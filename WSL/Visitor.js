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
var Visitor = /*#__PURE__*/function () {
  function Visitor() {
    _classCallCheck(this, Visitor);
  }
  return _createClass(Visitor, [{
    key: "visitProgram",
    value: function visitProgram(node) {
      for (var statement of node.topLevelStatements) statement.visit(this);
    }
  }, {
    key: "visitFunc",
    value: function visitFunc(node) {
      node.returnType.visit(this);
      for (var typeParameter of node.typeParameters) typeParameter.visit(this);
      for (var parameter of node.parameters) parameter.visit(this);
    }
  }, {
    key: "visitProtocolFuncDecl",
    value: function visitProtocolFuncDecl(node) {
      this.visitFunc(node);
    }
  }, {
    key: "visitFuncParameter",
    value: function visitFuncParameter(node) {
      node.type.visit(this);
    }
  }, {
    key: "visitFuncDef",
    value: function visitFuncDef(node) {
      this.visitFunc(node);
      node.body.visit(this);
    }
  }, {
    key: "visitNativeFunc",
    value: function visitNativeFunc(node) {
      this.visitFunc(node);
    }
  }, {
    key: "visitNativeFuncInstance",
    value: function visitNativeFuncInstance(node) {
      this.visitFunc(node);
      node.func.visitImplementationData(node.implementationData, this);
    }
  }, {
    key: "visitBlock",
    value: function visitBlock(node) {
      for (var statement of node.statements) statement.visit(this);
    }
  }, {
    key: "visitCommaExpression",
    value: function visitCommaExpression(node) {
      for (var expression of node.list) expression.visit(this);
    }
  }, {
    key: "visitProtocolRef",
    value: function visitProtocolRef(node) {}
  }, {
    key: "visitProtocolDecl",
    value: function visitProtocolDecl(node) {
      for (var protocol of node.extends) protocol.visit(this);
      for (var signature of node.signatures) signature.visit(this);
    }
  }, {
    key: "visitTypeRef",
    value: function visitTypeRef(node) {
      for (var typeArgument of node.typeArguments) typeArgument.visit(this);
    }
  }, {
    key: "visitNativeType",
    value: function visitNativeType(node) {
      for (var typeParameter of node.typeParameters) typeParameter.visit(this);
    }
  }, {
    key: "visitNativeTypeInstance",
    value: function visitNativeTypeInstance(node) {
      node.type.visit(this);
      for (var typeArgument of node.typeArguments) typeArgument.visit(this);
    }
  }, {
    key: "visitTypeDef",
    value: function visitTypeDef(node) {
      for (var typeParameter of node.typeParameters) typeParameter.visit(this);
      node.type.visit(this);
    }
  }, {
    key: "visitStructType",
    value: function visitStructType(node) {
      for (var typeParameter of node.typeParameters) typeParameter.visit(this);
      for (var field of node.fields) field.visit(this);
    }
  }, {
    key: "visitTypeVariable",
    value: function visitTypeVariable(node) {
      Node.visit(node.protocol, this);
    }
  }, {
    key: "visitConstexprTypeParameter",
    value: function visitConstexprTypeParameter(node) {
      node.type.visit(this);
    }
  }, {
    key: "visitField",
    value: function visitField(node) {
      node.type.visit(this);
    }
  }, {
    key: "visitEnumType",
    value: function visitEnumType(node) {
      node.baseType.visit(this);
      for (var member of node.members) member.visit(this);
    }
  }, {
    key: "visitEnumMember",
    value: function visitEnumMember(node) {
      Node.visit(node.value, this);
    }
  }, {
    key: "visitEnumLiteral",
    value: function visitEnumLiteral(node) {}
  }, {
    key: "visitElementalType",
    value: function visitElementalType(node) {
      node.elementType.visit(this);
    }
  }, {
    key: "visitReferenceType",
    value: function visitReferenceType(node) {
      this.visitElementalType(node);
    }
  }, {
    key: "visitPtrType",
    value: function visitPtrType(node) {
      this.visitReferenceType(node);
    }
  }, {
    key: "visitArrayRefType",
    value: function visitArrayRefType(node) {
      this.visitReferenceType(node);
    }
  }, {
    key: "visitArrayType",
    value: function visitArrayType(node) {
      this.visitElementalType(node);
      node.numElements.visit(this);
    }
  }, {
    key: "visitVariableDecl",
    value: function visitVariableDecl(node) {
      node.type.visit(this);
      Node.visit(node.initializer, this);
    }
  }, {
    key: "visitAssignment",
    value: function visitAssignment(node) {
      node.lhs.visit(this);
      node.rhs.visit(this);
      Node.visit(node.type, this);
    }
  }, {
    key: "visitReadModifyWriteExpression",
    value: function visitReadModifyWriteExpression(node) {
      node.lValue.visit(this);
      node.oldValueVar.visit(this);
      node.newValueVar.visit(this);
      node.newValueExp.visit(this);
      node.resultExp.visit(this);
    }
  }, {
    key: "visitDereferenceExpression",
    value: function visitDereferenceExpression(node) {
      node.ptr.visit(this);
    }
  }, {
    key: "_handlePropertyAccessExpression",
    value: function _handlePropertyAccessExpression(node) {
      Node.visit(node.baseType, this);
      Node.visit(node.callForGet, this);
      Node.visit(node.resultTypeForGet, this);
      Node.visit(node.callForAnd, this);
      Node.visit(node.resultTypeForAnd, this);
      Node.visit(node.callForSet, this);
    }
  }, {
    key: "visitDotExpression",
    value: function visitDotExpression(node) {
      node.struct.visit(this);
      this._handlePropertyAccessExpression(node);
    }
  }, {
    key: "visitIndexExpression",
    value: function visitIndexExpression(node) {
      node.array.visit(this);
      node.index.visit(this);
      this._handlePropertyAccessExpression(node);
    }
  }, {
    key: "visitMakePtrExpression",
    value: function visitMakePtrExpression(node) {
      node.lValue.visit(this);
    }
  }, {
    key: "visitMakeArrayRefExpression",
    value: function visitMakeArrayRefExpression(node) {
      node.lValue.visit(this);
      Node.visit(node.numElements, this);
    }
  }, {
    key: "visitConvertPtrToArrayRefExpression",
    value: function visitConvertPtrToArrayRefExpression(node) {
      node.lValue.visit(this);
    }
  }, {
    key: "visitVariableRef",
    value: function visitVariableRef(node) {}
  }, {
    key: "visitIfStatement",
    value: function visitIfStatement(node) {
      node.conditional.visit(this);
      node.body.visit(this);
      Node.visit(node.elseBody, this);
    }
  }, {
    key: "visitWhileLoop",
    value: function visitWhileLoop(node) {
      node.conditional.visit(this);
      node.body.visit(this);
    }
  }, {
    key: "visitDoWhileLoop",
    value: function visitDoWhileLoop(node) {
      node.body.visit(this);
      node.conditional.visit(this);
    }
  }, {
    key: "visitForLoop",
    value: function visitForLoop(node) {
      Node.visit(node.initialization, this);
      Node.visit(node.condition, this);
      Node.visit(node.increment, this);
      node.body.visit(this);
    }
  }, {
    key: "visitSwitchStatement",
    value: function visitSwitchStatement(node) {
      node.value.visit(this);
      for (var switchCase of node.switchCases) switchCase.visit(this);
    }
  }, {
    key: "visitSwitchCase",
    value: function visitSwitchCase(node) {
      Node.visit(node.value, this);
      node.body.visit(this);
    }
  }, {
    key: "visitReturn",
    value: function visitReturn(node) {
      Node.visit(node.value, this);
    }
  }, {
    key: "visitContinue",
    value: function visitContinue(node) {}
  }, {
    key: "visitBreak",
    value: function visitBreak(node) {}
  }, {
    key: "visitTrapStatement",
    value: function visitTrapStatement(node) {}
  }, {
    key: "visitGenericLiteral",
    value: function visitGenericLiteral(node) {
      node.type.visit(this);
    }
  }, {
    key: "visitGenericLiteralType",
    value: function visitGenericLiteralType(node) {
      Node.visit(node.type, this);
      node.preferredType.visit(this);
    }
  }, {
    key: "visitNullLiteral",
    value: function visitNullLiteral(node) {
      node.type.visit(this);
    }
  }, {
    key: "visitBoolLiteral",
    value: function visitBoolLiteral(node) {}
  }, {
    key: "visitNullType",
    value: function visitNullType(node) {
      Node.visit(node.type, this);
    }
  }, {
    key: "visitCallExpression",
    value: function visitCallExpression(node) {
      for (var typeArgument of node.typeArguments) typeArgument.visit(this);
      for (var argument of node.argumentList) Node.visit(argument, this);
      var handleTypeArguments = actualTypeArguments => {
        if (actualTypeArguments) {
          for (var _argument of actualTypeArguments) _argument.visit(this);
        }
      };
      handleTypeArguments(node.actualTypeArguments);
      handleTypeArguments(node.instantiatedActualTypeArguments);
      Node.visit(node.nativeFuncInstance, this);
      Node.visit(node.returnType, this);
      Node.visit(node.resultType, this);
    }
  }, {
    key: "visitLogicalNot",
    value: function visitLogicalNot(node) {
      node.operand.visit(this);
    }
  }, {
    key: "visitLogicalExpression",
    value: function visitLogicalExpression(node) {
      node.left.visit(this);
      node.right.visit(this);
    }
  }, {
    key: "visitFunctionLikeBlock",
    value: function visitFunctionLikeBlock(node) {
      Node.visit(node.returnType, this);
      for (var argument of node.argumentList) argument.visit(this);
      for (var parameter of node.parameters) parameter.visit(this);
      node.body.visit(this);
      Node.visit(node.resultType, this);
    }
  }, {
    key: "visitAnonymousVariable",
    value: function visitAnonymousVariable(node) {
      Node.visit(node.type, this);
    }
  }, {
    key: "visitIdentityExpression",
    value: function visitIdentityExpression(node) {
      node.target.visit(this);
    }
  }]);
}();

