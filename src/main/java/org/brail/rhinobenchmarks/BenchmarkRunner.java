package org.brail.rhinobenchmarks;

import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import org.mozilla.javascript.Callable;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class BenchmarkRunner {
  private final Context cx;
  private final Scriptable scope;
  private final Scriptable benchmark;
  private final Callable run;

  @SuppressWarnings("unused")
  public static volatile Object blackhole;

  private static final double GOOD_VARIANCE = 0.1;
  private static final int WARMUP_BATCH = 5;
  private static final int MAX_RERUNS = 5;
  // 100 milliseconds
  private static final long QUICK_BENCHMARK = 100 * 1000000;

  private BenchmarkRunner(Context cx, Scriptable scope, Scriptable benchmark, Callable run) {
    this.cx = cx;
    this.scope = scope;
    this.benchmark = benchmark;
    this.run = run;
  }

  public static BenchmarkRunner load(Path path) throws BenchmarkException, IOException {
    var cx = Context.enter();
    var scope = makeScope(cx);
    try (var rdr = new FileReader(path.toFile(), StandardCharsets.UTF_8)) {
      cx.evaluateReader(scope, rdr, path.getFileName().toString(), 1, null);
    }
    return makeRunner(cx, scope);
  }

  public static BenchmarkRunner load(List<String> fileNames)
      throws BenchmarkException, IOException {
    var cx = Context.enter();
    var scope = makeScope(cx);
    for (var file : fileNames) {
      try (var rdr = new FileReader(file, StandardCharsets.UTF_8)) {
        cx.evaluateReader(scope, rdr, file, 1, null);
      }
    }
    return makeRunner(cx, scope);
  }

  private static BenchmarkRunner makeRunner(Context cx, Scriptable scope)
      throws BenchmarkException {
    Object benchmarkObj = ScriptableObject.getProperty(scope, "Benchmark");
    if (!(benchmarkObj instanceof Function cons)) {
      throw new BenchmarkException("Script did not create \"Benchmark\" object");
    }
    Object benchmark = cons.construct(cx, scope, ScriptRuntime.emptyArgs);
    if (!(benchmark instanceof Scriptable bo)) {
      throw new BenchmarkException("Benchmark constructor didn't construct");
    }
    Object runObj = ScriptableObject.getProperty(bo, "runIteration");
    if (!(runObj instanceof Function f)) {
      throw new BenchmarkException(
          "Benchmark object did not have a \"runIteration\" method but " + runObj);
    }

    return new BenchmarkRunner(cx, scope, bo, f);
  }

  private static Scriptable makeScope(Context cx) {
    var scope = cx.initStandardObjects();
    Performance.init(cx, scope);
    return scope;
  }

  public List<Long> run(Duration warmupMin, Duration warmupMax, Duration d) {
    warmUp(warmupMin, warmupMax);
    ArrayList<Long> results = null;
    double variance = 0;
    for (int i = 0; i < MAX_RERUNS; i++) {
      results = new ArrayList<>();
      long start = System.currentTimeMillis();
      long end = start + d.toMillis();
      while (System.currentTimeMillis() < end) {
        long t = runOnce();
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

  public long runOnce() {
    long nanoStart = System.nanoTime();
    blackhole = run.call(cx, scope, benchmark, ScriptRuntime.emptyArgs);
    long nanoEnd = System.nanoTime();
    return nanoEnd - nanoStart;
  }

  public void warmUp(Duration warmupMin, Duration warmupMax) {
    long now = System.currentTimeMillis();
    long endMin = now + warmupMin.toMillis();
    long end = now + warmupMax.toMillis();
    List<Long> previousBatch = null;
    List<Long> batch;
    long firstTime = runOnce();
    int warmupBatch = WARMUP_BATCH;
    // Larger batches for faster benchmarks
    if (firstTime < QUICK_BENCHMARK) {
      warmupBatch *= 10;
    }
    while (System.currentTimeMillis() < end) {
      batch = new ArrayList<>(warmupBatch);
      for (int j = 0; j < warmupBatch; j++) {
        long elapsed = runOnce();
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
}
