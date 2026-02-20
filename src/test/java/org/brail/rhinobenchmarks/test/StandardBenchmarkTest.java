package org.brail.rhinobenchmarks.test;

import java.io.IOException;
import java.util.stream.Stream;
import org.brail.rhinobenchmarks.BenchmarkDriver;
import org.brail.rhinobenchmarks.BenchmarkException;
import org.brail.rhinobenchmarks.StandardBenchmarks;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

class StandardBenchmarkTest {
  private static BenchmarkDriver driver;

  @BeforeAll
  public static void init() throws BenchmarkException, IOException {
    driver = new BenchmarkDriver();
    StandardBenchmarks.load(driver);
  }

  static Stream<String> benchmarkProvider() {
    return driver.testNames().stream();
  }

  @ParameterizedTest
  @MethodSource("benchmarkProvider")
  void benchmark(String benchmarkName) {
    driver.dryRunOne(benchmarkName);
  }
}
