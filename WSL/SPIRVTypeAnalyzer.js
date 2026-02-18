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
var SPIRVTypeAnalyzer = /*#__PURE__*/function (_Visitor) {
  function SPIRVTypeAnalyzer(program, typeMap, currentId) {
    var _this;
    _classCallCheck(this, SPIRVTypeAnalyzer);
    _this = _callSuper(this, SPIRVTypeAnalyzer);
    _this._program = program;
    _this._typeMap = typeMap;
    _this._currentId = currentId;
    _this._stack = [];
    return _this;
  }
  _inherits(SPIRVTypeAnalyzer, _Visitor);
  return _createClass(SPIRVTypeAnalyzer, [{
    key: "program",
    get: function () {
      this._program;
    }
  }, {
    key: "typeMap",
    get: function () {
      return this._typeMap;
    }
  }, {
    key: "currentId",
    get: function () {
      return this._currentId;
    }
  }, {
    key: "stack",
    get: function () {
      return this._stack;
    }
  }, {
    key: "visitTypeRef",
    value: function visitTypeRef(node) {
      node.type.visit(this);
    }
  }, {
    key: "_encounterType",
    value: function _encounterType(id) {
      if (this.stack.length > 0) this.stack[this.stack.length - 1].push(id);
    }
  }, {
    key: "visitNullType",
    value: function visitNullType(node) {
      _superPropGet(SPIRVTypeAnalyzer, "visit", this, 3)([this]);
    }
  }, {
    key: "visitGenericLiteralType",
    value: function visitGenericLiteralType(node) {
      node.type.visit(this);
    }
  }, {
    key: "visitNativeType",
    value: function visitNativeType(node) {
      if (!this.typeMap.has(node)) this.typeMap.set(node, this._currentId++);
      var id = this.typeMap.get(node);
      this._encounterType(id);
    }
  }, {
    key: "visitEnumType",
    value: function visitEnumType(node) {
      _superPropGet(SPIRVTypeAnalyzer, "visit", this, 3)([this]);
    }
  }, {
    key: "visitPtrType",
    value: function visitPtrType(node) {
      // Intentionally blank
    }
  }, {
    key: "visitArrayRefType",
    value: function visitArrayRefType(node) {
      this.visitNativeType(program.intrinsics.uint32);
      this.visitNativeType(program.intrinsics.uint32);
    }

    // FIXME: Using toString() in these functions is a hack. Instead, we should implement a proper type deduper.
  }, {
    key: "visitArrayType",
    value: function visitArrayType(node) {
      var id;
      if (this.typeMap.has(node.toString())) {
        id = this.typeMap.get(node);
        if (typeof id == "object") id = id.id;
      } else {
        var fieldType = [];
        this.stack.push(fieldType);
        node.elementType.visit(this);
        this.stack.pop();
        if (fieldType.length != 1) throw new Error("Arrays can only have one element type!");
        id = this._currentId++;
        node.numElements.visit(this);
        this.typeMap.set(node.toString(), {
          id: id,
          elementType: fieldType[0],
          numElements: node.numElements.value
        });
      }
      this._encounterType(id);
    }
  }, {
    key: "visitStructType",
    value: function visitStructType(node) {
      var id;
      if (this.typeMap.has(node.toString())) {
        id = this.typeMap.get(node.toString());
        if (typeof id == "object") id = id.id;
      } else {
        var fieldTypes = [];
        this.stack.push(fieldTypes);
        for (var field of node.fields) field.visit(this);
        this.stack.pop();
        id = this._currentId++;
        this.typeMap.set(node.toString(), {
          id: id,
          fieldTypes: fieldTypes
        });
      }
      this._encounterType(id);
    }
  }]);
}(Visitor);

