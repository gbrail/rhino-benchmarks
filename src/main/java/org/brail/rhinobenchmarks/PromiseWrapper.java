package org.brail.rhinobenchmarks;

import org.mozilla.javascript.Callable;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.LambdaFunction;
import org.mozilla.javascript.NativePromise;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Undefined;

/** PromiseWrapper adapts a Rhino Promise so that we can take action when it is resolved. */
public class PromiseWrapper {
  private final NativePromise promise;

  public interface ResultCallback {
    void deliver(Context cx, Scriptable scope, Object result);
  }

  public PromiseWrapper(NativePromise p) {
    this.promise = p;
  }

  /** Register a callback that will be called when the promise resolves. */
  public Object then(Context cx, Scriptable scope, ResultCallback cb) {
    var resolve =
        new LambdaFunction(
            scope,
            "resolve",
            1,
            (lcx, ls, to, args) -> {
              var val = args.length > 0 ? args[0] : Undefined.instance;
              cb.deliver(lcx, ls, val);
              return Undefined.instance;
            });
    var then = (Callable) ScriptableObject.getProperty(promise, "then");
    return then.call(cx, scope, promise, new Object[] {resolve});
  }

  /** Register a callback that will be called when the promise resolves. */
  public Object then(
      Context cx, Scriptable scope, ResultCallback resolveCb, ResultCallback rejectCb) {
    var resolve =
        new LambdaFunction(
            scope,
            "resolve",
            1,
            (lcx, ls, to, args) -> {
              var val = args.length > 0 ? args[0] : Undefined.instance;
              resolveCb.deliver(lcx, ls, val);
              return Undefined.instance;
            });
    var reject =
        new LambdaFunction(
            scope,
            "reject",
            1,
            (lcx, ls, to, args) -> {
              var val = args.length > 0 ? args[0] : Undefined.instance;
              rejectCb.deliver(lcx, ls, val);
              return Undefined.instance;
            });
    var then = (Callable) ScriptableObject.getProperty(promise, "then");
    return then.call(cx, scope, promise, new Object[] {resolve, reject});
  }
}
