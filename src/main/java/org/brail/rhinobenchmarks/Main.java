package org.brail.rhinobenchmarks;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;
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

  @Override
  public Integer call() throws IOException {
    var driver = new BenchmarkDriver();
    try {
      if (testFileName != null) {
        driver.loadFile(testFileName, testFileName);
      } else {
        driver.loadFile("sunspider-3d-cube", "./SunSpider/3d-cube.js");
        driver.loadFile("sunspider-3d-raytrace", "./SunSpider/3d-raytrace.js");
        driver.loadFile("sunspider-base64", "./SunSpider/base64.js");
        driver.loadFile("sunspider-crypto-aes", "./SunSpider/crypto-aes.js");
        driver.loadFile("sunspider-crypto-md5", "./SunSpider/crypto-md5.js");
        driver.loadFile("sunspider-crypto-sha1", "./SunSpider/crypto-sha1.js");
        driver.loadFile("sunspider-n-body", "./SunSpider/n-body.js");
        driver.loadFile("sunspider-regex-dna", "./SunSpider/regex-dna.js");
        driver.loadFile("sunspider-string-unpack-code", "./SunSpider/string-unpack-code.js");
        driver.loadFile("sunspider-tagcloud", "./SunSpider/tagcloud.js");

        driver.loadFile("octane-box2d", "./Octane/box2d.js");
        driver.loadFile("octane-code-first-load", "./Octane/code-first-load.js");
        driver.loadFile("octane-crypto", "./Octane/crypto.js");
        driver.loadFile("octane-deltablue", "./Octane/deltablue.js");
        driver.loadFile("octane-navier-stokes", "./Octane/navier-stokes.js");
        driver.loadFile("octane-richards", "./Octane/richards.js");

        driver.loadFile("simple-hash-map", "./simple/hash-map.js");
        driver.loadFile("simple-doxbee-promise", "./simple/doxbee-promise.js");
        driver.loadFile("simple-doxbee-async", "./simple/doxbee-async.js");

        driver.loadCollection(
            "cdjs",
            List.of(
                "./cdjs/constants.js",
                "./cdjs/util.js",
                "./cdjs/red_black_tree.js",
                "./cdjs/call_sign.js",
                "./cdjs/vector_2d.js",
                "./cdjs/vector_3d.js",
                "./cdjs/motion.js",
                "./cdjs/reduce_collision_set.js",
                "./cdjs/simulator.js",
                "./cdjs/collision.js",
                "./cdjs/collision_detector.js",
                "./cdjs/benchmark.js"));

        driver.loadCollection(
            "RexBench-UniPoker",
            List.of(
                "./RexBench/UniPoker/poker.js",
                "./RexBench/UniPoker/expected.js",
                "./RexBench/UniPoker/benchmark.js"));

        driver.loadCollection(
            "RexBench-OfflineAssembler",
            List.of(
                "./RexBench/OfflineAssembler/registers.js",
                "./RexBench/OfflineAssembler/instructions.js",
                "./RexBench/OfflineAssembler/ast.js",
                "./RexBench/OfflineAssembler/parser.js",
                "./RexBench/OfflineAssembler/file.js",
                "./RexBench/OfflineAssembler/LowLevelInterpreter.js",
                "./RexBench/OfflineAssembler/LowLevelInterpreter32_64.js",
                "./RexBench/OfflineAssembler/LowLevelInterpreter64.js",
                "./RexBench/OfflineAssembler/InitBytecodes.js",
                "./RexBench/OfflineAssembler/expected.js",
                "./RexBench/OfflineAssembler/benchmark.js"));

        driver.loadCollection(
            "bigint-bigdenary",
            List.of("./bigint/bigdenary-bundle.js", "./bigint/bigdenary-benchmark.js"));

        driver.loadCollection(
            "ARES-6-Air",
            List.of(
                "./ARES-6/Air/symbols.js",
                "./ARES-6/Air/tmp_base.js",
                "./ARES-6/Air/arg.js",
                "./ARES-6/Air/basic_block.js",
                "./ARES-6/Air/code.js",
                "./ARES-6/Air/frequented_block.js",
                "./ARES-6/Air/inst.js",
                "./ARES-6/Air/opcode.js",
                "./ARES-6/Air/reg.js",
                "./ARES-6/Air/stack_slot.js",
                "./ARES-6/Air/tmp.js",
                "./ARES-6/Air/util.js",
                "./ARES-6/Air/custom.js",
                "./ARES-6/Air/liveness.js",
                "./ARES-6/Air/insertion_set.js",
                "./ARES-6/Air/allocate_stack.js",
                "./ARES-6/Air/payload-gbemu-executeIteration.js",
                "./ARES-6/Air/payload-imaging-gaussian-blur-gaussianBlur.js",
                "./ARES-6/Air/payload-airjs-ACLj8C.js",
                "./ARES-6/Air/payload-typescript-scanIdentifier.js",
                "./ARES-6/Air/benchmark.js"));
      }
    } catch (BenchmarkException | IOException e) {
      System.out.println("Can't load benchmarks: " + e);
      return 2;
    }

    int maxWarmupSecs = Math.max(MIN_WARMUP, maxWarmup);

    driver.dryRunAll();
    driver.runAll(
        Duration.ofSeconds(MIN_WARMUP),
        Duration.ofSeconds(maxWarmupSecs),
        Duration.ofSeconds(runTime));

    if (jsonOutput != null) {
      var results = new BenchmarkDriver.Results(runName, driver.results());
      var mapper = new ObjectMapper();
      Files.writeString(Path.of(jsonOutput), mapper.writeValueAsString(results));
    }

    return 0;
  }

  public static void main(String... args) {
    int exitCode = new CommandLine(new Main()).execute(args);
    System.exit(exitCode);
  }
}
