/*
 * Copyright (C) 2016 Apple Inc. All rights reserved.
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
var Liveness = /*#__PURE__*/function () {
  function Liveness(thing, code) {
    var _this = this;
    _classCallCheck(this, Liveness);
    this._thing = thing;
    this._code = code;
    this._liveAtHead = new Map();
    this._liveAtTail = new Map();
    var _loop = function () {
      _this._liveAtHead.set(block, new Set());
      var liveAtTail = new Set();
      _this._liveAtTail.set(block, liveAtTail);
      block.last.forEach(thing, (value, role, type, width) => {
        if (Arg.isLateUse(role)) liveAtTail.add(value);
      });
    };
    for (var block of code) {
      _loop();
    }
    var dirtyBlocks = new Set(code);
    var changed;
    do {
      changed = false;
      var _loop2 = function () {
          var block = code.at(blockIndex);
          if (!block) return 0; // continue
          if (!dirtyBlocks.delete(block)) return 0; // continue
          var localCalc = _this.localCalc(block);
          for (var instIndex = block.size; instIndex--;) localCalc.execute(instIndex);

          // Handle the early def's of the first instruction.
          block.at(0).forEach(thing, (value, role, type, width) => {
            if (Arg.isEarlyDef(role)) localCalc.liveSet.remove(value);
          });
          var liveAtHead = _this._liveAtHead.get(block);
          if (!mergeIntoSet(liveAtHead, localCalc.liveSet)) return 0; // continue
          for (var predecessor of block.predecessors) {
            if (mergeIntoSet(_this._liveAtTail.get(predecessor), liveAtHead)) {
              dirtyBlocks.add(predecessor);
              changed = true;
            }
          }
        },
        _ret;
      for (var blockIndex = code.size; blockIndex--;) {
        _ret = _loop2();
        if (_ret === 0) continue;
      }
    } while (changed);
  }
  return _createClass(Liveness, [{
    key: "thing",
    get: function () {
      return this._thing;
    }
  }, {
    key: "code",
    get: function () {
      return this._code;
    }
  }, {
    key: "liveAtHead",
    get: function () {
      return this._liveAtHead;
    }
  }, {
    key: "liveAtTail",
    get: function () {
      return this._liveAtTail;
    }
  }, {
    key: "localCalc",
    value: function localCalc(block) {
      var liveness = this;
      var LocalCalc = /*#__PURE__*/function () {
        function LocalCalc() {
          _classCallCheck(this, LocalCalc);
          this._liveSet = new Set(liveness.liveAtTail.get(block));
        }
        return _createClass(LocalCalc, [{
          key: "liveSet",
          get: function () {
            return this._liveSet;
          }
        }, {
          key: "execute",
          value: function execute(instIndex) {
            var inst = block.at(instIndex);

            // First handle the early defs of the next instruction.
            if (instIndex + 1 < block.size) {
              block.at(instIndex + 1).forEach(liveness.thing, (value, role, type, width) => {
                if (Arg.isEarlyDef(role)) this._liveSet.delete(value);
              });
            }

            // Then handle defs.
            inst.forEach(liveness.thing, (value, role, type, width) => {
              if (Arg.isLateDef(role)) this._liveSet.delete(value);
            });

            // Then handle uses.
            inst.forEach(liveness.thing, (value, role, type, width) => {
              if (Arg.isEarlyUse(role)) this._liveSet.add(value);
            });

            // Finally handle the late uses of the previous instruction.
            if (instIndex - 1 >= 0) {
              block.at(instIndex - 1).forEach(liveness.thing, (value, role, type, width) => {
                if (Arg.isLateUse(role)) this._liveSet.add(value);
              });
            }
          }
        }]);
      }();
      return new LocalCalc();
    }
  }]);
}();

