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
var UnificationContext = /*#__PURE__*/function () {
  function UnificationContext(typeParameters) {
    _classCallCheck(this, UnificationContext);
    this._typeParameters = new Set(typeParameters);
    this._nextMap = new Map();
    this._extraNodes = new Set();
  }
  return _createClass(UnificationContext, [{
    key: "union",
    value: function union(a, b) {
      a = this.find(a);
      b = this.find(b);
      if (a == b) return;
      if (!a.isUnifiable) {
        [a, b] = [b, a];
        if (!a.isUnifiable) throw new Error("Cannot unify non-unifiable things " + a + " and " + b);
      }

      // Make sure that type parameters don't end up being roots.
      if (a.isUnifiable && b.isUnifiable && this._typeParameters.has(b)) [a, b] = [b, a];
      this._nextMap.set(a, b);
    }
  }, {
    key: "find",
    value: function find(node) {
      var currentNode = node;
      var nextNode = this._nextMap.get(currentNode);
      if (!nextNode) return currentNode;
      for (;;) {
        currentNode = nextNode;
        nextNode = this._nextMap.get(currentNode);
        if (!nextNode) break;
      }
      this._nextMap.set(node, currentNode);
      return currentNode;
    }
  }, {
    key: "addExtraNode",
    value: function addExtraNode(node) {
      this._extraNodes.add(node);
    }
  }, {
    key: "nodes",
    get: function () {
      var result = new Set();
      for (var [key, value] of this._nextMap) {
        result.add(key);
        result.add(value);
      }
      for (var node of this._extraNodes) result.add(node);
      return result;
    }
  }, {
    key: "typeParameters",
    value: function typeParameters() {
      return this._typeParameters;
    }
  }, {
    key: "typeArguments",
    value: function* typeArguments() {
      for (var typeArgument of this.nodes) {
        if (!typeArgument.isUnifiable) continue;
        if (this._typeParameters.has(typeArgument)) continue;
        yield typeArgument;
      }
    }
  }, {
    key: "verify",
    value: function verify() {
      // We do a two-phase pre-verification. This gives literals a chance to select a more specific type.
      var preparations = [];
      for (var node of this.nodes) {
        var preparation = node.prepareToVerify(this);
        if (preparation) preparations.push(preparation);
      }
      for (var _preparation of preparations) {
        var result = _preparation();
        if (!result.result) return result;
      }
      for (var typeParameter of this._typeParameters) {
        var _result = typeParameter.verifyAsParameter(this);
        if (!_result.result) return _result;
      }
      var numTypeVariableArguments = 0;
      var argumentSet = new Set();
      for (var typeArgument of this.typeArguments()) {
        var _result2 = typeArgument.verifyAsArgument(this);
        if (!_result2.result) return _result2;
        if (typeArgument.isLiteral) continue;
        argumentSet.add(this.find(typeArgument));
        numTypeVariableArguments++;
      }
      if (argumentSet.size == numTypeVariableArguments) return {
        result: true
      };
      return {
        result: false,
        reason: "Type variables used as arguments got unified with each other"
      };
    }
  }, {
    key: "conversionCost",
    get: function () {
      var result = 0;
      for (var typeArgument of this.typeArguments()) result += typeArgument.conversionCost(this);
      return result;
    }
  }, {
    key: "commit",
    value: function commit() {
      for (var typeArgument of this.typeArguments()) typeArgument.commitUnification(this);
    }
  }]);
}();

