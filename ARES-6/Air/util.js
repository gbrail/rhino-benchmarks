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

function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function isRepresentableAsInt32(value) {
  return (value | 0) === value;
}
function addIndexed(list, cons) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  var result = _construct(cons, [list.length].concat(args));
  list.push(result);
  return result;
}
var stackAlignmentBytes = 16;
function roundUpToMultipleOf(amount, value) {
  return Math.ceil(value / amount) * amount;
}
function symbolName(symbol) {
  var fullString = symbol.toString();
  return fullString.substring("Symbol(".length, fullString.length - ")".length);
}
function lowerSymbolName(symbol) {
  return symbolName(symbol).toLowerCase();
}
function setToString(set) {
  var result = "";
  for (var value of set) {
    if (result) result += ", ";
    result += value;
  }
  return result;
}
function mergeIntoSet(target, source) {
  var didAdd = false;
  for (var value of source) {
    if (target.has(value)) continue;
    target.add(value);
    didAdd = true;
  }
  return didAdd;
}
function nonEmptyRangesOverlap(leftMin, leftMax, rightMin, rightMax) {
  if (leftMin >= leftMax) throw new Error("Bad left range");
  if (rightMin >= rightMax) throw new Error("Bad right range");
  if (leftMin <= rightMin && leftMax > rightMin) return true;
  if (rightMin <= leftMin && rightMax > leftMin) return true;
  return false;
}
function rangesOverlap(leftMin, leftMax, rightMin, rightMax) {
  if (leftMin > leftMax) throw new Error("Bad left range");
  if (rightMin > rightMax) throw new Error("Bad right range");
  if (leftMin == leftMax) return false;
  if (rightMin == rightMax) return false;
  return nonEmptyRangesOverlap(leftMin, leftMax, rightMin, rightMax);
}
function removeAllMatching(array, func) {
  var srcIndex = 0;
  var dstIndex = 0;
  while (srcIndex < array.length) {
    var value = array[srcIndex++];
    if (!func(value)) array[dstIndex++] = value;
  }
  array.length = dstIndex;
}
function bubbleSort(array, lessThan) {
  function swap(i, j) {
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  var begin = 0;
  var end = array.length;
  var _loop = function () {
      var changed = false;
      function bubble(i, j) {
        if (lessThan(array[i], array[j])) {
          swap(i, j);
          changed = true;
        }
      }
      if (end < begin) throw new Error("Begin and end are messed up");
      var limit = end - begin;
      for (var i = limit; i-- > 1;) bubble(begin + i, begin + i - 1);
      if (!changed) return {
        v: void 0
      };

      // After one run, the first element in the list is guaranteed to be the smallest.
      begin++;

      // Now go in the other direction. This eliminates most sorting pathologies.
      changed = false;
      if (end < begin) throw new Error("Begin and end are messed up");
      limit = end - begin;
      for (var _i = 1; _i < limit; ++_i) bubble(begin + _i, begin + _i - 1);
      if (!changed) return {
        v: void 0
      };

      // Now the last element is guaranteed to be the largest.
      end--;
    },
    _ret;
  for (;;) {
    _ret = _loop();
    if (_ret) return _ret.v;
  }
}

