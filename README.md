# Rhino Benchmarks

This repository contains a set of benchmarks for Rhino. The benchmarks themselves
come from the [WebKit](https://github.com/WebKit/JetStream) benchmark suite, with a wrapper to run them and account for the variability of everything on the JVM.

## Running

To run the benchmarks using the version of Rhino specified in build.gradle:

    ./run.sh

To write output to a specific JSON file:

    ./run.sh results.json

To compare the results of two benchmark runs:

    ./compare.sh results1.json results2.json

To run using a different Rhino JAR, either edit build.gradle, or use 
run-other.sh:

    ./run-other.sh some-rhino-jar.jar

## Updating Benchmarks

The Makefile in the "babel" directory copies benchmarks from a clone of the WebKit repository and copies them to the main source directory. To add new
benchmarks from JetStream, update the Makefile, and load them in Main.java.

## Benchmark Selection

Benchmarks are processed using Babel to cover things Rhino doesn't do, mainly
certain forms of const, rest parameters, and classes.

The benchmarks selected give fairly reproducable results and work with Rhino
1.9.0. Over time other benchmarks may be added.

## Benchmark Requirements

Consistent with the JetStream benchmark, all the benchmarks must have the 
following:

* A constructor named Benchmark
* The constructor must have a function on the prototype called runIteration
* runIteration may simply run the benchmark and return
* Alternately, runIteration may return a Promise. In this case, the framework will wait for it to be resolved before considering the benchmark complete.

