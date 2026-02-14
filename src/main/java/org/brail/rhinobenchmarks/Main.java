package org.brail.rhinobenchmarks;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

public class Main {
  public static void main(String[] args) {
    var driver = new BenchmarkDriver();
    try {
      driver.loadIndividualFiles("./SunSpider");

      driver.loadFile("./Octane/box2d.js");
      driver.loadFile("./Octane/code-first-load.js");
      driver.loadFile("./Octane/crypto.js");
      driver.loadFile("./Octane/deltablue.js");
      driver.loadFile("./Octane/navier-stokes.js");
      driver.loadFile("./Octane/richards.js");
      driver.loadFile("./Octane/splay.js");

      driver.loadFile("./simple/hash-map.js");

      driver.loadCollection(
          "./cdjs",
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

      /*driver.loadCollection(
      "./RexBench/FlightPlanner",
      List.of(
          "./RexBench/FlightPlanner/airways.js",
          "./RexBench/FlightPlanner/waypoints.js.z",
          "./RexBench/FlightPlanner/flight_planner.js",
          "./RexBench/FlightPlanner/expectations.js",
          "./RexBench/FlightPlanner/benchmark.js"));*/

      driver.loadCollection(
          "./RexBench/UniPoker",
          List.of(
              "./RexBench/UniPoker/poker.js",
              "./RexBench/UniPoker/expected.js",
              "./RexBench/UniPoker/benchmark.js"));

      driver.loadCollection(
          "./RexBench/OfflineAssembler",
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
          "bigint-noble-bls12-381",
          List.of(
              "./bigint/web-crypto-sham.js",
              "./bigint/noble-bls12-381-bundle.js",
              "./bigint/noble-benchmark.js"));
      driver.loadCollection(
          "bigint-paillier",
          List.of(
              "./bigint/web-crypto-sham.js",
              "./bigint/paillier-bundle.js",
              "./bigint/paillier-benchmark.js"));
      driver.loadCollection(
          "bigint-bigdenary",
          List.of("./bigint/bigdenary-bundle.js", "./bigint/bigdenary-benchmark.js"));
    } catch (BenchmarkException | IOException e) {
      System.out.println("Can't load benchmarks: " + e);
      System.exit(2);
      return;
    }

    driver.dryRunAll();
    driver.runAll(Duration.ofSeconds(5));
  }
}
