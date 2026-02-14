function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * Copyright (C) 2022 Apple Inc. All rights reserved.
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
var Benchmark = /*#__PURE__*/function () {
  function Benchmark() {
    _classCallCheck(this, Benchmark);
    this._verbose = false;
    this._c1DecryptedIsCorrect = true;
    this._c2DecryptedIsCorrect = true;
    this._decryptedMulIsCorrect = true;
  }
  return _createClass(Benchmark, [{
    key: "runIteration",
    value: function runIteration() {
      var {
        publicKey,
        privateKey
      } = paillierBigint.generateRandomKeysSync(1024);
      var m1 = 12345678901234567890n;
      var m2 = 5n;
      var c1 = publicKey.encrypt(m1);
      var c1Decrypted = privateKey.decrypt(c1);
      this._c1DecryptedIsCorrect &&= c1Decrypted === 12345678901234567890n;
      var c2 = publicKey.encrypt(m2);
      var encryptedSum = publicKey.addition(c1, c2);
      var c2Decrypted = privateKey.decrypt(encryptedSum);
      this._c2DecryptedIsCorrect &&= c2Decrypted === 12345678901234567895n;
      var k = 10n;
      var encryptedMul = publicKey.multiply(c1, k);
      var decryptedMul = privateKey.decrypt(encryptedMul);
      this._decryptedMulIsCorrect &&= decryptedMul === 123456789012345678900n;
    }
  }, {
    key: "validate",
    value: function validate(iterations) {
      if (!this._c1DecryptedIsCorrect) throw new Error("Bad value: c1Decrypted!");
      if (!this._c2DecryptedIsCorrect) throw new Error("Bad value: c2Decrypted!");
      if (!this._decryptedMulIsCorrect) throw new Error("Bad value: decryptedMul!");
    }
  }]);
}();

