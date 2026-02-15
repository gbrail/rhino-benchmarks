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
var BasicBlock = /*#__PURE__*/function () {
  function BasicBlock(index, frequency) {
    _classCallCheck(this, BasicBlock);
    this._index = index;
    this._frequency = frequency;
    this._insts = [];
    this._successors = [];
    this._predecessors = [];
  }
  return _createClass(BasicBlock, [{
    key: "index",
    get: function () {
      return this._index;
    }
  }, {
    key: "size",
    get: function () {
      return this._insts.length;
    }
  }, {
    key: Symbol.iterator,
    value: function () {
      return this._insts[Symbol.iterator]();
    }
  }, {
    key: "at",
    value: function at(index) {
      if (index >= this._insts.length) throw new Error("Out of bounds access");
      return this._insts[index];
    }
  }, {
    key: "get",
    value: function get(index) {
      if (index < 0 || index >= this._insts.length) return null;
      return this._insts[index];
    }
  }, {
    key: "last",
    get: function () {
      return this._insts[this._insts.length - 1];
    }
  }, {
    key: "insts",
    get: function () {
      return this._insts;
    }
  }, {
    key: "append",
    value: function append(inst) {
      this._insts.push(inst);
    }
  }, {
    key: "numSuccessors",
    get: function () {
      return this._successors.length;
    }
  }, {
    key: "successor",
    value: function successor(index) {
      return this._successors[index];
    }
  }, {
    key: "successors",
    get: function () {
      return this._successors;
    }
  }, {
    key: "successorBlock",
    value: function successorBlock(index) {
      return this._successors[index].block;
    }
  }, {
    key: "successorBlocks",
    get: function () {
      return new Proxy(this._successors, {
        get(target, property) {
          if (typeof property == "string" && (property | 0) == property) return target[property].block;
          return target[property];
        },
        set(target, property, value) {
          if (typeof property == "string" && (property | 0) == property) {
            var oldValue = target[property];
            target[property] = new FrequentedBlock(value, oldValue ? oldValue.frequency : Normal);
            return;
          }
          target[property] = value;
        }
      });
    }
  }, {
    key: "numPredecessors",
    get: function () {
      return this._predecessors.length;
    }
  }, {
    key: "predecessor",
    value: function predecessor(index) {
      return this._predecessors[index];
    }
  }, {
    key: "predecessors",
    get: function () {
      return this._predecessors;
    }
  }, {
    key: "frequency",
    get: function () {
      return this._frequency;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "#" + this._index;
    }
  }, {
    key: "headerString",
    get: function () {
      var result = "";
      result += `BB${this}: ; frequency = ${this._frequency}\n`;
      if (this._predecessors.length) result += "  Predecessors: " + this._predecessors.join(", ") + "\n";
      return result;
    }
  }, {
    key: "footerString",
    get: function () {
      var result = "";
      if (this._successors.length) result += "  Successors: " + this._successors.join(", ") + "\n";
      return result;
    }
  }, {
    key: "toStringDeep",
    value: function toStringDeep() {
      var result = "";
      result += this.headerString;
      for (var inst of this) result += `    ${inst}\n`;
      result += this.footerString;
      return result;
    }
  }]);
}();

