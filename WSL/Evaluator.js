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

// This is a combined LHS/RHS evaluator that passes around EPtr's to everything.
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
var Evaluator = /*#__PURE__*/function (_Visitor) {
  function Evaluator(program) {
    var _this;
    _classCallCheck(this, Evaluator);
    _this = _callSuper(this, Evaluator);
    _this._program = program;
    return _this;
  }

  // You must snapshot if you use a value in rvalue context. For example, a call expression will
  // snapshot all of its arguments immedaitely upon executing them. In general, it should not be
  // possible for a pointer returned from a visit method in rvalue context to live across any effects.
  _inherits(Evaluator, _Visitor);
  return _createClass(Evaluator, [{
    key: "_snapshot",
    value: function _snapshot(type, dstPtr, srcPtr) {
      var size = type.size;
      if (size == null) throw new Error("Cannot get size of type: " + type + " (size = " + size + ", constructor = " + type.constructor.name + ")");
      if (!dstPtr) dstPtr = new EPtr(new EBuffer(size), 0);
      dstPtr.copyFrom(srcPtr, size);
      return dstPtr;
    }
  }, {
    key: "runFunc",
    value: function runFunc(func) {
      return EBuffer.disallowAllocation(() => this._runBody(func.returnType, func.returnEPtr, func.body));
    }
  }, {
    key: "_runBody",
    value: function _runBody(type, ptr, block) {
      if (!ptr) throw new Error("Null ptr");
      try {
        block.visit(this);
        // FIXME: We should have a check that there is no way to drop out of a function without
        // returning unless the function returns void.
        return null;
      } catch (e) {
        if (e == BreakException || e == ContinueException) throw new Error("Should not see break/continue at function scope");
        if (e instanceof ReturnException) {
          var result = this._snapshot(type, ptr, e.value);
          return result;
        }
        throw e;
      }
    }
  }, {
    key: "visitFunctionLikeBlock",
    value: function visitFunctionLikeBlock(node) {
      for (var i = 0; i < node.argumentList.length; ++i) {
        node.parameters[i].ePtr.copyFrom(node.argumentList[i].visit(this), node.parameters[i].type.size);
      }
      var result = this._runBody(node.returnType, node.returnEPtr, node.body);
      return result;
    }
  }, {
    key: "visitReturn",
    value: function visitReturn(node) {
      throw new ReturnException(node.value ? node.value.visit(this) : null);
    }
  }, {
    key: "visitVariableDecl",
    value: function visitVariableDecl(node) {
      if (!node.ePtr.buffer) throw new Error("eptr without buffer in " + node);
      node.type.populateDefaultValue(node.ePtr.buffer, node.ePtr.offset);
      if (node.initializer) node.ePtr.copyFrom(node.initializer.visit(this), node.type.size);
    }
  }, {
    key: "visitAssignment",
    value: function visitAssignment(node) {
      var target = node.lhs.visit(this);
      var source = node.rhs.visit(this);
      target.copyFrom(source, node.type.size);
      return target;
    }
  }, {
    key: "visitIdentityExpression",
    value: function visitIdentityExpression(node) {
      return node.target.visit(this);
    }
  }, {
    key: "visitDereferenceExpression",
    value: function visitDereferenceExpression(node) {
      var ptr = node.ptr.visit(this).loadValue();
      if (!ptr) throw new WTrapError(node.origin.originString, "Null dereference");
      return ptr;
    }
  }, {
    key: "visitMakePtrExpression",
    value: function visitMakePtrExpression(node) {
      var ptr = node.lValue.visit(this);
      return node.ePtr.box(ptr);
    }
  }, {
    key: "visitMakeArrayRefExpression",
    value: function visitMakeArrayRefExpression(node) {
      return node.ePtr.box(new EArrayRef(node.lValue.visit(this), node.numElements.visit(this).loadValue()));
    }
  }, {
    key: "visitConvertPtrToArrayRefExpression",
    value: function visitConvertPtrToArrayRefExpression(node) {
      return node.ePtr.box(new EArrayRef(node.lValue.visit(this).loadValue(), 1));
    }
  }, {
    key: "visitCommaExpression",
    value: function visitCommaExpression(node) {
      var result;
      for (var expression of node.list) result = expression.visit(this);
      // This should almost snapshot, except that tail-returning a pointer is totally OK.
      return result;
    }
  }, {
    key: "visitVariableRef",
    value: function visitVariableRef(node) {
      return node.variable.ePtr;
    }
  }, {
    key: "visitGenericLiteral",
    value: function visitGenericLiteral(node) {
      return node.ePtr.box(node.valueForSelectedType);
    }
  }, {
    key: "visitNullLiteral",
    value: function visitNullLiteral(node) {
      return node.ePtr.box(null);
    }
  }, {
    key: "visitBoolLiteral",
    value: function visitBoolLiteral(node) {
      return node.ePtr.box(node.value);
    }
  }, {
    key: "visitEnumLiteral",
    value: function visitEnumLiteral(node) {
      return node.ePtr.box(node.member.value.unifyNode.valueForSelectedType);
    }
  }, {
    key: "visitLogicalNot",
    value: function visitLogicalNot(node) {
      var result = !node.operand.visit(this).loadValue();
      return node.ePtr.box(result);
    }
  }, {
    key: "visitLogicalExpression",
    value: function visitLogicalExpression(node) {
      var lhs = node.left.visit(this).loadValue();
      var rhs = node.right.visit(this).loadValue();
      var result;
      switch (node.text) {
        case "&&":
          result = lhs && rhs;
          break;
        case "||":
          result = lhs || rhs;
          break;
        default:
          throw new Error("Unknown type of logical expression");
      }
      return node.ePtr.box(result);
    }
  }, {
    key: "visitIfStatement",
    value: function visitIfStatement(node) {
      if (node.conditional.visit(this).loadValue()) return node.body.visit(this);else if (node.elseBody) return node.elseBody.visit(this);
    }
  }, {
    key: "visitWhileLoop",
    value: function visitWhileLoop(node) {
      while (node.conditional.visit(this).loadValue()) {
        try {
          node.body.visit(this);
        } catch (e) {
          if (e == BreakException) break;
          if (e == ContinueException) continue;
          throw e;
        }
      }
    }
  }, {
    key: "visitDoWhileLoop",
    value: function visitDoWhileLoop(node) {
      do {
        try {
          node.body.visit(this);
        } catch (e) {
          if (e == BreakException) break;
          if (e == ContinueException) continue;
          throw e;
        }
      } while (node.conditional.visit(this).loadValue());
    }
  }, {
    key: "visitForLoop",
    value: function visitForLoop(node) {
      for (node.initialization ? node.initialization.visit(this) : true; node.condition ? node.condition.visit(this).loadValue() : true; node.increment ? node.increment.visit(this) : true) {
        try {
          node.body.visit(this);
        } catch (e) {
          if (e == BreakException) break;
          if (e == ContinueException) continue;
          throw e;
        }
      }
    }
  }, {
    key: "visitSwitchStatement",
    value: function visitSwitchStatement(node) {
      var findAndRunCast = predicate => {
        for (var i = 0; i < node.switchCases.length; ++i) {
          var switchCase = node.switchCases[i];
          if (predicate(switchCase)) {
            try {
              for (var j = i; j < node.switchCases.length; ++j) node.switchCases[j].visit(this);
            } catch (e) {
              if (e != BreakException) throw e;
            }
            return true;
          }
        }
        return false;
      };
      var value = node.value.visit(this).loadValue();
      var found = findAndRunCast(switchCase => {
        if (switchCase.isDefault) return false;
        return node.type.unifyNode.valuesEqual(value, switchCase.value.unifyNode.valueForSelectedType);
      });
      if (found) return;
      found = findAndRunCast(switchCase => switchCase.isDefault);
      if (!found) throw new Error("Switch statement did not find case");
    }
  }, {
    key: "visitBreak",
    value: function visitBreak(node) {
      throw BreakException;
    }
  }, {
    key: "visitContinue",
    value: function visitContinue(node) {
      throw ContinueException;
    }
  }, {
    key: "visitTrapStatement",
    value: function visitTrapStatement(node) {
      throw new WTrapError(node.origin.originString, "Trap statement");
    }
  }, {
    key: "visitAnonymousVariable",
    value: function visitAnonymousVariable(node) {
      node.type.populateDefaultValue(node.ePtr.buffer, node.ePtr.offset);
    }
  }, {
    key: "visitCallExpression",
    value: function visitCallExpression(node) {
      var _this2 = this;
      // We evaluate inlined ASTs, so this can only be a native call.
      var callArguments = [];
      var _loop = function () {
        var argument = node.argumentList[i];
        var type = node.nativeFuncInstance.parameterTypes[i];
        if (!type || !argument) throw new Error("Cannot get type or argument; i = " + i + ", argument = " + argument + ", type = " + type + "; in " + node);
        var argumentValue = argument.visit(_this2);
        if (!argumentValue) throw new Error("Null argument value, i = " + i + ", node = " + node);
        callArguments.push(() => {
          var result = _this2._snapshot(type, null, argumentValue);
          return result;
        });
      };
      for (var i = 0; i < node.argumentList.length; ++i) {
        _loop();
      }

      // For simplicity, we allow intrinsics to just allocate new buffers, and we allocate new
      // buffers when snapshotting their arguments. This is not observable to the user, so it's OK.
      var result = EBuffer.allowAllocation(() => node.func.implementation(callArguments.map(thunk => thunk()), node));
      result = this._snapshot(node.nativeFuncInstance.returnType, node.resultEPtr, result);
      return result;
    }
  }]);
}(Visitor);

