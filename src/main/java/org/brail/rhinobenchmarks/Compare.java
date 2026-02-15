package org.brail.rhinobenchmarks;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import picocli.CommandLine;

@CommandLine.Command(name = "compare", mixinStandardHelpOptions = true, version = "0.0.1")
public class Compare implements Callable<Integer> {
  @CommandLine.Parameters private String beforeFile;
  @CommandLine.Parameters private String afterFile;

  @Override
  public Integer call() throws IOException {
    var beforeResults = readResults(beforeFile);
    var before = mapResults(beforeResults);
    var afterResults = readResults(afterFile);
    var after = mapResults(afterResults);
    System.out.println("**** Average ****");
    System.out.println("Benchmark Before After Difference");
    for (var e : before.entrySet()) {
      var ar = after.get(e.getKey());
      if (ar != null) {
        compareAverage(e.getValue(), ar);
      }
    }

    System.out.println();
    System.out.println("**** Median ****");
    System.out.println("Benchmark Before After Difference");
    for (var e : before.entrySet()) {
      var ar = after.get(e.getKey());
      if (ar != null) {
        compareMedian(e.getValue(), ar);
      }
    }
    return 0;
  }

  public static void main(String... args) {
    int exitCode = new CommandLine(new Compare()).execute(args);
    System.exit(exitCode);
  }

  private void compareAverage(
      BenchmarkDriver.Result beforeResult, BenchmarkDriver.Result afterResult) {
    double comp = (double) afterResult.average() / (double) beforeResult.average();
    System.out.println(
        beforeResult.name()
            + " "
            + Utils.formatNanos(beforeResult.average())
            + " "
            + Utils.formatNanos(afterResult.average())
            + " "
            + formatComp(comp));
  }

  private void compareMedian(
      BenchmarkDriver.Result beforeResult, BenchmarkDriver.Result afterResult) {
    double comp = (double) afterResult.median() / (double) beforeResult.median();
    System.out.println(
        beforeResult.name()
            + " "
            + Utils.formatNanos(beforeResult.median())
            + " "
            + Utils.formatNanos(afterResult.median())
            + " "
            + formatComp(comp));
  }

  private static BenchmarkDriver.Results readResults(String fileName) throws IOException {
    var mapper = new ObjectMapper();
    try (var rdr = new FileReader(fileName, StandardCharsets.UTF_8)) {
      return mapper.readValue(rdr, BenchmarkDriver.Results.class);
    }
  }

  private static Map<String, BenchmarkDriver.Result> mapResults(BenchmarkDriver.Results r) {
    var map = new HashMap<String, BenchmarkDriver.Result>();
    for (var result : r.results()) {
      map.put(result.name(), result);
    }
    return map;
  }

  private static String formatComp(double c) {
    double pct = c * 100;
    if (pct > 100) {
      return String.format("+%.1f", pct - 100);
    }
    return String.format("-%.1f", (100 - pct));
  }
}
