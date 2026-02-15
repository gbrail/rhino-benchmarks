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

function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Reg = /*#__PURE__*/function (_TmpBase) {
  function Reg(index, type, name, isCalleeSave) {
    var _this;
    _classCallCheck(this, Reg);
    _this = _callSuper(this, Reg);
    _this._index = index;
    _this._type = type;
    _this._name = name;
    _this._isCalleeSave = !!isCalleeSave;
    return _this;
  }
  _inherits(Reg, _TmpBase);
  return _createClass(Reg, [{
    key: "index",
    get: function () {
      return this._index;
    }
  }, {
    key: "type",
    get: function () {
      return this._type;
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }, {
    key: "isCalleeSave",
    get: function () {
      return this._isCalleeSave;
    }
  }, {
    key: "isReg",
    get: function () {
      return true;
    }
  }, {
    key: "hash",
    value: function hash() {
      if (this.isGP) return 1 + this._index;
      return -1 - this._index;
    }
  }, {
    key: "toString",
    value: function toString() {
      return `%${this._name}`;
    }
  }], [{
    key: "fromReg",
    value: function fromReg(reg) {
      return reg;
    }
  }, {
    key: "extract",
    value: function extract(arg) {
      if (arg.isReg) return arg.reg;
      return null;
    }
  }, {
    key: "forEachFast",
    value: function forEachFast(arg, func) {
      return arg.forEachTmpFast(tmp => {
        if (!tmp.isReg) return;
        return func(tmp);
      });
    }
  }, {
    key: "forEach",
    value: function forEach(arg, argRole, argType, argWidth, func) {
      return arg.forEachTmp(argRole, argType, argWidth, (tmp, role, type, width) => {
        if (!tmp.isReg) return;
        return func(tmp, role, type, width);
      });
    }
  }]);
}(TmpBase);
{
  Reg.regs = [];
  function newReg() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var result = _construct(Reg, args);
    Reg.regs.push(result);
    return result;
  }

  // Define X86_64 GPRs
  {
    var index = 0;
    function newGPR(name, isCalleeSave) {
      return newReg(index++, GP, name, isCalleeSave);
    }
    Reg.rax = newGPR("rax");
    Reg.rcx = newGPR("rcx");
    Reg.rdx = newGPR("rdx");
    Reg.rbx = newGPR("rbx", true);
    Reg.rsp = newGPR("rsp");
    Reg.rbp = newGPR("rbp", true);
    Reg.rsi = newGPR("rsi");
    Reg.rdi = newGPR("rdi");
    for (var i = 8; i <= 15; ++i) Reg[`r${i}`] = newGPR(`r${i}`, i >= 12);
  }

  // Define X86_64 FPRs.
  for (var _i = 0; _i <= 15; ++_i) Reg[`xmm${_i}`] = newReg(_i, FP, `xmm${_i}`);
  Reg.gprs = [];
  Reg.fprs = [];
  Reg.calleeSaveGPRs = [];
  Reg.calleeSaveFPRs = [];
  Reg.calleeSaves = [];
  for (var reg of Reg.regs) {
    if (reg.isGP) {
      Reg.gprs.push(reg);
      if (reg.isCalleeSave) Reg.calleeSaveGPRs.push(reg);
    } else {
      Reg.fprs.push(reg);
      if (reg.isCalleeSave) Reg.calleeSaveFPRS.push(reg);
    }
    if (reg.isCalleeSave) Reg.calleeSaves.push(reg);
  }
  Reg.callFrameRegister = Reg.rbp;
  Reg.stackPointerRegister = Reg.rsp;
}

