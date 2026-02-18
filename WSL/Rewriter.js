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

// FIXME: This should have sensible behavior when it encounters definitions that it cannot handle. Right
// now we are hackishly preventing this by wrapping things in TypeRef. That's probably wrong.
// https://bugs.webkit.org/show_bug.cgi?id=176208
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Rewriter = /*#__PURE__*/function () {
  function Rewriter() {
    _classCallCheck(this, Rewriter);
    this._mapping = new Map();
  }
  return _createClass(Rewriter, [{
    key: "_mapNode",
    value: function _mapNode(oldItem, newItem) {
      this._mapping.set(oldItem, newItem);
      return newItem;
    }
  }, {
    key: "_getMapping",
    value: function _getMapping(oldItem) {
      var result = this._mapping.get(oldItem);
      if (result) return result;
      return oldItem;
    }

    // We return identity for anything that is not inside a function/struct body. When processing
    // function bodies, we only recurse into them and never out of them - for example if there is a
    // function call to another function then we don't rewrite the other function. This is how we stop
    // that.
  }, {
    key: "visitFuncDef",
    value: function visitFuncDef(node) {
      return node;
    }
  }, {
    key: "visitNativeFunc",
    value: function visitNativeFunc(node) {
      return node;
    }
  }, {
    key: "visitNativeFuncInstance",
    value: function visitNativeFuncInstance(node) {
      return node;
    }
  }, {
    key: "visitNativeType",
    value: function visitNativeType(node) {
      return node;
    }
  }, {
    key: "visitTypeDef",
    value: function visitTypeDef(node) {
      return node;
    }
  }, {
    key: "visitStructType",
    value: function visitStructType(node) {
      return node;
    }
  }, {
    key: "visitConstexprTypeParameter",
    value: function visitConstexprTypeParameter(node) {
      return node;
    }
  }, {
    key: "visitProtocolDecl",
    value: function visitProtocolDecl(node) {
      return node;
    }
  }, {
    key: "visitEnumType",
    value: function visitEnumType(node) {
      return node;
    }

    // This is almost wrong. We instantiate Func in Substitution in ProtocolDecl. Then, we end up
    // not rewriting type variables. I think that just works because not rewriting them there is OK.
    // Everywhere else, it's mandatory that we don't rewrite these because we always assume that
    // type variables are outside the scope of rewriting.
  }, {
    key: "visitTypeVariable",
    value: function visitTypeVariable(node) {
      return node;
    }
  }, {
    key: "visitProtocolFuncDecl",
    value: function visitProtocolFuncDecl(node) {
      var result = new ProtocolFuncDecl(node.origin, node.name, node.returnType.visit(this), node.typeParameters.map(parameter => parameter.visit(this)), node.parameters.map(parameter => parameter.visit(this)), node.isCast, node.shaderType);
      result.protocolDecl = node.protocolDecl;
      result.possibleOverloads = node.possibleOverloads;
      return result;
    }
  }, {
    key: "visitNativeTypeInstance",
    value: function visitNativeTypeInstance(node) {
      return new NativeTypeInstance(node.type.visit(this), node.typeArguments.map(argument => argument.visit(this)));
    }
  }, {
    key: "visitFuncParameter",
    value: function visitFuncParameter(node) {
      var result = new FuncParameter(node.origin, node.name, node.type.visit(this));
      this._mapNode(node, result);
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitVariableDecl",
    value: function visitVariableDecl(node) {
      var result = new VariableDecl(node.origin, node.name, node.type.visit(this), Node.visit(node.initializer, this));
      this._mapNode(node, result);
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitBlock",
    value: function visitBlock(node) {
      var result = new Block(node.origin);
      for (var statement of node.statements) result.add(statement.visit(this));
      return result;
    }
  }, {
    key: "visitCommaExpression",
    value: function visitCommaExpression(node) {
      return new CommaExpression(node.origin, node.list.map(expression => {
        var result = expression.visit(this);
        if (!result) throw new Error("Null result from " + expression);
        return result;
      }));
    }
  }, {
    key: "visitProtocolRef",
    value: function visitProtocolRef(node) {
      return node;
    }
  }, {
    key: "visitTypeRef",
    value: function visitTypeRef(node) {
      var result = new TypeRef(node.origin, node.name, node.typeArguments.map(typeArgument => typeArgument.visit(this)));
      result.type = Node.visit(node.type, this);
      return result;
    }
  }, {
    key: "visitField",
    value: function visitField(node) {
      return new Field(node.origin, node.name, node.type.visit(this));
    }
  }, {
    key: "visitEnumMember",
    value: function visitEnumMember(node) {
      return new EnumMember(node.origin, node.name, node.value.visit(this));
    }
  }, {
    key: "visitEnumLiteral",
    value: function visitEnumLiteral(node) {
      var result = new EnumLiteral(node.origin, node.member);
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitReferenceType",
    value: function visitReferenceType(node) {
      return new node.constructor(node.origin, node.addressSpace, node.elementType.visit(this));
    }
  }, {
    key: "visitPtrType",
    value: function visitPtrType(node) {
      return this.visitReferenceType(node);
    }
  }, {
    key: "visitArrayRefType",
    value: function visitArrayRefType(node) {
      return this.visitReferenceType(node);
    }
  }, {
    key: "visitArrayType",
    value: function visitArrayType(node) {
      return new ArrayType(node.origin, node.elementType.visit(this), node.numElements.visit(this));
    }
  }, {
    key: "visitAssignment",
    value: function visitAssignment(node) {
      var result = new Assignment(node.origin, node.lhs.visit(this), node.rhs.visit(this));
      result.type = Node.visit(node.type, this);
      return result;
    }
  }, {
    key: "visitReadModifyWriteExpression",
    value: function visitReadModifyWriteExpression(node) {
      var result = new ReadModifyWriteExpression(node.origin, node.lValue.visit(this));
      result.oldValueVar = node.oldValueVar.visit(this);
      result.newValueVar = node.newValueVar.visit(this);
      result.newValueExp = node.newValueExp.visit(this);
      result.resultExp = node.resultExp.visit(this);
      return result;
    }
  }, {
    key: "visitDereferenceExpression",
    value: function visitDereferenceExpression(node) {
      var result = new DereferenceExpression(node.origin, node.ptr.visit(this));
      result.type = Node.visit(node.type, this);
      result.addressSpace = node.addressSpace;
      return result;
    }
  }, {
    key: "_handlePropertyAccessExpression",
    value: function _handlePropertyAccessExpression(result, node) {
      result.possibleGetOverloads = node.possibleGetOverloads;
      result.possibleSetOverloads = node.possibleSetOverloads;
      result.possibleAndOverloads = node.possibleAndOverloads;
      result.baseType = Node.visit(node.baseType, this);
      result.callForGet = Node.visit(node.callForGet, this);
      result.resultTypeForGet = Node.visit(node.resultTypeForGet, this);
      result.callForAnd = Node.visit(node.callForAnd, this);
      result.resultTypeForAnd = Node.visit(node.resultTypeForAnd, this);
      result.callForSet = Node.visit(node.callForSet, this);
      result.errorForSet = node.errorForSet;
      result.updateCalls();
    }
  }, {
    key: "visitDotExpression",
    value: function visitDotExpression(node) {
      var result = new DotExpression(node.origin, node.struct.visit(this), node.fieldName);
      this._handlePropertyAccessExpression(result, node);
      return result;
    }
  }, {
    key: "visitIndexExpression",
    value: function visitIndexExpression(node) {
      var result = new IndexExpression(node.origin, node.array.visit(this), node.index.visit(this));
      this._handlePropertyAccessExpression(result, node);
      return result;
    }
  }, {
    key: "visitMakePtrExpression",
    value: function visitMakePtrExpression(node) {
      var result = new MakePtrExpression(node.origin, node.lValue.visit(this));
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitMakeArrayRefExpression",
    value: function visitMakeArrayRefExpression(node) {
      var result = new MakeArrayRefExpression(node.origin, node.lValue.visit(this));
      if (node.numElements) result.numElements = node.numElements.visit(this);
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitConvertPtrToArrayRefExpression",
    value: function visitConvertPtrToArrayRefExpression(node) {
      var result = new ConvertPtrToArrayRefExpression(node.origin, node.lValue.visit(this));
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitVariableRef",
    value: function visitVariableRef(node) {
      var result = new VariableRef(node.origin, node.name);
      result.variable = this._getMapping(node.variable);
      return result;
    }
  }, {
    key: "visitReturn",
    value: function visitReturn(node) {
      return new Return(node.origin, Node.visit(node.value, this));
    }
  }, {
    key: "visitContinue",
    value: function visitContinue(node) {
      return new Continue(node.origin);
    }
  }, {
    key: "visitBreak",
    value: function visitBreak(node) {
      return new Break(node.origin);
    }
  }, {
    key: "visitTrapStatement",
    value: function visitTrapStatement(node) {
      return new TrapStatement(node.origin);
    }
  }, {
    key: "visitGenericLiteral",
    value: function visitGenericLiteral(node) {
      // FIXME: This doesn't seem right.
      var result = new IntLiteral(node.origin, node.value);
      result.type = node.type.visit(this);
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitGenericLiteralType",
    value: function visitGenericLiteralType(node) {
      var result = new node.constructor(node.origin, node.value);
      result.type = Node.visit(node.type, this);
      result.preferredType = node.preferredType.visit(this);
      return result;
    }
  }, {
    key: "visitBoolLiteral",
    value: function visitBoolLiteral(node) {
      return node;
    }
  }, {
    key: "visitNullLiteral",
    value: function visitNullLiteral(node) {
      var result = new NullLiteral(node.origin);
      result.type = node.type.visit(this);
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitNullType",
    value: function visitNullType(node) {
      var result = new NullType(node.origin);
      result.type = Node.visit(node.type, this);
      return result;
    }
  }, {
    key: "processDerivedCallData",
    value: function processDerivedCallData(node, result) {
      var handleTypeArguments = actualTypeArguments => {
        if (actualTypeArguments) return actualTypeArguments.map(actualTypeArgument => actualTypeArgument.visit(this));else return null;
      };
      result.actualTypeArguments = handleTypeArguments(node.actualTypeArguments);
      result.instantiatedActualTypeArguments = handleTypeArguments(node.instantiatedActualTypeArguments);
      var argumentTypes = node.argumentTypes;
      if (argumentTypes) result.argumentTypes = argumentTypes.map(argumentType => argumentType.visit(this));
      result.func = node.func;
      result.nativeFuncInstance = node.nativeFuncInstance;
      result.possibleOverloads = node.possibleOverloads;
      if (node.isCast) result.setCastData(node.returnType.visit(this));
      result.resultType = Node.visit(node.resultType, this);
      result.resultEPtr = node.resultEPtr;
      return result;
    }
  }, {
    key: "visitCallExpression",
    value: function visitCallExpression(node) {
      var result = new CallExpression(node.origin, node.name, node.typeArguments.map(typeArgument => typeArgument.visit(this)), node.argumentList.map(argument => Node.visit(argument, this)));
      return this.processDerivedCallData(node, result);
    }
  }, {
    key: "visitFunctionLikeBlock",
    value: function visitFunctionLikeBlock(node) {
      var result = new FunctionLikeBlock(node.origin, Node.visit(node.returnType, this), node.argumentList.map(argument => argument.visit(this)), node.parameters.map(parameter => parameter.visit(this)), node.body.visit(this));
      result.returnEPtr = node.returnEPtr;
      return result;
    }
  }, {
    key: "visitLogicalNot",
    value: function visitLogicalNot(node) {
      var result = new LogicalNot(node.origin, node.operand.visit(this));
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitLogicalExpression",
    value: function visitLogicalExpression(node) {
      var result = new LogicalExpression(node.origin, node.text, node.left.visit(this), node.right.visit(this));
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitIfStatement",
    value: function visitIfStatement(node) {
      return new IfStatement(node.origin, node.conditional.visit(this), node.body.visit(this), Node.visit(node.elseBody, this));
    }
  }, {
    key: "visitWhileLoop",
    value: function visitWhileLoop(node) {
      return new WhileLoop(node.origin, node.conditional.visit(this), node.body.visit(this));
    }
  }, {
    key: "visitDoWhileLoop",
    value: function visitDoWhileLoop(node) {
      return new DoWhileLoop(node.origin, node.body.visit(this), node.conditional.visit(this));
    }
  }, {
    key: "visitForLoop",
    value: function visitForLoop(node) {
      return new ForLoop(node.origin, Node.visit(node.initialization, this), Node.visit(node.condition, this), Node.visit(node.increment, this), node.body.visit(this));
    }
  }, {
    key: "visitSwitchStatement",
    value: function visitSwitchStatement(node) {
      var result = new SwitchStatement(node.origin, Node.visit(node.value, this));
      for (var switchCase of node.switchCases) result.add(switchCase.visit(this));
      result.type = Node.visit(node.type, this);
      return result;
    }
  }, {
    key: "visitSwitchCase",
    value: function visitSwitchCase(node) {
      return new SwitchCase(node.origin, Node.visit(node.value, this), node.body.visit(this));
    }
  }, {
    key: "visitAnonymousVariable",
    value: function visitAnonymousVariable(node) {
      var result = new AnonymousVariable(node.origin, node.type.visit(this));
      result._index = node._index;
      this._mapNode(node, result);
      result.ePtr = node.ePtr;
      return result;
    }
  }, {
    key: "visitIdentityExpression",
    value: function visitIdentityExpression(node) {
      return new IdentityExpression(node.target.visit(this));
    }
  }]);
}();

