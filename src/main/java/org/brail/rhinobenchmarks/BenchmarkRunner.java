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

  private BenchmarkRunner(Context cx, Scriptable scope, Scriptable benchmark, Callable run) {
    this.cx = cx;
    this.scope = scope;
    this.benchmark = benchmark;
    this.run = run;
  }

  public static BenchmarkRunner load(Path path) throws BenchmarkException, IOException {
    var cx = Context.enter();
    var scope = cx.initStandardObjects();
    try (var rdr = new FileReader(path.toFile(), StandardCharsets.UTF_8)) {
      cx.evaluateReader(scope, rdr, path.getFileName().toString(), 1, null);
    }
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

  public void runOnce() {
    blackhole = run.call(cx, scope, benchmark, ScriptRuntime.emptyArgs);
  }

  public List<Timing> run(Duration d) {
    var timings = new ArrayList<Timing>();
    long start = System.currentTimeMillis();
    long end = start + d.toMillis();
    long itStart;
    while ((itStart = System.currentTimeMillis()) < end) {
      long secEnd = itStart + 1000;
      long totalNanos = 0;
      int totalInvocations = 0;
      while (System.currentTimeMillis() < secEnd) {
        long nanoStart = System.nanoTime();
        blackhole = run.call(cx, scope, benchmark, ScriptRuntime.emptyArgs);
        long nanoEnd = System.nanoTime();
        totalNanos += (nanoEnd - nanoStart);
        totalInvocations++;
      }
      double nanosPerOp = (double) totalNanos / (double) totalInvocations;
      timings.add(new Timing(totalInvocations, nanosPerOp));
    }
    return timings;
  }

  public record Timing(int invocations, double nanosPerOp) {}
}
