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
var StructType = /*#__PURE__*/function (_Type) {
  function StructType(origin, name, typeParameters) {
    var _this;
    _classCallCheck(this, StructType);
    _this = _callSuper(this, StructType);
    _this._origin = origin;
    _this._name = name;
    _this._typeParameters = typeParameters;
    _this._fields = new Map();
    return _this;
  }
  _inherits(StructType, _Type);
  return _createClass(StructType, [{
    key: "add",
    value: function add(field) {
      field.struct = this;
      if (this._fields.has(field.name)) throw new WTypeError(field.origin.originString, "Duplicate field name: " + field.name);
      this._fields.set(field.name, field);
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }, {
    key: "origin",
    get: function () {
      return this._origin;
    }
  }, {
    key: "typeParameters",
    get: function () {
      return this._typeParameters;
    }
  }, {
    key: "fieldNames",
    get: function () {
      return this._fields.keys();
    }
  }, {
    key: "fieldByName",
    value: function fieldByName(name) {
      return this._fields.get(name);
    }
  }, {
    key: "fields",
    get: function () {
      return this._fields.values();
    }
  }, {
    key: "fieldMap",
    get: function () {
      return this._fields;
    }
  }, {
    key: "isPrimitive",
    get: function () {
      var result = true;
      for (var field of this.fields) result &= field.type.isPrimitive;
      return result;
    }
  }, {
    key: "instantiate",
    value: function instantiate() {
      var typeArguments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var substitution = null;
      var typeParameters = this.typeParameters;
      if (typeArguments) {
        if (typeArguments.length != this.typeParameters.length) throw new WTypeError(this.origin.originString, "Wrong number of type arguments to instantiation");
        substitution = new Substitution(this.typeParameters, typeArguments);
        typeParameters = [];
      }
      var instantiateImmediates = new InstantiateImmediates();
      var result = new StructType(this.origin, this.name, typeParameters);
      for (var field of this.fields) {
        var newField = field;
        if (substitution) newField = newField.visit(substitution);
        newField = newField.visit(instantiateImmediates);
        result.add(newField);
      }
      return result;
    }
  }, {
    key: "populateDefaultValue",
    value: function populateDefaultValue(buffer, offset) {
      if (this.size == null) throw new Error("Struct does not have layout: " + this + " " + describe(this));
      for (var field of this.fields) field.type.populateDefaultValue(buffer, offset + field.offset);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "struct " + this.name + "<" + this.typeParameters + "> { " + Array.from(this.fields).join("; ") + "; }";
    }
  }]);
}(Type);

