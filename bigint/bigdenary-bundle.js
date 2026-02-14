function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// MIT License

// Copyright (c) 2020 U-Zyn Chua <chua@uzyn.com>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

globalThis.BigDenary = function () {
  'use strict';

  function bigIntAbs(n) {
    if (n >= 0n) {
      return n;
    }
    return n * -1n;
  }
  function getDecimals(n) {
    if (isNaN(n)) {
      throw new Error("InvalidNumber");
    }
    var [preDec, postDec] = _splitString(n.toString(), ".");
    return postDec.length;
  }
  function extractExp(n) {
    var [mul, expStr] = _splitString(n, "e");
    if (expStr === "") {
      return [n, 0];
    }
    var exp = parseInt(expStr, 10);
    if (isNaN(exp)) {
      throw new Error("InvalidNumber");
    }
    return [mul, exp];
  }
  function countTrailingZeros(n, upTo) {
    if (n === 0n) {
      return 0;
    }
    var count = 0;
    var c = n < 0 ? n * -1n : n;
    while (c % 10n === 0n && count < upTo) {
      count += 1;
      c = c / 10n;
    }
    return count;
  }
  function _splitString(input, char) {
    var pos = input.indexOf(char);
    if (pos === -1) {
      return [input, ""];
    }
    var after = input.substr(pos + 1);
    if (after.indexOf(char) !== -1) {
      throw new Error("InvalidNumber"); // Multiple occurences
    }
    return [input.substr(0, pos), after];
  }
  var BDCompare = {
    Greater: 1,
    Less: -1,
    Equal: 0
  };
  var BigDenary = /*#__PURE__*/function () {
    function BigDenary(n) {
      _classCallCheck(this, BigDenary);
      if (n instanceof BigDenary) {
        this.base = n.base;
        this._decimals = n.decimals;
      } else if (typeof n === "number") {
        this._decimals = getDecimals(n);
        this.base = BigInt(n * Math.pow(10, this._decimals));
      } else if (typeof n === "string") {
        var [mul, exp] = extractExp(n);
        var mulDec = getDecimals(mul);
        if (exp > mulDec) {
          this.base = BigInt(mul.replace(".", "")) * BigInt(Math.pow(10, exp - mulDec));
          this._decimals = 0;
        } else {
          this.base = BigInt(mul.replace(".", ""));
          this._decimals = mulDec - exp;
        }
      } else if (typeof n === "bigint") {
        this.base = n * this.decimalMultiplier;
        this._decimals = 0;
      } else if (typeof n === "object" && n !== null) {
        if (n.decimals < 0) {
          throw new Error("InvalidBigDenaryRaw");
        }
        this.base = n.base;
        this._decimals = n.decimals;
      } else {
        throw new Error("UnsupportedInput");
      }
      this.trimTrailingZeros();
    }
    return _createClass(BigDenary, [{
      key: "toString",
      value: function toString() {
        if (this.base === 0n) {
          return "0";
        }
        var negative = this.base < 0;
        var base = this.base;
        if (negative) {
          base = base * -1n;
        }
        var baseStr = base.toString();
        var position = baseStr.length - this._decimals;
        var pre;
        var post;
        if (position < 0) {
          pre = "";
          post = `${_strOfZeros(position * -1)}${baseStr}`;
        } else {
          pre = baseStr.substr(0, position);
          post = baseStr.substr(position);
        }
        var result;
        if (pre.length === 0) {
          result = `0.${post}`;
        } else if (post.length === 0) {
          result = `${pre}`;
        } else {
          result = `${pre}.${post}`;
        }
        if (negative) {
          return `-${result}`;
        }
        return result;
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        return Number.parseFloat(this.toString());
      }
    }, {
      key: "toFixed",
      value: function toFixed(digits) {
        if (!digits) {
          return this.toString();
        }
        var temp = new BigDenary(this);
        temp.scaleDecimalsTo(digits);
        return temp.toString();
      }
    }, {
      key: "decimals",
      get: function () {
        return this._decimals;
      }
      /**
       * Alters the decimal places, actual underlying value does not change
       */
    }, {
      key: "scaleDecimalsTo",
      value: function scaleDecimalsTo(_decimals) {
        if (_decimals > this._decimals) {
          this.base = this.base * BigDenary.getDecimalMultiplier(_decimals - this._decimals);
        } else if (_decimals < this._decimals) {
          var adjust = this._decimals - _decimals;
          var multiplier = BigDenary.getDecimalMultiplier(adjust);
          var remainder = this.base % multiplier;
          this.base = this.base / multiplier;
          if (bigIntAbs(remainder * 2n) >= multiplier) {
            if (this.base >= 0) {
              this.base += 1n;
            } else {
              this.base -= 1n;
            }
          }
        }
        this._decimals = _decimals;
      }
    }, {
      key: "decimalMultiplier",
      get: function () {
        return BigDenary.getDecimalMultiplier(this._decimals);
      }
    }, {
      key: "trimTrailingZeros",
      value: function trimTrailingZeros() {
        var trailingZerosCount = countTrailingZeros(this.base, this.decimals);
        if (trailingZerosCount > 0) {
          this.scaleDecimalsTo(this.decimals - trailingZerosCount);
        }
      }
      /**
       * Operations
       */
    }, {
      key: "plus",
      value: function plus(operand) {
        var curr = new BigDenary(this);
        var oper = new BigDenary(operand);
        var targetDecs = Math.max(curr.decimals, oper.decimals);
        curr.scaleDecimalsTo(targetDecs);
        oper.scaleDecimalsTo(targetDecs);
        return new BigDenary({
          base: curr.base + oper.base,
          decimals: targetDecs
        });
      }
    }, {
      key: "minus",
      value: function minus(operand) {
        return this.plus(new BigDenary(operand).negated());
      }
    }, {
      key: "multipliedBy",
      value: function multipliedBy(operand) {
        var curr = new BigDenary(this);
        var oper = new BigDenary(operand);
        var targetDecs = curr.decimals + oper.decimals;
        return new BigDenary({
          base: curr.base * oper.base,
          decimals: targetDecs
        });
      }
    }, {
      key: "dividedBy",
      value: function dividedBy(operand) {
        var MIN_DIVIDE_DECIMALS = 20;
        var curr = new BigDenary(this);
        var oper = new BigDenary(operand);
        var targetDecs = Math.max(curr.decimals * 2, oper.decimals * 2, MIN_DIVIDE_DECIMALS);
        curr.scaleDecimalsTo(targetDecs);
        return new BigDenary({
          base: curr.base / oper.base,
          decimals: curr.decimals - oper.decimals
        });
      }
    }, {
      key: "negated",
      value: function negated() {
        return new BigDenary({
          base: this.base * -1n,
          decimals: this.decimals
        });
      }
    }, {
      key: "absoluteValue",
      value: function absoluteValue() {
        if (this.base >= 0n) {
          return this;
        }
        return this.negated();
      }
      /**
       * Comparisons
       */
    }, {
      key: "comparedTo",
      value: function comparedTo(comparator) {
        var curr = new BigDenary(this);
        var comp = new BigDenary(comparator);
        var targetDecs = Math.max(curr.decimals, comp.decimals);
        curr.scaleDecimalsTo(targetDecs);
        comp.scaleDecimalsTo(targetDecs);
        if (curr.base > comp.base) {
          return BDCompare.Greater;
        } else if (curr.base < comp.base) {
          return BDCompare.Less;
        }
        return BDCompare.Equal;
      }
    }, {
      key: "equals",
      value: function equals(comparator) {
        return this.comparedTo(comparator) === BDCompare.Equal;
      }
    }, {
      key: "greaterThan",
      value: function greaterThan(comparator) {
        return this.comparedTo(comparator) === BDCompare.Greater;
      }
    }, {
      key: "greaterThanOrEqualTo",
      value: function greaterThanOrEqualTo(comparator) {
        return this.comparedTo(comparator) === BDCompare.Greater || this.comparedTo(comparator) === BDCompare.Equal;
      }
    }, {
      key: "lessThan",
      value: function lessThan(comparator) {
        return this.comparedTo(comparator) === BDCompare.Less;
      }
    }, {
      key: "lessThanOrEqualTo",
      value: function lessThanOrEqualTo(comparator) {
        return this.comparedTo(comparator) === BDCompare.Less || this.comparedTo(comparator) === BDCompare.Equal;
      }
      /**
       * Shortforms
       */
    }, {
      key: "add",
      value: function add(operand) {
        return this.plus(operand);
      }
    }, {
      key: "sub",
      value: function sub(operand) {
        return this.minus(operand);
      }
    }, {
      key: "mul",
      value: function mul(operand) {
        return this.multipliedBy(operand);
      }
    }, {
      key: "div",
      value: function div(operand) {
        return this.dividedBy(operand);
      }
    }, {
      key: "neg",
      value: function neg() {
        return this.negated();
      }
    }, {
      key: "abs",
      value: function abs() {
        return this.absoluteValue();
      }
    }, {
      key: "cmp",
      value: function cmp(comparator) {
        return this.comparedTo(comparator);
      }
    }, {
      key: "eq",
      value: function eq(comparator) {
        return this.equals(comparator);
      }
    }, {
      key: "gt",
      value: function gt(comparator) {
        return this.greaterThan(comparator);
      }
    }, {
      key: "gte",
      value: function gte(comparator) {
        return this.greaterThanOrEqualTo(comparator);
      }
    }, {
      key: "lt",
      value: function lt(comparator) {
        return this.lessThan(comparator);
      }
    }, {
      key: "lte",
      value: function lte(comparator) {
        return this.lessThanOrEqualTo(comparator);
      }
    }], [{
      key: "getDecimalMultiplier",
      value: function getDecimalMultiplier(decimals) {
        return 10n ** BigInt(decimals);
      }
    }]);
  }();
  function _strOfZeros(count) {
    return "0".repeat(count);
  }
  BigDenary.BDCompare = BDCompare;
  return BigDenary;
}();

