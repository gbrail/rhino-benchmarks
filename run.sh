#!/bin/sh

bazel build //:benchmarks
bazel-bin/benchmarks $*
