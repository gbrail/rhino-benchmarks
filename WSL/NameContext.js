/*
 * Copyright (C) 2017 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
 */
"use strict";

function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Anything = Symbol();
function isWildcardKind(kind) {
  return kind == Anything;
}
var NameContext = /*#__PURE__*/function () {
  function NameContext(delegate) {
    _classCallCheck(this, NameContext);
    this._map = new Map();
    this._set = new Set();
    this._currentStatement = null;
    this._delegate = delegate;
    this._intrinsics = null;
    this._program = null;
  }
  return _createClass(NameContext, [{
    key: "add",
    value: function add(thing) {
      if (!thing.name) return;
      if (!thing.origin) throw new Error("Thing does not have origin: " + thing);
      if (thing.isNative && !thing.implementation) {
        if (!this._intrinsics) throw new Error("Native function in a scope that does not recognize intrinsics");
        this._intrinsics.add(thing);
      }
      if (thing.kind == Func) {
        this._set.add(thing);
        var array = this._map.get(thing.name);
        if (!array) {
          array = [];
          array.kind = Func;
          this._map.set(thing.name, array);
        }
        if (array.kind != Func) throw new WTypeError(thing.origin.originString, "Cannot reuse type name for function: " + thing.name);
        array.push(thing);
        return;
      }
      if (this._map.has(thing.name)) throw new WTypeError(thing.origin.originString, "Duplicate name: " + thing.name);
      this._set.add(thing);
      this._map.set(thing.name, thing);
    }
  }, {
    key: "get",
    value: function get(kind, name) {
      var result = this._map.get(name);
      if (!result && this._delegate) return this._delegate.get(kind, name);
      if (result && !isWildcardKind(kind) && result.kind != kind) return null;
      return result;
    }
  }, {
    key: "underlyingThings",
    value: function underlyingThings(kind, name) {
      var things = this.get(kind, name);
      return NameContext.underlyingThings(things);
    }
  }, {
    key: "resolveFuncOverload",
    value: function resolveFuncOverload(name, typeArguments, argumentTypes, returnType) {
      var allowEntryPoint = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var functions = this.get(Func, name);
      if (!functions) return {
        failures: []
      };
      return resolveOverloadImpl(functions, typeArguments, argumentTypes, returnType, allowEntryPoint);
    }
  }, {
    key: "currentStatement",
    get: function () {
      if (this._currentStatement) return this._currentStatement;
      if (this._delegate) return this._delegate.currentStatement;
      return null;
    }
  }, {
    key: "doStatement",
    value: function doStatement(statement, callback) {
      this._currentStatement = statement;
      callback();
      this._currentStatement = null;
    }
  }, {
    key: "recognizeIntrinsics",
    value: function recognizeIntrinsics() {
      this._intrinsics = new Intrinsics(this);
    }
  }, {
    key: "intrinsics",
    get: function () {
      if (this._intrinsics) return this._intrinsics;
      if (this._delegate) return this._delegate.intrinsics;
      return null;
    }
  }, {
    key: "program",
    get: function () {
      if (this._program) return this._program;
      if (this._delegate) return this._delegate.program;
      return null;
    },
    set: function (value) {
      this._program = value;
    }
  }, {
    key: Symbol.iterator,
    value: function* () {
      for (var value of this._map.values()) {
        if (value instanceof Array) {
          for (var func of value) yield func;
          continue;
        }
        yield value;
      }
    }
  }], [{
    key: "underlyingThings",
    value: function* underlyingThings(thing) {
      if (!thing) return;
      if (thing.kind === Func) {
        if (!(thing instanceof Array)) throw new Error("Func thing is not array: " + thing);
        for (var func of thing) yield func;
        return;
      }
      yield thing;
    }
  }]);
}();

