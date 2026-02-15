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
var Arg = /*#__PURE__*/function () {
  function Arg() {
    _classCallCheck(this, Arg);
    this._kind = Arg.Invalid;
  }
  return _createClass(Arg, [{
    key: "kind",
    get: function () {
      return this._kind;
    }
  }, {
    key: "isTmp",
    get: function () {
      return this._kind == Arg.Tmp;
    }
  }, {
    key: "isImm",
    get: function () {
      return this._kind == Arg.Imm;
    }
  }, {
    key: "isBigImm",
    get: function () {
      return this._kind == Arg.BigImm;
    }
  }, {
    key: "isBitImm",
    get: function () {
      return this._kind == Arg.BitImm;
    }
  }, {
    key: "isBitImm64",
    get: function () {
      return this._kind == Arg.BitImm64;
    }
  }, {
    key: "isSomeImm",
    get: function () {
      switch (this._kind) {
        case Arg.Imm:
        case Arg.BitImm:
          return true;
        default:
          return false;
      }
    }
  }, {
    key: "isSomeBigImm",
    get: function () {
      switch (this._kind) {
        case Arg.BigImm:
        case Arg.BitImm64:
          return true;
        default:
          return false;
      }
    }
  }, {
    key: "isAddr",
    get: function () {
      return this._kind == Arg.Addr;
    }
  }, {
    key: "isStack",
    get: function () {
      return this._kind == Arg.Stack;
    }
  }, {
    key: "isCallArg",
    get: function () {
      return this._kind == Arg.CallArg;
    }
  }, {
    key: "isIndex",
    get: function () {
      return this._kind == Arg.Index;
    }
  }, {
    key: "isMemory",
    get: function () {
      switch (this._kind) {
        case Arg.Addr:
        case Arg.Stack:
        case Arg.CallArg:
        case Arg.Index:
          return true;
        default:
          return false;
      }
    }
  }, {
    key: "isStackMemory",
    get: function () {
      switch (this._kind) {
        case Arg.Addr:
          return this._base == Reg.callFrameRegister || this._base == Reg.stackPointerRegister;
        case Arg.Stack:
        case Arg.CallArg:
          return true;
        default:
          return false;
      }
    }
  }, {
    key: "isRelCond",
    get: function () {
      return this._kind == Arg.RelCond;
    }
  }, {
    key: "isResCond",
    get: function () {
      return this._kind == Arg.ResCond;
    }
  }, {
    key: "isDoubleCond",
    get: function () {
      return this._kind == Arg.DoubleCond;
    }
  }, {
    key: "isCondition",
    get: function () {
      switch (this._kind) {
        case Arg.RelCond:
        case Arg.ResCond:
        case Arg.DoubleCond:
          return true;
        default:
          return false;
      }
    }
  }, {
    key: "isWidth",
    get: function () {
      return this._kind == Arg.Width;
    }
  }, {
    key: "isSpecial",
    get: function () {
      return this._kind == Arg.Special;
    }
  }, {
    key: "isAlive",
    get: function () {
      return this.isTmp || this.isStack;
    }
  }, {
    key: "tmp",
    get: function () {
      if (this._kind != Arg.Tmp) throw new Error("Called .tmp for non-tmp");
      return this._tmp;
    }
  }, {
    key: "value",
    get: function () {
      if (!this.isSomeImm) throw new Error("Called .value for non-imm");
      return this._value;
    }
  }, {
    key: "lowValue",
    get: function () {
      if (!this.isSomeBigImm) throw new Error("Called .lowValue for non-big-imm");
      return this._lowValue;
    }
  }, {
    key: "highValue",
    get: function () {
      if (!this.isSomeBigImm) throw new Error("Called .highValue for non-big-imm");
      return this._highValue;
    }
  }, {
    key: "base",
    get: function () {
      switch (this._kind) {
        case Arg.Addr:
        case Arg.Index:
          return this._base;
        default:
          throw new Error("Called .base for non-address");
      }
    }
  }, {
    key: "hasOffset",
    get: function () {
      return this.isMemory;
    }
  }, {
    key: "offset",
    get: function () {
      switch (this._kind) {
        case Arg.Addr:
        case Arg.Index:
        case Arg.Stack:
        case Arg.CallArg:
          return this._offset;
        default:
          throw new Error("Called .offset for non-address");
      }
    }
  }, {
    key: "stackSlot",
    get: function () {
      if (this._kind != Arg.Stack) throw new Error("Called .stackSlot for non-address");
      return this._slot;
    }
  }, {
    key: "index",
    get: function () {
      if (this._kind != Arg.Index) throw new Error("Called .index for non-Index");
      return this._index;
    }
  }, {
    key: "scale",
    get: function () {
      if (this._kind != Arg.Index) throw new Error("Called .scale for non-Index");
      return this._scale;
    }
  }, {
    key: "logScale",
    get: function () {
      return Arg.logScale(this.scale);
    }
  }, {
    key: "width",
    get: function () {
      if (this._kind != Arg.Width) throw new Error("Called .width for non-Width");
      return this._width;
    }
  }, {
    key: "isGPTmp",
    get: function () {
      return this.isTmp && this.tmp.isGP;
    }
  }, {
    key: "isFPTmp",
    get: function () {
      return this.isTmp && this.tmp.isFP;
    }
  }, {
    key: "isGP",
    get: function () {
      switch (this._kind) {
        case Arg.Imm:
        case Arg.BigImm:
        case Arg.BitImm:
        case Arg.BitImm64:
        case Arg.Addr:
        case Arg.Index:
        case Arg.Stack:
        case Arg.CallArg:
        case Arg.RelCond:
        case Arg.ResCond:
        case Arg.DoubleCond:
        case Arg.Width:
        case Arg.Special:
          return true;
        case Arg.Tmp:
          return this.isGPTmp;
        case Arg.Invalid:
          return false;
        default:
          throw new Error("Bad kind");
      }
    }
  }, {
    key: "isFP",
    get: function () {
      switch (this._kind) {
        case Arg.Imm:
        case Arg.BitImm:
        case Arg.BitImm64:
        case Arg.RelCond:
        case Arg.ResCond:
        case Arg.DoubleCond:
        case Arg.Width:
        case Arg.Special:
        case Arg.Invalid:
          return false;
        case Arg.Addr:
        case Arg.Index:
        case Arg.Stack:
        case Arg.CallArg:
        case Arg.BigImm:
          return true;
        case Arg.Tmp:
          return this.isFPTmp;
        default:
          throw new Error("Bad kind");
      }
    }
  }, {
    key: "hasType",
    get: function () {
      switch (this._kind) {
        case Arg.Imm:
        case Arg.BitImm:
        case Arg.BitImm64:
        case Arg.Tmp:
          return true;
        default:
          return false;
      }
    }
  }, {
    key: "type",
    get: function () {
      return this.isGP ? GP : FP;
    }
  }, {
    key: "isType",
    value: function isType(type) {
      switch (type) {
        case Arg.GP:
          return this.isGP;
        case Arg.FP:
          return this.isFP;
        default:
          throw new Error("Bad type");
      }
    }
  }, {
    key: "isCompatibleType",
    value: function isCompatibleType(other) {
      if (this.hasType) return other.isType(this.type);
      if (other.hasType) return this.isType(other.type);
      return true;
    }
  }, {
    key: "isGPR",
    get: function () {
      return this.isTmp && this.tmp.isGPR;
    }
  }, {
    key: "gpr",
    get: function () {
      return this.tmp.gpr;
    }
  }, {
    key: "isFPR",
    get: function () {
      return this.isTmp && this.tmp.isFPR;
    }
  }, {
    key: "fpr",
    get: function () {
      return this.tmp.fpr;
    }
  }, {
    key: "isReg",
    get: function () {
      return this.isTmp && this.tmp.isReg;
    }
  }, {
    key: "reg",
    get: function () {
      return this.tmp.reg;
    }
  }, {
    key: "isValidForm",
    value: function isValidForm(width) {
      switch (this._kind) {
        case Arg.Invalid:
          return false;
        case Arg.Tmp:
          return true;
        case Arg.Imm:
          return Arg.isValidImmForm(this.value);
        case Arg.BigImm:
          return true;
        case Arg.BitImm:
          return Arg.isValidBitImmForm(this.value);
        case Arg.BitImm64:
          return Arg.isValidBitImm64Form(this.value);
        case Arg.Addr:
        case Arg.Stack:
        case Arg.CallArg:
          return Arg.isValidAddrForm(this.offset, width);
        case Arg.Index:
          return Arg.isValidIndexForm(this.scale, this.offset, width);
        case Arg.RelCond:
        case Arg.ResCond:
        case Arg.DoubleCond:
        case Arg.Width:
        case Arg.Special:
          return true;
        default:
          throw new Error("Bad kind");
      }
    }
  }, {
    key: "forEachTmpFast",
    value: function forEachTmpFast(func) {
      switch (this._kind) {
        case Arg.Tmp:
          {
            var replacement;
            if (replacement = func(this._tmp)) return Arg.createTmp(replacement);
            break;
          }
        case Arg.Addr:
          {
            var _replacement;
            if (_replacement = func(this._base)) return Arg.createAddr(_replacement, this._offset);
            break;
          }
        case Arg.Index:
          {
            var baseReplacement = func(this._base);
            var indexReplacement = func(this._index);
            if (baseReplacement || indexReplacement) {
              return Arg.createIndex(baseReplacement ? baseReplacement : this._base, indexReplacement ? indexReplacement : this._index, this._scale, this._offset);
            }
            break;
          }
        default:
          break;
      }
    }
  }, {
    key: "usesTmp",
    value: function usesTmp(expectedTmp) {
      var usesTmp = false;
      forEachTmpFast(tmp => {
        usesTmp |= tmp == expectedTmp;
      });
      return usesTmp;
    }
  }, {
    key: "forEachTmp",
    value: function forEachTmp(role, type, width, func) {
      switch (this._kind) {
        case Arg.Tmp:
          {
            var replacement;
            if (replacement = func(this._tmp, role, type, width)) return Arg.createTmp(replacement);
            break;
          }
        case Arg.Addr:
          {
            var _replacement2;
            if (_replacement2 = func(this._base, Arg.Use, GP, role == Arg.UseAddr ? width : Ptr)) return Arg.createAddr(_replacement2, this._offset);
            break;
          }
        case Arg.Index:
          {
            var baseReplacement = func(this._base, Arg.Use, GP, role == Arg.UseAddr ? width : Ptr);
            var indexReplacement = func(this._index, Arg.Use, GP, role == Arg.UseAddr ? width : Ptr);
            if (baseReplacement || indexReplacement) {
              return Arg.createIndex(baseReplacement ? baseReplacement : this._base, indexReplacement ? indexReplacement : this._index, this._scale, this._offset);
            }
            break;
          }
        default:
          break;
      }
    }
  }, {
    key: "is",
    value: function is(thing) {
      return !!thing.extract(this);
    }
  }, {
    key: "as",
    value: function as(thing) {
      return thing.extract(this);
    }

    // This lets you say things like:
    // arg.forEach(Tmp | Reg | Arg | StackSlot, ...)
    //
    // It's used for abstract liveness analysis.
  }, {
    key: "forEachFast",
    value: function forEachFast(thing, func) {
      return thing.forEachFast(this, func);
    }
  }, {
    key: "forEach",
    value: function forEach(thing, role, type, width, func) {
      return thing.forEach(this, role, type, width, func);
    }
  }, {
    key: "condition",
    get: function () {
      switch (this._kind) {
        case Arg.RelCond:
        case Arg.ResCond:
        case Arg.DoubleCond:
          return this._condition;
        default:
          throw new Error("Called .condition for non-condition");
      }
    }
  }, {
    key: "isInvertible",
    get: function () {
      switch (this._kind) {
        case Arg.RelCond:
        case Arg.DoubleCold:
          return true;
        case Arg.ResCond:
          switch (this._condition) {
            case Zero:
            case NonZero:
            case Signed:
            case PositiveOrZero:
              return true;
            default:
              return false;
          }
        default:
          return false;
      }
    }
  }, {
    key: "hash",
    value: function hash() {
      var result = Arg.kindCode(this._kind);
      switch (this._kind) {
        case Arg.Invalid:
        case Arg.Special:
          break;
        case Arg.Tmp:
          result += this._tmp.hash();
          result |= 0;
          break;
        case Arg.Imm:
        case Arg.BitImm:
          result += this._value;
          result |= 0;
          break;
        case Arg.BigImm:
        case Arg.BitImm64:
          result += this._lowValue;
          result |= 0;
          result += this._highValue;
          result |= 0;
          break;
        case Arg.CallArg:
          result += this._offset;
          result |= 0;
          break;
        case Arg.RelCond:
          result += relCondCode(this._condition);
          result |= 0;
          break;
        case Arg.ResCond:
          result += resCondCode(this._condition);
          result |= 0;
          break;
        case Arg.DoubleCond:
          result += doubleCondCode(this._condition);
          result |= 0;
          break;
        case Arg.WidthArg:
          result += this._width;
          result |= 0;
          break;
        case Arg.Addr:
          result += this._offset;
          result |= 0;
          result += this._base.hash();
          result |= 0;
          break;
        case Arg.Index:
          result += this._offset;
          result |= 0;
          result += this._scale;
          result |= 0;
          result += this._base.hash();
          result |= 0;
          result += this._index.hash();
          result |= 0;
          break;
        case Arg.Stack:
          result += this._offset;
          result |= 0;
          result += this.stackSlot.index;
          result |= 0;
          break;
      }
      return result >>> 0;
    }
  }, {
    key: "toString",
    value: function toString() {
      switch (this._kind) {
        case Arg.Invalid:
          return "<invalid>";
        case Arg.Tmp:
          return this._tmp.toString();
        case Arg.Imm:
          return "$" + this._value;
        case Arg.BigImm:
        case Arg.BitImm64:
          return "$0x" + this._highValue.toString(16) + ":" + this._lowValue.toString(16);
        case Arg.Addr:
          return "" + (this._offset ? this._offset : "") + "(" + this._base + ")";
        case Arg.Index:
          return "" + (this._offset ? this._offset : "") + "(" + this._base + "," + this._index + (this._scale == 1 ? "" : "," + this._scale) + ")";
        case Arg.Stack:
          return "" + (this._offset ? this._offset : "") + "(" + this._slot + ")";
        case Arg.CallArg:
          return "" + (this._offset ? this._offset : "") + "(callArg)";
        case Arg.RelCond:
        case Arg.ResCond:
        case Arg.DoubleCond:
          return symbolName(this._condition);
        case Arg.Special:
          return "special";
        case Arg.Width:
          return "" + this._value;
        default:
          throw new Error("Bad kind");
      }
    }
  }], [{
    key: "isAnyUse",
    value: function isAnyUse(role) {
      switch (role) {
        case Arg.Use:
        case Arg.ColdUse:
        case Arg.UseDef:
        case Arg.UseZDef:
        case Arg.LateUse:
        case Arg.LateColdUse:
        case Arg.Scratch:
          return true;
        case Arg.Def:
        case Arg.ZDef:
        case Arg.UseAddr:
        case Arg.EarlyDef:
          return false;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "isColdUse",
    value: function isColdUse(role) {
      switch (role) {
        case Arg.ColdUse:
        case Arg.LateColdUse:
          return true;
        case Arg.Use:
        case Arg.UseDef:
        case Arg.UseZDef:
        case Arg.LateUse:
        case Arg.Def:
        case Arg.ZDef:
        case Arg.UseAddr:
        case Arg.Scratch:
        case Arg.EarlyDef:
          return false;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "isWarmUse",
    value: function isWarmUse(role) {
      return Arg.isAnyUse(role) && !Arg.isColdUse(role);
    }
  }, {
    key: "cooled",
    value: function cooled(role) {
      switch (role) {
        case Arg.ColdUse:
        case Arg.LateColdUse:
        case Arg.UseDef:
        case Arg.UseZDef:
        case Arg.Def:
        case Arg.ZDef:
        case Arg.UseAddr:
        case Arg.Scratch:
        case Arg.EarlyDef:
          return role;
        case Arg.Use:
          return Arg.ColdUse;
        case Arg.LateUse:
          return Arg.LateColdUse;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "isEarlyUse",
    value: function isEarlyUse(role) {
      switch (role) {
        case Arg.Use:
        case Arg.ColdUse:
        case Arg.UseDef:
        case Arg.UseZDef:
          return true;
        case Arg.Def:
        case Arg.ZDef:
        case Arg.UseAddr:
        case Arg.LateUse:
        case Arg.LateColdUse:
        case Arg.Scratch:
        case Arg.EarlyDef:
          return false;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "isLateUse",
    value: function isLateUse(role) {
      switch (role) {
        case Arg.LateUse:
        case Arg.LateColdUse:
        case Arg.Scratch:
          return true;
        case Arg.ColdUse:
        case Arg.Use:
        case Arg.UseDef:
        case Arg.UseZDef:
        case Arg.Def:
        case Arg.ZDef:
        case Arg.UseAddr:
        case Arg.EarlyDef:
          return false;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "isAnyDef",
    value: function isAnyDef(role) {
      switch (role) {
        case Arg.Use:
        case Arg.ColdUse:
        case Arg.UseAddr:
        case Arg.LateUse:
        case Arg.LateColdUse:
          return false;
        case Arg.Def:
        case Arg.UseDef:
        case Arg.ZDef:
        case Arg.UseZDef:
        case Arg.EarlyDef:
        case Arg.Scratch:
          return true;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "isEarlyDef",
    value: function isEarlyDef(role) {
      switch (role) {
        case Arg.Use:
        case Arg.ColdUse:
        case Arg.UseAddr:
        case Arg.LateUse:
        case Arg.Def:
        case Arg.UseDef:
        case Arg.ZDef:
        case Arg.UseZDef:
        case Arg.LateColdUse:
          return false;
        case Arg.EarlyDef:
        case Arg.Scratch:
          return true;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "isLateDef",
    value: function isLateDef(role) {
      switch (role) {
        case Arg.Use:
        case Arg.ColdUse:
        case Arg.UseAddr:
        case Arg.LateUse:
        case Arg.EarlyDef:
        case Arg.Scratch:
        case Arg.LateColdUse:
          return false;
        case Arg.Def:
        case Arg.UseDef:
        case Arg.ZDef:
        case Arg.UseZDef:
          return true;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "isZDef",
    value: function isZDef(role) {
      switch (role) {
        case Arg.Use:
        case Arg.ColdUse:
        case Arg.UseAddr:
        case Arg.LateUse:
        case Arg.Def:
        case Arg.UseDef:
        case Arg.EarlyDef:
        case Arg.Scratch:
        case Arg.LateColdUse:
          return false;
        case Arg.ZDef:
        case Arg.UseZDef:
          return true;
        default:
          throw new Error("Bad role");
      }
    }
  }, {
    key: "typeForB3Type",
    value: function typeForB3Type(type) {
      switch (type) {
        case Int32:
        case Int64:
          return GP;
        case Float:
        case Double:
          return FP;
        default:
          throw new Error("Bad B3 type");
      }
    }
  }, {
    key: "widthForB3Type",
    value: function widthForB3Type(type) {
      switch (type) {
        case Int32:
        case Float:
          return 32;
        case Int64:
        case Double:
          return 64;
        default:
          throw new Error("Bad B3 type");
      }
    }
  }, {
    key: "conservativeWidth",
    value: function conservativeWidth(type) {
      return type == GP ? Ptr : 64;
    }
  }, {
    key: "minimumWidth",
    value: function minimumWidth(type) {
      return type == GP ? 8 : 32;
    }
  }, {
    key: "bytes",
    value: function bytes(width) {
      return width / 8;
    }
  }, {
    key: "widthForBytes",
    value: function widthForBytes(bytes) {
      switch (bytes) {
        case 0:
        case 1:
          return 8;
        case 2:
          return 16;
        case 3:
        case 4:
          return 32;
        default:
          if (bytes > 8) throw new Error("Bad number of bytes");
          return 64;
      }
    }
  }, {
    key: "createTmp",
    value: function createTmp(tmp) {
      var result = new Arg();
      result._kind = Arg.Tmp;
      result._tmp = tmp;
      return result;
    }
  }, {
    key: "fromReg",
    value: function fromReg(reg) {
      return Arg.createTmp(reg);
    }
  }, {
    key: "createImm",
    value: function createImm(value) {
      var result = new Arg();
      result._kind = Arg.Imm;
      result._value = value;
      return result;
    }
  }, {
    key: "createBigImm",
    value: function createBigImm(lowValue) {
      var highValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var result = new Arg();
      result._kind = Arg.BigImm;
      result._lowValue = lowValue;
      result._highValue = highValue;
      return result;
    }
  }, {
    key: "createBitImm",
    value: function createBitImm(value) {
      var result = new Arg();
      result._kind = Arg.BitImm;
      result._value = value;
      return result;
    }
  }, {
    key: "createBitImm64",
    value: function createBitImm64(lowValue) {
      var highValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var result = new Arg();
      result._kind = Arg.BitImm64;
      result._lowValue = lowValue;
      result._highValue = highValue;
      return result;
    }
  }, {
    key: "createAddr",
    value: function createAddr(base) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var result = new Arg();
      result._kind = Arg.Addr;
      result._base = base;
      result._offset = offset;
      return result;
    }
  }, {
    key: "createStack",
    value: function createStack(slot) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var result = new Arg();
      result._kind = Arg.Stack;
      result._slot = slot;
      result._offset = offset;
      return result;
    }
  }, {
    key: "createCallArg",
    value: function createCallArg(offset) {
      var result = new Arg();
      result._kind = Arg.CallArg;
      result._offset = offset;
      return result;
    }
  }, {
    key: "createStackAddr",
    value: function createStackAddr(offsetFromFP, frameSize, width) {
      var result = Arg.createAddr(Reg.callFrameRegister, offsetFromFP);
      if (!result.isValidForm(width)) result = Arg.createAddr(Reg.stackPointerRegister, offsetFromFP + frameSize);
      return result;
    }
  }, {
    key: "isValidScale",
    value: function isValidScale(scale, width) {
      switch (scale) {
        case 1:
        case 2:
        case 4:
        case 8:
          return true;
        default:
          return false;
      }
    }
  }, {
    key: "logScale",
    value: function logScale(scale) {
      switch (scale) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new Error("Bad scale");
      }
    }
  }, {
    key: "createIndex",
    value: function createIndex(base, index) {
      var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var result = new Arg();
      result._kind = Arg.Index;
      result._base = base;
      result._index = index;
      result._scale = scale;
      result._offset = offset;
      return result;
    }
  }, {
    key: "createRelCond",
    value: function createRelCond(condition) {
      var result = new Arg();
      result._kind = Arg.RelCond;
      result._condition = condition;
      return result;
    }
  }, {
    key: "createResCond",
    value: function createResCond(condition) {
      var result = new Arg();
      result._kind = Arg.ResCond;
      result._condition = condition;
      return result;
    }
  }, {
    key: "createDoubleCond",
    value: function createDoubleCond(condition) {
      var result = new Arg();
      result._kind = Arg.DoubleCond;
      result._condition = condition;
      return result;
    }
  }, {
    key: "createWidth",
    value: function createWidth(width) {
      var result = new Arg();
      result._kind = Arg.Width;
      result._width = width;
      return result;
    }
  }, {
    key: "createSpecial",
    value: function createSpecial() {
      var result = new Arg();
      result._kind = Arg.Special;
      return result;
    }
  }, {
    key: "isValidImmForm",
    value: function isValidImmForm(value) {
      return isRepresentableAsInt32(value);
    }
  }, {
    key: "isValidBitImmForm",
    value: function isValidBitImmForm(value) {
      return isRepresentableAsInt32(value);
    }
  }, {
    key: "isValidBitImm64Form",
    value: function isValidBitImm64Form(value) {
      return isRepresentableAsInt32(value);
    }
  }, {
    key: "isValidAddrForm",
    value: function isValidAddrForm(offset, width) {
      return true;
    }
  }, {
    key: "isValidIndexForm",
    value: function isValidIndexForm(scale, offset, width) {
      if (!isValidScale(scale, width)) return false;
      return true;
    }
  }, {
    key: "extract",
    value: function extract(arg) {
      return arg;
    }
  }, {
    key: "forEachFast",
    value: function forEachFast(arg, func) {
      return func(arg);
    }
  }, {
    key: "forEach",
    value: function forEach(arg, role, type, width, func) {
      return func(arg, role, type, width);
    }
  }, {
    key: "kindCode",
    value: function kindCode(kind) {
      switch (kind) {
        case Arg.Invalid:
          return 0;
        case Arg.Tmp:
          return 1;
        case Arg.Imm:
          return 2;
        case Arg.BigImm:
          return 3;
        case Arg.BitImm:
          return 4;
        case Arg.BitImm64:
          return 5;
        case Arg.Addr:
          return 6;
        case Arg.Stack:
          return 7;
        case Arg.CallArg:
          return 8;
        case Arg.Index:
          return 9;
        case Arg.RelCond:
          return 10;
        case Arg.ResCond:
          return 11;
        case Arg.DoubleCond:
          return 12;
        case Arg.Special:
          return 13;
        case Arg.WidthArg:
          return 14;
        default:
          throw new Error("Bad kind");
      }
    }
  }]);
}(); // Arg kinds
Arg.Invalid = Symbol("Invalid");
Arg.Tmp = Symbol("Tmp");
Arg.Imm = Symbol("Imm");
Arg.BigImm = Symbol("BigImm");
Arg.BitImm = Symbol("BitImm");
Arg.BitImm64 = Symbol("BitImm64");
Arg.Addr = Symbol("Addr");
Arg.Stack = Symbol("Stack");
Arg.CallArg = Symbol("CallArg");
Arg.Index = Symbol("Index");
Arg.RelCond = Symbol("RelCond");
Arg.ResCond = Symbol("ResCond");
Arg.DoubleCond = Symbol("DoubleCond");
Arg.Special = Symbol("Special");
Arg.Width = Symbol("Width");

// Arg roles
Arg.Use = Symbol("Use");
Arg.ColdUse = Symbol("ColdUse");
Arg.LateUse = Symbol("LateUse");
Arg.LateColdUse = Symbol("LateColdUse");
Arg.Def = Symbol("Def");
Arg.ZDef = Symbol("ZDef");
Arg.UseDef = Symbol("UseDef");
Arg.UseZDef = Symbol("UseZDef");
Arg.EarlyDef = Symbol("EarlyDef");
Arg.Scratch = Symbol("Scratch");
Arg.UseAddr = Symbol("UseAddr");

