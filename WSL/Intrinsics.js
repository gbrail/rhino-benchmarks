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
var Intrinsics = /*#__PURE__*/function () {
  function Intrinsics(nameContext) {
    _classCallCheck(this, Intrinsics);
    this._map = new Map();

    // NOTE: Intrinsic resolution happens before type name resolution, so the strings we use here
    // to catch the intrinsics must be based on the type names that StandardLibraryPrologue.js uses.
    // For example, if a native function is declared using "int" rather than "int32", then we must
    // use "int" here, since we don't yet know that they are the same type.

    this._map.set("native typedef void<>", type => {
      this.void = type;
      type.size = 0;
      type.populateDefaultValue = () => {};
    });
    function isBitwiseEquivalent(left, right) {
      var doubleArray = new Float64Array(1);
      var intArray = new Int32Array(doubleArray.buffer);
      doubleArray[0] = left;
      var leftInts = Int32Array.from(intArray);
      doubleArray[0] = right;
      for (var i = 0; i < 2; ++i) {
        if (leftInts[i] != intArray[i]) return false;
      }
      return true;
    }
    this._map.set("native typedef int32<>", type => {
      this.int32 = type;
      type.isPrimitive = true;
      type.isInt = true;
      type.isNumber = true;
      type.isSigned = true;
      type.canRepresent = value => isBitwiseEquivalent(value | 0, value);
      type.size = 1;
      type.defaultValue = 0;
      type.createLiteral = (origin, value) => IntLiteral.withType(origin, value | 0, type);
      type.successorValue = value => value + 1 | 0;
      type.valuesEqual = (a, b) => a === b;
      type.populateDefaultValue = (buffer, offset) => buffer.set(offset, 0);
      type.formatValueFromIntLiteral = value => value | 0;
      type.formatValueFromUintLiteral = value => value | 0;
      type.allValues = function* () {
        for (var i = 0; i <= 0xffffffff; ++i) {
          var value = i | 0;
          yield {
            value: value,
            name: value
          };
        }
      };
    });
    this._map.set("native typedef uint32<>", type => {
      this.uint32 = type;
      type.isPrimitive = true;
      type.isInt = true;
      type.isNumber = true;
      type.isSigned = false;
      type.canRepresent = value => isBitwiseEquivalent(value >>> 0, value);
      type.size = 1;
      type.defaultValue = 0;
      type.createLiteral = (origin, value) => IntLiteral.withType(origin, value >>> 0, type);
      type.successorValue = value => value + 1 >>> 0;
      type.valuesEqual = (a, b) => a === b;
      type.populateDefaultValue = (buffer, offset) => buffer.set(offset, 0);
      type.formatValueFromIntLiteral = value => value >>> 0;
      type.formatValueFromUintLiteral = value => value >>> 0;
      type.allValues = function* () {
        for (var i = 0; i <= 0xffffffff; ++i) yield {
          value: i,
          name: i
        };
      };
    });
    this._map.set("native typedef uint8<>", type => {
      this.uint8 = type;
      type.isInt = true;
      type.isNumber = true;
      type.isSigned = false;
      type.canRepresent = value => isBitwiseEquivalent(value & 0xff, value);
      type.size = 1;
      type.defaultValue = 0;
      type.createLiteral = (origin, value) => IntLiteral.withType(origin, value & 0xff, type);
      type.successorValue = value => value + 1 & 0xff;
      type.valuesEqual = (a, b) => a === b;
      type.populateDefaultValue = (buffer, offset) => buffer.set(offset, 0);
      type.formatValueFromIntLiteral = value => value & 0xff;
      type.formatValueFromUintLiteral = value => value & 0xff;
      type.allValues = function* () {
        for (var i = 0; i <= 0xff; ++i) yield {
          value: i,
          name: i
        };
      };
    });
    this._map.set("native typedef float32<>", type => {
      this.float = type;
      type.isPrimitive = true;
      type.size = 1;
      type.isFloating = true;
      type.isNumber = true;
      type.canRepresent = value => isBitwiseEquivalent(Math.fround(value), value);
      type.populateDefaultValue = (buffer, offset) => buffer.set(offset, 0);
      type.formatValueFromIntLiteral = value => value;
      type.formatValueFromUintLiteral = value => value;
      type.formatValueFromFloatLiteral = value => Math.fround(value);
      type.formatValueFromDoubleLiteral = value => Math.fround(value);
    });
    this._map.set("native typedef float64<>", type => {
      this.double = type;
      type.isPrimitive = true;
      type.size = 1;
      type.isFloating = true;
      type.isNumber = true;
      type.canRepresent = value => true;
      type.populateDefaultValue = (buffer, offset) => buffer.set(offset, 0);
      type.formatValueFromIntLiteral = value => value;
      type.formatValueFromUintLiteral = value => value;
      type.formatValueFromFloatLiteral = value => value;
      type.formatValueFromDoubleLiteral = value => value;
    });
    this._map.set("native typedef bool<>", type => {
      this.bool = type;
      type.isPrimitive = true;
      type.size = 1;
      type.populateDefaultValue = (buffer, offset) => buffer.set(offset, false);
    });
    this._map.set("native operator<> int32(uint32)", func => {
      func.implementation = _ref => {
        var [value] = _ref;
        return EPtr.box(value.loadValue() | 0);
      };
    });
    this._map.set("native operator<> int32(uint8)", func => {
      func.implementation = _ref2 => {
        var [value] = _ref2;
        return EPtr.box(value.loadValue() | 0);
      };
    });
    this._map.set("native operator<> int32(float)", func => {
      func.implementation = _ref3 => {
        var [value] = _ref3;
        return EPtr.box(value.loadValue() | 0);
      };
    });
    this._map.set("native operator<> int32(double)", func => {
      func.implementation = _ref4 => {
        var [value] = _ref4;
        return EPtr.box(value.loadValue() | 0);
      };
    });
    this._map.set("native operator<> uint32(int32)", func => {
      func.implementation = _ref5 => {
        var [value] = _ref5;
        return EPtr.box(value.loadValue() >>> 0);
      };
    });
    this._map.set("native operator<> uint32(uint8)", func => {
      func.implementation = _ref6 => {
        var [value] = _ref6;
        return EPtr.box(value.loadValue() >>> 0);
      };
    });
    this._map.set("native operator<> uint32(float)", func => {
      func.implementation = _ref7 => {
        var [value] = _ref7;
        return EPtr.box(value.loadValue() >>> 0);
      };
    });
    this._map.set("native operator<> uint32(double)", func => {
      func.implementation = _ref8 => {
        var [value] = _ref8;
        return EPtr.box(value.loadValue() >>> 0);
      };
    });
    this._map.set("native operator<> uint8(int32)", func => {
      func.implementation = _ref9 => {
        var [value] = _ref9;
        return EPtr.box(value.loadValue() & 0xff);
      };
    });
    this._map.set("native operator<> uint8(uint32)", func => {
      func.implementation = _ref0 => {
        var [value] = _ref0;
        return EPtr.box(value.loadValue() & 0xff);
      };
    });
    this._map.set("native operator<> uint8(float)", func => {
      func.implementation = _ref1 => {
        var [value] = _ref1;
        return EPtr.box(value.loadValue() & 0xff);
      };
    });
    this._map.set("native operator<> uint8(double)", func => {
      func.implementation = _ref10 => {
        var [value] = _ref10;
        return EPtr.box(value.loadValue() & 0xff);
      };
    });
    this._map.set("native operator<> float(double)", func => {
      func.implementation = _ref11 => {
        var [value] = _ref11;
        return EPtr.box(Math.fround(value.loadValue()));
      };
    });
    this._map.set("native operator<> float(int32)", func => {
      func.implementation = _ref12 => {
        var [value] = _ref12;
        return EPtr.box(Math.fround(value.loadValue()));
      };
    });
    this._map.set("native operator<> float(uint32)", func => {
      func.implementation = _ref13 => {
        var [value] = _ref13;
        return EPtr.box(Math.fround(value.loadValue()));
      };
    });
    this._map.set("native operator<> float(uint8)", func => {
      func.implementation = _ref14 => {
        var [value] = _ref14;
        return EPtr.box(Math.fround(value.loadValue()));
      };
    });
    this._map.set("native operator<> double(float)", func => {
      func.implementation = _ref15 => {
        var [value] = _ref15;
        return EPtr.box(value.loadValue());
      };
    });
    this._map.set("native operator<> double(int32)", func => {
      func.implementation = _ref16 => {
        var [value] = _ref16;
        return EPtr.box(value.loadValue());
      };
    });
    this._map.set("native operator<> double(uint32)", func => {
      func.implementation = _ref17 => {
        var [value] = _ref17;
        return EPtr.box(value.loadValue());
      };
    });
    this._map.set("native operator<> double(uint8)", func => {
      func.implementation = _ref18 => {
        var [value] = _ref18;
        return EPtr.box(value.loadValue());
      };
    });
    this._map.set("native int operator+<>(int,int)", func => {
      func.implementation = _ref19 => {
        var [left, right] = _ref19;
        return EPtr.box(left.loadValue() + right.loadValue() | 0);
      };
    });
    this._map.set("native uint operator+<>(uint,uint)", func => {
      func.implementation = _ref20 => {
        var [left, right] = _ref20;
        return EPtr.box(left.loadValue() + right.loadValue() >>> 0);
      };
    });
    this._map.set("native float operator+<>(float,float)", func => {
      func.implementation = _ref21 => {
        var [left, right] = _ref21;
        return EPtr.box(Math.fround(left.loadValue() + right.loadValue()));
      };
    });
    this._map.set("native double operator+<>(double,double)", func => {
      func.implementation = _ref22 => {
        var [left, right] = _ref22;
        return EPtr.box(left.loadValue() + right.loadValue());
      };
    });
    this._map.set("native int operator-<>(int,int)", func => {
      func.implementation = _ref23 => {
        var [left, right] = _ref23;
        return EPtr.box(left.loadValue() - right.loadValue() | 0);
      };
    });
    this._map.set("native uint operator-<>(uint,uint)", func => {
      func.implementation = _ref24 => {
        var [left, right] = _ref24;
        return EPtr.box(left.loadValue() - right.loadValue() >>> 0);
      };
    });
    this._map.set("native float operator-<>(float,float)", func => {
      func.implementation = _ref25 => {
        var [left, right] = _ref25;
        return EPtr.box(Math.fround(left.loadValue() - right.loadValue()));
      };
    });
    this._map.set("native double operator-<>(double,double)", func => {
      func.implementation = _ref26 => {
        var [left, right] = _ref26;
        return EPtr.box(left.loadValue() - right.loadValue());
      };
    });
    this._map.set("native int operator*<>(int,int)", func => {
      func.implementation = _ref27 => {
        var [left, right] = _ref27;
        return EPtr.box(left.loadValue() * right.loadValue() | 0);
      };
    });
    this._map.set("native uint operator*<>(uint,uint)", func => {
      func.implementation = _ref28 => {
        var [left, right] = _ref28;
        return EPtr.box(left.loadValue() * right.loadValue() >>> 0);
      };
    });
    this._map.set("native float operator*<>(float,float)", func => {
      func.implementation = _ref29 => {
        var [left, right] = _ref29;
        return EPtr.box(Math.fround(left.loadValue() * right.loadValue()));
      };
    });
    this._map.set("native double operator*<>(double,double)", func => {
      func.implementation = _ref30 => {
        var [left, right] = _ref30;
        return EPtr.box(left.loadValue() * right.loadValue());
      };
    });
    this._map.set("native int operator/<>(int,int)", func => {
      func.implementation = _ref31 => {
        var [left, right] = _ref31;
        return EPtr.box(left.loadValue() / right.loadValue() | 0);
      };
    });
    this._map.set("native uint operator/<>(uint,uint)", func => {
      func.implementation = _ref32 => {
        var [left, right] = _ref32;
        return EPtr.box(left.loadValue() / right.loadValue() >>> 0);
      };
    });
    this._map.set("native int operator&<>(int,int)", func => {
      func.implementation = _ref33 => {
        var [left, right] = _ref33;
        return EPtr.box(left.loadValue() & right.loadValue());
      };
    });
    this._map.set("native uint operator&<>(uint,uint)", func => {
      func.implementation = _ref34 => {
        var [left, right] = _ref34;
        return EPtr.box((left.loadValue() & right.loadValue()) >>> 0);
      };
    });
    this._map.set("native int operator|<>(int,int)", func => {
      func.implementation = _ref35 => {
        var [left, right] = _ref35;
        return EPtr.box(left.loadValue() | right.loadValue());
      };
    });
    this._map.set("native uint operator|<>(uint,uint)", func => {
      func.implementation = _ref36 => {
        var [left, right] = _ref36;
        return EPtr.box((left.loadValue() | right.loadValue()) >>> 0);
      };
    });
    this._map.set("native int operator^<>(int,int)", func => {
      func.implementation = _ref37 => {
        var [left, right] = _ref37;
        return EPtr.box(left.loadValue() ^ right.loadValue());
      };
    });
    this._map.set("native uint operator^<>(uint,uint)", func => {
      func.implementation = _ref38 => {
        var [left, right] = _ref38;
        return EPtr.box((left.loadValue() ^ right.loadValue()) >>> 0);
      };
    });
    this._map.set("native int operator<<<>(int,uint)", func => {
      func.implementation = _ref39 => {
        var [left, right] = _ref39;
        return EPtr.box(left.loadValue() << right.loadValue());
      };
    });
    this._map.set("native uint operator<<<>(uint,uint)", func => {
      func.implementation = _ref40 => {
        var [left, right] = _ref40;
        return EPtr.box(left.loadValue() << right.loadValue() >>> 0);
      };
    });
    this._map.set("native int operator>><>(int,uint)", func => {
      func.implementation = _ref41 => {
        var [left, right] = _ref41;
        return EPtr.box(left.loadValue() >> right.loadValue());
      };
    });
    this._map.set("native uint operator>><>(uint,uint)", func => {
      func.implementation = _ref42 => {
        var [left, right] = _ref42;
        return EPtr.box(left.loadValue() >>> right.loadValue());
      };
    });
    this._map.set("native int operator~<>(int)", func => {
      func.implementation = _ref43 => {
        var [value] = _ref43;
        return EPtr.box(~value.loadValue());
      };
    });
    this._map.set("native uint operator~<>(uint)", func => {
      func.implementation = _ref44 => {
        var [value] = _ref44;
        return EPtr.box(~value.loadValue() >>> 0);
      };
    });
    this._map.set("native float operator/<>(float,float)", func => {
      func.implementation = _ref45 => {
        var [left, right] = _ref45;
        return EPtr.box(Math.fround(left.loadValue() / right.loadValue()));
      };
    });
    this._map.set("native double operator/<>(double,double)", func => {
      func.implementation = _ref46 => {
        var [left, right] = _ref46;
        return EPtr.box(left.loadValue() / right.loadValue());
      };
    });
    this._map.set("native bool operator==<>(int,int)", func => {
      func.implementation = _ref47 => {
        var [left, right] = _ref47;
        return EPtr.box(left.loadValue() == right.loadValue());
      };
    });
    this._map.set("native bool operator==<>(uint,uint)", func => {
      func.implementation = _ref48 => {
        var [left, right] = _ref48;
        return EPtr.box(left.loadValue() == right.loadValue());
      };
    });
    this._map.set("native bool operator==<>(bool,bool)", func => {
      func.implementation = _ref49 => {
        var [left, right] = _ref49;
        return EPtr.box(left.loadValue() == right.loadValue());
      };
    });
    this._map.set("native bool operator==<>(float,float)", func => {
      func.implementation = _ref50 => {
        var [left, right] = _ref50;
        return EPtr.box(left.loadValue() == right.loadValue());
      };
    });
    this._map.set("native bool operator==<>(double,double)", func => {
      func.implementation = _ref51 => {
        var [left, right] = _ref51;
        return EPtr.box(left.loadValue() == right.loadValue());
      };
    });
    this._map.set("native bool operator<<>(int,int)", func => {
      func.implementation = _ref52 => {
        var [left, right] = _ref52;
        return EPtr.box(left.loadValue() < right.loadValue());
      };
    });
    this._map.set("native bool operator<<>(uint,uint)", func => {
      func.implementation = _ref53 => {
        var [left, right] = _ref53;
        return EPtr.box(left.loadValue() < right.loadValue());
      };
    });
    this._map.set("native bool operator<<>(float,float)", func => {
      func.implementation = _ref54 => {
        var [left, right] = _ref54;
        return EPtr.box(left.loadValue() < right.loadValue());
      };
    });
    this._map.set("native bool operator<<>(double,double)", func => {
      func.implementation = _ref55 => {
        var [left, right] = _ref55;
        return EPtr.box(left.loadValue() < right.loadValue());
      };
    });
    this._map.set("native bool operator<=<>(int,int)", func => {
      func.implementation = _ref56 => {
        var [left, right] = _ref56;
        return EPtr.box(left.loadValue() <= right.loadValue());
      };
    });
    this._map.set("native bool operator<=<>(uint,uint)", func => {
      func.implementation = _ref57 => {
        var [left, right] = _ref57;
        return EPtr.box(left.loadValue() <= right.loadValue());
      };
    });
    this._map.set("native bool operator<=<>(float,float)", func => {
      func.implementation = _ref58 => {
        var [left, right] = _ref58;
        return EPtr.box(left.loadValue() <= right.loadValue());
      };
    });
    this._map.set("native bool operator<=<>(double,double)", func => {
      func.implementation = _ref59 => {
        var [left, right] = _ref59;
        return EPtr.box(left.loadValue() <= right.loadValue());
      };
    });
    this._map.set("native bool operator><>(int,int)", func => {
      func.implementation = _ref60 => {
        var [left, right] = _ref60;
        return EPtr.box(left.loadValue() > right.loadValue());
      };
    });
    this._map.set("native bool operator><>(uint,uint)", func => {
      func.implementation = _ref61 => {
        var [left, right] = _ref61;
        return EPtr.box(left.loadValue() > right.loadValue());
      };
    });
    this._map.set("native bool operator><>(float,float)", func => {
      func.implementation = _ref62 => {
        var [left, right] = _ref62;
        return EPtr.box(left.loadValue() > right.loadValue());
      };
    });
    this._map.set("native bool operator><>(double,double)", func => {
      func.implementation = _ref63 => {
        var [left, right] = _ref63;
        return EPtr.box(left.loadValue() > right.loadValue());
      };
    });
    this._map.set("native bool operator>=<>(int,int)", func => {
      func.implementation = _ref64 => {
        var [left, right] = _ref64;
        return EPtr.box(left.loadValue() >= right.loadValue());
      };
    });
    this._map.set("native bool operator>=<>(uint,uint)", func => {
      func.implementation = _ref65 => {
        var [left, right] = _ref65;
        return EPtr.box(left.loadValue() >= right.loadValue());
      };
    });
    this._map.set("native bool operator>=<>(float,float)", func => {
      func.implementation = _ref66 => {
        var [left, right] = _ref66;
        return EPtr.box(left.loadValue() >= right.loadValue());
      };
    });
    this._map.set("native bool operator>=<>(double,double)", func => {
      func.implementation = _ref67 => {
        var [left, right] = _ref67;
        return EPtr.box(left.loadValue() >= right.loadValue());
      };
    });
    for (var addressSpace of addressSpaces) {
      this._map.set(`native T* ${addressSpace} operator&[]<T>(T[] ${addressSpace},uint)`, func => {
        func.implementation = (_ref68, node) => {
          var [ref, index] = _ref68;
          ref = ref.loadValue();
          if (!ref) throw new WTrapError(node.origin.originString, "Null dereference");
          index = index.loadValue();
          if (index > ref.length) throw new WTrapError(node.origin.originString, "Array index " + index + " is out of bounds of " + ref);
          return EPtr.box(ref.ptr.plus(index * node.instantiatedActualTypeArguments[0].size));
        };
      });
      this._map.set(`native uint operator.length<T>(T[] ${addressSpace})`, func => {
        func.implementation = (_ref69, node) => {
          var [ref] = _ref69;
          ref = ref.loadValue();
          if (!ref) return EPtr.box(0);
          return EPtr.box(ref.length);
        };
      });
    }
  }
  return _createClass(Intrinsics, [{
    key: "add",
    value: function add(thing) {
      var intrinsic = this._map.get(thing.toString());
      if (!intrinsic) throw new WTypeError(thing.origin.originString, "Unrecognized intrinsic: " + thing);
      intrinsic(thing);
    }
  }]);
}();

