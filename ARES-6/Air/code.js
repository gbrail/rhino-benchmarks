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
var Code = /*#__PURE__*/function () {
  function Code() {
    _classCallCheck(this, Code);
    this._blocks = [];
    this._stackSlots = [];
    this._gpTmps = [];
    this._fpTmps = [];
    this._callArgAreaSize = 0;
    this._frameSize = 0;
  }
  return _createClass(Code, [{
    key: "addBlock",
    value: function addBlock() {
      var frequency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return addIndexed(this._blocks, BasicBlock, frequency);
    }
  }, {
    key: "addStackSlot",
    value: function addStackSlot(byteSize, kind) {
      return addIndexed(this._stackSlots, StackSlot, byteSize, kind);
    }
  }, {
    key: "newTmp",
    value: function newTmp(type) {
      return addIndexed(this[`_${lowerSymbolName(type)}Tmps`], Tmp, type);
    }
  }, {
    key: "size",
    get: function () {
      return this._blocks.length;
    }
  }, {
    key: "at",
    value: function at(index) {
      return this._blocks[index];
    }
  }, {
    key: Symbol.iterator,
    value: function () {
      return this._blocks[Symbol.iterator]();
    }
  }, {
    key: "blocks",
    get: function () {
      return this._blocks;
    }
  }, {
    key: "stackSlots",
    get: function () {
      return this._stackSlots;
    }
  }, {
    key: "tmps",
    value: function tmps(type) {
      return this[`_${lowerSymbolName(type)}Tmps`];
    }
  }, {
    key: "callArgAreaSize",
    get: function () {
      return this._callArgAreaSize;
    }
  }, {
    key: "requestCallArgAreaSize",
    value: function requestCallArgAreaSize(size) {
      this._callArgAreaSize = Math.max(this._callArgAreaSize, roundUpToMultipleOf(stackAlignmentBytes, size));
    }
  }, {
    key: "frameSize",
    get: function () {
      return this._frameSize;
    }
  }, {
    key: "setFrameSize",
    value: function setFrameSize(frameSize) {
      this._frameSize = frameSize;
    }
  }, {
    key: "hash",
    value: function hash() {
      var result = 0;
      for (var block of this) {
        result *= 1000001;
        result |= 0;
        for (var inst of block) {
          result *= 97;
          result |= 0;
          result += inst.hash();
          result |= 0;
        }
        for (var successor of block.successorBlocks) {
          result *= 7;
          result |= 0;
          result += successor.index;
          result |= 0;
        }
      }
      for (var slot of this.stackSlots) {
        result *= 101;
        result |= 0;
        result += slot.hash();
        result |= 0;
      }
      return result >>> 0;
    }
  }, {
    key: "toString",
    value: function toString() {
      var result = "";
      for (var block of this) {
        result += block.toStringDeep();
      }
      if (this.stackSlots.length) {
        result += "Stack slots:\n";
        for (var slot of this.stackSlots) result += `    ${slot}\n`;
      }
      if (this._frameSize) result += `Frame size: ${this._frameSize}\n`;
      if (this._callArgAreaSize) result += `Call arg area size: ${this._callArgAreaSize}\n`;
      return result;
    }
  }]);
}();

