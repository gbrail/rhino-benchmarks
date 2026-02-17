package org.brail.rhinobenchmarks;

import java.io.IOException;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import org.mozilla.javascript.RhinoException;

/** This class loads all the benchmarks and runs them. */
public class BenchmarkDriver {
  private final HashMap<String, BenchmarkRunner> benchmarks = new HashMap<>();
  private final ArrayList<Result> allResults = new ArrayList<>();

  /**
   * Load a single JavaScript source file. It will be run in its own isolated scope and with its own
   * Context.
   */
  public void loadFile(String name, String fileName) throws IOException, BenchmarkException {
    try {
      var runner = BenchmarkRunner.load(Path.of(fileName));
      benchmarks.put(name, runner);
    } catch (BenchmarkException | RhinoException | IllegalStateException e) {
      System.out.println("WARNING: Skipping " + fileName + ": " + e);
    }
  }

  /**
   * Load a list of source files. The files will all be executed in the order specified in the same
   * scope and with the same context, so they may all refer to each other. Whatever the value of the
   * "Benchmark" property is when all is * complete will be used to start the benchmark.
   */
  public void loadCollection(String start, List<String> fileNames)
      throws IOException, BenchmarkException {
    try {
      var runner = BenchmarkRunner.load(fileNames);
      benchmarks.put(start, runner);
    } catch (BenchmarkException | RhinoException e) {
      System.out.println("WARNING: Skipping directory " + start + ": " + e);
    }
  }

  /** Run each benchmark's "runIteration" method once. */
  public void dryRunAll() {
    for (var e : benchmarks.entrySet()) {
      System.out.print(e.getKey() + "...");
      e.getValue().runOnce();
      System.out.println("OK");
    }
  }

  /**
   * Run each benchmark. First it will be run between "warmupMin" and "warmupMax" time until five
   * ierations in a row produce a relatively consistent result. Then, it will be run for "d" time
   * and all the results will be gathered. If the variation between results is too great, it will
   * retry the run.
   */
  public void runAll(Duration warmupMin, Duration warmupMax, Duration d) {
    for (var e : benchmarks.entrySet()) {
      System.out.println(e.getKey() + "...");
      var timings = e.getValue().run(warmupMin, warmupMax, d);
      var result = makeResult(e.getKey(), timings);
      result.print();
      allResults.add(result);
    }
  }

  /** Run just one benchmark. */
  public void runOne(String name, Duration warmupMin, Duration warmupMax, Duration d) {
    var test = benchmarks.get(name);
    if (test == null) {
      System.out.println("No benchmark named \"" + name + "\"");
      return;
    }
    var timings = test.run(warmupMin, warmupMax, d);
    var result = makeResult(name, timings);
    result.print();
    allResults.add(result);
  }

  public Collection<String> testNames() {
    return benchmarks.keySet();
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
