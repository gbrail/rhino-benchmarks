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
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var StatementCloner = /*#__PURE__*/function (_Rewriter) {
  function StatementCloner() {
    _classCallCheck(this, StatementCloner);
    return _callSuper(this, StatementCloner, arguments);
  }
  _inherits(StatementCloner, _Rewriter);
  return _createClass(StatementCloner, [{
    key: "visitFuncDef",
    value: function visitFuncDef(node) {
      var typeParameters = node.typeParameters.map(typeParameter => typeParameter.visit(this));
      var result = new FuncDef(node.origin, node.name, node.returnType.visit(this), typeParameters, node.parameters.map(parameter => parameter.visit(this)), node.body.visit(this), node.isCast, node.shaderType);
      result.isRestricted = node.isRestricted;
      return result;
    }
  }, {
    key: "visitNativeFunc",
    value: function visitNativeFunc(node) {
      var result = new NativeFunc(node.origin, node.name, node.returnType.visit(this), node.typeParameters.map(typeParameter => typeParameter.visit(this)), node.parameters.map(parameter => parameter.visit(this)), node.isCast, node.shaderType);
      result.isRestricted = node.isRestricted;
      return result;
    }
  }, {
    key: "visitNativeType",
    value: function visitNativeType(node) {
      return new NativeType(node.origin, node.name, node.typeParameters.map(typeParameter => typeParameter.visit(this)));
    }
  }, {
    key: "visitTypeDef",
    value: function visitTypeDef(node) {
      return new TypeDef(node.origin, node.name, node.typeParameters.map(typeParameter => typeParameter.visit(this)), node.type.visit(this));
    }
  }, {
    key: "visitStructType",
    value: function visitStructType(node) {
      var result = new StructType(node.origin, node.name, node.typeParameters.map(typeParameter => typeParameter.visit(this)));
      for (var field of node.fields) result.add(field.visit(this));
      return result;
    }
  }, {
    key: "visitConstexprTypeParameter",
    value: function visitConstexprTypeParameter(node) {
      return new ConstexprTypeParameter(node.origin, node.name, node.type.visit(this));
    }
  }, {
    key: "visitProtocolDecl",
    value: function visitProtocolDecl(node) {
      var result = new ProtocolDecl(node.origin, node.name);
      for (var protocol of node.extends) result.addExtends(protocol.visit(this));
      for (var signature of node.signatures) result.add(signature.visit(this));
      return result;
    }
  }, {
    key: "visitTypeVariable",
    value: function visitTypeVariable(node) {
      return new TypeVariable(node.origin, node.name, Node.visit(node.protocol, this));
    }
  }, {
    key: "visitProtocolRef",
    value: function visitProtocolRef(node) {
      return new ProtocolRef(node.origin, node.name);
    }
  }, {
    key: "visitBoolLiteral",
    value: function visitBoolLiteral(node) {
      return new BoolLiteral(node.origin, node.value);
    }
  }, {
    key: "visitTypeOrVariableRef",
    value: function visitTypeOrVariableRef(node) {
      return new TypeOrVariableRef(node.origin, node.name);
    }
  }, {
    key: "visitEnumType",
    value: function visitEnumType(node) {
      var result = new EnumType(node.origin, node.name, node.baseType.visit(this));
      for (var member of node.members) result.add(member);
      return result;
    }
  }]);
}(Rewriter);

