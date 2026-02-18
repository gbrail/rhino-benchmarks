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
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var LateChecker = /*#__PURE__*/function (_Visitor) {
  function LateChecker() {
    _classCallCheck(this, LateChecker);
    return _callSuper(this, LateChecker, arguments);
  }
  _inherits(LateChecker, _Visitor);
  return _createClass(LateChecker, [{
    key: "visitReferenceType",
    value: function visitReferenceType(node) {
      if (node.addressSpace == "thread") return;
      if (!node.elementType.isPrimitive) throw new WTypeError(node.origin.originString, "Illegal pointer to non-primitive type: " + node);
    }
  }, {
    key: "_checkShaderType",
    value: function _checkShaderType(node) {
      // FIXME: Tighten these checks. For now, we should only accept int32, uint32, float32, and float64.
      var assertPrimitive = type => {
        if (!type.isPrimitive) throw new WTypeError(node.origin.originString, "Shader signature cannot include non-primitive type: " + type);
      };
      assertPrimitive(node.returnType);
      if (!(node.returnType.unifyNode instanceof StructType)) throw new WTypeError(node.origin.originString, "Vertex shader " + node.name + " must return a struct.");
      switch (node.shaderType) {
        case "vertex":
          for (var parameter of node.parameters) {
            if (parameter.type.unifyNode instanceof StructType) assertPrimitive(parameter.type);else if (!parameter.type.unifyNode.isArrayRef) throw new WTypeError(node.origin.originString, node.name + " accepts a parameter " + parameter.name + " which isn't a struct and isn't an ArrayRef.");
          }
          break;
        case "fragment":
          for (var _parameter of node.parameters) {
            if (_parameter.name == "stageIn") {
              if (!(_parameter.type.unifyNode instanceof StructType)) throw new WTypeError(node.origin.originString, "Fragment entry points' stageIn parameter (of " + node.name + ") must be a struct type.");
              assertPrimitive(_parameter.type);
            } else {
              if (!_parameter.type.unifyNode.isArrayRef) throw new WTypeError(node.origin.originString, "Fragment entry point's " + _parameter.name + " parameter is not an array reference.");
            }
          }
          break;
        default:
          throw new Error("Bad shader type: " + node.shaderType);
      }
    }
  }, {
    key: "visitFuncDef",
    value: function visitFuncDef(node) {
      if (node.shaderType) this._checkShaderType(node);
      _superPropGet(LateChecker, "visitFuncDef", this, 3)([node]);
    }
  }]);
}(Visitor);

