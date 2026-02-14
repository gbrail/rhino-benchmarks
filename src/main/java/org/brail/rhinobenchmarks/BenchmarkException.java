package org.brail.rhinobenchmarks;

public class BenchmarkException extends Exception {
  public BenchmarkException(String msg) {
    super(msg);
  }

  public BenchmarkException(String msg, Throwable t) {
    super(msg, t);
  }
}
