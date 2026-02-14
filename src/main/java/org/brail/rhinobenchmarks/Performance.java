package org.brail.rhinobenchmarks;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.LambdaConstructor;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Undefined;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public class Performance extends ScriptableObject {
  private long timeOrigin;
  private final HashMap<String, List<Scriptable>> marks = new HashMap<>();
  private final HashMap<String, List<Scriptable>> measures = new HashMap<>();

  public static void init(Context cx, Scriptable scope) {
    var cons = new LambdaConstructor(scope, "performance", 0, Performance::constructor);
    cons.definePrototypeProperty(
        cx, "timeOrigin", Performance::timeOrigin, Performance::setTimeOrigin);
    cons.definePrototypeMethod(scope, "now", 0, Performance::now);
    cons.definePrototypeMethod(scope, "mark", 1, Performance::mark);
    cons.definePrototypeMethod(scope, "clearMarks", 0, Performance::clearMarks);
    cons.definePrototypeMethod(scope, "measure", 1, Performance::measure);
    cons.definePrototypeMethod(scope, "clearMeasures", 0, Performance::clearMeasures);
    cons.definePrototypeMethod(scope, "getEntries", 0, Performance::getEntries);
    cons.definePrototypeMethod(scope, "getEntriesByType", 1, Performance::getEntriesByType);
    var perf = cons.construct(cx, scope, ScriptRuntime.emptyArgs);
    scope.put("performance", scope, perf);
  }

  private Performance() {
    timeOrigin = System.nanoTime();
  }

  @Override
  public String getClassName() {
    return "Performance";
  }

  private static Scriptable constructor(Context cx, Scriptable scope, Object[] args) {
    return new Performance();
  }

  private static Object timeOrigin(Scriptable thisObj) {
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    return timestampToDouble(self.timeOrigin);
  }

  private static void setTimeOrigin(Scriptable thisObj, Object value) {
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    double d = ScriptRuntime.toNumber(value);
    self.timeOrigin = doubleToTimestamp(d);
  }

  private static Object now(Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    return timestampToDouble(self.timeNow());
  }

  private static Object mark(Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
    var name = requiredStringArg(args, 0, "name");
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    var entry = makeEntry(cx, scope, name, "mark", self.timeNow(), 0);
    self.marks.compute(
        name,
        (k, v) -> {
          List<Scriptable> marks = v;
          if (marks == null) {
            marks = new ArrayList<>();
          }
          marks.add(entry);
          return marks;
        });
    return Undefined.instance;
  }

  private static Object clearMarks(
      Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
    var name = stringArg(args, 0);
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    if (name.isPresent()) {
      self.marks.remove(name.get());
    } else {
      self.marks.clear();
    }
    return Undefined.instance;
  }

  private static Object measure(Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
    var name = requiredStringArg(args, 0, "name");
    var startMark = stringArg(args, 1);
    var endMark = stringArg(args, 2);
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    long endTime = endMark.map(self::lastMark).orElseGet(self::timeNow);
    long startTime = startMark.map(self::lastMark).orElse(0L);
    var entry = makeEntry(cx, scope, name, "measure", startTime, endTime - startTime);
    self.measures.compute(
        name,
        (k, v) -> {
          List<Scriptable> measures = v;
          if (measures == null) {
            measures = new ArrayList<>();
          }
          measures.add(entry);
          return measures;
        });
    return Undefined.instance;
  }

  private static Object clearMeasures(
      Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
    var name = stringArg(args, 0);
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    if (name.isPresent()) {
      self.measures.remove(name.get());
    } else {
      self.measures.clear();
    }
    return Undefined.instance;
  }

  private static Object getEntries(
      Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
    var entries = new ArrayList<>();
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    entries.addAll(self.marks.values());
    entries.addAll(self.measures.values());
    return cx.newArray(scope, entries.toArray());
  }

  private static Object getEntriesByType(
      Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
    var type = requiredStringArg(args, 0, "type");
    var self = LambdaConstructor.convertThisObject(thisObj, Performance.class);
    if ("mark".equals(type)) {
      return cx.newArray(scope, self.marks.values().toArray());
    } else if ("measure".equals(type)) {
      return cx.newArray(scope, self.measures.values().toArray());
    } else {
      return cx.newArray(scope, 0);
    }
  }

  private static Scriptable makeEntry(
      Context cx, Scriptable scope, String name, String type, long start, long duration) {
    var e = cx.newObject(scope);
    e.put("name", e, name);
    e.put("entryType", e, type);
    e.put("startTime", e, timestampToDouble(start));
    e.put("_start", e, start);
    e.put("duration", e, timestampToDouble(duration));
    return e;
  }

  private static double timestampToDouble(long ts) {
    // Timestamp in nanoseconds, result is in milliseconds
    return (double) ts / 1000000.0;
  }

  private static long doubleToTimestamp(double d) {
    // Timestamp in nanoseconds, result is in milliseconds
    return (long) (d * 1000000.0);
  }

  private long timeNow() {
    return System.nanoTime() - timeOrigin;
  }

  private long lastMark(String name) {
    var entries = marks.get(name);
    if (entries == null) {
      throw ScriptRuntime.syntaxError("Missing mark " + name);
    }
    var last = entries.getLast();
    var start = last.get("_start", last);
    assert start instanceof Long;
    return (Long) start;
  }

  private static Optional<String> stringArg(Object[] args, int ix) {
    return args.length > ix ? Optional.of(ScriptRuntime.toString(args[ix])) : Optional.empty();
  }

  private static String requiredStringArg(Object[] args, int ix, String name) {
    var val = stringArg(args, ix);
    if (val.isEmpty()) {
      throw ScriptRuntime.syntaxError(name + " parameter is required");
    }
    return val.get();
  }
}
