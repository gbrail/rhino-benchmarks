package org.brail.rhinobenchmarks;

import java.io.IOException;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import org.mozilla.javascript.RhinoException;

public class BenchmarkDriver {
  private final HashMap<String, BenchmarkRunner> benchmarks = new HashMap<>();
  private final ArrayList<Result> allResults = new ArrayList<>();

  public void loadFile(String name, String fileName) throws IOException, BenchmarkException {
    try {
      var runner = BenchmarkRunner.load(Path.of(fileName));
      benchmarks.put(name, runner);
    } catch (BenchmarkException | RhinoException | IllegalStateException e) {
      System.out.println("WARNING: Skipping " + fileName + ": " + e);
    }
  }

  public void loadCollection(String start, List<String> fileNames)
      throws IOException, BenchmarkException {
    try {
      var runner = BenchmarkRunner.load(fileNames);
      benchmarks.put(start, runner);
    } catch (BenchmarkException | RhinoException e) {
      System.out.println("WARNING: Skipping directory " + start + ": " + e);
    }
  }

  public void dryRunAll() {
    for (var e : benchmarks.entrySet()) {
      System.out.print(e.getKey() + "...");
      e.getValue().runOnce();
      System.out.println("OK");
    }
  }

  public void runAll(Duration warmupMin, Duration warmupMax, Duration d) {
    for (var e : benchmarks.entrySet()) {
      System.out.println(e.getKey() + "...");
      var timings = e.getValue().run(warmupMin, warmupMax, d);
      var result = makeResult(e.getKey(), timings);
      result.print();
      allResults.add(result);
    }
  }

  public List<Result> results() {
    return allResults;
  }

  private static Result makeResult(String name, List<Long> timings) {
    long[] allTimings = new long[timings.size()];
    int i = 0;
    long totalTime = 0;
    for (var t : timings) {
      allTimings[i++] = t;
      totalTime += t;
    }
    Arrays.sort(allTimings);
    long average = totalTime / allTimings.length;
    return new Result(
        name,
        allTimings.length,
        average,
        getP(allTimings, 50),
        getP(allTimings, 90),
        getP(allTimings, 95),
        allTimings[allTimings.length - 1]);
  }

  private static long getP(long[] results, int pct) {
    assert pct < 100;
    int ix = (results.length * pct) / 100;
    return results[ix];
  }

  public record Result(
      String name, int iterations, long average, long median, long p90, long p95, long max)
      implements Comparable<Result> {
    public void print() {
      System.out.println("  Name:       " + name);
      System.out.println("  Iterations: " + iterations);
      System.out.println("  Average:    " + Utils.formatNanos(average));
      System.out.println("  Median:     " + Utils.formatNanos(median));
      System.out.println("  P90:        " + Utils.formatNanos(p90));
      System.out.println("  P95:        " + Utils.formatNanos(p95));
      System.out.println("  Max:        " + Utils.formatNanos(max));
    }

    @Override
    public int compareTo(Result r) {
      return name.compareTo(r.name);
    }
  }

  public record Results(String name, List<BenchmarkDriver.Result> results) {}
}
