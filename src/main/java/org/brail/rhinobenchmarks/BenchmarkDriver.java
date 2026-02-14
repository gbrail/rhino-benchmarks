package org.brail.rhinobenchmarks;

import org.mozilla.javascript.Context;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class BenchmarkDriver {
  private final HashMap<String, BenchmarkRunner> benchmarks;

  public static BenchmarkDriver load(String startName) throws IOException, BenchmarkException {
    Path start = Path.of(startName);
    var files = listRegularFiles(start);
    HashMap<String, BenchmarkRunner> benchmarks = new HashMap<>();
    for (var file : files) {
      String relName = start.relativize(file).toString();
      try {
        var runner = BenchmarkRunner.load(file);
        benchmarks.put(relName, runner);
      } catch (BenchmarkException e) {
        System.out.println("WARNING: Skipping " + relName + ": " + e);
      }
    }
    return new BenchmarkDriver(benchmarks);
  }

  private BenchmarkDriver(HashMap<String, BenchmarkRunner> benchmarks) {
    this.benchmarks = benchmarks;
  }

  public void dryRunAll() {
    for (var e : benchmarks.entrySet()) {
      System.out.print(e.getKey() + "...");
      e.getValue().runOnce();
      System.out.println("OK");
    }
  }

  public void runAll(Duration d) {
    for (var e : benchmarks.entrySet()) {
      System.out.print(e.getKey() + "...");
      var timings = e.getValue().run(d);
      System.out.println("OK");
      for (var t : timings) {
        System.out.println(t.invocations() + " invocations, " + formatNanos(t.nanosPerOp()));
      }
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

  private static String formatNanos(double nanos) {
    if (nanos < 1000) return String.format("%.2f ns", nanos);
    if (nanos < 1000_000) return String.format("%.2f μs", nanos / 1000.0);
    if (nanos < 1000_000_000) return String.format("%.2f ms", nanos / 1000_000.0);
    return String.format("%.2f s", nanos / 1000_000_000.0);
  }
}
