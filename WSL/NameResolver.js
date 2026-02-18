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

// This only resolves names. After this phase runs, all names will be resolved. This means that all
// XYZRef objects now know who they resolve to. This does not yet allow type analysis, because there
// are still TypeDefs. This throws type errors for failed name resolutions and for things that are
// more convenient to check here than in the Checker. This usually involves things that need to be
// checked before TypeRefToTypeDefSkipper.
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var NameResolver = /*#__PURE__*/function (_Visitor) {
  function NameResolver(nameContext) {
    var _this;
    _classCallCheck(this, NameResolver);
    _this = _callSuper(this, NameResolver);
    _this._nameContext = nameContext;
    return _this;
  }
  _inherits(NameResolver, _Visitor);
  return _createClass(NameResolver, [{
    key: "doStatement",
    value: function doStatement(statement) {
      this._nameContext.doStatement(statement, () => statement.visit(this));
    }
  }, {
    key: "_visitTypeParametersAndBuildNameContext",
    value: function _visitTypeParametersAndBuildNameContext(node) {
      var nameContext = new NameContext(this._nameContext);
      for (var typeParameter of node.typeParameters) {
        nameContext.add(typeParameter);
        typeParameter.visit(this);
      }
      return nameContext;
    }
  }, {
    key: "visitFunc",
    value: function visitFunc(node) {
      var checker = new NameResolver(this._visitTypeParametersAndBuildNameContext(node));
      node.returnType.visit(checker);
      for (var parameter of node.parameters) parameter.visit(checker);
    }
  }, {
    key: "visitFuncDef",
    value: function visitFuncDef(node) {
      var contextWithTypeParameters = this._visitTypeParametersAndBuildNameContext(node);
      var checkerWithTypeParameters = new NameResolver(contextWithTypeParameters);
      node.returnType.visit(checkerWithTypeParameters);
      var contextWithParameters = new NameContext(contextWithTypeParameters);
      for (var parameter of node.parameters) {
        parameter.visit(checkerWithTypeParameters);
        contextWithParameters.add(parameter);
      }
      var checkerWithParameters = new NameResolver(contextWithParameters);
      node.body.visit(checkerWithParameters);
    }
  }, {
    key: "visitBlock",
    value: function visitBlock(node) {
      var checker = new NameResolver(new NameContext(this._nameContext));
      for (var statement of node.statements) statement.visit(checker);
    }
  }, {
    key: "visitIfStatement",
    value: function visitIfStatement(node) {
      node.conditional.visit(this);
      // The bodies might not be Blocks, so we need to explicitly give them a new context.
      node.body.visit(new NameResolver(new NameContext(this._nameContext)));
      if (node.elseBody) node.elseBody.visit(new NameResolver(new NameContext(this._nameContext)));
    }
  }, {
    key: "visitWhileLoop",
    value: function visitWhileLoop(node) {
      node.conditional.visit(this);
      // The bodies might not be Blocks, so we need to explicitly give them a new context.
      node.body.visit(new NameResolver(new NameContext(this._nameContext)));
    }
  }, {
    key: "visitDoWhileLoop",
    value: function visitDoWhileLoop(node) {
      // The bodies might not be Blocks, so we need to explicitly give them a new context.
      node.body.visit(new NameResolver(new NameContext(this._nameContext)));
      node.conditional.visit(this);
    }
  }, {
    key: "visitForLoop",
    value: function visitForLoop(node) {
      var newResolver = new NameResolver(new NameContext(this._nameContext));
      if (node.initialization) node.initialization.visit(newResolver);
      if (node.condition) node.condition.visit(newResolver);
      if (node.increment) node.increment.visit(newResolver);
      node.body.visit(newResolver);
    }
  }, {
    key: "visitProtocolDecl",
    value: function visitProtocolDecl(node) {
      for (var parent of node.extends) parent.visit(this);
      var nameContext = new NameContext(this._nameContext);
      nameContext.add(node.typeVariable);
      var checker = new NameResolver(nameContext);
      for (var signature of node.signatures) signature.visit(checker);
    }
  }, {
    key: "visitProtocolRef",
    value: function visitProtocolRef(node) {
      var result = this._nameContext.get(Protocol, node.name);
      if (!result) throw new WTypeError(node.origin.originString, "Could not find protocol named " + node.name);
      node.protocolDecl = result;
    }
  }, {
    key: "visitProtocolFuncDecl",
    value: function visitProtocolFuncDecl(node) {
      this.visitFunc(node);
      var funcs = this._nameContext.get(Func, node.name);
      if (!funcs) throw new WTypeError(node.origin.originString, "Cannot find any functions named " + node.name);
      node.possibleOverloads = funcs;
    }
  }, {
    key: "visitTypeDef",
    value: function visitTypeDef(node) {
      var nameContext = new NameContext(this._nameContext);
      for (var typeParameter of node.typeParameters) {
        typeParameter.visit(this);
        nameContext.add(typeParameter);
      }
      var checker = new NameResolver(nameContext);
      node.type.visit(checker);
    }
  }, {
    key: "visitStructType",
    value: function visitStructType(node) {
      var nameContext = new NameContext(this._nameContext);
      for (var typeParameter of node.typeParameters) {
        typeParameter.visit(this);
        nameContext.add(typeParameter);
      }
      var checker = new NameResolver(nameContext);
      for (var field of node.fields) field.visit(checker);
    }
  }, {
    key: "_resolveTypeArguments",
    value: function _resolveTypeArguments(typeArguments) {
      for (var i = 0; i < typeArguments.length; ++i) {
        var typeArgument = typeArguments[i];
        if (typeArgument instanceof TypeOrVariableRef) {
          var thing = this._nameContext.get(Anything, typeArgument.name);
          if (!thing) new WTypeError(typeArgument.origin.originString, "Could not find type or variable named " + typeArgument.name);
          if (thing instanceof Value) typeArguments[i] = new VariableRef(typeArgument.origin, typeArgument.name);else if (thing instanceof Type) typeArguments[i] = new TypeRef(typeArgument.origin, typeArgument.name, []);else throw new WTypeError(typeArgument.origin.originString, "Type argument resolved to wrong kind of thing: " + thing.kind);
        }
        if (typeArgument[i] instanceof Value && !typeArgument[i].isConstexpr) throw new WTypeError(typeArgument[i].origin.originString, "Expected constexpr");
      }
    }
  }, {
    key: "visitTypeRef",
    value: function visitTypeRef(node) {
      this._resolveTypeArguments(node.typeArguments);
      var type = node.type;
      if (!type) {
        type = this._nameContext.get(Type, node.name);
        if (!type) throw new WTypeError(node.origin.originString, "Could not find type named " + node.name);
        node.type = type;
      }
      if (type.typeParameters.length != node.typeArguments.length) throw new WTypeError(node.origin.originString, "Wrong number of type arguments (passed " + node.typeArguments.length + ", expected " + type.typeParameters.length + ")");
      for (var i = 0; i < type.typeParameters.length; ++i) {
        var parameterIsType = type.typeParameters[i] instanceof TypeVariable;
        var argumentIsType = node.typeArguments[i] instanceof Type;
        node.typeArguments[i].visit(this);
        if (parameterIsType && !argumentIsType) throw new WTypeError(node.origin.originString, "Expected type, but got value at argument #" + i);
        if (!parameterIsType && argumentIsType) throw new WTypeError(node.origin.originString, "Expected value, but got type at argument #" + i);
      }
    }
  }, {
    key: "visitReferenceType",
    value: function visitReferenceType(node) {
      var nameContext = new NameContext(this._nameContext);
      node.elementType.visit(new NameResolver(nameContext));
    }
  }, {
    key: "visitVariableDecl",
    value: function visitVariableDecl(node) {
      this._nameContext.add(node);
      node.type.visit(this);
      if (node.initializer) node.initializer.visit(this);
    }
  }, {
    key: "visitVariableRef",
    value: function visitVariableRef(node) {
      if (node.variable) return;
      var result = this._nameContext.get(Value, node.name);
      if (!result) throw new WTypeError(node.origin.originString, "Could not find variable named " + node.name);
      node.variable = result;
    }
  }, {
    key: "visitReturn",
    value: function visitReturn(node) {
      node.func = this._nameContext.currentStatement;
      _superPropGet(NameResolver, "visitReturn", this, 3)([node]);
    }
  }, {
    key: "_handlePropertyAccess",
    value: function _handlePropertyAccess(node) {
      node.possibleGetOverloads = this._nameContext.get(Func, node.getFuncName);
      node.possibleSetOverloads = this._nameContext.get(Func, node.setFuncName);
      node.possibleAndOverloads = this._nameContext.get(Func, node.andFuncName);
      if (!node.possibleGetOverloads && !node.possibleAndOverloads) throw new WTypeError(node.origin.originString, "Cannot find either " + node.getFuncName + " or " + node.andFuncName);
    }
  }, {
    key: "visitDotExpression",
    value: function visitDotExpression(node) {
      // This could be a reference to an enum. Let's resolve that now.
      if (node.struct instanceof VariableRef) {
        var enumType = this._nameContext.get(Type, node.struct.name);
        if (enumType && enumType instanceof EnumType) {
          var enumMember = enumType.memberByName(node.fieldName);
          if (!enumMember) throw new WTypeError(node.origin.originString, "Enum " + enumType.name + " does not have a member named " + node.fieldName);
          node.become(new EnumLiteral(node.origin, enumMember));
          return;
        }
      }
      this._handlePropertyAccess(node);
      _superPropGet(NameResolver, "visitDotExpression", this, 3)([node]);
    }
  }, {
    key: "visitIndexExpression",
    value: function visitIndexExpression(node) {
      this._handlePropertyAccess(node);
      _superPropGet(NameResolver, "visitIndexExpression", this, 3)([node]);
    }
  }, {
    key: "visitCallExpression",
    value: function visitCallExpression(node) {
      this._resolveTypeArguments(node.typeArguments);
      var funcs = this._nameContext.get(Func, node.name);
      if (funcs) node.possibleOverloads = funcs;else {
        var type = this._nameContext.get(Type, node.name);
        if (!type) throw new WTypeError(node.origin.originString, "Cannot find any function or type named \"" + node.name + "\"");
        node.becomeCast(type);
        node.possibleOverloads = this._nameContext.get(Func, "operator cast");
        if (!node.possibleOverloads) throw new WTypeError(node.origin.originString, "Cannot find any operator cast implementations in cast to " + type);
      }
      _superPropGet(NameResolver, "visitCallExpression", this, 3)([node]);
    }
  }]);
}(Visitor);

