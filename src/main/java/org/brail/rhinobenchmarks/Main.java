package org.brail.rhinobenchmarks;

import java.io.IOException;
import java.time.Duration;

public class Main {
  public static void main(String[] args) {
    BenchmarkDriver driver;
    try {
      driver = BenchmarkDriver.load("./SunSpider");
    } catch (BenchmarkException | IOException e) {
      System.out.println("Can't load benchmarks: " + e);
      System.exit(2);
      return;
    }

    driver.dryRunAll();
    driver.runAll(Duration.ofSeconds(5));
  }
}
