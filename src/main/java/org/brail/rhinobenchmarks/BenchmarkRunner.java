package org.brail.rhinobenchmarks;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Stream;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;
import org.mozilla.javascript.Callable;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.LambdaFunction;
import org.mozilla.javascript.NativeConsole;
import org.mozilla.javascript.NativePromise;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.VarScope;

public class BenchmarkRunner {
  private static final ContextFactory CONTEXT_FACTORY = new BenchmarkContextFactory();

  private final List<Path> files;

  @SuppressWarnings("unused")
  public static volatile Object blackhole;

  private static final double GOOD_VARIANCE = 0.1;
  private static final int WARMUP_BATCH = 5;
  private static final int MAX_RERUNS = 5;
  // 100 milliseconds
  private static final long QUICK_BENCHMARK = 100 * 1000000;

  private record RunArgs(VarScope scope, Scriptable thisObj, Callable run) {}

  private BenchmarkRunner(List<Path> files) {
    this.files = files;
  }

  public static BenchmarkRunner load(Path path) throws BenchmarkException, IOException {
    if (!path.toFile().exists()) {
      throw new IOException("Not found: " + path);
    }
    return new BenchmarkRunner(List.of(path));
  }

  public static BenchmarkRunner load(List<String> fileNames)
      throws BenchmarkException, IOException {
    var paths = fileNames.stream().map(Path::of).toList();
    for (var p : paths) {
      if (!p.toFile().exists()) {
        throw new IOException("Not found: " + p);
      }
    }
    return new BenchmarkRunner(paths);
  }

  private static void loadFile(Context cx, VarScope scope, Path path) throws IOException {
    try (var in = new FileInputStream(path.toFile())) {
      Reader rdr;
      if (path.toString().endsWith(".z")) {
        Inflater inflater = new Inflater();
        rdr = new InputStreamReader(new InflaterInputStream(in, inflater), StandardCharsets.UTF_8);
      } else {
        rdr = new InputStreamReader(in, StandardCharsets.UTF_8);
      }
      cx.evaluateReader(scope, rdr, path.getFileName().toString(), 1, null);
    }
  }

  private RunArgs initialize(Context cx) throws BenchmarkException, IOException {
    var scope = makeScope(cx);
    for (var p : files) {
      loadFile(cx, scope, p);
    }

    Object benchmarkObj = ScriptableObject.getProperty(scope, "Benchmark");
    if (!(benchmarkObj instanceof Function cons)) {
      throw new BenchmarkException("Script did not create \"Benchmark\" object");
    }
    Object benchmark = cons.construct(cx, scope, ScriptRuntime.emptyArgs);
    if (!(benchmark instanceof Scriptable bo)) {
      throw new BenchmarkException("Benchmark constructor didn't construct");
    }
    Function runFunc;
    Object runObj = ScriptableObject.getProperty(bo, "runIteration");
    if (runObj instanceof Function f) {
      runFunc = f;
    } else {
      runObj = ScriptableObject.getProperty(bo, "run");
      if (runObj instanceof Function f) {
        runFunc = f;
      } else {
        throw new BenchmarkException(
            "Benchmark object did not have a \"runIteration\" or a \"run\" method but " + runObj);
      }
    }

    return new RunArgs(scope, bo, runFunc);
  }

  private static VarScope makeScope(Context cx) {
    var scope = cx.initStandardObjects();
    NativeConsole.init(
        scope,
        false,
        (NativeConsole.ConsolePrinter)
            (cx1, scope1, level, args, stack) -> {
              if (args.length == 1) {
                System.out.println(args[0].toString());
              } else {
                System.out.println(
                    String.join(
                        ", ", Stream.of(args).map(Object::toString).toArray(String[]::new)));
              }
            });
    Performance.init(cx, scope);
    setRandom(scope);
    return scope;
  }

  /** Replace "math.random" with a generator with a constant seed. */
  private static void setRandom(VarScope scope) {
    Object mathObj = ScriptableObject.getProperty(scope, "Math");
    assert mathObj instanceof Scriptable;
    Scriptable math = (Scriptable) mathObj;
    var rand = new Random(0);
    var randomFunc = new LambdaFunction(scope, 1, (lcx, ls, lthis, largs) -> rand.nextDouble());
    ScriptableObject.defineProperty(math, "random", randomFunc, 0);
  }

