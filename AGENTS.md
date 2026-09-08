# Rhino Benchmarks

This project supports many standard JavaScript benchmarks from the WSL
benchmark suite using Rhino. It is intended as a test suite for measuring
performance of Rhino against real-world JavaScript.

# Useful commands:

Bazel is the fastest and most complete build and test suite for
this project. Bazelisk is the best tool for running Bazel.

1. Build: `bazel build //:benchmarks`
2. Test: `bazel test ...`
3. Run: `bazel run //:benchmarks`

# Benchmark output

The "//:benchmarks" Bazel target runs all the benchmarks, and takes
about 10 minutes to run. For each benchmark, it produces:

* Average: Average time per iteration, larger is worse
* Score: A composite score of benchmark execution, higher is better
* Median, Max, P90, and P95 of the iteration time

# Benchmark Notes

The benchmark running framework tries to measure benchmark time carefully,
and re-run if variance is too high to try and get a consistent result, although it gives up eventually.

# Building

The original source for each benchmark is in the "wpt" submodule.
Bazel rules preprocess the source using Babel to remove Rhino
inconsistencies and missing features.

If the "local_path_override" in MODULE.bazel is uncommented, this
project uses the copy of Rhino in a sibling directory. This makes it
easy to patch Rhino and then quickly test the effects.