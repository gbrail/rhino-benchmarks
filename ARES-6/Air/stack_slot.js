/*
 * Copyright (C) 2016 Apple Inc. All rights reserved.
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
var StackSlot = /*#__PURE__*/function () {
  function StackSlot(index, byteSize, kind) {
    _classCallCheck(this, StackSlot);
    this._index = index;
    this._byteSize = byteSize;
    this._kind = kind;
  }
  return _createClass(StackSlot, [{
    key: "byteSize",
    get: function () {
      return this._byteSize;
    }
  }, {
    key: "kind",
    get: function () {
      return this._kind;
    }
  }, {
    key: "isLocked",
    get: function () {
      return this._kind == Locked;
    }
  }, {
    key: "isSpill",
    get: function () {
      return this._kind == Spill;
    }
  }, {
    key: "index",
    get: function () {
      return this._index;
    }
  }, {
    key: "ensureSize",
    value: function ensureSize(size) {
      if (this._offsetFromFP) throw new Error("Stack slot already allocated");
      this._byteSize = Math.max(this._byteSize, size);
    }
  }, {
    key: "alignment",
    get: function () {
      if (this._byteSize <= 1) return 1;
      if (this._byteSize <= 2) return 2;
      if (this._byteSize <= 4) return 4;
      return 8;
    }
  }, {
    key: "offsetFromFP",
    get: function () {
      return this._offsetFromFP;
    }
  }, {
    key: "setOffsetFromFP",
    value: function setOffsetFromFP(value) {
      this._offsetFromFP = value;
    }
  }, {
    key: "hash",
    value: function hash() {
      return (this._kind == Spill ? 1 : 0) + this._byteSize * 3 + (this._offsetFromFP ? this._offsetFromFP * 7 : 0) >>> 0;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "" + (this.isSpill ? "spill" : "stack") + this._index + "<" + this._byteSize + (this._offsetFromFP ? ", offset = " + this._offsetFromFP : "") + ">";
    }
  }], [{
    key: "extract",
    value: function extract(arg) {
      if (arg.isStack) return arg.stackSlot;
      return null;
    }
  }, {
    key: "forEachFast",
    value: function forEachFast(arg, func) {
      if (!arg.isStack) return;
      var replacement;
      if (replacement = func(arg.stackSlot)) return Arg.createStack(replacement, this._offset);
    }
  }, {
    key: "forEach",
    value: function forEach(arg, role, type, width, func) {
      if (!arg.isStack) return;
      var replacement;
      if (replacement = func(arg.stackSlot, role, type, width)) return Arg.createStack(replacement, this._offset);
    }
  }]);
}();

