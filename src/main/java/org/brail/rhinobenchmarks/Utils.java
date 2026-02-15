package org.brail.rhinobenchmarks;

import java.util.List;

public class Utils {
  public static String formatNanos(long nanos) {
    if (nanos < 1000) return String.format("%.2f ns", (double) nanos);
    if (nanos < 1000_000) return String.format("%.2f μs", nanos / 1000.0);
    if (nanos < 1000_000_000) return String.format("%.2f ms", nanos / 1000_000.0);
    return String.format("%.2f s", nanos / 1000_000_000.0);
  }

  static double average(List<Long> timings) {
    return timings.stream().mapToLong(Long::longValue).average().orElse(0);
  }

  /** Calculate coefficient of variance. */
  static double calculateVariance(List<Long> timings) {
    if (timings.size() <= 1) {
      return 0.0;
    }

    double mean = average(timings);

    if (mean == 0) return 0.0;

    double variance =
        timings.stream().mapToDouble(t -> Math.pow((double) t - mean, 2)).average().orElse(0);

    double standardDeviation = Math.sqrt(variance);

    // CV = σ / μ
    return standardDeviation / mean;
  }
}
