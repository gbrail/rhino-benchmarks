function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}
function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
function _call(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }
  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
}
function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }
        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }
    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }
    pact.s = state;
    pact.v = value;
    var observer = pact.o;
    if (observer) {
      observer(pact);
    }
  }
}
var _Pact = /*#__PURE__*/function () {
  function _Pact() {}
  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;
    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;
      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }
        return result;
      } else {
        return this;
      }
    }
    this.o = function (_this) {
      try {
        var value = _this.v;
        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };
    return result;
  };
  return _Pact;
}();
function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}
function _for(test, update, body) {
  var stage;
  for (;;) {
    var shouldContinue = test();
    if (_isSettledPact(shouldContinue)) {
      shouldContinue = shouldContinue.v;
    }
    if (!shouldContinue) {
      return result;
    }
    if (shouldContinue.then) {
      stage = 0;
      break;
    }
    var result = body();
    if (result && result.then) {
      if (_isSettledPact(result)) {
        result = result.s;
      } else {
        stage = 1;
        break;
      }
    }
    if (update) {
      var updateValue = update();
      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
        stage = 2;
        break;
      }
    }
  }
  var pact = new _Pact();
  var reject = _settle.bind(null, pact, 2);
  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
  return pact;
  function _resumeAfterBody(value) {
    result = value;
    do {
      if (update) {
        updateValue = update();
        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
          return;
        }
      }
      shouldContinue = test();
      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
        _settle(pact, 1, result);
        return;
      }
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        return;
      }
      result = body();
      if (_isSettledPact(result)) {
        result = result.v;
      }
    } while (!result || !result.then);
    result.then(_resumeAfterBody).then(void 0, reject);
  }
  function _resumeAfterTest(shouldContinue) {
    if (shouldContinue) {
      result = body();
      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
      } else {
        _resumeAfterBody(result);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
  function _resumeAfterUpdate() {
    if (shouldContinue = test()) {
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
      } else {
        _resumeAfterTest(shouldContinue);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
}
function _empty() {}
function _continueIgnored(value) {
  if (value && value.then) {
    return value.then(_empty);
  }
}
function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}
function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// The MIT License (MIT)

// Copyright (c) 2019 Paul Miller (https://paulmillr.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }
      return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
  }
  return r;
})()({
  1: [function (require, module, exports) {
    "use strict";

    /*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
    var getSharedSecret = function (privateKey, publicKey) {
      return _await(getExtendedPublicKey(privateKey), function (_ref2) {
        var {
          head
        } = _ref2;
        var u = Point.fromHex(publicKey).toX25519();
        return exports.curve25519.scalarMult(head, u);
      });
    };
    var verify = _async(function (sig, message, publicKey) {
      var {
        r,
        SB,
        msg,
        pub
      } = prepareVerification(sig, message, publicKey);
      return _await(exports.utils.sha512(r.toRawBytes(), pub.toRawBytes(), msg), function (hashed) {
        return finishVerification(pub, r, SB, hashed);
      });
    });
    var sign = _async(function (message, privateKey) {
      message = ensureBytes(message);
      return _await(getExtendedPublicKey(privateKey), function (_ref) {
        var {
          prefix,
          scalar,
          pointBytes
        } = _ref;
        return _await(exports.utils.sha512(prefix, message), function (_exports$utils$sha2) {
          var r = modlLE(_exports$utils$sha2);
          var R = Point.BASE.multiply(r);
          return _await(exports.utils.sha512(R.toRawBytes(), pointBytes, message), function (_exports$utils$sha3) {
            var k = modlLE(_exports$utils$sha3);
            var s = mod(r + k * scalar, CURVE.l);
            return new Signature(R, s).toRawBytes();
          });
        });
      });
    });
    var getPublicKey = function (privateKey) {
      return _await(getExtendedPublicKey(privateKey), function (_getExtendedPublicKey2) {
        return _getExtendedPublicKey2.pointBytes;
      });
    };
    var getExtendedPublicKey = _async(function (key) {
      return _await(exports.utils.sha512(checkPrivateKey(key)), getKeyFromHash);
    });
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.utils = exports.curve25519 = exports.getSharedSecret = exports.sync = exports.verify = exports.sign = exports.getPublicKey = exports.Signature = exports.Point = exports.RistrettoPoint = exports.ExtendedPoint = exports.CURVE = void 0;
    var nodeCrypto = require("crypto");
    var _0n = BigInt(0);
    var _1n = BigInt(1);
    var _2n = BigInt(2);
    var CU_O = BigInt('7237005577332262213973186563042994240857116359379907606001950938285454250989');
    var CURVE = Object.freeze({
      a: BigInt(-1),
      d: BigInt('37095705934669439343138083508754565189542113879843219016388785533085940283555'),
      P: BigInt('57896044618658097711785492504343953926634992332820282019728792003956564819949'),
      l: CU_O,
      n: CU_O,
      h: BigInt(8),
      Gx: BigInt('15112221349535400772501151409588531511454012693041857206046113283949847762202'),
      Gy: BigInt('46316835694926478169428394003475163141307993866256225615783033603165251855960')
    });
    exports.CURVE = CURVE;
    var POW_2_256 = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000');
    var SQRT_M1 = BigInt('19681161376707505956807079304988542015446066515923890162744021073123829784752');
    var SQRT_D = BigInt('6853475219497561581579357271197624642482790079785650197046958215289687604742');
    var SQRT_AD_MINUS_ONE = BigInt('25063068953384623474111414158702152701244531502492656460079210482610430750235');
    var INVSQRT_A_MINUS_D = BigInt('54469307008909316920995813868745141605393597292927456921205312896311721017578');
    var ONE_MINUS_D_SQ = BigInt('1159843021668779879193775521855586647937357759715417654439879720876111806838');
    var D_MINUS_ONE_SQ = BigInt('40440834346308536858101042469323190826248399146238708352240133220865137265952');
    var ExtendedPoint = /*#__PURE__*/function () {
      function ExtendedPoint(x, y, z, t) {
        _classCallCheck(this, ExtendedPoint);
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = t;
      }
      return _createClass(ExtendedPoint, [{
        key: "equals",
        value: function equals(other) {
          assertExtPoint(other);
          var {
            x: X1,
            y: Y1,
            z: Z1
          } = this;
          var {
            x: X2,
            y: Y2,
            z: Z2
          } = other;
          var X1Z2 = mod(X1 * Z2);
          var X2Z1 = mod(X2 * Z1);
          var Y1Z2 = mod(Y1 * Z2);
          var Y2Z1 = mod(Y2 * Z1);
          return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
        }
      }, {
        key: "negate",
        value: function negate() {
          return new ExtendedPoint(mod(-this.x), this.y, this.z, mod(-this.t));
        }
      }, {
        key: "double",
        value: function double() {
          var {
            x: X1,
            y: Y1,
            z: Z1
          } = this;
          var {
            a
          } = CURVE;
          var A = mod(X1 * X1);
          var B = mod(Y1 * Y1);
          var C = mod(_2n * mod(Z1 * Z1));
          var D = mod(a * A);
          var x1y1 = X1 + Y1;
          var E = mod(mod(x1y1 * x1y1) - A - B);
          var G = D + B;
          var F = G - C;
          var H = D - B;
          var X3 = mod(E * F);
          var Y3 = mod(G * H);
          var T3 = mod(E * H);
          var Z3 = mod(F * G);
          return new ExtendedPoint(X3, Y3, Z3, T3);
        }
      }, {
        key: "add",
        value: function add(other) {
          assertExtPoint(other);
          var {
            x: X1,
            y: Y1,
            z: Z1,
            t: T1
          } = this;
          var {
            x: X2,
            y: Y2,
            z: Z2,
            t: T2
          } = other;
          var A = mod((Y1 - X1) * (Y2 + X2));
          var B = mod((Y1 + X1) * (Y2 - X2));
          var F = mod(B - A);
          if (F === _0n) return this.double();
          var C = mod(Z1 * _2n * T2);
          var D = mod(T1 * _2n * Z2);
          var E = D + C;
          var G = B + A;
          var H = D - C;
          var X3 = mod(E * F);
          var Y3 = mod(G * H);
          var T3 = mod(E * H);
          var Z3 = mod(F * G);
          return new ExtendedPoint(X3, Y3, Z3, T3);
        }
      }, {
        key: "subtract",
        value: function subtract(other) {
          return this.add(other.negate());
        }
      }, {
        key: "precomputeWindow",
        value: function precomputeWindow(W) {
          var windows = 1 + 256 / W;
          var points = [];
          var p = this;
          var base = p;
          for (var window = 0; window < windows; window++) {
            base = p;
            points.push(base);
            for (var i = 1; i < 2 ** (W - 1); i++) {
              base = base.add(p);
              points.push(base);
            }
            p = base.double();
          }
          return points;
        }
      }, {
        key: "wNAF",
        value: function wNAF(n, affinePoint) {
          if (!affinePoint && this.equals(ExtendedPoint.BASE)) affinePoint = Point.BASE;
          var W = affinePoint && affinePoint._WINDOW_SIZE || 1;
          if (256 % W) {
            throw new Error('Point#wNAF: Invalid precomputation window, must be power of 2');
          }
          var precomputes = affinePoint && pointPrecomputes.get(affinePoint);
          if (!precomputes) {
            precomputes = this.precomputeWindow(W);
            if (affinePoint && W !== 1) {
              precomputes = ExtendedPoint.normalizeZ(precomputes);
              pointPrecomputes.set(affinePoint, precomputes);
            }
          }
          var p = ExtendedPoint.ZERO;
          var f = ExtendedPoint.ZERO;
          var windows = 1 + 256 / W;
          var windowSize = 2 ** (W - 1);
          var mask = BigInt(2 ** W - 1);
          var maxNumber = 2 ** W;
          var shiftBy = BigInt(W);
          for (var window = 0; window < windows; window++) {
            var offset = window * windowSize;
            var wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
              wbits -= maxNumber;
              n += _1n;
            }
            if (wbits === 0) {
              var pr = precomputes[offset];
              if (window % 2) pr = pr.negate();
              f = f.add(pr);
            } else {
              var cached = precomputes[offset + Math.abs(wbits) - 1];
              if (wbits < 0) cached = cached.negate();
              p = p.add(cached);
            }
          }
          return ExtendedPoint.normalizeZ([p, f])[0];
        }
      }, {
        key: "multiply",
        value: function multiply(scalar, affinePoint) {
          return this.wNAF(normalizeScalar(scalar, CURVE.l), affinePoint);
        }
      }, {
        key: "multiplyUnsafe",
        value: function multiplyUnsafe(scalar) {
          var n = normalizeScalar(scalar, CURVE.l, false);
          var G = ExtendedPoint.BASE;
          var P0 = ExtendedPoint.ZERO;
          if (n === _0n) return P0;
          if (this.equals(P0) || n === _1n) return this;
          if (this.equals(G)) return this.wNAF(n);
          var p = P0;
          var d = this;
          while (n > _0n) {
            if (n & _1n) p = p.add(d);
            d = d.double();
            n >>= _1n;
          }
          return p;
        }
      }, {
        key: "isSmallOrder",
        value: function isSmallOrder() {
          return this.multiplyUnsafe(CURVE.h).equals(ExtendedPoint.ZERO);
        }
      }, {
        key: "isTorsionFree",
        value: function isTorsionFree() {
          return this.multiplyUnsafe(CURVE.l).equals(ExtendedPoint.ZERO);
        }
      }, {
        key: "toAffine",
        value: function toAffine() {
          var invZ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : invert(this.z);
          var {
            x,
            y,
            z
          } = this;
          var ax = mod(x * invZ);
          var ay = mod(y * invZ);
          var zz = mod(z * invZ);
          if (zz !== _1n) throw new Error('invZ was invalid');
          return new Point(ax, ay);
        }
      }, {
        key: "fromRistrettoBytes",
        value: function fromRistrettoBytes() {
          legacyRist();
        }
      }, {
        key: "toRistrettoBytes",
        value: function toRistrettoBytes() {
          legacyRist();
        }
      }, {
        key: "fromRistrettoHash",
        value: function fromRistrettoHash() {
          legacyRist();
        }
      }], [{
        key: "fromAffine",
        value: function fromAffine(p) {
          if (!(p instanceof Point)) {
            throw new TypeError('ExtendedPoint#fromAffine: expected Point');
          }
          if (p.equals(Point.ZERO)) return ExtendedPoint.ZERO;
          return new ExtendedPoint(p.x, p.y, _1n, mod(p.x * p.y));
        }
      }, {
        key: "toAffineBatch",
        value: function toAffineBatch(points) {
          var toInv = invertBatch(points.map(p => p.z));
          return points.map((p, i) => p.toAffine(toInv[i]));
        }
      }, {
        key: "normalizeZ",
        value: function normalizeZ(points) {
          return this.toAffineBatch(points).map(this.fromAffine);
        }
      }]);
    }();
    exports.ExtendedPoint = ExtendedPoint;
    ExtendedPoint.BASE = new ExtendedPoint(CURVE.Gx, CURVE.Gy, _1n, mod(CURVE.Gx * CURVE.Gy));
    ExtendedPoint.ZERO = new ExtendedPoint(_0n, _1n, _1n, _0n);
    function assertExtPoint(other) {
      if (!(other instanceof ExtendedPoint)) throw new TypeError('ExtendedPoint expected');
    }
    function assertRstPoint(other) {
      if (!(other instanceof RistrettoPoint)) throw new TypeError('RistrettoPoint expected');
    }
    function legacyRist() {
      throw new Error('Legacy method: switch to RistrettoPoint');
    }
    var RistrettoPoint = /*#__PURE__*/function () {
      function RistrettoPoint(ep) {
        _classCallCheck(this, RistrettoPoint);
        this.ep = ep;
      }
      return _createClass(RistrettoPoint, [{
        key: "toRawBytes",
        value: function toRawBytes() {
          var {
            x,
            y,
            z,
            t
          } = this.ep;
          var u1 = mod(mod(z + y) * mod(z - y));
          var u2 = mod(x * y);
          var u2sq = mod(u2 * u2);
          var {
            value: invsqrt
          } = invertSqrt(mod(u1 * u2sq));
          var D1 = mod(invsqrt * u1);
          var D2 = mod(invsqrt * u2);
          var zInv = mod(D1 * D2 * t);
          var D;
          if (edIsNegative(t * zInv)) {
            var _x = mod(y * SQRT_M1);
            var _y = mod(x * SQRT_M1);
            x = _x;
            y = _y;
            D = mod(D1 * INVSQRT_A_MINUS_D);
          } else {
            D = D2;
          }
          if (edIsNegative(x * zInv)) y = mod(-y);
          var s = mod((z - y) * D);
          if (edIsNegative(s)) s = mod(-s);
          return numberTo32BytesLE(s);
        }
      }, {
        key: "toHex",
        value: function toHex() {
          return bytesToHex(this.toRawBytes());
        }
      }, {
        key: "toString",
        value: function toString() {
          return this.toHex();
        }
      }, {
        key: "equals",
        value: function equals(other) {
          assertRstPoint(other);
          var a = this.ep;
          var b = other.ep;
          var one = mod(a.x * b.y) === mod(a.y * b.x);
          var two = mod(a.y * b.y) === mod(a.x * b.x);
          return one || two;
        }
      }, {
        key: "add",
        value: function add(other) {
          assertRstPoint(other);
          return new RistrettoPoint(this.ep.add(other.ep));
        }
      }, {
        key: "subtract",
        value: function subtract(other) {
          assertRstPoint(other);
          return new RistrettoPoint(this.ep.subtract(other.ep));
        }
      }, {
        key: "multiply",
        value: function multiply(scalar) {
          return new RistrettoPoint(this.ep.multiply(scalar));
        }
      }, {
        key: "multiplyUnsafe",
        value: function multiplyUnsafe(scalar) {
          return new RistrettoPoint(this.ep.multiplyUnsafe(scalar));
        }
      }], [{
        key: "calcElligatorRistrettoMap",
        value: function calcElligatorRistrettoMap(r0) {
          var {
            d
          } = CURVE;
          var r = mod(SQRT_M1 * r0 * r0);
          var Ns = mod((r + _1n) * ONE_MINUS_D_SQ);
          var c = BigInt(-1);
          var D = mod((c - d * r) * mod(r + d));
          var {
            isValid: Ns_D_is_sq,
            value: s
          } = uvRatio(Ns, D);
          var s_ = mod(s * r0);
          if (!edIsNegative(s_)) s_ = mod(-s_);
          if (!Ns_D_is_sq) s = s_;
          if (!Ns_D_is_sq) c = r;
          var Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D);
          var s2 = s * s;
          var W0 = mod((s + s) * D);
          var W1 = mod(Nt * SQRT_AD_MINUS_ONE);
          var W2 = mod(_1n - s2);
          var W3 = mod(_1n + s2);
          return new ExtendedPoint(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
        }
      }, {
        key: "hashToCurve",
        value: function hashToCurve(hex) {
          hex = ensureBytes(hex, 64);
          var r1 = bytes255ToNumberLE(hex.slice(0, 32));
          var R1 = this.calcElligatorRistrettoMap(r1);
          var r2 = bytes255ToNumberLE(hex.slice(32, 64));
          var R2 = this.calcElligatorRistrettoMap(r2);
          return new RistrettoPoint(R1.add(R2));
        }
      }, {
        key: "fromHex",
        value: function fromHex(hex) {
          hex = ensureBytes(hex, 32);
          var {
            a,
            d
          } = CURVE;
          var emsg = 'RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint';
          var s = bytes255ToNumberLE(hex);
          if (!equalBytes(numberTo32BytesLE(s), hex) || edIsNegative(s)) throw new Error(emsg);
          var s2 = mod(s * s);
          var u1 = mod(_1n + a * s2);
          var u2 = mod(_1n - a * s2);
          var u1_2 = mod(u1 * u1);
          var u2_2 = mod(u2 * u2);
          var v = mod(a * d * u1_2 - u2_2);
          var {
            isValid,
            value: I
          } = invertSqrt(mod(v * u2_2));
          var Dx = mod(I * u2);
          var Dy = mod(I * Dx * v);
          var x = mod((s + s) * Dx);
          if (edIsNegative(x)) x = mod(-x);
          var y = mod(u1 * Dy);
          var t = mod(x * y);
          if (!isValid || edIsNegative(t) || y === _0n) throw new Error(emsg);
          return new RistrettoPoint(new ExtendedPoint(x, y, _1n, t));
        }
      }]);
    }();
    exports.RistrettoPoint = RistrettoPoint;
    RistrettoPoint.BASE = new RistrettoPoint(ExtendedPoint.BASE);
    RistrettoPoint.ZERO = new RistrettoPoint(ExtendedPoint.ZERO);
    var pointPrecomputes = new WeakMap();
    var Point = /*#__PURE__*/function () {
      function Point(x, y) {
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
      }
      return _createClass(Point, [{
        key: "_setWindowSize",
        value: function _setWindowSize(windowSize) {
          this._WINDOW_SIZE = windowSize;
          pointPrecomputes.delete(this);
        }
      }, {
        key: "toRawBytes",
        value: function toRawBytes() {
          var bytes = numberTo32BytesLE(this.y);
          bytes[31] |= this.x & _1n ? 0x80 : 0;
          return bytes;
        }
      }, {
        key: "toHex",
        value: function toHex() {
          return bytesToHex(this.toRawBytes());
        }
      }, {
        key: "toX25519",
        value: function toX25519() {
          var {
            y
          } = this;
          var u = mod((_1n + y) * invert(_1n - y));
          return numberTo32BytesLE(u);
        }
      }, {
        key: "isTorsionFree",
        value: function isTorsionFree() {
          return ExtendedPoint.fromAffine(this).isTorsionFree();
        }
      }, {
        key: "equals",
        value: function equals(other) {
          return this.x === other.x && this.y === other.y;
        }
      }, {
        key: "negate",
        value: function negate() {
          return new Point(mod(-this.x), this.y);
        }
      }, {
        key: "add",
        value: function add(other) {
          return ExtendedPoint.fromAffine(this).add(ExtendedPoint.fromAffine(other)).toAffine();
        }
      }, {
        key: "subtract",
        value: function subtract(other) {
          return this.add(other.negate());
        }
      }, {
        key: "multiply",
        value: function multiply(scalar) {
          return ExtendedPoint.fromAffine(this).multiply(scalar, this).toAffine();
        }
      }], [{
        key: "fromHex",
        value: function fromHex(hex) {
          var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          var {
            d,
            P
          } = CURVE;
          hex = ensureBytes(hex, 32);
          var normed = hex.slice();
          normed[31] = hex[31] & ~0x80;
          var y = bytesToNumberLE(normed);
          if (strict && y >= P) throw new Error('Expected 0 < hex < P');
          if (!strict && y >= POW_2_256) throw new Error('Expected 0 < hex < 2**256');
          var y2 = mod(y * y);
          var u = mod(y2 - _1n);
          var v = mod(d * y2 + _1n);
          var {
            isValid,
            value: x
          } = uvRatio(u, v);
          if (!isValid) throw new Error('Point.fromHex: invalid y coordinate');
          var isXOdd = (x & _1n) === _1n;
          var isLastByteOdd = (hex[31] & 0x80) !== 0;
          if (isLastByteOdd !== isXOdd) {
            x = mod(-x);
          }
          return new Point(x, y);
        }
      }, {
        key: "fromPrivateKey",
        value: function fromPrivateKey(privateKey) {
          return _await(getExtendedPublicKey(privateKey), function (_getExtendedPublicKey) {
            return _getExtendedPublicKey.point;
          });
        }
      }]);
    }();
    exports.Point = Point;
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
    Point.ZERO = new Point(_0n, _1n);
    var Signature = /*#__PURE__*/function () {
      function Signature(r, s) {
        _classCallCheck(this, Signature);
        this.r = r;
        this.s = s;
        this.assertValidity();
      }
      return _createClass(Signature, [{
        key: "assertValidity",
        value: function assertValidity() {
          var {
            r,
            s
          } = this;
          if (!(r instanceof Point)) throw new Error('Expected Point instance');
          normalizeScalar(s, CURVE.l, false);
          return this;
        }
      }, {
        key: "toRawBytes",
        value: function toRawBytes() {
          var u8 = new Uint8Array(64);
          u8.set(this.r.toRawBytes());
          u8.set(numberTo32BytesLE(this.s), 32);
          return u8;
        }
      }, {
        key: "toHex",
        value: function toHex() {
          return bytesToHex(this.toRawBytes());
        }
      }], [{
        key: "fromHex",
        value: function fromHex(hex) {
          var bytes = ensureBytes(hex, 64);
          var r = Point.fromHex(bytes.slice(0, 32), false);
          var s = bytesToNumberLE(bytes.slice(32, 64));
          return new Signature(r, s);
        }
      }]);
    }();
    exports.Signature = Signature;
    function concatBytes() {
      for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
        arrays[_key] = arguments[_key];
      }
      if (!arrays.every(a => a instanceof Uint8Array)) throw new Error('Expected Uint8Array list');
      if (arrays.length === 1) return arrays[0];
      var length = arrays.reduce((a, arr) => a + arr.length, 0);
      var result = new Uint8Array(length);
      for (var i = 0, pad = 0; i < arrays.length; i++) {
        var arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
      }
      return result;
    }
    var hexes = Array.from({
      length: 256
    }, (v, i) => i.toString(16).padStart(2, '0'));
    function bytesToHex(uint8a) {
      if (!(uint8a instanceof Uint8Array)) throw new Error('Uint8Array expected');
      var hex = '';
      for (var i = 0; i < uint8a.length; i++) {
        hex += hexes[uint8a[i]];
      }
      return hex;
    }
    function hexToBytes(hex) {
      if (typeof hex !== 'string') {
        throw new TypeError('hexToBytes: expected string, got ' + typeof hex);
      }
      if (hex.length % 2) throw new Error('hexToBytes: received invalid unpadded hex');
      var array = new Uint8Array(hex.length / 2);
      for (var i = 0; i < array.length; i++) {
        var j = i * 2;
        var hexByte = hex.slice(j, j + 2);
        var byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0) throw new Error('Invalid byte sequence');
        array[i] = byte;
      }
      return array;
    }
    function numberTo32BytesBE(num) {
      var length = 32;
      var hex = num.toString(16).padStart(length * 2, '0');
      return hexToBytes(hex);
    }
    function numberTo32BytesLE(num) {
      return numberTo32BytesBE(num).reverse();
    }
    function edIsNegative(num) {
      return (mod(num) & _1n) === _1n;
    }
    function bytesToNumberLE(uint8a) {
      if (!(uint8a instanceof Uint8Array)) throw new Error('Expected Uint8Array');
      return BigInt('0x' + bytesToHex(Uint8Array.from(uint8a).reverse()));
    }
    var MAX_255B = BigInt('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    function bytes255ToNumberLE(bytes) {
      return mod(bytesToNumberLE(bytes) & MAX_255B);
    }
    function mod(a) {
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : CURVE.P;
      var res = a % b;
      return res >= _0n ? res : b + res;
    }
    function invert(number) {
      var modulo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : CURVE.P;
      if (number === _0n || modulo <= _0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
      }
      var a = mod(number, modulo);
      var b = modulo;
      var x = _0n,
        y = _1n,
        u = _1n,
        v = _0n;
      while (a !== _0n) {
        var q = b / a;
        var r = b % a;
        var m = x - u * q;
        var n = y - v * q;
        b = a, a = r, x = u, y = v, u = m, v = n;
      }
      var gcd = b;
      if (gcd !== _1n) throw new Error('invert: does not exist');
      return mod(x, modulo);
    }
    function invertBatch(nums) {
      var p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : CURVE.P;
      var tmp = new Array(nums.length);
      var lastMultiplied = nums.reduce((acc, num, i) => {
        if (num === _0n) return acc;
        tmp[i] = acc;
        return mod(acc * num, p);
      }, _1n);
      var inverted = invert(lastMultiplied, p);
      nums.reduceRight((acc, num, i) => {
        if (num === _0n) return acc;
        tmp[i] = mod(acc * tmp[i], p);
        return mod(acc * num, p);
      }, inverted);
      return tmp;
    }
    function pow2(x, power) {
      var {
        P
      } = CURVE;
      var res = x;
      while (power-- > _0n) {
        res *= res;
        res %= P;
      }
      return res;
    }
    function pow_2_252_3(x) {
      var {
        P
      } = CURVE;
      var _5n = BigInt(5);
      var _10n = BigInt(10);
      var _20n = BigInt(20);
      var _40n = BigInt(40);
      var _80n = BigInt(80);
      var x2 = x * x % P;
      var b2 = x2 * x % P;
      var b4 = pow2(b2, _2n) * b2 % P;
      var b5 = pow2(b4, _1n) * x % P;
      var b10 = pow2(b5, _5n) * b5 % P;
      var b20 = pow2(b10, _10n) * b10 % P;
      var b40 = pow2(b20, _20n) * b20 % P;
      var b80 = pow2(b40, _40n) * b40 % P;
      var b160 = pow2(b80, _80n) * b80 % P;
      var b240 = pow2(b160, _80n) * b80 % P;
      var b250 = pow2(b240, _10n) * b10 % P;
      var pow_p_5_8 = pow2(b250, _2n) * x % P;
      return {
        pow_p_5_8,
        b2
      };
    }
    function uvRatio(u, v) {
      var v3 = mod(v * v * v);
      var v7 = mod(v3 * v3 * v);
      var pow = pow_2_252_3(u * v7).pow_p_5_8;
      var x = mod(u * v3 * pow);
      var vx2 = mod(v * x * x);
      var root1 = x;
      var root2 = mod(x * SQRT_M1);
      var useRoot1 = vx2 === u;
      var useRoot2 = vx2 === mod(-u);
      var noRoot = vx2 === mod(-u * SQRT_M1);
      if (useRoot1) x = root1;
      if (useRoot2 || noRoot) x = root2;
      if (edIsNegative(x)) x = mod(-x);
      return {
        isValid: useRoot1 || useRoot2,
        value: x
      };
    }
    function invertSqrt(number) {
      return uvRatio(_1n, number);
    }
    function modlLE(hash) {
      return mod(bytesToNumberLE(hash), CURVE.l);
    }
    function equalBytes(b1, b2) {
      if (b1.length !== b2.length) {
        return false;
      }
      for (var i = 0; i < b1.length; i++) {
        if (b1[i] !== b2[i]) {
          return false;
        }
      }
      return true;
    }
    function ensureBytes(hex, expectedLength) {
      var bytes = hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes(hex);
      if (typeof expectedLength === 'number' && bytes.length !== expectedLength) throw new Error(`Expected ${expectedLength} bytes`);
      return bytes;
    }
    function normalizeScalar(num, max) {
      var strict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!max) throw new TypeError('Specify max value');
      if (typeof num === 'number' && Number.isSafeInteger(num)) num = BigInt(num);
      if (typeof num === 'bigint' && num < max) {
        if (strict) {
          if (_0n < num) return num;
        } else {
          if (_0n <= num) return num;
        }
      }
      throw new TypeError('Expected valid scalar: 0 < scalar < max');
    }
    function adjustBytes25519(bytes) {
      bytes[0] &= 248;
      bytes[31] &= 127;
      bytes[31] |= 64;
      return bytes;
    }
    function decodeScalar25519(n) {
      return bytesToNumberLE(adjustBytes25519(ensureBytes(n, 32)));
    }
    function checkPrivateKey(key) {
      key = typeof key === 'bigint' || typeof key === 'number' ? numberTo32BytesBE(normalizeScalar(key, POW_2_256)) : ensureBytes(key);
      if (key.length !== 32) throw new Error(`Expected 32 bytes`);
      return key;
    }
    function getKeyFromHash(hashed) {
      var head = adjustBytes25519(hashed.slice(0, 32));
      var prefix = hashed.slice(32, 64);
      var scalar = modlLE(head);
      var point = Point.BASE.multiply(scalar);
      var pointBytes = point.toRawBytes();
      return {
        head,
        prefix,
        scalar,
        point,
        pointBytes
      };
    }
    var _sha512Sync;
    function sha512s() {
      if (typeof _sha512Sync !== 'function') throw new Error('utils.sha512Sync must be set to use sync methods');
      return _sha512Sync.apply(void 0, arguments);
    }
    function getExtendedPublicKeySync(key) {
      return getKeyFromHash(sha512s(checkPrivateKey(key)));
    }
    exports.getPublicKey = getPublicKey;
    function getPublicKeySync(privateKey) {
      return getExtendedPublicKeySync(privateKey).pointBytes;
    }
    exports.sign = sign;
    function signSync(message, privateKey) {
      message = ensureBytes(message);
      var {
        prefix,
        scalar,
        pointBytes
      } = getExtendedPublicKeySync(privateKey);
      var r = modlLE(sha512s(prefix, message));
      var R = Point.BASE.multiply(r);
      var k = modlLE(sha512s(R.toRawBytes(), pointBytes, message));
      var s = mod(r + k * scalar, CURVE.l);
      return new Signature(R, s).toRawBytes();
    }
    function prepareVerification(sig, message, publicKey) {
      message = ensureBytes(message);
      if (!(publicKey instanceof Point)) publicKey = Point.fromHex(publicKey, false);
      var {
        r,
        s
      } = sig instanceof Signature ? sig.assertValidity() : Signature.fromHex(sig);
      var SB = ExtendedPoint.BASE.multiplyUnsafe(s);
      return {
        r,
        s,
        SB,
        pub: publicKey,
        msg: message
      };
    }
    function finishVerification(publicKey, r, SB, hashed) {
      var k = modlLE(hashed);
      var kA = ExtendedPoint.fromAffine(publicKey).multiplyUnsafe(k);
      var RkA = ExtendedPoint.fromAffine(r).add(kA);
      return RkA.subtract(SB).multiplyUnsafe(CURVE.h).equals(ExtendedPoint.ZERO);
    }
    exports.verify = verify;
    function verifySync(sig, message, publicKey) {
      var {
        r,
        SB,
        msg,
        pub
      } = prepareVerification(sig, message, publicKey);
      var hashed = sha512s(r.toRawBytes(), pub.toRawBytes(), msg);
      return finishVerification(pub, r, SB, hashed);
    }
    exports.sync = {
      getExtendedPublicKey: getExtendedPublicKeySync,
      getPublicKey: getPublicKeySync,
      sign: signSync,
      verify: verifySync
    };
    exports.getSharedSecret = getSharedSecret;
    Point.BASE._setWindowSize(8);
    function cswap(swap, x_2, x_3) {
      var dummy = mod(swap * (x_2 - x_3));
      x_2 = mod(x_2 - dummy);
      x_3 = mod(x_3 + dummy);
      return [x_2, x_3];
    }
    function montgomeryLadder(pointU, scalar) {
      var {
        P
      } = CURVE;
      var u = normalizeScalar(pointU, P);
      var k = normalizeScalar(scalar, P);
      var a24 = BigInt(121665);
      var x_1 = u;
      var x_2 = _1n;
      var z_2 = _0n;
      var x_3 = u;
      var z_3 = _1n;
      var swap = _0n;
      var sw;
      for (var t = BigInt(255 - 1); t >= _0n; t--) {
        var k_t = k >> t & _1n;
        swap ^= k_t;
        sw = cswap(swap, x_2, x_3);
        x_2 = sw[0];
        x_3 = sw[1];
        sw = cswap(swap, z_2, z_3);
        z_2 = sw[0];
        z_3 = sw[1];
        swap = k_t;
        var A = x_2 + z_2;
        var AA = mod(A * A);
        var B = x_2 - z_2;
        var BB = mod(B * B);
        var E = AA - BB;
        var C = x_3 + z_3;
        var D = x_3 - z_3;
        var DA = mod(D * A);
        var CB = mod(C * B);
        var dacb = DA + CB;
        var da_cb = DA - CB;
        x_3 = mod(dacb * dacb);
        z_3 = mod(x_1 * mod(da_cb * da_cb));
        x_2 = mod(AA * BB);
        z_2 = mod(E * (AA + mod(a24 * E)));
      }
      sw = cswap(swap, x_2, x_3);
      x_2 = sw[0];
      x_3 = sw[1];
      sw = cswap(swap, z_2, z_3);
      z_2 = sw[0];
      z_3 = sw[1];
      var {
        pow_p_5_8,
        b2
      } = pow_2_252_3(z_2);
      var xp2 = mod(pow2(pow_p_5_8, BigInt(3)) * b2);
      return mod(x_2 * xp2);
    }
    function encodeUCoordinate(u) {
      return numberTo32BytesLE(mod(u, CURVE.P));
    }
    function decodeUCoordinate(uEnc) {
      var u = ensureBytes(uEnc, 32);
      u[31] &= 127;
      return bytesToNumberLE(u);
    }
    exports.curve25519 = {
      BASE_POINT_U: '0900000000000000000000000000000000000000000000000000000000000000',
      scalarMult(privateKey, publicKey) {
        var u = decodeUCoordinate(publicKey);
        var p = decodeScalar25519(privateKey);
        var pu = montgomeryLadder(u, p);
        if (pu === _0n) throw new Error('Invalid private or public key received');
        return encodeUCoordinate(pu);
      },
      scalarMultBase(privateKey) {
        return exports.curve25519.scalarMult(privateKey, exports.curve25519.BASE_POINT_U);
      }
    };
    var crypto = {
      node: undefined,
      web: typeof self === 'object' && 'crypto' in self ? self.crypto : undefined
    };
    exports.utils = {
      bytesToHex,
      hexToBytes,
      concatBytes,
      getExtendedPublicKey,
      mod,
      invert,
      TORSION_SUBGROUP: ['0100000000000000000000000000000000000000000000000000000000000000', 'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a', '0000000000000000000000000000000000000000000000000000000000000080', '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05', 'ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f', '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85', '0000000000000000000000000000000000000000000000000000000000000000', 'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa'],
      hashToPrivateScalar: hash => {
        hash = ensureBytes(hash);
        if (hash.length < 40 || hash.length > 1024) throw new Error('Expected 40-1024 bytes of private key as per FIPS 186');
        return mod(bytesToNumberLE(hash), CURVE.l - _1n) + _1n;
      },
      randomBytes: function () {
        var bytesLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
        if (crypto.web) {
          return crypto.web.getRandomValues(new Uint8Array(bytesLength));
        } else if (crypto.node) {
          var {
            randomBytes
          } = crypto.node;
          return new Uint8Array(randomBytes(bytesLength).buffer);
        } else {
          throw new Error("The environment doesn't have randomBytes function");
        }
      },
      randomPrivateKey: () => {
        return exports.utils.randomBytes(32);
      },
      sha512: _async(function () {
        var message = concatBytes.apply(void 0, arguments);
        if (crypto.web) {
          return _await(crypto.web.subtle.digest('SHA-512', message), function (buffer) {
            return new Uint8Array(buffer);
          });
        } else if (crypto.node) {
          return Uint8Array.from(crypto.node.createHash('sha512').update(message).digest());
        } else {
          throw new Error("The environment doesn't have sha512 function");
        }
      }),
      precompute() {
        var windowSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
        var point = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Point.BASE;
        var cached = point.equals(Point.BASE) ? point : new Point(point.x, point.y);
        cached._setWindowSize(windowSize);
        cached.multiply(_2n);
        return cached;
      },
      sha512Sync: undefined
    };
    Object.defineProperties(exports.utils, {
      sha512Sync: {
        configurable: false,
        get() {
          return _sha512Sync;
        },
        set(val) {
          if (!_sha512Sync) _sha512Sync = val;
        }
      }
    });
  }, {
    "crypto": 9
  }],
  2: [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.output = exports.exists = exports.hash = exports.bytes = exports.bool = exports.number = void 0;
    function number(n) {
      if (!Number.isSafeInteger(n) || n < 0) throw new Error(`Wrong positive integer: ${n}`);
    }
    exports.number = number;
    function bool(b) {
      if (typeof b !== 'boolean') throw new Error(`Expected boolean, not ${b}`);
    }
    exports.bool = bool;
    function bytes(b) {
      if (!(b instanceof Uint8Array)) throw new TypeError('Expected Uint8Array');
      for (var _len2 = arguments.length, lengths = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        lengths[_key2 - 1] = arguments[_key2];
      }
      if (lengths.length > 0 && !lengths.includes(b.length)) throw new TypeError(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
    }
    exports.bytes = bytes;
    function hash(hash) {
      if (typeof hash !== 'function' || typeof hash.create !== 'function') throw new Error('Hash should be wrapped by utils.wrapConstructor');
      number(hash.outputLen);
      number(hash.blockLen);
    }
    exports.hash = hash;
    function exists(instance) {
      var checkFinished = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (instance.destroyed) throw new Error('Hash instance has been destroyed');
      if (checkFinished && instance.finished) throw new Error('Hash#digest() has already been called');
    }
    exports.exists = exists;
    function output(out, instance) {
      bytes(out);
      var min = instance.outputLen;
      if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
      }
    }
    exports.output = output;
    var assert = {
      number,
      bool,
      bytes,
      hash,
      exists,
      output
    };
    exports.default = assert;
  }, {}],
  3: [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SHA2 = void 0;
    var _assert_js_1 = require("./_assert.js");
    var utils_js_1 = require("./utils.js");
    // Polyfill for Safari 14
    function setBigUint64(view, byteOffset, value, isLE) {
      if (typeof view.setBigUint64 === 'function') return view.setBigUint64(byteOffset, value, isLE);
      var _32n = BigInt(32);
      var _u32_max = BigInt(0xffffffff);
      var wh = Number(value >> _32n & _u32_max);
      var wl = Number(value & _u32_max);
      var h = isLE ? 4 : 0;
      var l = isLE ? 0 : 4;
      view.setUint32(byteOffset + h, wh, isLE);
      view.setUint32(byteOffset + l, wl, isLE);
    }
    // Base SHA2 class (RFC 6234)
    var SHA2 = /*#__PURE__*/function (_utils_js_1$Hash) {
      function SHA2(blockLen, outputLen, padOffset, isLE) {
        var _this;
        _classCallCheck(this, SHA2);
        _this = _callSuper(this, SHA2);
        _this.blockLen = blockLen;
        _this.outputLen = outputLen;
        _this.padOffset = padOffset;
        _this.isLE = isLE;
        _this.finished = false;
        _this.length = 0;
        _this.pos = 0;
        _this.destroyed = false;
        _this.buffer = new Uint8Array(blockLen);
        _this.view = (0, utils_js_1.createView)(_this.buffer);
        return _this;
      }
      _inherits(SHA2, _utils_js_1$Hash);
      return _createClass(SHA2, [{
        key: "update",
        value: function update(data) {
          _assert_js_1.default.exists(this);
          var {
            view,
            buffer,
            blockLen
          } = this;
          data = (0, utils_js_1.toBytes)(data);
          var len = data.length;
          for (var pos = 0; pos < len;) {
            var take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
              var dataView = (0, utils_js_1.createView)(data);
              for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
              continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
      }, {
        key: "digestInto",
        value: function digestInto(out) {
          _assert_js_1.default.exists(this);
          _assert_js_1.default.output(out, this);
          this.finished = true;
          // Padding
          // We can avoid allocation of buffer for padding completely if it
          // was previously not allocated here. But it won't change performance.
          var {
            buffer,
            view,
            blockLen,
            isLE
          } = this;
          var {
            pos
          } = this;
          // append the bit '1' to the message
          buffer[pos++] = 0b10000000;
          this.buffer.subarray(pos).fill(0);
          // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          // Pad until full block byte with zeros
          for (var i = pos; i < blockLen; i++) buffer[i] = 0;
          // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
          // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
          // So we just write lowest 64 bits of that value.
          setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
          this.process(view, 0);
          var oview = (0, utils_js_1.createView)(out);
          this.get().forEach((v, i) => oview.setUint32(4 * i, v, isLE));
        }
      }, {
        key: "digest",
        value: function digest() {
          var {
            buffer,
            outputLen
          } = this;
          this.digestInto(buffer);
          var res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
      }, {
        key: "_cloneInto",
        value: function _cloneInto(to) {
          var _to;
          to || (to = new this.constructor());
          (_to = to).set.apply(_to, _toConsumableArray(this.get()));
          var {
            blockLen,
            buffer,
            length,
            finished,
            destroyed,
            pos
          } = this;
          to.length = length;
          to.pos = pos;
          to.finished = finished;
          to.destroyed = destroyed;
          if (length % blockLen) to.buffer.set(buffer);
          return to;
        }
      }]);
    }(utils_js_1.Hash);
    exports.SHA2 = SHA2;
  }, {
    "./_assert.js": 2,
    "./utils.js": 7
  }],
  4: [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.add = exports.toBig = exports.split = exports.fromBig = void 0;
    var U32_MASK64 = BigInt(2 ** 32 - 1);
    var _32n = BigInt(32);
    // We are not using BigUint64Array, because they are extremely slow as per 2022
    function fromBig(n) {
      var le = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (le) return {
        h: Number(n & U32_MASK64),
        l: Number(n >> _32n & U32_MASK64)
      };
      return {
        h: Number(n >> _32n & U32_MASK64) | 0,
        l: Number(n & U32_MASK64) | 0
      };
    }
    exports.fromBig = fromBig;
    function split(lst) {
      var le = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var Ah = new Uint32Array(lst.length);
      var Al = new Uint32Array(lst.length);
      for (var i = 0; i < lst.length; i++) {
        var {
          h,
          l
        } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
      }
      return [Ah, Al];
    }
    exports.split = split;
    var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
    exports.toBig = toBig;
    // for Shift in [0, 32)
    var shrSH = (h, l, s) => h >>> s;
    var shrSL = (h, l, s) => h << 32 - s | l >>> s;
    // Right rotate for Shift in [1, 32)
    var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    // Right rotate for Shift in (32, 64), NOTE: 32 is special case.
    var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    // Right rotate for shift===32 (just swaps l&h)
    var rotr32H = (h, l) => l;
    var rotr32L = (h, l) => h;
    // Left rotate for Shift in [1, 32)
    var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    // Left rotate for Shift in (32, 64), NOTE: 32 is special case.
    var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    // JS uses 32-bit signed integers for bitwise operations which means we cannot
    // simple take carry out of low bit sum by shift, we need to use division.
    // Removing "export" has 5% perf penalty -_-
    function add(Ah, Al, Bh, Bl) {
      var l = (Al >>> 0) + (Bl >>> 0);
      return {
        h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
        l: l | 0
      };
    }
    exports.add = add;
    // Addition with more than 2 elements
    var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    // prettier-ignore
    var u64 = {
      fromBig,
      split,
      toBig: exports.toBig,
      shrSH,
      shrSL,
      rotrSH,
      rotrSL,
      rotrBH,
      rotrBL,
      rotr32H,
      rotr32L,
      rotlSH,
      rotlSL,
      rotlBH,
      rotlBL,
      add,
      add3L,
      add3H,
      add4L,
      add4H,
      add5H,
      add5L
    };
    exports.default = u64;
  }, {}],
  5: [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.crypto = {
      node: undefined,
      web: typeof self === 'object' && 'crypto' in self ? self.crypto : undefined
    };
  }, {}],
  6: [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.sha384 = exports.sha512_256 = exports.sha512 = exports.SHA512 = void 0;
    var _sha2_js_1 = require("./_sha2.js");
    var _u64_js_1 = require("./_u64.js");
    var utils_js_1 = require("./utils.js");
    // Round contants (first 32 bits of the fractional parts of the cube roots of the first 80 primes 2..409):
    // prettier-ignore
    var [SHA512_Kh, SHA512_Kl] = _u64_js_1.default.split(['0x428a2f98d728ae22', '0x7137449123ef65cd', '0xb5c0fbcfec4d3b2f', '0xe9b5dba58189dbbc', '0x3956c25bf348b538', '0x59f111f1b605d019', '0x923f82a4af194f9b', '0xab1c5ed5da6d8118', '0xd807aa98a3030242', '0x12835b0145706fbe', '0x243185be4ee4b28c', '0x550c7dc3d5ffb4e2', '0x72be5d74f27b896f', '0x80deb1fe3b1696b1', '0x9bdc06a725c71235', '0xc19bf174cf692694', '0xe49b69c19ef14ad2', '0xefbe4786384f25e3', '0x0fc19dc68b8cd5b5', '0x240ca1cc77ac9c65', '0x2de92c6f592b0275', '0x4a7484aa6ea6e483', '0x5cb0a9dcbd41fbd4', '0x76f988da831153b5', '0x983e5152ee66dfab', '0xa831c66d2db43210', '0xb00327c898fb213f', '0xbf597fc7beef0ee4', '0xc6e00bf33da88fc2', '0xd5a79147930aa725', '0x06ca6351e003826f', '0x142929670a0e6e70', '0x27b70a8546d22ffc', '0x2e1b21385c26c926', '0x4d2c6dfc5ac42aed', '0x53380d139d95b3df', '0x650a73548baf63de', '0x766a0abb3c77b2a8', '0x81c2c92e47edaee6', '0x92722c851482353b', '0xa2bfe8a14cf10364', '0xa81a664bbc423001', '0xc24b8b70d0f89791', '0xc76c51a30654be30', '0xd192e819d6ef5218', '0xd69906245565a910', '0xf40e35855771202a', '0x106aa07032bbd1b8', '0x19a4c116b8d2d0c8', '0x1e376c085141ab53', '0x2748774cdf8eeb99', '0x34b0bcb5e19b48a8', '0x391c0cb3c5c95a63', '0x4ed8aa4ae3418acb', '0x5b9cca4f7763e373', '0x682e6ff3d6b2b8a3', '0x748f82ee5defb2fc', '0x78a5636f43172f60', '0x84c87814a1f0ab72', '0x8cc702081a6439ec', '0x90befffa23631e28', '0xa4506cebde82bde9', '0xbef9a3f7b2c67915', '0xc67178f2e372532b', '0xca273eceea26619c', '0xd186b8c721c0c207', '0xeada7dd6cde0eb1e', '0xf57d4f7fee6ed178', '0x06f067aa72176fba', '0x0a637dc5a2c898a6', '0x113f9804bef90dae', '0x1b710b35131c471b', '0x28db77f523047d84', '0x32caab7b40c72493', '0x3c9ebe0a15c9bebc', '0x431d67c49c100d4c', '0x4cc5d4becb3e42b6', '0x597f299cfc657e2a', '0x5fcb6fab3ad6faec', '0x6c44198c4a475817'].map(n => BigInt(n)));
    // Temporary buffer, not used to store anything between runs
    var SHA512_W_H = new Uint32Array(80);
    var SHA512_W_L = new Uint32Array(80);
    var SHA512 = /*#__PURE__*/function (_sha2_js_1$SHA) {
      function SHA512() {
        var _this2;
        _classCallCheck(this, SHA512);
        _this2 = _callSuper(this, SHA512, [128, 64, 16, false]);
        // We cannot use array here since array allows indexing by variable which means optimizer/compiler cannot use registers.
        // Also looks cleaner and easier to verify with spec.
        // Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
        // h -- high 32 bits, l -- low 32 bits
        _this2.Ah = 0x6a09e667 | 0;
        _this2.Al = 0xf3bcc908 | 0;
        _this2.Bh = 0xbb67ae85 | 0;
        _this2.Bl = 0x84caa73b | 0;
        _this2.Ch = 0x3c6ef372 | 0;
        _this2.Cl = 0xfe94f82b | 0;
        _this2.Dh = 0xa54ff53a | 0;
        _this2.Dl = 0x5f1d36f1 | 0;
        _this2.Eh = 0x510e527f | 0;
        _this2.El = 0xade682d1 | 0;
        _this2.Fh = 0x9b05688c | 0;
        _this2.Fl = 0x2b3e6c1f | 0;
        _this2.Gh = 0x1f83d9ab | 0;
        _this2.Gl = 0xfb41bd6b | 0;
        _this2.Hh = 0x5be0cd19 | 0;
        _this2.Hl = 0x137e2179 | 0;
        return _this2;
      }
      // prettier-ignore
      _inherits(SHA512, _sha2_js_1$SHA);
      return _createClass(SHA512, [{
        key: "get",
        value: function get() {
          var {
            Ah,
            Al,
            Bh,
            Bl,
            Ch,
            Cl,
            Dh,
            Dl,
            Eh,
            El,
            Fh,
            Fl,
            Gh,
            Gl,
            Hh,
            Hl
          } = this;
          return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
        }
        // prettier-ignore
      }, {
        key: "set",
        value: function set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
          this.Ah = Ah | 0;
          this.Al = Al | 0;
          this.Bh = Bh | 0;
          this.Bl = Bl | 0;
          this.Ch = Ch | 0;
          this.Cl = Cl | 0;
          this.Dh = Dh | 0;
          this.Dl = Dl | 0;
          this.Eh = Eh | 0;
          this.El = El | 0;
          this.Fh = Fh | 0;
          this.Fl = Fl | 0;
          this.Gh = Gh | 0;
          this.Gl = Gl | 0;
          this.Hh = Hh | 0;
          this.Hl = Hl | 0;
        }
      }, {
        key: "process",
        value: function process(view, offset) {
          // Extend the first 16 words into the remaining 64 words w[16..79] of the message schedule array
          for (var i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32(offset += 4);
          }
          for (var _i = 16; _i < 80; _i++) {
            // s0 := (w[i-15] rightrotate 1) xor (w[i-15] rightrotate 8) xor (w[i-15] rightshift 7)
            var W15h = SHA512_W_H[_i - 15] | 0;
            var W15l = SHA512_W_L[_i - 15] | 0;
            var s0h = _u64_js_1.default.rotrSH(W15h, W15l, 1) ^ _u64_js_1.default.rotrSH(W15h, W15l, 8) ^ _u64_js_1.default.shrSH(W15h, W15l, 7);
            var s0l = _u64_js_1.default.rotrSL(W15h, W15l, 1) ^ _u64_js_1.default.rotrSL(W15h, W15l, 8) ^ _u64_js_1.default.shrSL(W15h, W15l, 7);
            // s1 := (w[i-2] rightrotate 19) xor (w[i-2] rightrotate 61) xor (w[i-2] rightshift 6)
            var W2h = SHA512_W_H[_i - 2] | 0;
            var W2l = SHA512_W_L[_i - 2] | 0;
            var s1h = _u64_js_1.default.rotrSH(W2h, W2l, 19) ^ _u64_js_1.default.rotrBH(W2h, W2l, 61) ^ _u64_js_1.default.shrSH(W2h, W2l, 6);
            var s1l = _u64_js_1.default.rotrSL(W2h, W2l, 19) ^ _u64_js_1.default.rotrBL(W2h, W2l, 61) ^ _u64_js_1.default.shrSL(W2h, W2l, 6);
            // SHA256_W[i] = s0 + s1 + SHA256_W[i - 7] + SHA256_W[i - 16];
            var SUMl = _u64_js_1.default.add4L(s0l, s1l, SHA512_W_L[_i - 7], SHA512_W_L[_i - 16]);
            var SUMh = _u64_js_1.default.add4H(SUMl, s0h, s1h, SHA512_W_H[_i - 7], SHA512_W_H[_i - 16]);
            SHA512_W_H[_i] = SUMh | 0;
            SHA512_W_L[_i] = SUMl | 0;
          }
          var {
            Ah,
            Al,
            Bh,
            Bl,
            Ch,
            Cl,
            Dh,
            Dl,
            Eh,
            El,
            Fh,
            Fl,
            Gh,
            Gl,
            Hh,
            Hl
          } = this;
          // Compression function main loop, 80 rounds
          for (var _i2 = 0; _i2 < 80; _i2++) {
            // S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
            var sigma1h = _u64_js_1.default.rotrSH(Eh, El, 14) ^ _u64_js_1.default.rotrSH(Eh, El, 18) ^ _u64_js_1.default.rotrBH(Eh, El, 41);
            var sigma1l = _u64_js_1.default.rotrSL(Eh, El, 14) ^ _u64_js_1.default.rotrSL(Eh, El, 18) ^ _u64_js_1.default.rotrBL(Eh, El, 41);
            //const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            var CHIh = Eh & Fh ^ ~Eh & Gh;
            var CHIl = El & Fl ^ ~El & Gl;
            // T1 = H + sigma1 + Chi(E, F, G) + SHA512_K[i] + SHA512_W[i]
            // prettier-ignore
            var T1ll = _u64_js_1.default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[_i2], SHA512_W_L[_i2]);
            var T1h = _u64_js_1.default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[_i2], SHA512_W_H[_i2]);
            var T1l = T1ll | 0;
            // S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
            var sigma0h = _u64_js_1.default.rotrSH(Ah, Al, 28) ^ _u64_js_1.default.rotrBH(Ah, Al, 34) ^ _u64_js_1.default.rotrBH(Ah, Al, 39);
            var sigma0l = _u64_js_1.default.rotrSL(Ah, Al, 28) ^ _u64_js_1.default.rotrBL(Ah, Al, 34) ^ _u64_js_1.default.rotrBL(Ah, Al, 39);
            var MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
            var MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({
              h: Eh,
              l: El
            } = _u64_js_1.default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            var All = _u64_js_1.default.add3L(T1l, sigma0l, MAJl);
            Ah = _u64_js_1.default.add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
          }
          // Add the compressed chunk to the current hash value
          ({
            h: Ah,
            l: Al
          } = _u64_js_1.default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
          ({
            h: Bh,
            l: Bl
          } = _u64_js_1.default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
          ({
            h: Ch,
            l: Cl
          } = _u64_js_1.default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
          ({
            h: Dh,
            l: Dl
          } = _u64_js_1.default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
          ({
            h: Eh,
            l: El
          } = _u64_js_1.default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
          ({
            h: Fh,
            l: Fl
          } = _u64_js_1.default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
          ({
            h: Gh,
            l: Gl
          } = _u64_js_1.default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
          ({
            h: Hh,
            l: Hl
          } = _u64_js_1.default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
          this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
        }
      }, {
        key: "roundClean",
        value: function roundClean() {
          SHA512_W_H.fill(0);
          SHA512_W_L.fill(0);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this.buffer.fill(0);
          this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
      }]);
    }(_sha2_js_1.SHA2);
    exports.SHA512 = SHA512;
    var SHA512_256 = /*#__PURE__*/function (_SHA) {
      function SHA512_256() {
        var _this3;
        _classCallCheck(this, SHA512_256);
        _this3 = _callSuper(this, SHA512_256);
        // h -- high 32 bits, l -- low 32 bits
        _this3.Ah = 0x22312194 | 0;
        _this3.Al = 0xfc2bf72c | 0;
        _this3.Bh = 0x9f555fa3 | 0;
        _this3.Bl = 0xc84c64c2 | 0;
        _this3.Ch = 0x2393b86b | 0;
        _this3.Cl = 0x6f53b151 | 0;
        _this3.Dh = 0x96387719 | 0;
        _this3.Dl = 0x5940eabd | 0;
        _this3.Eh = 0x96283ee2 | 0;
        _this3.El = 0xa88effe3 | 0;
        _this3.Fh = 0xbe5e1e25 | 0;
        _this3.Fl = 0x53863992 | 0;
        _this3.Gh = 0x2b0199fc | 0;
        _this3.Gl = 0x2c85b8aa | 0;
        _this3.Hh = 0x0eb72ddc | 0;
        _this3.Hl = 0x81c52ca2 | 0;
        _this3.outputLen = 32;
        return _this3;
      }
      _inherits(SHA512_256, _SHA);
      return _createClass(SHA512_256);
    }(SHA512);
    var SHA384 = /*#__PURE__*/function (_SHA2) {
      function SHA384() {
        var _this4;
        _classCallCheck(this, SHA384);
        _this4 = _callSuper(this, SHA384);
        // h -- high 32 bits, l -- low 32 bits
        _this4.Ah = 0xcbbb9d5d | 0;
        _this4.Al = 0xc1059ed8 | 0;
        _this4.Bh = 0x629a292a | 0;
        _this4.Bl = 0x367cd507 | 0;
        _this4.Ch = 0x9159015a | 0;
        _this4.Cl = 0x3070dd17 | 0;
        _this4.Dh = 0x152fecd8 | 0;
        _this4.Dl = 0xf70e5939 | 0;
        _this4.Eh = 0x67332667 | 0;
        _this4.El = 0xffc00b31 | 0;
        _this4.Fh = 0x8eb44a87 | 0;
        _this4.Fl = 0x68581511 | 0;
        _this4.Gh = 0xdb0c2e0d | 0;
        _this4.Gl = 0x64f98fa7 | 0;
        _this4.Hh = 0x47b5481d | 0;
        _this4.Hl = 0xbefa4fa4 | 0;
        _this4.outputLen = 48;
        return _this4;
      }
      _inherits(SHA384, _SHA2);
      return _createClass(SHA384);
    }(SHA512);
    exports.sha512 = (0, utils_js_1.wrapConstructor)(() => new SHA512());
    exports.sha512_256 = (0, utils_js_1.wrapConstructor)(() => new SHA512_256());
    exports.sha384 = (0, utils_js_1.wrapConstructor)(() => new SHA384());
  }, {
    "./_sha2.js": 3,
    "./_u64.js": 4,
    "./utils.js": 7
  }],
  7: [function (require, module, exports) {
    "use strict";

    /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
    // Returns control to thread each 'tick' ms to avoid blocking
    var asyncLoop = _async(function (iters, tick, cb) {
      var ts = Date.now();
      var i = 0;
      return _continueIgnored(_for(function () {
        return i < iters;
      }, function () {
        return i++;
      }, function () {
        cb(i);
        // Date.now() is not monotonic, so in case if clock goes backwards we return return control too
        var diff = Date.now() - ts;
        if (diff >= 0 && diff < tick) return;
        return _call((0, exports.nextTick), function () {
          ts += diff;
        });
      }));
    });
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.randomBytes = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.checkOpts = exports.Hash = exports.concatBytes = exports.toBytes = exports.utf8ToBytes = exports.asyncLoop = exports.nextTick = exports.hexToBytes = exports.bytesToHex = exports.isLE = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
    // The import here is via the package name. This is to ensure
    // that exports mapping/resolution does fall into place.
    var crypto_1 = require("@noble/hashes/crypto");
    // Cast array to different type
    var u8 = arr => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.u8 = u8;
    var u32 = arr => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
    exports.u32 = u32;
    // Cast array to view
    var createView = arr => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    exports.createView = createView;
    // The rotate right (circular right shift) operation for uint32
    var rotr = (word, shift) => word << 32 - shift | word >>> shift;
    exports.rotr = rotr;
    exports.isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
    // There is almost no big endian hardware, but js typed arrays uses platform specific endianness.
    // So, just to be sure not to corrupt anything.
    if (!exports.isLE) throw new Error('Non little-endian hardware is not supported');
    var hexes = Array.from({
      length: 256
    }, (v, i) => i.toString(16).padStart(2, '0'));
    /**
     * @example bytesToHex(Uint8Array.from([0xde, 0xad, 0xbe, 0xef]))
     */
    function bytesToHex(uint8a) {
      // pre-caching improves the speed 6x
      if (!(uint8a instanceof Uint8Array)) throw new Error('Uint8Array expected');
      var hex = '';
      for (var i = 0; i < uint8a.length; i++) {
        hex += hexes[uint8a[i]];
      }
      return hex;
    }
    exports.bytesToHex = bytesToHex;
    /**
     * @example hexToBytes('deadbeef')
     */
    function hexToBytes(hex) {
      if (typeof hex !== 'string') {
        throw new TypeError('hexToBytes: expected string, got ' + typeof hex);
      }
      if (hex.length % 2) throw new Error('hexToBytes: received invalid unpadded hex');
      var array = new Uint8Array(hex.length / 2);
      for (var i = 0; i < array.length; i++) {
        var j = i * 2;
        var hexByte = hex.slice(j, j + 2);
        var byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0) throw new Error('Invalid byte sequence');
        array[i] = byte;
      }
      return array;
    }
    exports.hexToBytes = hexToBytes;
    // There is no setImmediate in browser and setTimeout is slow. However, call to async function will return Promise
    // which will be fullfiled only on next scheduler queue processing step and this is exactly what we need.
    var nextTick = function () {
      return _await();
    };
    exports.nextTick = nextTick;
    exports.asyncLoop = asyncLoop;
    function utf8ToBytes(str) {
      if (typeof str !== 'string') {
        throw new TypeError(`utf8ToBytes expected string, got ${typeof str}`);
      }
      return new TextEncoder().encode(str);
    }
    exports.utf8ToBytes = utf8ToBytes;
    function toBytes(data) {
      if (typeof data === 'string') data = utf8ToBytes(data);
      if (!(data instanceof Uint8Array)) throw new TypeError(`Expected input type is Uint8Array (got ${typeof data})`);
      return data;
    }
    exports.toBytes = toBytes;
    /**
     * Concats Uint8Array-s into one; like `Buffer.concat([buf1, buf2])`
     * @example concatBytes(buf1, buf2)
     */
    function concatBytes() {
      for (var _len3 = arguments.length, arrays = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        arrays[_key3] = arguments[_key3];
      }
      if (!arrays.every(a => a instanceof Uint8Array)) throw new Error('Uint8Array list expected');
      if (arrays.length === 1) return arrays[0];
      var length = arrays.reduce((a, arr) => a + arr.length, 0);
      var result = new Uint8Array(length);
      for (var i = 0, pad = 0; i < arrays.length; i++) {
        var arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
      }
      return result;
    }
    exports.concatBytes = concatBytes;
    // For runtime check if class implements interface
    var Hash = /*#__PURE__*/function () {
      function Hash() {
        _classCallCheck(this, Hash);
      }
      return _createClass(Hash, [{
        key: "clone",
        value:
        // Safe version that clones internal state
        function clone() {
          return this._cloneInto();
        }
      }]);
    }();
    exports.Hash = Hash;
    // Check if object doens't have custom constructor (like Uint8Array/Array)
    var isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object;
    function checkOpts(defaults, opts) {
      if (opts !== undefined && (typeof opts !== 'object' || !isPlainObject(opts))) throw new TypeError('Options should be object or undefined');
      var merged = Object.assign(defaults, opts);
      return merged;
    }
    exports.checkOpts = checkOpts;
    function wrapConstructor(hashConstructor) {
      var hashC = message => hashConstructor().update(toBytes(message)).digest();
      var tmp = hashConstructor();
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = () => hashConstructor();
      return hashC;
    }
    exports.wrapConstructor = wrapConstructor;
    function wrapConstructorWithOpts(hashCons) {
      var hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
      var tmp = hashCons({});
      hashC.outputLen = tmp.outputLen;
      hashC.blockLen = tmp.blockLen;
      hashC.create = opts => hashCons(opts);
      return hashC;
    }
    exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
    /**
     * Secure PRNG
     */
    function randomBytes() {
      var bytesLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
      if (crypto_1.crypto.web) {
        return crypto_1.crypto.web.getRandomValues(new Uint8Array(bytesLength));
      } else if (crypto_1.crypto.node) {
        return new Uint8Array(crypto_1.crypto.node.randomBytes(bytesLength).buffer);
      } else {
        throw new Error("The environment doesn't have randomBytes function");
      }
    }
    exports.randomBytes = randomBytes;
  }, {
    "@noble/hashes/crypto": 5
  }],
  8: [function (require, module, exports) {
    var {
      sha512
    } = require('@noble/hashes/sha512');
    var ed = require('../../lib');
    globalThis.runNobleBenchmark = _async(function () {
      var x = 1;
      function to64Bytes(numOrStr) {
        var hex = typeof numOrStr === 'string' ? numOrStr : numOrStr.toString(16);
        return ed.utils.hexToBytes(hex.padStart(64, '0'));
      }
      ed.utils.precompute();
      var priv1bit = to64Bytes(2n);
      var priv = to64Bytes(0x9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60n);
      var msg = to64Bytes('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef');
      var pubHex, sigHex;
      var i = 0;
      return _continue(_for(function () {
        return i < 30 * x;
      }, function () {
        return i++;
      }, function () {
        return _await(ed.getPublicKey(priv1bit), function (_ed$getPublicKey) {
          pubHex = _ed$getPublicKey;
        });
      }), function () {
        var i = 0;
        return _continue(_for(function () {
          return i < 30 * x;
        }, function () {
          return i++;
        }, function () {
          return _await(ed.getPublicKey(ed.utils.randomPrivateKey()), function (_ed$getPublicKey2) {
            pubHex = _ed$getPublicKey2;
          });
        }), function () {
          var i = 0;
          return _continue(_for(function () {
            return i < 20 * x;
          }, function () {
            return i++;
          }, function () {
            return _await(ed.sign(msg, priv), function (_ed$sign) {
              sigHex = _ed$sign;
            });
          }), function () {
            var i = 0;
            return _continue(_for(function () {
              return i < 4 * x;
            }, function () {
              return i++;
            }, function () {
              return _awaitIgnored(ed.verify(sigHex, msg, pubHex));
            }), function () {
              var sigInst = ed.Signature.fromHex(sigHex);
              var pubInst = ed.Point.fromHex(pubHex);
              var i = 0;
              return _continue(_for(function () {
                return i < 5 * x;
              }, function () {
                return i++;
              }, function () {
                return _awaitIgnored(ed.verify(sigInst, msg, pubInst));
              }), function () {
                for (var i = 0; i < 65 * x; i++) {
                  ed.Point.fromHex(pubHex);
                }
                var encodingsOfSmallMultiples = [
                // This is the identity point
                '0000000000000000000000000000000000000000000000000000000000000000',
                // This is the basepoint
                'e2f2ae0a6abc4e71a884a961c500515f58e30b6aa582dd8db6a65945e08d2d76',
                // These are small multiples of the basepoint
                '6a493210f7499cd17fecb510ae0cea23a110e8d5b901f8acadd3095c73a3b919', '94741f5d5d52755ece4f23f044ee27d5d1ea1e2bd196b462166b16152a9d0259', 'da80862773358b466ffadfe0b3293ab3d9fd53c5ea6c955358f568322daf6a57', 'e882b131016b52c1d3337080187cf768423efccbb517bb495ab812c4160ff44e', 'f64746d3c92b13050ed8d80236a7f0007c3b3f962f5ba793d19a601ebb1df403', '44f53520926ec81fbd5a387845beb7df85a96a24ece18738bdcfa6a7822a176d', '903293d8f2287ebe10e2374dc1a53e0bc887e592699f02d077d5263cdd55601c', '02622ace8f7303a31cafc63f8fc48fdc16e1c8c8d234b2f0d6685282a9076031', '20706fd788b2720a1ed2a5dad4952b01f413bcf0e7564de8cdc816689e2db95f', 'bce83f8ba5dd2fa572864c24ba1810f9522bc6004afe95877ac73241cafdab42', 'e4549ee16b9aa03099ca208c67adafcafa4c3f3e4e5303de6026e3ca8ff84460', 'aa52e000df2e16f55fb1032fc33bc42742dad6bd5a8fc0be0167436c5948501f', '46376b80f409b29dc2b5f6f0c52591990896e5716f41477cd30085ab7f10301e', 'e0c418f7c8d9c4cdd7395b93ea124f3ad99021bb681dfc3302a9d99a2e53e64e'].map(n => ed.utils.hexToBytes(n));
                var hash = new Uint8Array([0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef]);
                for (var i = 0; i < 30 * x; i++) {
                  ed.RistrettoPoint.hashToCurve(hash);
                }
                for (var i = 0; i < 30 * x; i++) {
                  ed.RistrettoPoint.fromHex(encodingsOfSmallMultiples[2]).toHex();
                }
                for (var i = 0; i < 6 * x; i++) {
                  ed.curve25519.scalarMultBase('aeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef');
                }
                var i = 0;
                return _continue(_for(function () {
                  return i < 5 * x;
                }, function () {
                  return i++;
                }, function () {
                  return _awaitIgnored(ed.getSharedSecret(0x12345, 'aeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'));
                }), function () {
                  ed.utils.sha512Sync = function () {
                    var _ed$utils;
                    return sha512((_ed$utils = ed.utils).concatBytes.apply(_ed$utils, arguments));
                  };
                  var {
                    sync
                  } = ed;
                  for (var i = 0; i < 30 * x; i++) {
                    sync.getPublicKey(ed.utils.randomPrivateKey());
                  }
                  for (var i = 0; i < 20 * x; i++) {
                    sync.sign(msg, priv);
                  }
                  for (var i = 0; i < 4 * x; i++) {
                    sync.verify(sigHex, msg, pubHex);
                  }
                });
              });
            });
          });
        });
      });
    });
  }, {
    "../../lib": 1,
    "@noble/hashes/sha512": 6
  }],
  9: [function (require, module, exports) {}, {}]
}, {}, [8]);

