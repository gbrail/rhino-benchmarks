/*
 * Copyright (C) 2016-2017 Apple Inc. All rights reserved.
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

/*
 * Base utility types for the AST.
 *
 * Valid methods for Node:
 *
 * node.children -> Returns an array of immediate children.  It has been modified 
 *     from the original Ruby version to dump directly nearly the original source.
 *
 * node.descendents -> Returns an array of all strict descendants (children
 *     and children of children, transitively).
 *
 */
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Node = /*#__PURE__*/function () {
  function Node(codeOrigin) {
    _classCallCheck(this, Node);
    this._codeOrigin = codeOrigin;
  }
  return _createClass(Node, [{
    key: "codeOriginString",
    get: function () {
      return this._codeOrigin.toString();
    }
  }, {
    key: "codeOrigin",
    get: function () {
      return this._codeOrigin;
    }
  }]);
}();
var NoChildren = /*#__PURE__*/function (_Node) {
  function NoChildren(codeOrigin) {
    _classCallCheck(this, NoChildren);
    return _callSuper(this, NoChildren, [codeOrigin]);
  }
  _inherits(NoChildren, _Node);
  return _createClass(NoChildren, [{
    key: "children",
    value: function children() {
      return [];
    }
  }]);
}(Node);
function structOffsetKey(struct, field) {
  return struct + "::" + field;
}

