package org.brail.rhinobenchmarks;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.mozilla.javascript.RhinoException;

public class BenchmarkDriver {
  private final HashMap<String, BenchmarkRunner> benchmarks = new HashMap<>();

  public void loadIndividualFiles(String startName) throws IOException, BenchmarkException {
    Path start = Path.of(startName);
    var files = listRegularFiles(start);
    for (var file : files) {
      String relName = start.relativize(file).toString();
      try {
        var runner = BenchmarkRunner.load(file);
        benchmarks.put(relName, runner);
      } catch (BenchmarkException | RhinoException | IllegalStateException e) {
        System.out.println("WARNING: Skipping " + relName + ": " + e);
      }
    }
  }

  public void loadFile(String fileName) throws IOException, BenchmarkException {
    try {
      var runner = BenchmarkRunner.load(Path.of(fileName));
      benchmarks.put(fileName, runner);
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
      printResult(timings);
    }
  }

  private static List<Path> listRegularFiles(Path start) throws IOException {
    if (start == null) {
      throw new IllegalArgumentException("start path must not be null");
    }
    if (!Files.exists(start)) {
      return Collections.emptyList();
    }
    try (Stream<Path> stream = Files.walk(start)) {
      return stream.filter(Files::isRegularFile).collect(Collectors.toList());
    }
  }

  private static String formatNanos(long nanos) {
    if (nanos < 1000) return String.format("%.2f ns", (double) nanos);
    if (nanos < 1000_000) return String.format("%.2f μs", nanos / 1000.0);
    if (nanos < 1000_000_000) return String.format("%.2f ms", nanos / 1000_000.0);
    return String.format("%.2f s", nanos / 1000_000_000.0);
  }

  private static void printResult(List<BenchmarkRunner.Timing> timings) {
    long[] allTimings = new long[timings.size()];
    int i = 0;
    long totalTime = 0;
    for (var t : timings) {
      allTimings[i++] = t.nanosPerOp();
      totalTime += t.nanosPerOp();
    }
    Arrays.sort(allTimings);
    long average = totalTime / allTimings.length;
    System.out.println("  Iterations: " + allTimings.length);
    System.out.println("  Average:    " + formatNanos(average));
    System.out.println("  Median:     " + formatNanos(getP(allTimings, 50)));
    System.out.println("  P99:        " + formatNanos(getP(allTimings, 99)));
    System.out.println("  Max:        " + formatNanos(allTimings[allTimings.length - 1]));
  }

  private static long getP(long[] results, int pct) {
    assert pct < 100;
    int ix = (results.length * pct) / 100;
    return results[ix];
  }
}
