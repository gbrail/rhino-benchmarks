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

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
var Checker = /*#__PURE__*/function (_Visitor) {
  function Checker(program) {
    var _this;
    _classCallCheck(this, Checker);
    _this = _callSuper(this, Checker);
    _this._program = program;
    _this._currentStatement = null;
    _this._vertexEntryPoints = new Set();
    _this._fragmentEntryPoints = new Set();
    return _this;
  }
  _inherits(Checker, _Visitor);
  return _createClass(Checker, [{
    key: "visitProgram",
    value: function visitProgram(node) {
      var doStatement = statement => {
        this._currentStatement = statement;
        statement.visit(this);
      };
      for (var type of node.types.values()) doStatement(type);
      for (var protocol of node.protocols.values()) doStatement(protocol);
      for (var funcs of node.functions.values()) {
        for (var func of funcs) {
          this.visitFunc(func);
        }
      }
      for (var _funcs of node.functions.values()) {
        for (var _func of _funcs) doStatement(_func);
      }
    }
  }, {
    key: "_checkShaderType",
    value: function _checkShaderType(node) {
      // FIXME: Relax these checks once we have implemented support for textures and samplers.
      if (node.typeParameters.length != 0) throw new WTypeError(node.origin.originString, "Entry point " + node.name + " must not have type arguments.");
      var shaderFunc = node;
      switch (node.shaderType) {
        case "vertex":
          if (this._vertexEntryPoints.has(node.name)) throw new WTypeError(node.origin.originString, "Duplicate vertex entry point name " + node.name);
          this._vertexEntryPoints.add(node.name);
          break;
        case "fragment":
          if (this._fragmentEntryPoints.has(node.name)) throw new WTypeError(node.origin.originString, "Duplicate fragment entry point name " + node.name);
          this._fragmentEntryPoints.add(node.name);
          break;
      }
    }
  }, {
    key: "_checkOperatorOverload",
    value: function _checkOperatorOverload(func, resolveFuncs) {
      if (Lexer.textIsIdentifier(func.name)) return; // Not operator!

      if (!func.name.startsWith("operator")) throw new Error("Bad operator overload name: " + func.name);
      var typeVariableTracker = new TypeVariableTracker();
      for (var parameterType of func.parameterTypes) parameterType.visit(typeVariableTracker);
      Node.visit(func.returnTypeForOverloadResolution, typeVariableTracker);
      for (var typeParameter of func.typeParameters) {
        if (!typeVariableTracker.set.has(typeParameter)) throw new WTypeError(typeParameter.origin.originString, "Type parameter " + typeParameter + " to operator " + func.toDeclString() + " is not inferrable from value parameters");
      }
      var checkGetter = kind => {
        var numExpectedParameters = kind == "index" ? 2 : 1;
        if (func.parameters.length != numExpectedParameters) throw new WTypeError(func.origin.originString, "Incorrect number of parameters for " + func.name + " (expected " + numExpectedParameters + ", got " + func.parameters.length + ")");
        if (func.parameterTypes[0].unifyNode.isPtr) throw new WTypeError(func.origin.originString, "Cannot have getter for pointer type: " + func.parameterTypes[0]);
      };
      var checkSetter = kind => {
        var numExpectedParameters = kind == "index" ? 3 : 2;
        if (func.parameters.length != numExpectedParameters) throw new WTypeError(func.origin.originString, "Incorrect number of parameters for " + func.name + " (expected " + numExpectedParameters + ", got " + func.parameters.length + ")");
        if (func.parameterTypes[0].unifyNode.isPtr) throw new WTypeError(func.origin.originString, "Cannot have setter for pointer type: " + func.parameterTypes[0]);
        if (!func.returnType.equals(func.parameterTypes[0])) throw new WTypeError(func.origin.originString, "First parameter type and return type of setter must match (parameter was " + func.parameterTypes[0] + " but return was " + func.returnType + ")");
        var valueType = func.parameterTypes[numExpectedParameters - 1];
        var getterName = func.name.substr(0, func.name.length - 1);
        var getterFuncs = resolveFuncs(getterName);
        if (!getterFuncs) throw new WTypeError(func.origin.originString, "Every setter must have a matching getter, but did not find any function named " + getterName + " to match " + func.name);
        var argumentTypes = func.parameterTypes.slice(0, numExpectedParameters - 1);
        var overload = resolveOverloadImpl(getterFuncs, [], argumentTypes, null);
        if (!overload.func) throw new WTypeError(func.origin.originString, "Did not find function named " + func.name + " with arguments " + argumentTypes + (overload.failures.length ? "; tried:\n" + overload.failures.join("\n") : ""));
        var resultType = overload.func.returnType.substituteToUnification(overload.func.typeParameters, overload.unificationContext);
        if (!resultType.equals(valueType)) throw new WTypeError(func.origin.originString, "Setter and getter must agree on value type (getter at " + overload.func.origin.originString + " says " + resultType + " while this setter says " + valueType + ")");
      };
      var checkAnder = kind => {
        var numExpectedParameters = kind == "index" ? 2 : 1;
        if (func.parameters.length != numExpectedParameters) throw new WTypeError(func.origin.originString, "Incorrect number of parameters for " + func.name + " (expected " + numExpectedParameters + ", got " + func.parameters.length + ")");
        if (!func.returnType.unifyNode.isPtr) throw new WTypeError(func.origin.originString, "Return type of ander is not a pointer: " + func.returnType);
        if (!func.parameterTypes[0].unifyNode.isRef) throw new WTypeError(func.origin.originString, "Parameter to ander is not a reference: " + func.parameterTypes[0]);
      };
      switch (func.name) {
        case "operator cast":
          break;
        case "operator++":
        case "operator--":
          if (func.parameters.length != 1) throw new WTypeError(func.origin.originString, "Incorrect number of parameters for " + func.name + " (expected 1, got " + func.parameters.length + ")");
          if (!func.parameterTypes[0].equals(func.returnType)) throw new WTypeError(func.origin.originString, "Parameter type and return type must match for " + func.name + " (parameter is " + func.parameterTypes[0] + " while return is " + func.returnType + ")");
          break;
        case "operator+":
        case "operator-":
          if (func.parameters.length != 1 && func.parameters.length != 2) throw new WTypeError(func.origin.originString, "Incorrect number of parameters for " + func.name + " (expected 1 or 2, got " + func.parameters.length + ")");
          break;
        case "operator*":
        case "operator/":
        case "operator%":
        case "operator&":
        case "operator|":
        case "operator^":
        case "operator<<":
        case "operator>>":
          if (func.parameters.length != 2) throw new WTypeError(func.origin.originString, "Incorrect number of parameters for " + func.name + " (expected 2, got " + func.parameters.length + ")");
          break;
        case "operator~":
          if (func.parameters.length != 1) throw new WTypeError(func.origin.originString, "Incorrect number of parameters for " + func.name + " (expected 1, got " + func.parameters.length + ")");
          break;
        case "operator==":
        case "operator<":
        case "operator<=":
        case "operator>":
        case "operator>=":
          if (func.parameters.length != 2) throw new WTypeError(func.origin.originString, "Incorrect number of parameters for " + func.name + " (expected 2, got " + func.parameters.length + ")");
          if (!func.returnType.equals(this._program.intrinsics.bool)) throw new WTypeError(func.origin.originString, "Return type of " + func.name + " must be bool but was " + func.returnType);
          break;
        case "operator[]":
          checkGetter("index");
          break;
        case "operator[]=":
          checkSetter("index");
          break;
        case "operator&[]":
          checkAnder("index");
          break;
        default:
          if (func.name.startsWith("operator.")) {
            if (func.name.endsWith("=")) checkSetter("dot");else checkGetter("dot");
            break;
          }
          if (func.name.startsWith("operator&.")) {
            checkAnder("dot");
            break;
          }
          throw new Error("Parser accepted unrecognized operator: " + func.name);
      }
    }
  }, {
    key: "visitFuncDef",
    value: function visitFuncDef(node) {
      if (node.shaderType) this._checkShaderType(node);
      this._checkOperatorOverload(node, name => this._program.functions.get(name));
      node.body.visit(this);
    }
  }, {
    key: "visitNativeFunc",
    value: function visitNativeFunc(node) {}
  }, {
    key: "visitProtocolDecl",
    value: function visitProtocolDecl(node) {
      for (var signature of node.signatures) {
        var typeVariableTracker = new TypeVariableTracker();
        for (var parameterType of signature.parameterTypes) parameterType.visit(typeVariableTracker);
        Node.visit(signature.returnTypeForOverloadResolution, typeVariableTracker);
        for (var typeParameter of signature.typeParameters) {
          if (!typeVariableTracker.set.has(typeParameter)) throw WTypeError(typeParameter.origin.originString, "Type parameter to protocol signature not inferrable from value parameters");
        }
        if (!typeVariableTracker.set.has(node.typeVariable)) throw new WTypeError(signature.origin.originString, "Protocol's type variable (" + node.name + ") not mentioned in signature: " + signature);
        this._checkOperatorOverload(signature, name => node.signaturesByName(name));
      }
    }
  }, {
    key: "visitEnumType",
    value: function visitEnumType(node) {
      node.baseType.visit(this);
      var baseType = node.baseType.unifyNode;
      if (!baseType.isInt) throw new WTypeError(node.origin.originString, "Base type of enum is not an integer: " + node.baseType);
      for (var member of node.members) {
        if (!member.value) continue;
        var memberType = member.value.visit(this);
        if (!baseType.equalsWithCommit(memberType)) throw new WTypeError(member.origin.originString, "Type of enum member " + member.value.name + " does not patch enum base type (member type is " + memberType + ", enum base type is " + node.baseType + ")");
      }
      var nextValue = baseType.defaultValue;
      for (var _member of node.members) {
        if (_member.value) {
          nextValue = baseType.successorValue(_member.value.unifyNode.valueForSelectedType);
          continue;
        }
        _member.value = baseType.createLiteral(_member.origin, nextValue);
        nextValue = baseType.successorValue(nextValue);
      }
      var memberArray = Array.from(node.members);
      for (var i = 0; i < memberArray.length; ++i) {
        var _member2 = memberArray[i];
        for (var j = i + 1; j < memberArray.length; ++j) {
          var otherMember = memberArray[j];
          if (baseType.valuesEqual(_member2.value.unifyNode.valueForSelectedType, otherMember.value.unifyNode.valueForSelectedType)) throw new WTypeError(otherMember.origin.originString, "Duplicate enum member value (" + _member2.name + " has " + _member2.value + " while " + otherMember.name + " has " + otherMember.value + ")");
        }
      }
      var foundZero = false;
      for (var _member3 of node.members) {
        if (baseType.valuesEqual(_member3.value.unifyNode.valueForSelectedType, baseType.defaultValue)) {
          foundZero = true;
          break;
        }
      }
      if (!foundZero) throw new WTypeError(node.origin.originString, "Enum does not have a member with the value zero");
    }
  }, {
    key: "_checkTypeArguments",
    value: function _checkTypeArguments(origin, typeParameters, typeArguments) {
      for (var i = 0; i < typeParameters.length; ++i) {
        var argumentIsType = typeArguments[i] instanceof Type;
        var result = typeArguments[i].visit(this);
        if (argumentIsType) {
          var _result = typeArguments[i].inherits(typeParameters[i].protocol);
          if (!_result.result) throw new WTypeError(origin.originString, "Type argument does not inherit protocol: " + _result.reason);
        } else {
          if (!result.equalsWithCommit(typeParameters[i].type)) throw new WTypeError(origin.originString, "Wrong type for constexpr");
        }
      }
    }
  }, {
    key: "visitTypeRef",
    value: function visitTypeRef(node) {
      if (!node.type) throw new Error("Type reference without a type in checker: " + node + " at " + node.origin);
      if (!(node.type instanceof StructType)) node.type.visit(this);
      this._checkTypeArguments(node.origin, node.type.typeParameters, node.typeArguments);
    }
  }, {
    key: "visitArrayType",
    value: function visitArrayType(node) {
      node.elementType.visit(this);
      if (!node.numElements.isConstexpr) throw new WTypeError(node.origin.originString, "Array length must be constexpr");
      var type = node.numElements.visit(this);
      if (!type.equalsWithCommit(this._program.intrinsics.uint32)) throw new WTypeError(node.origin.originString, "Array length must be a uint32");
    }
  }, {
    key: "visitVariableDecl",
    value: function visitVariableDecl(node) {
      node.type.visit(this);
      if (node.initializer) {
        var lhsType = node.type;
        var rhsType = node.initializer.visit(this);
        if (!lhsType.equalsWithCommit(rhsType)) throw new WTypeError(node.origin.originString, "Type mismatch in variable initialization: " + lhsType + " versus " + rhsType);
      }
    }
  }, {
    key: "visitAssignment",
    value: function visitAssignment(node) {
      var lhsType = node.lhs.visit(this);
      if (!node.lhs.isLValue) throw new WTypeError(node.origin.originString, "LHS of assignment is not an LValue: " + node.lhs + node.lhs.notLValueReasonString);
      var rhsType = node.rhs.visit(this);
      if (!lhsType.equalsWithCommit(rhsType)) throw new WTypeError(node.origin.originString, "Type mismatch in assignment: " + lhsType + " versus " + rhsType);
      node.type = lhsType;
      return lhsType;
    }
  }, {
    key: "visitIdentityExpression",
    value: function visitIdentityExpression(node) {
      return node.target.visit(this);
    }
  }, {
    key: "visitReadModifyWriteExpression",
    value: function visitReadModifyWriteExpression(node) {
      var lhsType = node.lValue.visit(this);
      if (!node.lValue.isLValue) throw new WTypeError(node.origin.originString, "LHS of read-modify-write is not an LValue: " + node.lValue + node.lValue.notLValueReasonString);
      node.oldValueVar.type = lhsType;
      node.newValueVar.type = lhsType;
      node.oldValueVar.visit(this);
      node.newValueVar.visit(this);
      var newValueType = node.newValueExp.visit(this);
      if (!lhsType.equalsWithCommit(newValueType)) return new WTypeError(node.origin.originString, "Type mismatch in read-modify-write: " + lhsType + " versus " + newValueType);
      return node.resultExp.visit(this);
    }
  }, {
    key: "visitAnonymousVariable",
    value: function visitAnonymousVariable(node) {
      if (!node.type) throw new Error("Anonymous variable must know type before first appearance");
    }
  }, {
    key: "visitDereferenceExpression",
    value: function visitDereferenceExpression(node) {
      var type = node.ptr.visit(this).unifyNode;
      if (!type.isPtr) throw new WTypeError(node.origin.originString, "Type passed to dereference is not a pointer: " + type);
      node.type = type.elementType;
      node.addressSpace = type.addressSpace;
      if (!node.addressSpace) throw new Error("Null address space in type: " + type);
      return node.type;
    }
  }, {
    key: "visitMakePtrExpression",
    value: function visitMakePtrExpression(node) {
      var elementType = node.lValue.visit(this).unifyNode;
      if (!node.lValue.isLValue) throw new WTypeError(node.origin.originString, "Operand to & is not an LValue: " + node.lValue + node.lValue.notLValueReasonString);
      return new PtrType(node.origin, node.lValue.addressSpace, elementType);
    }
  }, {
    key: "visitMakeArrayRefExpression",
    value: function visitMakeArrayRefExpression(node) {
      var elementType = node.lValue.visit(this).unifyNode;
      if (elementType.isPtr) {
        node.become(new ConvertPtrToArrayRefExpression(node.origin, node.lValue));
        return new ArrayRefType(node.origin, elementType.addressSpace, elementType.elementType);
      }
      if (!node.lValue.isLValue) throw new WTypeError(node.origin.originString, "Operand to @ is not an LValue: " + node.lValue + node.lValue.notLValueReasonString);
      if (elementType.isArray) {
        node.numElements = elementType.numElements;
        elementType = elementType.elementType;
      } else node.numElements = UintLiteral.withType(node.origin, 1, this._program.intrinsics.uint32);
      return new ArrayRefType(node.origin, node.lValue.addressSpace, elementType);
    }
  }, {
    key: "visitConvertToArrayRefExpression",
    value: function visitConvertToArrayRefExpression(node) {
      throw new Error("Should not exist yet.");
    }
  }, {
    key: "_finishVisitingPropertyAccess",
    value: function _finishVisitingPropertyAccess(node, baseType, extraArgs, extraArgTypes) {
      baseType = baseType.visit(new AutoWrapper());
      node.baseType = baseType;

      // Such a type must exist. This may throw if it doesn't.
      var typeForAnd = baseType.argumentTypeForAndOverload(node.origin);
      if (!typeForAnd) throw new Error("Cannot get typeForAnd");
      var errorForGet;
      var errorForAnd;
      try {
        var result = CallExpression.resolve(node.origin, node.possibleGetOverloads, this._currentStatement.typeParameters, node.getFuncName, [], [node.base].concat(_toConsumableArray(extraArgs)), [baseType].concat(_toConsumableArray(extraArgTypes)), null);
        node.callForGet = result.call;
        node.resultTypeForGet = result.resultType;
      } catch (e) {
        if (!(e instanceof WTypeError)) throw e;
        errorForGet = e;
      }
      try {
        var baseForAnd = baseType.argumentForAndOverload(node.origin, node.base);
        var _result2 = CallExpression.resolve(node.origin, node.possibleAndOverloads, this._currentStatement.typeParameters, node.andFuncName, [], [baseForAnd].concat(_toConsumableArray(extraArgs)), [typeForAnd].concat(_toConsumableArray(extraArgTypes)), null);
        node.callForAnd = _result2.call;
        node.resultTypeForAnd = _result2.resultType.unifyNode.returnTypeFromAndOverload(node.origin);
      } catch (e) {
        if (!(e instanceof WTypeError)) throw e;
        errorForAnd = e;
      }
      if (!node.resultTypeForGet && !node.resultTypeForAnd) {
        throw new WTypeError(node.origin.originString, "Cannot resolve access; tried by-value:\n" + errorForGet.typeErrorMessage + "\n" + "and tried by-pointer:\n" + errorForAnd.typeErrorMessage);
      }
      if (node.resultTypeForGet && node.resultTypeForAnd && !node.resultTypeForGet.equals(node.resultTypeForAnd)) throw new WTypeError(node.origin.originString, "Result type resolved by-value (" + node.resultTypeForGet + ") does not match result type resolved by-pointer (" + node.resultTypeForAnd + ")");
      try {
        var _result3 = CallExpression.resolve(node.origin, node.possibleSetOverloads, this._currentStatement.typeParameters, node.setFuncName, [], [node.base].concat(_toConsumableArray(extraArgs), [null]), [baseType].concat(_toConsumableArray(extraArgTypes), [node.resultType]), null);
        node.callForSet = _result3.call;
        if (!_result3.resultType.equals(baseType)) throw new WTypeError(node.origin.originString, "Result type of setter " + _result3.call.func + " is not the base type " + baseType);
      } catch (e) {
        if (!(e instanceof WTypeError)) throw e;
        node.errorForSet = e;
      }

      // OK, now we need to determine if we are an lvalue. We are an lvalue if we can be assigned to. We can
      // be assigned to if we have an ander or setter. But it's weirder than that. We also need the base to be
      // an lvalue, except unless the base is an array reference.
      if (!node.callForAnd && !node.callForSet) {
        node.isLValue = false;
        node.notLValueReason = "Have neither ander nor setter. Tried setter:\n" + node.errorForSet.typeErrorMessage + "\n" + "and tried ander:\n" + errorForAnd.typeErrorMessage;
      } else if (!node.base.isLValue && !baseType.isArrayRef) {
        node.isLValue = false;
        node.notLValueReason = "Base of property access is neither a lvalue nor an array reference";
      } else {
        node.isLValue = true;
        node.addressSpace = node.base.isLValue ? node.base.addressSpace : baseType.addressSpace;
      }
      return node.resultType;
    }
  }, {
    key: "visitDotExpression",
    value: function visitDotExpression(node) {
      var structType = node.struct.visit(this).unifyNode;
      return this._finishVisitingPropertyAccess(node, structType, [], []);
    }
  }, {
    key: "visitIndexExpression",
    value: function visitIndexExpression(node) {
      var arrayType = node.array.visit(this).unifyNode;
      var indexType = node.index.visit(this);
      return this._finishVisitingPropertyAccess(node, arrayType, [node.index], [indexType]);
    }
  }, {
    key: "visitVariableRef",
    value: function visitVariableRef(node) {
      if (!node.variable.type) throw new Error("Variable has no type: " + node.variable);
      return node.variable.type;
    }
  }, {
    key: "visitReturn",
    value: function visitReturn(node) {
      if (node.value) {
        var resultType = node.value.visit(this);
        if (!resultType) throw new Error("Null result type from " + node.value);
        if (!node.func.returnType.equalsWithCommit(resultType)) throw new WTypeError(node.origin.originString, "Trying to return " + resultType + " in a function that returns " + node.func.returnType);
        return;
      }
      if (!node.func.returnType.equalsWithCommit(this._program.intrinsics.void)) throw new WTypeError(node.origin.originString, "Non-void function must return a value");
    }
  }, {
    key: "visitGenericLiteral",
    value: function visitGenericLiteral(node) {
      return node.type;
    }
  }, {
    key: "visitNullLiteral",
    value: function visitNullLiteral(node) {
      return node.type;
    }
  }, {
    key: "visitBoolLiteral",
    value: function visitBoolLiteral(node) {
      return this._program.intrinsics.bool;
    }
  }, {
    key: "visitEnumLiteral",
    value: function visitEnumLiteral(node) {
      return node.member.enumType;
    }
  }, {
    key: "_requireBool",
    value: function _requireBool(expression) {
      var type = expression.visit(this);
      if (!type) throw new Error("Expression has no type, but should be bool: " + expression);
      if (!type.equals(this._program.intrinsics.bool)) throw new WTypeError("Expression isn't a bool: " + expression);
    }
  }, {
    key: "visitLogicalNot",
    value: function visitLogicalNot(node) {
      this._requireBool(node.operand);
      return this._program.intrinsics.bool;
    }
  }, {
    key: "visitLogicalExpression",
    value: function visitLogicalExpression(node) {
      this._requireBool(node.left);
      this._requireBool(node.right);
      return this._program.intrinsics.bool;
    }
  }, {
    key: "visitIfStatement",
    value: function visitIfStatement(node) {
      this._requireBool(node.conditional);
      node.body.visit(this);
      if (node.elseBody) node.elseBody.visit(this);
    }
  }, {
    key: "visitWhileLoop",
    value: function visitWhileLoop(node) {
      this._requireBool(node.conditional);
      node.body.visit(this);
    }
  }, {
    key: "visitDoWhileLoop",
    value: function visitDoWhileLoop(node) {
      node.body.visit(this);
      this._requireBool(node.conditional);
    }
  }, {
    key: "visitForLoop",
    value: function visitForLoop(node) {
      if (node.initialization) node.initialization.visit(this);
      if (node.condition) this._requireBool(node.condition);
      if (node.increment) node.increment.visit(this);
      node.body.visit(this);
    }
  }, {
    key: "visitSwitchStatement",
    value: function visitSwitchStatement(node) {
      var type = node.value.visit(this).commit();
      if (!type.unifyNode.isInt && !(type.unifyNode instanceof EnumType)) throw new WTypeError(node.origin.originString, "Cannot switch on non-integer/non-enum type: " + type);
      node.type = type;
      var hasDefault = false;
      for (var switchCase of node.switchCases) {
        switchCase.body.visit(this);
        if (switchCase.isDefault) {
          hasDefault = true;
          continue;
        }
        if (!switchCase.value.isConstexpr) throw new WTypeError(switchCase.origin.originString, "Switch case not constexpr: " + switchCase.value);
        var caseType = switchCase.value.visit(this);
        if (!type.equalsWithCommit(caseType)) throw new WTypeError(switchCase.origin.originString, "Switch case type does not match switch value type (case type is " + caseType + " but switch value type is " + type + ")");
      }
      for (var i = 0; i < node.switchCases.length; ++i) {
        var firstCase = node.switchCases[i];
        for (var j = i + 1; j < node.switchCases.length; ++j) {
          var secondCase = node.switchCases[j];
          if (firstCase.isDefault != secondCase.isDefault) continue;
          if (firstCase.isDefault) throw new WTypeError(secondCase.origin.originString, "Duplicate default case in switch statement");
          var valuesEqual = type.unifyNode.valuesEqual(firstCase.value.unifyNode.valueForSelectedType, secondCase.value.unifyNode.valueForSelectedType);
          if (valuesEqual) throw new WTypeError(secondCase.origin.originString, "Duplicate case in switch statement for value " + firstCase.value.unifyNode.valueForSelectedType);
        }
      }
      if (!hasDefault) {
        var includedValues = new Set();
        for (var _switchCase of node.switchCases) includedValues.add(_switchCase.value.unifyNode.valueForSelectedType);
        for (var {
          value,
          name
        } of type.unifyNode.allValues()) {
          if (!includedValues.has(value)) throw new WTypeError(node.origin.originString, "Value not handled by switch statement: " + name);
        }
      }
    }
  }, {
    key: "visitCommaExpression",
    value: function visitCommaExpression(node) {
      var result = null;
      for (var expression of node.list) result = expression.visit(this);
      return result;
    }
  }, {
    key: "visitCallExpression",
    value: function visitCallExpression(node) {
      var typeArguments = node.typeArguments.map(typeArgument => typeArgument.visit(this));
      var argumentTypes = node.argumentList.map(argument => {
        var newArgument = argument.visit(this);
        if (!newArgument) throw new Error("visitor returned null for " + argument);
        return newArgument.visit(new AutoWrapper());
      });
      node.argumentTypes = argumentTypes;
      if (node.returnType) node.returnType.visit(this);
      var result = node.resolve(node.possibleOverloads, this._currentStatement.typeParameters, typeArguments);
      return result;
    }
  }]);
}(Visitor);