  public long dryRun() throws IOException, BenchmarkException {
    try (var cx = CONTEXT_FACTORY.enterContext()) {
      var a = initialize(cx);
      return runOnce(cx, a);
    }
  }

  public List<Long> run(Duration warmupMin, Duration warmupMax, Duration d)
      throws IOException, BenchmarkException {
    try (var cx = CONTEXT_FACTORY.enterContext()) {
      var a = initialize(cx);
      warmUp(cx, a, warmupMin, warmupMax);
      ArrayList<Long> results = null;
      double variance = 0;
      for (int i = 0; i < MAX_RERUNS; i++) {
        results = new ArrayList<>();
        long start = System.currentTimeMillis();
        long end = start + d.toMillis();
        while (System.currentTimeMillis() < end) {
          long t = runOnce(cx, a);
          results.add(t);
        }
        variance = Utils.calculateVariance(results);
        if (variance <= GOOD_VARIANCE) {
          return results;
        } else if (i < (MAX_RERUNS - 1)) {
          System.out.printf("Re-running because variance is %.2f\n", variance);
        }
      }
      System.out.printf("WARNING: Too much variance: %.2f\n", variance);
      return results;
    }
  }

  private long runOnce(Context cx, RunArgs r) {
    long nanoStart = System.nanoTime();
    Object result = r.run.call(cx, r.scope, r.thisObj, ScriptRuntime.emptyArgs);
    long nanoEnd = System.nanoTime();
    if (result instanceof NativePromise p) {
      waitForPromise(cx, r, p);
      nanoEnd = System.nanoTime();
    }
    blackhole = result;
    return nanoEnd - nanoStart;
  }

  private void waitForPromise(Context cx, RunArgs r, NativePromise p) {
    var wrapper = new PromiseWrapper(p);
    var resolved = new AtomicBoolean();
    wrapper.then(
        cx,
        r.scope,
        (lcx, ls, v) -> resolved.set(true),
        (lcx, ls, e) -> {
          throw new RuntimeException("Unexpected promise rejection: " + e);
        });
    cx.processMicrotasks();
    if (!resolved.get()) {
      System.out.println("WARNING: Promise was never resolved");
    }
  }

  private void warmUp(Context cx, RunArgs r, Duration warmupMin, Duration warmupMax) {
    long now = System.currentTimeMillis();
    long endMin = now + warmupMin.toMillis();
    long end = now + warmupMax.toMillis();
    List<Long> previousBatch = null;
    List<Long> batch;
    long firstTime = runOnce(cx, r);
    int warmupBatch = WARMUP_BATCH;
    // Larger batches for faster benchmarks
    if (firstTime < QUICK_BENCHMARK) {
      warmupBatch *= 10;
    }
    while (System.currentTimeMillis() < end) {
      batch = new ArrayList<>(warmupBatch);
      for (int j = 0; j < warmupBatch; j++) {
        long elapsed = runOnce(cx, r);
        batch.add(elapsed);
      }
      double batchVariance = Utils.calculateVariance(batch);
      if (batchVariance <= GOOD_VARIANCE
          && previousBatch != null
          && System.currentTimeMillis() > endMin) {
        // Not too much variance in the batch
        double avg = Utils.average(batch);
        double lastAvg = Utils.average(previousBatch);
        double change = Math.abs(avg - lastAvg) / lastAvg;
        if (change <= GOOD_VARIANCE) {
          // This batch and the last batch are also fairly close
          // We are likely warmed up
          return;
        }
      }
      previousBatch = batch;
    }
    System.out.printf("Never got to <%.2f in %d seconds\n", GOOD_VARIANCE, warmupMax.toSeconds());
  }

  private static class BenchmarkContextFactory extends ContextFactory {
    @Override
    protected void onContextCreated(Context cx) {
      cx.setLanguageVersion(Context.VERSION_ECMASCRIPT);
      // cx.setGeneratingDebug(true);
      // cx.setInterpretedMode(false);
      super.onContextCreated(cx);
    }
  }
}
