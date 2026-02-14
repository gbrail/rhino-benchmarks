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
  private volatile Object blackhole;

  // 250 milliseconds in nanos
  private static final long BATCH_THRESHOLD_MS = 250 * 1000000;

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

  public List<Timing> run(Duration d) {
    long firstTiming = runOnce();

    long start = System.currentTimeMillis();
    long end = start + d.toMillis();
    if (firstTiming > BATCH_THRESHOLD_MS) {
      return runIndividually(end);
    }
    return runInBatches(end);
  }

  private List<Timing> runIndividually(long endTime) {
    var timings = new ArrayList<Timing>();
    while (System.currentTimeMillis() < endTime) {
      long iterationTime = runOnce();
      timings.add(new Timing(1, iterationTime));
    }
    return timings;
  }

  private List<Timing> runInBatches(long endTime) {
    var timings = new ArrayList<Timing>();
    long iterationStart;
    while ((iterationStart = System.currentTimeMillis()) < endTime) {
      long iterationEnd = iterationStart + 1000;
      long totalNanos = 0;
      int totalInvocations = 1;
      while (System.currentTimeMillis() < iterationEnd) {
        long it = runOnce();
        totalNanos += it;
        totalInvocations++;
      }
      long nanosPerOp = totalNanos / totalInvocations;
      timings.add(new Timing(totalInvocations, nanosPerOp));
    }
    return timings;
  }

  public long runOnce() {
    long nanoStart = System.nanoTime();
    blackhole = run.call(cx, scope, benchmark, ScriptRuntime.emptyArgs);
    long nanoEnd = System.nanoTime();
    return nanoEnd - nanoStart;
  }

  public record Timing(int invocations, long nanosPerOp) {}
}