// AST nodes.
var StructOffset = /*#__PURE__*/function (_NoChildren) {
  function StructOffset(codeOrigin, struct, field) {
    var _this;
    _classCallCheck(this, StructOffset);
    _this = _callSuper(this, StructOffset, [codeOrigin]);
    _this._struct = struct;
    _this._field = field;
    return _this;
  }
  _inherits(StructOffset, _NoChildren);
  return _createClass(StructOffset, [{
    key: "dump",
    value: function dump() {
      return this.struct + "::" + this.field;
    }
  }, {
    key: "compare",
    value: function compare(other) {
      if (this.struct != other.struct) return this.struct.localeCompare(other.struct);
      return this.field.localeCompare(other.field);
    }
  }, {
    key: "struct",
    get: function () {
      return this._struct;
    }
  }, {
    key: "field",
    get: function () {
      return this._field;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }], [{
    key: "forField",
    value: function forField(codeOrigin, struct, field) {
      var key = structOffsetKey(struct, field);
      if (!this.mapping[key]) this.mapping[key] = new StructOffset(codeOrigin, struct, field);
      return this.mapping[key];
    }
  }, {
    key: "resetMappings",
    value: function resetMappings() {
      this.mapping = {};
    }
  }]);
}(NoChildren);
StructOffset.mapping = {};
var Sizeof = /*#__PURE__*/function (_NoChildren2) {
  function Sizeof(codeOrigin, struct) {
    var _this2;
    _classCallCheck(this, Sizeof);
    _this2 = _callSuper(this, Sizeof, [codeOrigin]);
    _this2._struct = struct;
    return _this2;
  }
  _inherits(Sizeof, _NoChildren2);
  return _createClass(Sizeof, [{
    key: "dump",
    value: function dump() {
      return "sizeof " + this.struct;
    }
  }, {
    key: "compare",
    value: function compare(other) {
      return this.struct.localeCompare(other.struct);
    }
  }, {
    key: "struct",
    get: function () {
      return this._struct;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }], [{
    key: "forName",
    value: function forName(codeOrigin, struct) {
      if (!this.mapping[struct]) this.mapping[struct] = new Sizeof(codeOrigin, struct);
      return this.mapping[struct];
    }
  }, {
    key: "resetMappings",
    value: function resetMappings() {
      this.mapping = {};
    }
  }]);
}(NoChildren);
Sizeof.mapping = {};
var Immediate = /*#__PURE__*/function (_NoChildren3) {
  function Immediate(codeOrigin, value) {
    var _this3;
    _classCallCheck(this, Immediate);
    _this3 = _callSuper(this, Immediate, [codeOrigin]);
    if (value instanceof Number) value = value.valueOf();
    _this3._value = value;
    if (typeof value != "number") throw "Bad immediate value " + value.inspect() + " at " + _this3.codeOriginString();
    return _this3;
  }
  _inherits(Immediate, _NoChildren3);
  return _createClass(Immediate, [{
    key: "dump",
    value: function dump() {
      return this.value.toString();
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return other instanceof Immediate && other.value == this.value;
    }
  }, {
    key: "value",
    get: function () {
      return this._value;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return true;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(NoChildren);
var AddImmediates = /*#__PURE__*/function (_Node2) {
  function AddImmediates(codeOrigin, left, right) {
    var _this4;
    _classCallCheck(this, AddImmediates);
    _this4 = _callSuper(this, AddImmediates, [codeOrigin]);
    _this4._left = left;
    _this4._right = right;
    return _this4;
  }
  _inherits(AddImmediates, _Node2);
  return _createClass(AddImmediates, [{
    key: "children",
    value: function children() {
      return [this.left, this.right];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(" + this.left.dump() + " + " + this.right.dump() + ")";
    }
  }, {
    key: "value",
    value: function value() {
      return (this.left.value() + this.right.value()).toString();
    }
  }, {
    key: "left",
    get: function () {
      return this._left;
    }
  }, {
    key: "right",
    get: function () {
      return this._right;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return true;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var SubImmediates = /*#__PURE__*/function (_Node3) {
  function SubImmediates(codeOrigin, left, right) {
    var _this5;
    _classCallCheck(this, SubImmediates);
    _this5 = _callSuper(this, SubImmediates, [codeOrigin]);
    _this5._left = left;
    _this5._right = right;
    return _this5;
  }
  _inherits(SubImmediates, _Node3);
  return _createClass(SubImmediates, [{
    key: "children",
    value: function children() {
      return [this.left, this.right];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(" + this.left.dump() + " - " + this.right.dump() + ")";
    }
  }, {
    key: "value",
    value: function value() {
      return (this.left.value() - this.right.value()).toString();
    }
  }, {
    key: "left",
    get: function () {
      return this._left;
    }
  }, {
    key: "right",
    get: function () {
      return this._right;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return true;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var MulImmediates = /*#__PURE__*/function (_Node4) {
  function MulImmediates(codeOrigin, left, right) {
    var _this6;
    _classCallCheck(this, MulImmediates);
    _this6 = _callSuper(this, MulImmediates, [codeOrigin]);
    _this6._left = left;
    _this6._right = right;
    return _this6;
  }
  _inherits(MulImmediates, _Node4);
  return _createClass(MulImmediates, [{
    key: "children",
    value: function children() {
      return [this.left, this.right];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(" + this.left.dump() + " * " + this.right.dump() + ")";
    }
  }, {
    key: "left",
    get: function () {
      return this._left;
    }
  }, {
    key: "right",
    get: function () {
      return this._right;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var NegImmediate = /*#__PURE__*/function (_Node5) {
  function NegImmediate(codeOrigin, child) {
    var _this7;
    _classCallCheck(this, NegImmediate);
    _this7 = _callSuper(this, NegImmediate, [codeOrigin]);
    _this7._child = child;
    return _this7;
  }
  _inherits(NegImmediate, _Node5);
  return _createClass(NegImmediate, [{
    key: "children",
    value: function children() {
      return [this.child];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(-" + this.child.dump() + ")";
    }
  }, {
    key: "child",
    get: function () {
      return this._child;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var OrImmediates = /*#__PURE__*/function (_Node6) {
  function OrImmediates(codeOrigin, left, right) {
    var _this8;
    _classCallCheck(this, OrImmediates);
    _this8 = _callSuper(this, OrImmediates, [codeOrigin]);
    _this8._left = left;
    _this8._right = right;
    return _this8;
  }
  _inherits(OrImmediates, _Node6);
  return _createClass(OrImmediates, [{
    key: "children",
    value: function children() {
      return [this.left, this.right];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(" + this.left.dump() + " | " + this.right.dump() + ")";
    }
  }, {
    key: "left",
    get: function () {
      return this._left;
    }
  }, {
    key: "right",
    get: function () {
      return this._right;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var AndImmediates = /*#__PURE__*/function (_Node7) {
  function AndImmediates(codeOrigin, left, right) {
    var _this9;
    _classCallCheck(this, AndImmediates);
    _this9 = _callSuper(this, AndImmediates, [codeOrigin]);
    _this9._left = left;
    _this9._right = right;
    return _this9;
  }
  _inherits(AndImmediates, _Node7);
  return _createClass(AndImmediates, [{
    key: "children",
    value: function children() {
      return [this.left, this.right];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(" + this.left.dump() + " & " + this.right.dump() + ")";
    }
  }, {
    key: "left",
    get: function () {
      return this._left;
    }
  }, {
    key: "right",
    get: function () {
      return this._right;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var XorImmediates = /*#__PURE__*/function (_Node8) {
  function XorImmediates(codeOrigin, left, right) {
    var _this0;
    _classCallCheck(this, XorImmediates);
    _this0 = _callSuper(this, XorImmediates, [codeOrigin]);
    _this0._left = left;
    _this0._right = right;
    return _this0;
  }
  _inherits(XorImmediates, _Node8);
  return _createClass(XorImmediates, [{
    key: "children",
    value: function children() {
      return [this.left, this.right];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(" + this.left.dump() + " ^ " + this.right.dump() + ")";
    }
  }, {
    key: "left",
    get: function () {
      return this._left;
    }
  }, {
    key: "right",
    get: function () {
      return this._right;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var BitnotImmediate = /*#__PURE__*/function (_Node9) {
  function BitnotImmediate(codeOrigin, child) {
    var _this1;
    _classCallCheck(this, BitnotImmediate);
    _this1 = _callSuper(this, BitnotImmediate, [codeOrigin]);
    _this1._child = child;
    return _this1;
  }
  _inherits(BitnotImmediate, _Node9);
  return _createClass(BitnotImmediate, [{
    key: "children",
    value: function children() {
      return [this.child];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(~" + this.child.dump() + ")";
    }
  }, {
    key: "child",
    get: function () {
      return this._child;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var StringLiteral = /*#__PURE__*/function (_NoChildren4) {
  function StringLiteral(codeOrigin, value) {
    var _this10;
    _classCallCheck(this, StringLiteral);
    _this10 = _callSuper(this, StringLiteral, [codeOrigin]);
    if (!value instanceof String || value[0] != "\"" || value.slice(-1) != "\"") throw "Bad string literal " + value.inspect() + " at " + _this10.codeOriginString();
    _this10._value = value.slice(1, -1);
    return _this10;
  }
  _inherits(StringLiteral, _NoChildren4);
  return _createClass(StringLiteral, [{
    key: "dump",
    value: function dump() {
      return "\"" + this.value + "\"";
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return other instanceof StringLiteral && other.value == this.value;
    }
  }, {
    key: "value",
    get: function () {
      return this._value;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(NoChildren);
var RegisterID = /*#__PURE__*/function (_NoChildren5) {
  function RegisterID(codeOrigin, name) {
    var _this11;
    _classCallCheck(this, RegisterID);
    _this11 = _callSuper(this, RegisterID, [codeOrigin]);
    _this11._name = name;
    return _this11;
  }
  _inherits(RegisterID, _NoChildren5);
  return _createClass(RegisterID, [{
    key: "dump",
    value: function dump() {
      return this.name;
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return true;
    }
  }], [{
    key: "forName",
    value: function forName(codeOrigin, name) {
      if (!this.mapping[name]) this.mapping[name] = new RegisterID(codeOrigin, name);
      return this.mapping[name];
    }
  }]);
}(NoChildren);
RegisterID.mapping = {};
var FPRegisterID = /*#__PURE__*/function (_NoChildren6) {
  function FPRegisterID(codeOrigin, name) {
    var _this12;
    _classCallCheck(this, FPRegisterID);
    _this12 = _callSuper(this, FPRegisterID, [codeOrigin]);
    _this12._name = name;
    return _this12;
  }
  _inherits(FPRegisterID, _NoChildren6);
  return _createClass(FPRegisterID, [{
    key: "dump",
    value: function dump() {
      return this.name;
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return true;
    }
  }], [{
    key: "forName",
    value: function forName(codeOrigin, name) {
      if (!this.mapping[name]) this.mapping[name] = new FPRegisterID(codeOrigin, name);
      return this.mapping[name];
    }
  }]);
}(NoChildren);
FPRegisterID.mapping = {};
var SpecialRegister = /*#__PURE__*/function (_NoChildren7) {
  function SpecialRegister(name) {
    var _this13;
    _classCallCheck(this, SpecialRegister);
    _this13._name = name;
    return _assertThisInitialized(_this13);
  }
  _inherits(SpecialRegister, _NoChildren7);
  return _createClass(SpecialRegister, [{
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return true;
    }
  }]);
}(NoChildren);
var Variable = /*#__PURE__*/function (_NoChildren8) {
  function Variable(codeOrigin, name) {
    var _this14;
    _classCallCheck(this, Variable);
    _this14 = _callSuper(this, Variable, [codeOrigin]);
    _this14._name = name;
    return _this14;
  }
  _inherits(Variable, _NoChildren8);
  return _createClass(Variable, [{
    key: "dump",
    value: function dump() {
      return this.name;
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }, {
    key: "inspect",
    value: function inspect() {
      return "<variable " + this.name + " at " + this.codeOriginString();
    }
  }], [{
    key: "forName",
    value: function forName(codeOrigin, name) {
      if (!this.mapping[name]) this.mapping[name] = new Variable(codeOrigin, name);
      return this.mapping[name];
    }
  }]);
}(NoChildren);
Variable.mapping = {};
var Address = /*#__PURE__*/function (_Node0) {
  function Address(codeOrigin, base, offset) {
    var _this15;
    _classCallCheck(this, Address);
    _this15 = _callSuper(this, Address, [codeOrigin]);
    _this15._base = base;
    _this15._offset = offset;
    if (!base instanceof Variable && !base.register) throw "Bad base for address " + base.inspect() + " at " + _this15.codeOriginString();
    if (!offset instanceof Variable && !offset.immediate()) throw "Bad offset for address " + offset.inspect() + " at " + _this15.codeOriginString();
    return _this15;
  }
  _inherits(Address, _Node0);
  return _createClass(Address, [{
    key: "withOffset",
    value: function withOffset(extraOffset) {
      return new Address(this.codeOrigin, this.base, new Immediate(this.codeOrigin, this.offset.value + extraOffset));
    }
  }, {
    key: "children",
    value: function children() {
      return [this.base, this.offset];
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.offset.dump() + "[" + this.base.dump() + "]";
    }
  }, {
    key: "base",
    get: function () {
      return this._base;
    }
  }, {
    key: "offset",
    get: function () {
      return this._offset;
    }
  }, {
    key: "isAddress",
    get: function () {
      return true;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return true;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var BaseIndex = /*#__PURE__*/function (_Node1) {
  function BaseIndex(codeOrigin, base, index, scale, offset) {
    var _this16;
    _classCallCheck(this, BaseIndex);
    _this16 = _callSuper(this, BaseIndex, [codeOrigin]);
    _this16._base = base;
    _this16._index = index;
    _this16._scale = scale;
    if (![1, 2, 4, 8].includes(_this16._scale)) throw "Bad scale " + _this16._scale + " at " + _this16.codeOriginString();
    _this16._offset = offset;
    return _this16;
  }
  _inherits(BaseIndex, _Node1);
  return _createClass(BaseIndex, [{
    key: "scaleShift",
    value: function scaleShift() {
      switch (this.scale) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw "Bad scale " + this.scale + " at " + this.codeOriginString();
      }
    }
  }, {
    key: "withOffset",
    value: function withOffset(extraOffset) {
      return new BaseIndex(codeOrigin, this.base, this.index, this.scale, new Immediate(codeOrigin, this.offset.value + extraOffset));
    }
  }, {
    key: "children",
    value: function children() {
      return [this.base, this.index, this.offset];
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.offset.dump() + "[" + this.base.dump() + ", " + this.index.dump() + ", " + this.scale + "]";
    }
  }, {
    key: "base",
    get: function () {
      return this._base;
    }
  }, {
    key: "index",
    get: function () {
      return this._index;
    }
  }, {
    key: "scale",
    get: function () {
      return this._scale;
    }
  }, {
    key: "offset",
    get: function () {
      return this._offset;
    }
  }, {
    key: "isAddress",
    get: function () {
      return true;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return false;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(Node);
var AbsoluteAddress = /*#__PURE__*/function (_NoChildren9) {
  function AbsoluteAddress(codeOrigin, address) {
    var _this17;
    _classCallCheck(this, AbsoluteAddress);
    _this17 = _callSuper(this, AbsoluteAddress, [codeOrigin]);
    _this17._address = address;
    return _this17;
  }
  _inherits(AbsoluteAddress, _NoChildren9);
  return _createClass(AbsoluteAddress, [{
    key: "withOffset",
    value: function withOffset(extraOffset) {
      return new AbsoluteAddress(codeOrigin, new Immediate(codeOrigin, this.address.value + extraOffset));
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.address.dump() + "[]";
    }
  }, {
    key: "address",
    get: function () {
      return this._address;
    }
  }, {
    key: "isAddress",
    get: function () {
      return true;
    }
  }, {
    key: "isLabel",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return true;
    }
  }, {
    key: "isRegister",
    get: function () {
      return false;
    }
  }]);
}(NoChildren);
var Instruction = /*#__PURE__*/function (_Node10) {
  function Instruction(codeOrigin, opcode, operands) {
    var _this18;
    var annotation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : nil;
    _classCallCheck(this, Instruction);
    _this18 = _callSuper(this, Instruction, [codeOrigin]);
    _this18._opcode = opcode;
    _this18._operands = operands;
    _this18._annotation = annotation;
    return _this18;
  }
  _inherits(Instruction, _Node10);
  return _createClass(Instruction, [{
    key: "children",
    value: function children() {
      return [];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "    " + this.opcode + " " + this.operands.map(function (v) {
        return v.dump();
      }).join(", ");
    }
  }, {
    key: "opcode",
    get: function () {
      return this._opcode;
    }
  }, {
    key: "operands",
    get: function () {
      return this._operands;
    }
  }, {
    key: "annotation",
    get: function () {
      return this._annotation;
    }
  }]);
}(Node);
var Error = /*#__PURE__*/function (_NoChildren0) {
  function Error(codeOrigin) {
    _classCallCheck(this, Error);
    return _callSuper(this, Error, [codeOrigin]);
  }
  _inherits(Error, _NoChildren0);
  return _createClass(Error, [{
    key: "dump",
    value: function dump() {
      return "    error";
    }
  }]);
}(NoChildren);
var ConstExpr = /*#__PURE__*/function (_NoChildren1) {
  function ConstExpr(codeOrigin, value) {
    var _this19;
    _classCallCheck(this, ConstExpr);
    _this19 = _callSuper(this, ConstExpr, [codeOrigin]);
    _this19._value = value;
    return _this19;
  }
  _inherits(ConstExpr, _NoChildren1);
  return _createClass(ConstExpr, [{
    key: "dump",
    value: function dump() {
      return "constexpr (" + this.value + ")";
    }
  }, {
    key: "compare",
    value: function compare(other) {
      return this.value(other.value);
    }
  }, {
    key: "isImmediate",
    value: function isImmediate() {
      return true;
    }
  }, {
    key: "variable",
    get: function () {
      return this._variable;
    }
  }, {
    key: "value",
    get: function () {
      return this._value;
    }
  }], [{
    key: "forName",
    value: function forName(codeOrigin, text) {
      if (!this.mapping[text]) this.mapping[text] = new ConstExpr(codeOrigin, text);
      return this.mapping[text];
    }
  }, {
    key: "resetMappings",
    value: function resetMappings() {
      this.mapping = {};
    }
  }]);
}(NoChildren);
ConstExpr.mapping = {};
var ConstDecl = /*#__PURE__*/function (_Node11) {
  function ConstDecl(codeOrigin, variable, value) {
    var _this20;
    _classCallCheck(this, ConstDecl);
    _this20 = _callSuper(this, ConstDecl, [codeOrigin]);
    _this20._variable = variable;
    _this20._value = value;
    return _this20;
  }
  _inherits(ConstDecl, _Node11);
  return _createClass(ConstDecl, [{
    key: "children",
    value: function children() {
      return [this.variable, this.value];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "const " + this.variable.dump() + " = " + this.value.dump();
    }
  }, {
    key: "variable",
    get: function () {
      return this._variable;
    }
  }, {
    key: "value",
    get: function () {
      return this._value;
    }
  }]);
}(Node);
var _labelMapping = {};
var _referencedExternLabels = [];
var Label = /*#__PURE__*/function (_NoChildren10) {
  function Label(codeOrigin, name) {
    var _this21;
    _classCallCheck(this, Label);
    _this21 = _callSuper(this, Label, [codeOrigin]);
    _this21._name = name;
    _this21._extern = true;
    _this21._global = false;
    return _this21;
  }
  _inherits(Label, _NoChildren10);
  return _createClass(Label, [{
    key: "clearExtern",
    value: function clearExtern() {
      this._extern = false;
    }
  }, {
    key: "isExtern",
    value: function isExtern() {
      return this._extern;
    }
  }, {
    key: "setGlobal",
    value: function setGlobal() {
      this._global = true;
    }
  }, {
    key: "isGlobal",
    value: function isGlobal() {
      return this._global;
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.name + ":";
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }], [{
    key: "forName",
    value: function forName(codeOrigin, name, definedInFile) {
      if (_labelMapping[name]) {
        if (!_labelMapping[name] instanceof Label) throw "Label name collision: " + name;
      } else _labelMapping[name] = new Label(codeOrigin, name);
      if (definedInFile) _labelMapping[name].clearExtern();
      return _labelMapping[name];
    }
  }, {
    key: "setAsGlobal",
    value: function setAsGlobal(codeOrigin, name) {
      if (_labelMapping[name]) {
        var label = _labelMapping[name];
        if (label.isGlobal()) throw "Label: " + name + " declared global multiple times";
        label.setGlobal();
      } else {
        var newLabel = new Label(codeOrigin, name);
        newLabel.setGlobal();
        _labelMapping[name] = newLabel;
      }
    }
  }, {
    key: "resetMappings",
    value: function resetMappings() {
      _labelMapping = {};
      _referencedExternLabels = [];
    }
  }, {
    key: "resetReferenced",
    value: function resetReferenced() {
      _referencedExternLabels = [];
    }
  }]);
}(NoChildren);
var LocalLabel = /*#__PURE__*/function (_NoChildren11) {
  function LocalLabel(codeOrigin, name) {
    var _this22;
    _classCallCheck(this, LocalLabel);
    _this22 = _callSuper(this, LocalLabel, [codeOrigin]);
    _this22._name = name;
    return _this22;
  }
  _inherits(LocalLabel, _NoChildren11);
  return _createClass(LocalLabel, [{
    key: "cleanName",
    value: function cleanName() {
      if (/^\./.test(this._name)) return "_" + this._name.slice(1);
      return this._name;
    }
  }, {
    key: "isGlobal",
    value: function isGlobal() {
      return false;
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.name + ":";
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }], [{
    key: "forName",
    value: function forName(codeOrigin, name) {
      if (_labelMapping[name]) {
        if (!_labelMapping[name] instanceof LocalLabel) throw "Label name collision: " + name;
      } else _labelMapping[name] = new LocalLabel(codeOrigin, name);
      return _labelMapping[name];
    }
  }, {
    key: "unique",
    value: function unique(comment) {
      var newName = "_" + comment;
      if (_labelMapping[newName]) {
        while (_labelMapping[newName = "_#" + this.uniqueNameCounter + "_" + comment]) this.uniqueNameCounter++;
      }
      return forName(undefined, newName);
    }
  }, {
    key: "resetMappings",
    value: function resetMappings() {
      this.uniquNameCounter = 0;
    }
  }]);
}(NoChildren);
LocalLabel.uniqueNameCounter = 0;
var LabelReference = /*#__PURE__*/function (_Node12) {
  function LabelReference(codeOrigin, label) {
    var _this23;
    _classCallCheck(this, LabelReference);
    _this23 = _callSuper(this, LabelReference, [codeOrigin]);
    _this23._label = label;
    return _this23;
  }
  _inherits(LabelReference, _Node12);
  return _createClass(LabelReference, [{
    key: "children",
    value: function children() {
      return [this.label];
    }
  }, {
    key: "name",
    value: function name() {
      return this.label.name;
    }
  }, {
    key: "isExtern",
    value: function isExtern() {
      return _labelMapping[name] instanceof Label && _labelMapping[name].isExtern();
    }
  }, {
    key: "used",
    value: function used() {
      if (!_referencedExternLabels.include(this._label) && this.isExtern()) _referencedExternLabels.push(this._label);
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.label.name;
    }
  }, {
    key: "value",
    value: function value() {
      return asmLabel();
    }
  }, {
    key: "label",
    get: function () {
      return this._label;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return true;
    }
  }]);
}(Node);
var LocalLabelReference = /*#__PURE__*/function (_NoChildren12) {
  function LocalLabelReference(codeOrigin, label) {
    var _this24;
    _classCallCheck(this, LocalLabelReference);
    _this24 = _callSuper(this, LocalLabelReference, [codeOrigin]);
    _this24._label = label;
    return _this24;
  }
  _inherits(LocalLabelReference, _NoChildren12);
  return _createClass(LocalLabelReference, [{
    key: "children",
    value: function children() {
      return [this._label];
    }
  }, {
    key: "name",
    value: function name() {
      return this.label.name;
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.label.name;
    }
  }, {
    key: "value",
    value: function value() {
      return asmLabel();
    }
  }, {
    key: "label",
    get: function () {
      return this._label;
    }
  }, {
    key: "isAddress",
    get: function () {
      return false;
    }
  }, {
    key: "isLabel",
    get: function () {
      return true;
    }
  }, {
    key: "isImmediate",
    get: function () {
      return false;
    }
  }, {
    key: "isImmediateOperand",
    get: function () {
      return true;
    }
  }]);
}(NoChildren);
var Sequence = /*#__PURE__*/function (_Node13) {
  function Sequence(codeOrigin, list) {
    var _this25;
    _classCallCheck(this, Sequence);
    _this25 = _callSuper(this, Sequence, [codeOrigin]);
    _this25._list = list;
    return _this25;
  }
  _inherits(Sequence, _Node13);
  return _createClass(Sequence, [{
    key: "children",
    value: function children() {
      return this.list;
    }
  }, {
    key: "dump",
    value: function dump() {
      return "" + this.list.map(function (v) {
        return v.dump();
      }).join("\n");
    }
  }, {
    key: "list",
    get: function () {
      return this._list;
    }
  }]);
}(Node);
var True = /*#__PURE__*/function (_NoChildren13) {
  function True() {
    _classCallCheck(this, True);
    return _callSuper(this, True, [undefined]);
  }
  _inherits(True, _NoChildren13);
  return _createClass(True, [{
    key: "value",
    value: function value() {
      return true;
    }
  }, {
    key: "dump",
    value: function dump() {
      return "true";
    }
  }], [{
    key: "instance",
    value: function instance() {
      return True.instance;
    }
  }]);
}(NoChildren);
True.instance = new True();
var False = /*#__PURE__*/function (_NoChildren14) {
  function False() {
    _classCallCheck(this, False);
    return _callSuper(this, False, [undefined]);
  }
  _inherits(False, _NoChildren14);
  return _createClass(False, [{
    key: "value",
    value: function value() {
      return false;
    }
  }, {
    key: "dump",
    value: function dump() {
      return "false";
    }
  }], [{
    key: "instance",
    value: function instance() {
      return False.instance;
    }
  }]);
}(NoChildren);
False.instance = new False();
var Setting = /*#__PURE__*/function (_NoChildren15) {
  function Setting(codeOrigin, name) {
    var _this26;
    _classCallCheck(this, Setting);
    _this26 = _callSuper(this, Setting, [codeOrigin]);
    _this26._name = name;
    return _this26;
  }
  _inherits(Setting, _NoChildren15);
  return _createClass(Setting, [{
    key: "dump",
    value: function dump() {
      return this.name;
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }], [{
    key: "forName",
    value: function forName(codeOrigin, name) {
      if (!this.mapping[name]) this.mapping[name] = new Setting(codeOrigin, name);
      return this.mapping[name];
    }
  }, {
    key: "resetMappings",
    value: function resetMappings() {
      this.mapping = {};
    }
  }]);
}(NoChildren);
Setting.mapping = {};
var And = /*#__PURE__*/function (_Node14) {
  function And(codeOrigin, left, right) {
    var _this27;
    _classCallCheck(this, And);
    _this27 = _callSuper(this, And, [codeOrigin]);
    _this27._left = left;
    _this27._right = right;
    return _this27;
  }
  _inherits(And, _Node14);
  return _createClass(And, [{
    key: "children",
    value: function children() {
      return [this.left, this.right];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(" + this.left.dump() + " and " + this.right.dump() + ")";
    }
  }, {
    key: "left",
    get: function () {
      return this._left;
    }
  }, {
    key: "right",
    get: function () {
      return this._right;
    }
  }]);
}(Node);
var Or = /*#__PURE__*/function (_Node15) {
  function Or(codeOrigin, left, right) {
    var _this28;
    _classCallCheck(this, Or);
    _this28 = _callSuper(this, Or, [codeOrigin]);
    _this28._left = left;
    _this28._right = right;
    return _this28;
  }
  _inherits(Or, _Node15);
  return _createClass(Or, [{
    key: "children",
    value: function children() {
      return [this.left, this.right];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(" + this.left.dump() + " or " + this.right.dump() + ")";
    }
  }, {
    key: "left",
    get: function () {
      return this._left;
    }
  }, {
    key: "right",
    get: function () {
      return this._right;
    }
  }]);
}(Node);
var Not = /*#__PURE__*/function (_Node16) {
  function Not(codeOrigin, child) {
    var _this29;
    _classCallCheck(this, Not);
    _this29 = _callSuper(this, Not, [codeOrigin]);
    _this29._child = child;
    return _this29;
  }
  _inherits(Not, _Node16);
  return _createClass(Not, [{
    key: "children",
    value: function children() {
      return [this.child];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "(not" + this.child.dump() + ")";
    }
  }, {
    key: "child",
    get: function () {
      return this._child;
    }
  }]);
}(Node);
var Skip = /*#__PURE__*/function (_NoChildren16) {
  function Skip(codeOrigin) {
    _classCallCheck(this, Skip);
    return _callSuper(this, Skip, [codeOrigin]);
  }
  _inherits(Skip, _NoChildren16);
  return _createClass(Skip, [{
    key: "dump",
    value: function dump() {
      return "    skip";
    }
  }]);
}(NoChildren);
var IfThenElse = /*#__PURE__*/function (_Node17) {
  function IfThenElse(codeOrigin, predicate, thenCase) {
    var _this30;
    _classCallCheck(this, IfThenElse);
    _this30 = _callSuper(this, IfThenElse, [codeOrigin]);
    _this30._predicate = predicate;
    _this30._thenCase = thenCase;
    _this30._elseCase = new Skip(codeOrigin);
    return _this30;
  }
  _inherits(IfThenElse, _Node17);
  return _createClass(IfThenElse, [{
    key: "children",
    value: function children() {
      return [];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "if " + this.predicate.dump() + "\n" + this.thenCase.dump() + "\nelse\n" + this.elseCase.dump() + "\nend";
    }
  }, {
    key: "predicate",
    get: function () {
      return this._predicate;
    }
  }, {
    key: "thenCase",
    get: function () {
      return this._thenCase;
    }
  }, {
    key: "elseCase",
    get: function () {
      return this._elseCase;
    },
    set: function (newElseCase) {
      this._elseCase = newElseCase;
    }
  }]);
}(Node);
var Macro = /*#__PURE__*/function (_Node18) {
  function Macro(codeOrigin, name, variables, body) {
    var _this31;
    _classCallCheck(this, Macro);
    _this31 = _callSuper(this, Macro, [codeOrigin]);
    _this31._name = name;
    _this31._variables = variables;
    _this31._body = body;
    return _this31;
  }
  _inherits(Macro, _Node18);
  return _createClass(Macro, [{
    key: "children",
    value: function children() {
      return [];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "macro " + this.name + "(" + this.variables.map(function (v) {
        return v.dump();
      }).join(", ") + ")\n" + this.body.dump() + "\nend";
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }, {
    key: "variables",
    get: function () {
      return this._variables;
    }
  }, {
    key: "body",
    get: function () {
      return this._body;
    }
  }]);
}(Node);
var MacroCall = /*#__PURE__*/function (_Node19) {
  function MacroCall(codeOrigin, name, operands, annotation) {
    var _this32;
    _classCallCheck(this, MacroCall);
    _this32 = _callSuper(this, MacroCall, [codeOrigin]);
    _this32._name = name;
    _this32._operands = operands;
    if (!_this32._operands) throw "Operands empty to Macro call " + name;
    _this32._annotation = annotation;
    return _this32;
  }
  _inherits(MacroCall, _Node19);
  return _createClass(MacroCall, [{
    key: "children",
    value: function children() {
      return [];
    }
  }, {
    key: "dump",
    value: function dump() {
      return "    " + this.name + "(" + this.operands.map(function (v) {
        return v.dump();
      }).join(", ") + ")";
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }, {
    key: "operands",
    get: function () {
      return this._operands;
    }
  }, {
    key: "annotation",
    get: function () {
      return this._annotation;
    }
  }]);
}(Node);
function resetAST() {
  StructOffset.resetMappings();
  Sizeof.resetMappings();
  ConstExpr.resetMappings();
  Label.resetMappings();
  LocalLabel.resetMappings();
  Setting.resetMappings();
}

