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
var Inst = /*#__PURE__*/function () {
  function Inst(opcode) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    _classCallCheck(this, Inst);
    this._opcode = opcode;
    this._args = args;
  }
  return _createClass(Inst, [{
    key: "append",
    value: function append() {
      var _this$_args;
      (_this$_args = this._args).push.apply(_this$_args, arguments);
    }
  }, {
    key: "clear",
    value: function clear() {
      this._opcode = Nop;
      this._args = [];
    }
  }, {
    key: "opcode",
    get: function () {
      return this._opcode;
    }
  }, {
    key: "args",
    get: function () {
      return this._args;
    }
  }, {
    key: "visitArg",
    value: function visitArg(index, func) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      var replacement = func.apply(void 0, [this._args[index]].concat(args));
      if (replacement) this._args[index] = replacement;
    }
  }, {
    key: "forEachTmpFast",
    value: function forEachTmpFast(func) {
      for (var i = 0; i < this._args.length; ++i) {
        var replacement = void 0;
        if (replacement = this._args[i].forEachTmpFast(func)) this._args[i] = replacement;
      }
    }
  }, {
    key: "forEachArg",
    value: function forEachArg(func) {
      Inst_forEachArg(this, func);
    }
  }, {
    key: "forEachTmp",
    value: function forEachTmp(func) {
      this.forEachArg((arg, role, type, width) => {
        return arg.forEachTmp(role, type, width, func);
      });
    }
  }, {
    key: "forEach",
    value: function forEach(thing, func) {
      this.forEachArg((arg, role, type, width) => {
        return arg.forEach(thing, role, type, width, func);
      });
    }
  }, {
    key: "hasNonArgEffects",
    get: function () {
      return Inst_hasNonArgEffects(this);
    }
  }, {
    key: "hash",
    value: function hash() {
      var result = opcodeCode(this.opcode);
      for (var arg of this.args) {
        result += arg.hash();
        result |= 0;
      }
      return result >>> 0;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "" + symbolName(this._opcode) + " " + this._args.join(", ");
    }
  }], [{
    key: "forEachDef",
    value: function forEachDef(thing, prevInst, nextInst, func) {
      if (prevInst) {
        prevInst.forEach(thing, (value, role, type, width) => {
          if (Arg.isLateDef(role)) return func(value, role, type, width);
        });
      }
      if (nextInst) {
        nextInst.forEach(thing, (value, role, type, width) => {
          if (Arg.isEarlyDef(role)) return func(value, role, type, width);
        });
      }
    }
  }, {
    key: "forEachDefWithExtraClobberedRegs",
    value: function forEachDefWithExtraClobberedRegs(thing, prevInst, nextInst, func) {
      forEachDef(thing, prevInst, nextInst, func);
      var regDefRole;
      var reportReg = reg => {
        var type = reg.isGPR ? GP : FP;
        func(thing.fromReg(reg), regDefRole, type, Arg.conservativeWidth(type));
      };
      if (prevInst && prevInst.opcode == Patch) {
        regDefRole = Arg.Def;
        prevInst.extraClobberedRegs.forEach(reportReg);
      }
      if (nextInst && nextInst.opcode == Patch) {
        regDefRole = Arg.EarlyDef;
        nextInst.extraEarlyClobberedRegs.forEach(reportReg);
      }
    }
  }]);
}();

