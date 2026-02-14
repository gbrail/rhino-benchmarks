package org.brail.rhinobenchmarks;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.LambdaFunction;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.tools.shell.Global;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class Main {
  public static void main(String[] args) throws IOException {
    try (var cx = Context.enter()) {
      var scope = new Global(cx);
      Performance.init(cx, scope);
      scope.put("global", scope, scope);
      scope.put("JetStreamParams", scope, makeParams(cx, scope));
      scope.put("isInBrowser", scope, false);
      scope.put("isD8", scope, false);
      scope.put("isSpiderMonkey", scope, false);
      scope.put("isRhino", scope, true);
      scope.put(
          "__evaluateString",
          scope,
          new LambdaFunction(scope, "__evaluateString", 1, Main::evaluateString));
      runResource(cx, scope, "JetStreamDriver.js");
      runResource(cx, scope, "start.js");
      cx.processMicrotasks();
    }
  }

  private static Object evaluateString(
      Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
    if (args.length < 1) {
      throw ScriptRuntime.typeError("Missing script");
    }
    String script = ScriptRuntime.toString(args[0]);
    return cx.evaluateString(scope, script, "script", 1, null);
  }

  private static Scriptable makeParams(Context cx, Scriptable scope) {
    var p = cx.newObject(scope);
    p.put("testIterationCountMap", p, cx.newObject(scope));
    p.put("testWorstCaseCountMap", p, cx.newObject(scope));
    p.put("testList", p, cx.newArray(scope, new Object[] {"Octane" /*"Sunspider", "cdjs"*/}));
    p.put("dumpJSONResults", p, false);
    return p;
  }

  private static void runResource(Context cx, Scriptable scope, String name) throws IOException {
    try (var in = Main.class.getClassLoader().getResourceAsStream(name)) {
      if (in == null) {
        throw new IOException("Resource " + name + " not found");
      }
      try (var rdr = new InputStreamReader(in, StandardCharsets.UTF_8)) {
        cx.evaluateReader(scope, rdr, name, 1, null);
      }
    }
  }
}
