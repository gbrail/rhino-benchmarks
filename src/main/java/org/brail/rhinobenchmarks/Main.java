package org.brail.rhinobenchmarks;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.concurrent.Callable;
import picocli.CommandLine;

@CommandLine.Command(name = "rhino-benchmark", mixinStandardHelpOptions = true, version = "0.0.1")
public class Main implements Callable<Integer> {
  private static final int MIN_WARMUP = 5;
  private static final String DEFAULT_WARMUP = "15";
  private static final String DEFAULT_RUN_TIME = "5";

  @CommandLine.Option(
      names = {"-n", "--name"},
      description = "A name to put on the output")
  private String runName;

  @CommandLine.Option(
      names = {"-f", "--file"},
      description = "Run just this single file")
  private String testFileName;

  @CommandLine.Option(
      names = {"-1", "--test"},
      description = "Run the single test with the specified name")
  private String singleTest;

  @CommandLine.Option(
      names = {"-j", "--json"},
      description = "Output JSON results to this file")
  private String jsonOutput;

  @CommandLine.Option(
      names = {"-w", "--warmup"},
      description = "Maximum warmup time",
      defaultValue = DEFAULT_WARMUP)
  private int maxWarmup;

  @CommandLine.Option(
      names = {"-t", "--run-time"},
      description = "Time to run the benchmarks",
      defaultValue = DEFAULT_RUN_TIME)
  private int runTime;

  @CommandLine.Option(
      names = {"-l", "--list-tests"},
      description = "List all the tests and then exit")
  private boolean listTests;

  @Override
  public Integer call() throws IOException {
    var driver = new BenchmarkDriver();
    try {
      if (testFileName != null) {
        driver.loadFile(testFileName, testFileName);
      } else {
        StandardBenchmarks.load(driver);
      }
    } catch (BenchmarkException | IOException e) {
      System.out.println("Can't load benchmarks: " + e);
      return 2;
    }

    if (listTests) {
      driver.testNames().stream().sorted().forEach(System.out::println);
      return 0;
    }

    int maxWarmupSecs = Math.max(MIN_WARMUP, maxWarmup);

    if (singleTest != null) {
      driver.runOne(
          singleTest,
          Duration.ofSeconds(MIN_WARMUP),
          Duration.ofSeconds(maxWarmupSecs),
          Duration.ofSeconds(runTime));
    } else {
      driver.dryRunAll();
      driver.runAll(
          Duration.ofSeconds(MIN_WARMUP),
          Duration.ofSeconds(maxWarmupSecs),
          Duration.ofSeconds(runTime));
    }

    if (jsonOutput != null) {
      var results = new BenchmarkDriver.Results(runName, driver.results());
      var mapper = new ObjectMapper();
      Files.writeString(Path.of(jsonOutput), mapper.writeValueAsString(results));
    }

    driver.summarizeResults(System.out);

    return 0;
  }

  public static void main(String... args) {
    int exitCode = new CommandLine(new Main()).execute(args);
    System.exit(exitCode);
  }
}
