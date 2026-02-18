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

// This function accepts a JSON object describing the SPIR-V syntax.
// For example, https://github.com/KhronosGroup/SPIRV-Headers/blob/master/include/spirv/1.2/spirv.core.grammar.json
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function SPIRV(json) {
  var result = {
    ops: {},
    kinds: {}
  };
  var composites = new Map();
  var ids = new Map();
  for (var kind of json.operand_kinds) {
    switch (kind.category) {
      case "BitEnum":
      case "ValueEnum":
        var enumerants = {
          category: kind.category
        };
        for (var enumerant of kind.enumerants) {
          enumerants[enumerant.enumerant] = enumerant;
        }
        result.kinds[kind.kind] = enumerants;
        break;
      case "Composite":
        composites.set(kind.kind, kind);
        break;
      case "Id":
        ids.set(kind.kind, kind);
        break;
    }
  }
  function matchType(operandInfoKind, operand) {
    switch (operandInfoKind) {
      // FIXME: I'm not actually sure that Ids should be unsigned.
      case "IdResultType":
      case "IdResult":
      case "IdRef":
      case "IdScope":
      case "IdMemorySemantics":
      case "LiteralExtInstInteger":
        if (typeof operand != "number") throw new Error("Operand needs to be a number");
        if (operand >>> 0 != operand) throw new Error("Operand needs to fit in an unsigned int");
        return;
      case "LiteralInteger":
        if (typeof operand != "number") throw new Error("Operand needs to be a number");
        if ((operand | 0) != operand) throw new Error("Operand needs to fit in an int");
        return;
      case "LiteralString":
        if (typeof operand != "string") throw new Error("Operand needs to be a string");
        return;
      case "LiteralContextDependentNumber":
      case "LiteralSpecConstantOpInteger":
        if (typeof operand != "number") throw new Error("Operand needs to be a number");
        if (operand >>> 0 != operand && (operand | 0) != operand) throw new Error("Operand needs to fit in an unsigned int or an int.");
        return;
    }
    var kind = result.kinds[operandInfoKind];
    if (kind) {
      if (operand instanceof Array) {
        if (kind.category != "BitEnum") throw new Error("Passing an array to a " + kind.category + " operand");
        for (var operandItem of operand) {
          if (kind[operandItem.enumerant] != operandItem) throw new Error("" + operandItem.enumerant + " is not a member of " + operandInfoKind);
        }
        return;
      }
      if (kind[operand.enumerant] != operand) throw new Error("" + operand.enumerant + " is not a member of " + operandInfoKind);
      return;
    }
    throw new Error("Unknown type: " + operandInfoKind);
  }
  var OperandChecker = /*#__PURE__*/function () {
    function OperandChecker(operandInfos) {
      _classCallCheck(this, OperandChecker);
      this._operandInfos = operandInfos || [];
      this._operandIndex = 0;
      this._operandInfoIndex = 0;
      this._parameters = [];
    }
    return _createClass(OperandChecker, [{
      key: "_isStar",
      value: function _isStar(operandInfo) {
        switch (operandInfo.kind) {
          case "LiteralContextDependentNumber":
          case "LiteralSpecConstantOpInteger":
            // These types can be any width.
            return true;
        }
        return operandInfo.quantifier && operandInfo.quantifier == "*";
      }
    }, {
      key: "nextComparisonType",
      value: function (_nextComparisonType) {
        function nextComparisonType(_x) {
          return _nextComparisonType.apply(this, arguments);
        }
        nextComparisonType.toString = function () {
          return _nextComparisonType.toString();
        };
        return nextComparisonType;
      }(function (operand) {
        if (this._operandInfoIndex >= this._operandInfos.length) throw new Error("Specified operand does not correspond to any that the instruction expects.");
        var operandInfo = this._operandInfos[this._operandInfoIndex];
        var isStar = this._isStar(operandInfo);
        if (this._parameters.length != 0) {
          var _result = this._parameters[0];
          this._parameters.splice(0, 1);
          // FIXME: Handle parameters that require their own parameters
          ++this._operandIndex;
          if (this._parameters.length == 0 && !isStar) ++this._operandInfoIndex;
          return _result;
        }
        var composite = composites.get(operandInfo.kind);
        if (composite) {
          for (var base of composite.bases) this._parameters.push(base);
          nextComparisonType(operand);
          return;
        }
        var kind = result.kinds[operandInfo.kind];
        if (kind) {
          var _enumerant = kind[operand.enumerant];
          if (_enumerant) {
            var parameters = _enumerant.parameters;
            if (parameters) {
              for (var parameter of parameters) {
                this._parameters.push(parameter.kind);
              }
              ++this._operandIndex;
              return operandInfo.kind;
            }
          }
        }
        ++this._operandIndex;
        if (!isStar) ++this._operandInfoIndex;
        return operandInfo.kind;
      })
    }, {
      key: "check",
      value: function check(operand) {
        matchType(this.nextComparisonType(operand), operand);
      }
    }, {
      key: "finalize",
      value: function finalize() {
        if (this._parameters.length != 0) throw new Error("Operand not specified for parameter.");
        for (var i = this._operandInfoIndex; i < this._operandInfos.length; ++i) {
          var operandInfo = this._operandInfos[i];
          var quantifier = operandInfo.quantifier;
          if (quantifier != "?" && !this._isStar(operandInfo)) throw new Error("Did not specify operand " + i + " to instruction.");
        }
      }
    }]);
  }();
  var _loop = function (instruction) {
    if (!instruction.opname.startsWith("Op")) return 1; // continue
    var attributeName = instruction.opname.substring(2);
    result.ops[attributeName] = /*#__PURE__*/function () {
      function _class() {
        _classCallCheck(this, _class);
        var operandChecker = new OperandChecker(instruction.operands);
        for (var _len = arguments.length, operands = new Array(_len), _key = 0; _key < _len; _key++) {
          operands[_key] = arguments[_key];
        }
        for (var operand of operands) operandChecker.check(operand);
        operandChecker.finalize();
        this._operands = operands;
      }
      return _createClass(_class, [{
        key: "operands",
        get: function () {
          return this._operands;
        }
      }, {
        key: "opname",
        get: function () {
          return instruction.opname;
        }
      }, {
        key: "opcode",
        get: function () {
          return instruction.opcode;
        }
      }, {
        key: "operandInfo",
        get: function () {
          return instruction.operands;
        }
      }, {
        key: "storageSize",
        get: function () {
          var result = 1;
          for (var operand of this.operands) {
            if (typeof operand == "number") ++result;else if (typeof operand == "string") result += (operand.length + 1 + 3) / 4 | 0;else ++result;
          }
          return result;
        }
      }, {
        key: "largestId",
        get: function () {
          var maximumId = 0;
          var operandChecker = new OperandChecker(this.operandInfo);
          for (var operand of this.operands) {
            var type = operandChecker.nextComparisonType(operand);
            var idType = ids.get(type);
            if (idType) maximumId = Math.max(maximumId, operand);
          }
          return maximumId;
        }
      }]);
    }();
  };
  for (var instruction of json.instructions) {
    if (_loop(instruction)) continue;
  }
  return result;
}
var SPIRVAssembler = /*#__PURE__*/function () {
  function SPIRVAssembler() {
    _classCallCheck(this, SPIRVAssembler);
    this._largestId = 0;
    this._size = 5;
    this._storage = new Uint32Array(this.size);
    this.storage[0] = 0x07230203; // Magic number
    this.storage[1] = 0x00010000; // Version: 1.0
    this.storage[2] = 0x574B0000; // Tool: "WK"
    this.storage[3] = 0; // Placeholder: All <id>s are less than this value.
    this.storage[4] = 0; // Reserved
  }
  return _createClass(SPIRVAssembler, [{
    key: "append",
    value: function append(op) {
      this._largestId = Math.max(this._largestId, op.largestId);
      var deltaStorageSize = op.storageSize;
      if (this.size + deltaStorageSize > this.storage.length) {
        var newStorageSize = (this.size + deltaStorageSize) * 1.5;
        var newStorage = new Uint32Array(newStorageSize);
        for (var i = 0; i < this.size; ++i) newStorage[i] = this.storage[i];
        this._storage = newStorage;
      }
      if ((deltaStorageSize & 0xFFFF) != deltaStorageSize || (op.opcode & 0xFFFF) != op.opcode) throw new Error("Out of bounds!");
      this.storage[this.size] = (deltaStorageSize & 0xFFFF) << 16 | op.opcode & 0xFFFF;
      ++this._size;
      if (deltaStorageSize <= op.operands.size) throw new Error("The storage size must be greater than the number of parameters");
      for (var _i = 0; _i < op.operands.length; ++_i) {
        var operand = op.operands[_i];
        if (typeof operand == "number") {
          this.storage[this.size] = operand;
          ++this._size;
        } else if (typeof operand == "string") {
          var word = 0;
          for (var j = 0; j < operand.length + 1; ++j) {
            var charCode = void 0;
            if (j < operand.length) charCode = operand.charCodeAt(j);else charCode = 0;
            if (charCode > 0xFF) throw new Error("Non-ASCII strings don't work yet");
            switch (j % 4) {
              case 0:
                word |= charCode;
                break;
              case 1:
                word |= charCode << 8;
                break;
              case 2:
                word |= charCode << 16;
                break;
              case 3:
                word |= charCode << 24;
                this.storage[this.size + (j / 4 | 0)] = word;
                word = 0;
                break;
            }
          }
          if (operand.length % 4 != 0) this.storage[this.size + ((operand.length + 1) / 4 | 0)] = word;
          this._size += (operand.length + 1 + 3) / 4 | 0;
        } else {
          this.storage[this.size] = operand.value;
          ++this._size;
        }
      }
    }
  }, {
    key: "size",
    get: function () {
      return this._size;
    }
  }, {
    key: "storage",
    get: function () {
      return this._storage;
    }
  }, {
    key: "result",
    get: function () {
      this.storage[3] = this._largestId + 1;
      return this.storage.slice(0, this.size);
    }
  }]);
}();

