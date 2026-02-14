"use strict";

/*
 * Copyright (C) 2018-2024 Apple Inc. All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
*/
var _excluded = ["worstCaseCount"];
function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
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
function _callIgnored(body, direct) {
  return _call(body, _empty, direct);
}
function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}
function _invoke(body, then) {
  var result = body();
  if (result && result.then) {
    return result.then(then);
  }
  return then(result);
}
var _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
function _forTo(array, body, check) {
  var i = -1,
    pact,
    reject;
  function _cycle(result) {
    try {
      while (++i < array.length && (!check || !check())) {
        result = body(i);
        if (result && result.then) {
          if (_isSettledPact(result)) {
            result = result.v;
          } else {
            result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
            return;
          }
        }
      }
      if (pact) {
        _settle(pact, 1, result);
      } else {
        pact = result;
      }
    } catch (e) {
      _settle(pact || (pact = new _Pact()), 2, e);
    }
  }
  _cycle();
  return pact;
}
function _forOf(target, body, check) {
  if (typeof target[_iteratorSymbol] === "function") {
    var iterator = target[_iteratorSymbol](),
      step,
      pact,
      reject;
    function _cycle(result) {
      try {
        while (!(step = iterator.next()).done && (!check || !check())) {
          result = body(step.value);
          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }
        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }
    _cycle();
    if (iterator.return) {
      var _fixup = function (value) {
        try {
          if (!step.done) {
            iterator.return();
          }
        } catch (e) {}
        return value;
      };
      if (pact && pact.then) {
        return pact.then(_fixup, function (e) {
          throw _fixup(e);
        });
      }
      _fixup();
    }
    return pact;
  }
  // No support for Symbol.iterator
  if (!("length" in target)) {
    throw new TypeError("Object is not iterable");
  }
  // Handle live collections properly
  var values = [];
  for (var i = 0; i < target.length; i++) {
    values.push(target[i]);
  }
  return _forTo(values, function (i) {
    return body(values[i]);
  }, check);
}
function _continueIgnored(value) {
  if (value && value.then) {
    return value.then(_empty);
  }
}
function _rethrow(thrown, value) {
  if (thrown) throw value;
  return value;
}
function _finallyRethrows(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer(true, e);
  }
  if (result && result.then) {
    return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
  }
  return finalizer(false, result);
}
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var measureTotalTimeAsSubtest = false; // Once we move to preloading all resources, it would be good to turn this on.

var defaultIterationCount = 120;
var defaultWorstCaseCount = 4;
if (!JetStreamParams.prefetchResources && isInBrowser) {
  console.warn("Disabling resource prefetching! All compressed files must have been decompressed using `npm run decompress`");
}
if (JetStreamParams.forceGC && typeof globalThis.gc === "undefined") {
  console.warn("Force-gc is set, but globalThis.gc() is not available.");
}
if (!isInBrowser && JetStreamParams.prefetchResources) {
  // Use the wasm compiled zlib as a polyfill when decompression stream is
  // not available in JS shells.
  load("./wasm/zlib/shell.js");

  // Load a polyfill for TextEncoder/TextDecoder in shells. Used when
  // decompressing a prefetched resource and converting it to text.
  load("./utils/polyfills/fast-text-encoding/1.0.3/text.js");
}

// Used for the promise representing the current benchmark run.
this.currentResolve = null;
this.currentReject = null;
function displayCategoryScores() {
  document.body.classList.add("details");
}
if (isInBrowser) {
  document.onkeydown = keyboardEvent => {
    var key = keyboardEvent.key;
    if (key === "d" || key === "D") displayCategoryScores();
  };
}
function sum(values) {
  console.assert(values instanceof Array);
  var sum = 0;
  for (var x of values) sum += x;
  return sum;
}
function mean(values) {
  var totalSum = sum(values);
  return totalSum / values.length;
}
function geomeanScore(values) {
  console.assert(values instanceof Array);
  var product = 1;
  for (var x of values) product *= x;
  var score = product ** (1 / values.length);
  // Allow 0 for uninitialized subScores().
  console.assert(score >= 0, `Got invalid score: ${score}`);
  return score;
}
function toScore(timeValue) {
  return 5000 / Math.max(timeValue, 1);
}
function toTimeValue(score) {
  return 5000 / score;
}
function updateUI() {
  return new Promise(resolve => {
    if (isInBrowser) requestAnimationFrame(() => setTimeout(resolve, 0));else resolve();
  });
}
function uiFriendlyNumber(num) {
  if (Number.isInteger(num)) return num;
  return num.toFixed(2);
}
function uiFriendlyScore(num) {
  return uiFriendlyNumber(num);
}
function uiFriendlyDuration(time) {
  return `${time.toFixed(2)} ms`;
}
var LABEL_PADDING = 45;
function shellFriendlyLabel(label) {
  return `${label}`.padEnd(LABEL_PADDING);
}
var VALUE_PADDING = 11;
function shellFriendlyDuration(time) {
  return `${uiFriendlyDuration(time)} `.padStart(VALUE_PADDING);
}
function shellFriendlyScore(time) {
  return `${uiFriendlyScore(time)} pts`.padStart(VALUE_PADDING);
}

// Files can be zlib compressed to reduce the size of the JetStream source code.
// We don't use http compression because we support running from the shell and
// don't want to require a complicated server setup.
//
// zlib was chosen because we already have it in tree for the wasm-zlib test.
function isCompressed(name) {
  return name.endsWith(".z");
}
function uncompressedName(name) {
  console.assert(isCompressed(name));
  return name.slice(0, -2);
}

// TODO: Cleanup / remove / merge. This is only used for caching loads in the
// non-browser setting. In the browser we use exclusively `loadCache`, 
// `loadBlob`, `doLoadBlob`, `prefetchResourcesForBrowser` etc., see below.
var ShellFileLoader = /*#__PURE__*/function () {
  function ShellFileLoader() {
    _classCallCheck(this, ShellFileLoader);
    this.requests = new Map();
  }

  // Cache / memoize previously read files, because some workloads
  // share common code.
  return _createClass(ShellFileLoader, [{
    key: "load",
    value: function load(url) {
      console.assert(!isInBrowser);
      var compressed = isCompressed(url);
      if (compressed && !JetStreamParams.prefetchResources) {
        url = uncompressedName(url);
      }

      // If we aren't supposed to prefetch this then return code snippet that will load the url on-demand.
      if (!JetStreamParams.prefetchResources) return `load("${url}");`;
      if (this.requests.has(url)) {
        return this.requests.get(url);
      }
      var contents;
      if (compressed) {
        var compressedBytes = new Int8Array(read(url, "binary"));
        var decompressedBytes = zlib.decompress(compressedBytes);
        contents = new TextDecoder().decode(decompressedBytes);
      } else {
        contents = readFile(url);
      }
      this.requests.set(url, contents);
      return contents;
    }
  }]);
}();
;
var BrowserFileLoader = /*#__PURE__*/function () {
  function BrowserFileLoader() {
    _classCallCheck(this, BrowserFileLoader);
    // TODO: Cleanup / remove / merge `blobDataCache` and `loadCache` vs.
    // the global `fileLoader` cache.
    this.blobDataCache = {
      __proto__: null
    };
    this.loadCache = {
      __proto__: null
    };
  }
  return _createClass(BrowserFileLoader, [{
    key: "doLoadBlob",
    value: function doLoadBlob(resource) {
      try {
        var _exit = false,
          _interrupt = false;
        var _this = this;
        var blobData = _this.blobDataCache[resource];
        var compressed = isCompressed(resource);
        if (compressed && !JetStreamParams.prefetchResources) {
          resource = uncompressedName(resource);
        }

        // If we aren't supposed to prefetch this then set the blobURL to just
        // be the resource URL.
        if (!JetStreamParams.prefetchResources) {
          blobData.blobURL = resource;
          return _await(blobData);
        }
        var response;
        var tries = 3;
        return _await(_continue(_for(function () {
          return !(_interrupt || _exit) && tries--;
        }, void 0, function () {
          var hasError = false;
          return _continue(_catch(function () {
            return _await(fetch(resource, {
              cache: "no-store"
            }), function (_fetch) {
              response = _fetch;
            });
          }, function () {
            hasError = true;
          }), function () {
            if (!hasError && response.ok) {
              _interrupt = true;
              return;
            }
            if (tries) return;
            throw new Error("Fetch failed");
          });
        }), function (_result) {
          if (_exit) return _result;
          // If we need to decompress this, then run it through a decompression
          // stream.
          if (compressed) {
            var stream = response.body.pipeThrough(new DecompressionStream("deflate"));
            response = new Response(stream);
          }
          return _await(response.blob(), function (blob) {
            blobData.blob = blob;
            blobData.blobURL = URL.createObjectURL(blob);
            return blobData;
          });
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "loadBlob",
    value: function loadBlob(type, prop, resource) {
      var incrementRefCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      try {
        var _this2 = this;
        var blobData = _this2.blobDataCache[resource];
        if (!blobData) {
          blobData = {
            type: type,
            prop: prop,
            resource: resource,
            blob: null,
            blobURL: null,
            refCount: 0
          };
          _this2.blobDataCache[resource] = blobData;
        }
        if (incrementRefCount) blobData.refCount++;
        var promise = _this2.loadCache[resource];
        if (promise) return _await(promise);
        promise = _this2.doLoadBlob(resource);
        _this2.loadCache[resource] = promise;
        return _await(promise);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "retryPrefetchResource",
    value: function retryPrefetchResource(type, prop, file) {
      try {
        var _this3 = this;
        console.assert(isInBrowser);
        var counter = JetStream.counter;
        var blobData = _this3.blobDataCache[file];
        if (blobData.blob) {
          // The same preload blob may be used by multiple subtests. Though the blob is already loaded,
          // we still need to check if this subtest failed to load it before. If so, handle accordingly.
          if (type == "preload") {
            if (_this3.failedPreloads && _this3.failedPreloads[blobData.prop]) {
              _this3.failedPreloads[blobData.prop] = false;
              _this3._preloadBlobData.push({
                name: blobData.prop,
                resource: blobData.resource,
                blobURLOrPath: blobData.blobURL
              });
              counter.failedPreloadResources--;
            }
          }
          return _await(!counter.failedPreloadResources && counter.loadedResources == counter.totalResources);
        }

        // Retry fetching the resource.
        _this3.loadCache[file] = null;
        return _await(_this3.loadBlob(type, prop, file, false).then(blobData => {
          if (!globalThis.allIsGood) return;
          if (blobData.type == "preload") _this3._preloadBlobData.push({
            name: blobData.prop,
            resource: blobData.resource,
            blobURLOrPath: blobData.blobURL
          });
          _this3.updateCounter();
        }), function () {
          if (!blobData.blob) {
            globalThis.allIsGood = false;
            throw new Error("Fetch failed");
          }
          return !counter.failedPreloadResources && counter.loadedResources == counter.totalResources;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "free",
    value: function free(files) {
      for (var file of files) {
        var blobData = this.blobDataCache[file];
        // If we didn't prefetch this resource, then no need to free it
        if (!blobData.blob) {
          continue;
        }
        blobData.refCount--;
        if (!blobData.refCount) this.blobDataCache[file] = undefined;
      }
    }
  }]);
}();
var browserFileLoader = new BrowserFileLoader();
var shellFileLoader = new ShellFileLoader();
var Driver = /*#__PURE__*/function () {
  function Driver(benchmarks) {
    _classCallCheck(this, Driver);
    this.isReady = false;
    this.isDone = false;
    this.errors = [];
    // Make benchmark list unique and sort it.
    this.benchmarks = Array.from(new Set(benchmarks));
    this.benchmarks.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1);
    console.assert(this.benchmarks.length, "No benchmarks selected");
    this.counter = {};
    this.counter.loadedResources = 0;
    this.counter.totalResources = 0;
    this.counter.failedPreloadResources = 0;
  }
  return _createClass(Driver, [{
    key: "start",
    value: function start() {
      try {
        var _exit2 = false;
        var _this4 = this;
        var statusElement = false;
        if (isInBrowser) {
          statusElement = document.getElementById("status");
          statusElement.innerHTML = `<label>Running...</label>`;
        } else if (!JetStreamParams.dumpJSONResults) console.log("Starting JetStream3");
        performance.mark("update-ui-start");
        var _start = performance.now();
        return _await(_continue(_forOf(_this4.benchmarks, function (benchmark) {
          benchmark.updateUIBeforeRun();
          return _invoke(function () {
            if (isInBrowser) {
              return _callIgnored(updateUI);
            }
          }, function () {
            var _exit3 = false;
            performance.measure("runner update-ui", "update-ui-start");
            console.log('Starting %s', benchmark.name);
            return _continue(_catch(function () {
              return _awaitIgnored(benchmark.run());
            }, function (e) {
              _this4.reportError(benchmark, e);
              throw e;
            }), function (_result2) {
              if (_exit3) return _result2;
              console.log('Ended %s', benchmark.name);
              performance.mark("update-ui");
              benchmark.updateUIAfterRun();
              if (isInBrowser) {
                browserFileLoader.free(benchmark.files);
              }
            });
          });
        }, function () {
          return _exit2;
        }), function (_result3) {
          if (_exit2) return _result3;
          console.log('Ended all benchmarks');
          performance.measure("runner update-ui", "update-ui-start");
          var totalTime = performance.now() - _start;
          if (measureTotalTimeAsSubtest) {
            if (isInBrowser) document.getElementById("benchmark-total-time-score").innerHTML = uiFriendlyNumber(totalTime);else if (!JetStreamParams.dumpJSONResults) console.log("Total-Time:", uiFriendlyNumber(totalTime));
            allScores.push(totalTime);
          }
          var allScores = [];
          for (var benchmark of _this4.benchmarks) {
            var score = benchmark.score;
            console.assert(score > 0, `Invalid ${benchmark.name} score: ${score}`);
            allScores.push(score);
          }
          var categoryScores = new Map();
          var categoryTimes = new Map();
          for (var _benchmark of _this4.benchmarks) {
            for (var category of Object.keys(_benchmark.subScores())) categoryScores.set(category, []);
            for (var _category of Object.keys(_benchmark.subTimes())) categoryTimes.set(_category, []);
          }
          for (var _benchmark2 of _this4.benchmarks) {
            for (var [_category2, value] of Object.entries(_benchmark2.subScores())) {
              var arr = categoryScores.get(_category2);
              console.assert(value > 0, `Invalid ${_benchmark2.name} ${_category2} score: ${value}`);
              arr.push(value);
            }
            for (var [_category3, _value] of Object.entries(_benchmark2.subTimes())) {
              var _arr = categoryTimes.get(_category3);
              console.assert(_value > 0, `Invalid ${_benchmark2.name} ${_category3} time: ${_value}`);
              _arr.push(_value);
            }
          }
          var overallScore = geomeanScore(allScores);
          console.assert(overallScore > 0, `Invalid total score: ${overallScore}`);
          if (isInBrowser) {
            var summaryHtml = `<div class="score">${uiFriendlyScore(overallScore)}</div>
                    <label>Score</label>`;
            summaryHtml += `<div class="benchmark benchmark-done">`;
            for (var [_category4, scores] of categoryScores) {
              summaryHtml += `<span class="result detail">
                                    <span>${uiFriendlyScore(geomeanScore(scores))}</span>
                                    <label>${_category4}</label>
                                </span>`;
            }
            summaryHtml += "<br/>";
            for (var [_category5, times] of categoryTimes) {
              summaryHtml += `<span class="result detail">
                                    <span>${uiFriendlyDuration(geomeanScore(times))}</span>
                                    <label>${_category5}</label>
                                </span>`;
            }
            summaryHtml += "</div>";
            var summaryElement = document.getElementById("result-summary");
            summaryElement.classList.add("done");
            summaryElement.innerHTML = summaryHtml;
            summaryElement.onclick = displayCategoryScores;
            statusElement.innerHTML = "";
          } else if (!JetStreamParams.dumpJSONResults || isRhino) {
            console.log("Overall:");
            for (var [_category6, _scores] of categoryScores) {
              console.log(shellFriendlyLabel(`Overall ${_category6}-Score`), shellFriendlyScore(geomeanScore(_scores)));
            }
            for (var [_category7, _times] of categoryTimes) {
              console.log(shellFriendlyLabel(`Overall ${_category7}-Time`), shellFriendlyDuration(geomeanScore(_times)));
            }
            console.log("");
            console.log(shellFriendlyLabel("Overall Score"), shellFriendlyScore(overallScore));
            console.log(shellFriendlyLabel("Overall Wall-Time"), shellFriendlyDuration(totalTime));
            console.log("");
          }
          _this4.reportScoreToRunBenchmarkRunner();
          _this4.dumpJSONResultsIfNeeded();
          _this4.isDone = true;
          if (isInBrowser) {
            globalThis.dispatchEvent(new CustomEvent("JetStreamDone", {
              detail: _this4.resultsObject()
            }));
          }
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "prepareBrowserUI",
    value: function prepareBrowserUI() {
      var text = "";
      for (var benchmark of this.benchmarks) text += benchmark.renderHTML();
      var resultsTable = document.getElementById("results");
      resultsTable.innerHTML = text;
      document.getElementById("magic").textContent = "";
      document.addEventListener('keypress', e => {
        if (e.key === "Enter") JetStream.start();
      });
    }
  }, {
    key: "reportError",
    value: function reportError(benchmark, error) {
      this.pushError(benchmark.name, error);
      if (isRhino) {
        console.error('Error in %s: %s', benchmark.name, error);
      }
      if (!isInBrowser) return;
      for (var id of benchmark.allScoreIdentifiers()) document.getElementById(id).innerHTML = "error";
      for (var _id of benchmark.allTimeIdentifiers()) document.getElementById(_id).innerHTML = "error";
      var benchmarkResultsUI = document.getElementById(`benchmark-${benchmark.name}`);
      benchmarkResultsUI.classList.remove("benchmark-running");
      benchmarkResultsUI.classList.add("benchmark-error");
    }
  }, {
    key: "pushError",
    value: function pushError(name, error) {
      this.errors.push({
        benchmark: name,
        error: error.toString(),
        stack: error.stack
      });
    }
  }, {
    key: "initialize",
    value: function initialize() {
      try {
        var _this5 = this;
        if (isInBrowser) window.addEventListener("error", e => _this5.pushError("driver startup", e.error));
        return _await(_this5.prefetchResources(), function () {
          _this5.benchmarks.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1);
          if (isInBrowser) _this5.prepareBrowserUI();
          _this5.isReady = true;
          if (isInBrowser) {
            globalThis.dispatchEvent(new Event("JetStreamReady"));
            if (typeof JetStreamParams.startDelay !== "undefined") {
              setTimeout(() => _this5.start(), JetStreamParams.startDelay);
            }
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "prefetchResources",
    value: function prefetchResources() {
      try {
        var _exit4 = false;
        var _this6 = this;
        return _await(_invoke(function () {
          if (!isInBrowser) {
            return _invoke(function () {
              if (JetStreamParams.prefetchResources) {
                return _awaitIgnored(zlib.initialize());
              }
            }, function () {
              for (var benchmark of _this6.benchmarks) benchmark.prefetchResourcesForShell();
              _exit4 = true;
            });
          }
        }, function (_result4) {
          if (_exit4) return _result4;
          // TODO: Cleanup the browser path of the preloading below and in
          // `prefetchResourcesForBrowser` / `retryPrefetchResourcesForBrowser`.
          var counter = JetStream.counter;
          var promises = [];
          for (var benchmark of _this6.benchmarks) promises.push(benchmark.prefetchResourcesForBrowser(counter));
          return _await(Promise.all(promises), function () {
            var _exit5 = false;
            return _invoke(function () {
              if (counter.failedPreloadResources || counter.loadedResources != counter.totalResources) {
                var _interrupt2 = false;
                return _continue(_forOf(_this6.benchmarks, function (benchmark) {
                  return _await(benchmark.retryPrefetchResourcesForBrowser(counter), function (allFilesLoaded) {
                    if (allFilesLoaded) {
                      _interrupt2 = true;
                    }
                  });
                }, function () {
                  return _interrupt2;
                }), function () {
                  if (counter.failedPreloadResources || counter.loadedResources != counter.totalResources) {
                    // If we've failed to prefetch resources even after a sequential 1 by 1 retry,
                    // then fail out early rather than letting subtests fail with a hang.
                    globalThis.allIsGood = false;
                    throw new Error("Fetch failed");
                  }
                });
              }
            }, function (_result5) {
              if (_exit5) return _result5;
              JetStream.loadCache = {}; // Done preloading all the files.

              var statusElement = document.getElementById("status");
              statusElement.classList.remove('loading');
              statusElement.innerHTML = `<a href="javascript:JetStream.start()" class="button">Start Test</a>`;
              statusElement.onclick = () => {
                statusElement.onclick = null;
                JetStream.start();
                return false;
              };
            });
          });
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "updateCounterUI",
    value: function updateCounterUI() {
      var counter = JetStream.counter;
      var statusElement = document.getElementById("status-text");
      statusElement.innerText = `Loading ${counter.loadedResources} of ${counter.totalResources} ...`;
      var percent = counter.loadedResources / counter.totalResources * 100;
      var progressBar = document.getElementById("status-progress-bar");
      progressBar.style.width = `${percent}%`;
    }
  }, {
    key: "resultsObject",
    value: function resultsObject() {
      var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "run-benchmark";
      switch (format) {
        case "run-benchmark":
          return this.runBenchmarkResultsObject();
        case "simple":
          return this.simpleResultsObject();
        default:
          throw Error(`Unknown result format '${format}'`);
      }
    }
  }, {
    key: "runBenchmarkResultsObject",
    value: function runBenchmarkResultsObject() {
      var results = {};
      for (var benchmark of this.benchmarks) {
        var subResults = {};
        var subScores = benchmark.subScores();
        for (var name in subScores) {
          subResults[name] = {
            "metrics": {
              "Time": {
                "current": [toTimeValue(subScores[name])]
              }
            }
          };
        }
        results[benchmark.name] = {
          "metrics": {
            "Score": {
              "current": [benchmark.score]
            },
            "Time": ["Geometric"]
          },
          "tests": subResults
        };
      }
      results = {
        "JetStream3.0": {
          "metrics": {
            "Score": ["Geometric"]
          },
          "tests": results
        }
      };
      return results;
    }
  }, {
    key: "simpleResultsObject",
    value: function simpleResultsObject() {
      var results = {
        __proto__: null
      };
      for (var benchmark of this.benchmarks) {
        if (!benchmark.isDone) continue;
        if (!benchmark.isSuccess) {
          results[benchmark.name] = "FAILED";
        } else {
          results[benchmark.name] = _objectSpread({
            Score: benchmark.score
          }, benchmark.subScores());
        }
      }
      return results;
    }
  }, {
    key: "resultsJSON",
    value: function resultsJSON() {
      var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "run-benchmark";
      return JSON.stringify(this.resultsObject(format));
    }
  }, {
    key: "dumpJSONResultsIfNeeded",
    value: function dumpJSONResultsIfNeeded() {
      if (JetStreamParams.dumpJSONResults) {
        console.log("\n");
        console.log(this.resultsJSON());
        console.log("\n");
      }
    }
  }, {
    key: "dumpTestList",
    value: function dumpTestList() {
      for (var benchmark of this.benchmarks) {
        console.log(benchmark.name);
      }
    }
  }, {
    key: "reportScoreToRunBenchmarkRunner",
    value: function reportScoreToRunBenchmarkRunner() {
      try {
        var _this7 = this;
        if (!isInBrowser) return _await();
        if (!JetStreamParams.report) return _await();
        var content = _this7.resultsJSON();
        return _await(_awaitIgnored(fetch("/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": content.length,
            "Connection": "close"
          },
          body: content
        })));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }]);
}();
;
var BenchmarkState = Object.freeze({
  READY: "READY",
  SETUP: "SETUP",
  RUNNING: "RUNNING",
  FINALIZE: "FINALIZE",
  ERROR: "ERROR",
  DONE: "DONE"
});
var Scripts = /*#__PURE__*/function () {
  function Scripts(preloads) {
    _classCallCheck(this, Scripts);
    this.scripts = [];
    var preloadsCode = "";
    var resourcesCode = "";
    for (var {
      name,
      resource,
      blobURLOrPath
    } of preloads) {
      console.assert(name?.length > 0, "Invalid preload name.");
      console.assert(resource?.length > 0, "Invalid preload resource.");
      console.assert(blobURLOrPath?.length > 0, "Invalid preload data.");
      preloadsCode += `${JSON.stringify(name)}: "${blobURLOrPath}",\n`;
      resourcesCode += `${JSON.stringify(resource)}: "${blobURLOrPath}",\n`;
    }
    // Expose a globalThis.JetStream object to the workload. We use
    // a proxy to prevent prototype access and throw on unknown properties.
    this.add(`
            var throwOnAccess = (name) => new Proxy({},  {
                get(target, property, receiver) {
                    throw new Error(name + "." + property + " is not defined.");
                }
            });
            globalThis.JetStream = {
                __proto__: throwOnAccess("JetStream"),
                preload: {
                    __proto__: throwOnAccess("JetStream.preload"),
                    ${preloadsCode}
                },
                resources: {
                    __proto__: throwOnAccess("JetStream.preload"),
                    ${resourcesCode}
                },
            };
            `);
    this.add(`
            performance.mark ??= function(name) { return { name }};
            performance.measure ??= function() {};
            performance.timeOrigin ??= performance.now();
        `);
  }
  return _createClass(Scripts, [{
    key: "run",
    value: function run() {
      throw new Error("Subclasses need to implement this");
    }
  }, {
    key: "add",
    value: function add(text) {
      throw new Error("Subclasses need to implement this");
    }
  }, {
    key: "addWithURL",
    value: function addWithURL(url) {
      throw new Error("addWithURL not supported");
    }
  }, {
    key: "addBrowserTest",
    value: function addBrowserTest() {
      this.add(`
            globalThis.JetStream.isInBrowser = ${isInBrowser};
            globalThis.JetStream.isD8 = ${isD8};
        `);
    }
  }, {
    key: "addDeterministicRandom",
    value: function addDeterministicRandom() {
      this.add(`(() => {
            const initialSeed = 49734321;
            let seed = initialSeed;

            Math.random = () => {
                // Robert Jenkins' 32 bit integer hash function.
                seed = ((seed + 0x7ed55d16) + (seed << 12))  & 0xffff_ffff;
                seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffff_ffff;
                seed = ((seed + 0x165667b1) + (seed << 5))   & 0xffff_ffff;
                seed = ((seed + 0xd3a2646c) ^ (seed << 9))   & 0xffff_ffff;
                seed = ((seed + 0xfd7046c5) + (seed << 3))   & 0xffff_ffff;
                seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffff_ffff;
                // Note that Math.random should return a value that is
                // greater than or equal to 0 and less than 1. Here, we
                // cast to uint32 first then divided by 2^32 for double.
                return (seed >>> 0) / 0x1_0000_0000;
            };

            Math.random.__resetSeed = () => {
                seed = initialSeed;
            };
        })();`);
    }
  }]);
}();
var ShellScripts = /*#__PURE__*/function (_Scripts) {
  function ShellScripts(preloads) {
    var _this8;
    _classCallCheck(this, ShellScripts);
    _this8 = _callSuper(this, ShellScripts, [preloads]);
    _this8.prefetchedResources = Object.create(null);
    ;
    return _this8;
  }
  _inherits(ShellScripts, _Scripts);
  return _createClass(ShellScripts, [{
    key: "run",
    value: function run() {
      var globalObject;
      var realm;
      if (isD8) {
        realm = Realm.createAllowCrossRealmAccess();
        globalObject = Realm.global(realm);
        globalObject.loadString = function (s) {
          return Realm.eval(realm, s);
        };
        globalObject.readFile = read;
      } else if (isSpiderMonkey) {
        globalObject = newGlobal();
        globalObject.loadString = globalObject.evaluate;
        globalObject.readFile = globalObject.readRelativeToScript;
      } else if (isRhino) {
        globalObject = global;
        globalObject.loadString = __evaluateString;
        globalObject.readFile = readFile;
      } else globalObject = runString("");

      // Expose console copy in the realm so we don't accidentally modify
      // the original object.
      globalObject.console = Object.assign({}, console);
      globalObject.self = globalObject;
      globalObject.top = {
        currentResolve,
        currentReject
      };

      // Pass the prefetched resources to the benchmark global.
      if (JetStreamParams.prefetchResources) {
        // Pass the 'TextDecoder' polyfill into the benchmark global. Don't
        // use 'TextDecoder' as that will get picked up in the kotlin test
        // without full support.
        globalObject.ShellTextDecoder = TextDecoder;
        // Store shellPrefetchedResources on ShellPrefetchedResources so that
        // getBinary and getString can find them.
        globalObject.ShellPrefetchedResources = this.prefetchedResources;
      } else {
        console.assert(Object.values(this.prefetchedResources).length === 0, "Unexpected prefetched resources");
      }
      globalObject.performance ??= performance;
      for (var script of this.scripts) globalObject.loadString(script);
      return isD8 ? realm : globalObject;
    }
  }, {
    key: "addPrefetchedResources",
    value: function addPrefetchedResources(prefetchedResources) {
      for (var [file, bytes] of Object.entries(prefetchedResources)) {
        this.prefetchedResources[file] = bytes;
      }
    }
  }, {
    key: "add",
    value: function add(text) {
      this.scripts.push(text);
    }
  }, {
    key: "addWithURL",
    value: function addWithURL(url) {
      console.assert(false, "Should not reach here in CLI");
    }
  }]);
}(Scripts);
var BrowserScripts = /*#__PURE__*/function (_Scripts2) {
  function BrowserScripts(preloads) {
    var _this9;
    _classCallCheck(this, BrowserScripts);
    _this9 = _callSuper(this, BrowserScripts, [preloads]);
    _this9.add("window.onerror = top.currentReject;");
    return _this9;
  }
  _inherits(BrowserScripts, _Scripts2);
  return _createClass(BrowserScripts, [{
    key: "run",
    value: function run() {
      var string = this.scripts.join("\n");
      var magic = document.getElementById("magic");
      magic.contentDocument.body.textContent = "";
      magic.contentDocument.body.innerHTML = `<iframe id="magicframe" frameborder="0">`;
      var magicFrame = magic.contentDocument.getElementById("magicframe");
      magicFrame.contentDocument.open();
      magicFrame.contentDocument.write(`<!DOCTYPE html>
            <head>
               <title>benchmark payload</title>
            </head>
            <body>${string}</body>
        </html>`);
      return magicFrame;
    }
  }, {
    key: "add",
    value: function add(text) {
      this.scripts.push(`<script>${text}</script>`);
    }
  }, {
    key: "addWithURL",
    value: function addWithURL(url) {
      this.scripts.push(`<script src="${url}"></script>`);
    }
  }]);
}(Scripts);
var Benchmark = /*#__PURE__*/function () {
  function Benchmark(_ref) {
    var {
      name,
      files,
      preload = {},
      tags,
      iterations,
      deterministicRandom = false,
      exposeBrowserTest = false,
      allowUtf16 = false,
      args = {}
    } = _ref;
    _classCallCheck(this, Benchmark);
    this._state = BenchmarkState.READY;
    this.results = [];
    this.name = name;
    this.tags = this._processTags(tags);
    this._arguments = args;
    this.iterations = this._processIterationCount(iterations);
    this._deterministicRandom = deterministicRandom;
    this._exposeBrowserTest = exposeBrowserTest;
    this.allowUtf16 = !!allowUtf16;

    // Resource handling:
    this._scripts = null;
    this._files = files;
    this._preloadEntries = Object.entries(preload);
    this._preloadBlobData = [];
    this._shellPrefetchedResources = null;
  }

  // Use getter so it can be overridden in subclasses (GroupedBenchmark).
  return _createClass(Benchmark, [{
    key: "files",
    get: function () {
      return this._files;
    }
  }, {
    key: "preloadEntries",
    get: function () {
      return this._preloadEntries;
    }
  }, {
    key: "_processTags",
    value: function _processTags(rawTags) {
      var tags = new Set(rawTags.map(each => each.toLowerCase()));
      if (tags.size != rawTags.length) throw new Error(`${this.name} got duplicate tags: ${rawTags.join()}`);
      tags.add("all");
      if (!tags.has("default")) tags.add("disabled");
      return tags;
    }
  }, {
    key: "_processIterationCount",
    value: function _processIterationCount(iterations) {
      if (this.name in JetStreamParams.testIterationCountMap) return JetStreamParams.testIterationCountMap[this.name];
      if (JetStreamParams.testIterationCount) return JetStreamParams.testIterationCount;
      if (iterations) return iterations;
      return defaultIterationCount;
    }
  }, {
    key: "_processWorstCaseCount",
    value: function _processWorstCaseCount(worstCaseCount) {
      if (this.name in JetStreamParams.testWorstCaseCountMap) return JetStreamParams.testWorstCaseCountMap[this.name];
      if (JetStreamParams.testWorstCaseCount) return JetStreamParams.testWorstCaseCount;
      if (worstCaseCount !== undefined) return worstCaseCount;
      return defaultWorstCaseCount;
    }
  }, {
    key: "isDone",
    get: function () {
      return this._state == BenchmarkState.DONE || this._state == BenchmarkState.ERROR;
    }
  }, {
    key: "isSuccess",
    get: function () {
      return this._state = BenchmarkState.DONE;
    }
  }, {
    key: "hasAnyTag",
    value: function hasAnyTag() {
      for (var _len = arguments.length, tags = new Array(_len), _key = 0; _key < _len; _key++) {
        tags[_key] = arguments[_key];
      }
      return tags.some(tag => this.tags.has(tag.toLowerCase()));
    }
  }, {
    key: "benchmarkArguments",
    get: function () {
      return _objectSpread(_objectSpread({}, this._arguments), {}, {
        iterationCount: this.iterations
      });
    }
  }, {
    key: "runnerCode",
    get: function () {
      return `{
            var benchmark = new Benchmark(${JSON.stringify(this.benchmarkArguments)});
            var results = [];
            var benchmarkName = "${this.name}";

            for (let i = 0; i < ${this.iterations}; i++) {
                ${this.preIterationCode}

                var iterationMarkLabel = benchmarkName + "-iteration-" + i;
                var iterationStartMark = performance.mark(iterationMarkLabel);

                var start = performance.now();
                benchmark.runIteration(i);
                var end = performance.now();

                performance.measure(iterationMarkLabel, iterationMarkLabel);

                ${this.postIterationCode}

                results.push(Math.max(1, end - start));
            }
            benchmark.validate?.(${this.iterations});
            top.currentResolve(results);
        };`;
    }
  }, {
    key: "processResults",
    value: function processResults(results) {
      this.results = Array.from(results);
      return this.results;
    }
  }, {
    key: "score",
    get: function () {
      var subScores = Object.values(this.subScores());
      return geomeanScore(subScores);
    }
  }, {
    key: "totalTime",
    get: function () {
      var subTimes = Object.values(this.subTimes());
      return sum(subTimes);
    }
  }, {
    key: "wallTime",
    get: function () {
      return this.endTime - this.startTime;
    }
  }, {
    key: "subScores",
    value: function subScores() {
      throw new Error("Subclasses need to implement this");
    }
  }, {
    key: "subTimes",
    value: function subTimes() {
      throw new Error("Subclasses need to implement this");
    }
  }, {
    key: "allScores",
    value: function allScores() {
      var allScores = this.subScores();
      allScores["Score"] = this.score;
      return allScores;
    }
  }, {
    key: "allTimes",
    value: function allTimes() {
      var allTimes = this.subTimes();
      allTimes["Total"] = this.totalTime;
      allTimes["Wall"] = this.wallTime;
      return allTimes;
    }
  }, {
    key: "prerunCode",
    get: function () {
      return null;
    }
  }, {
    key: "preIterationCode",
    get: function () {
      var code = this.prepareForNextIterationCode;
      if (this._deterministicRandom) code += `Math.random.__resetSeed();`;
      if (JetStreamParams.customPreIterationCode) code += JetStreamParams.customPreIterationCode;
      return code;
    }
  }, {
    key: "prepareForNextIterationCode",
    get: function () {
      return "benchmark.prepareForNextIteration?.();";
    }
  }, {
    key: "postIterationCode",
    get: function () {
      var code = "";
      if (JetStreamParams.customPostIterationCode) code += JetStreamParams.customPostIterationCode;
      return code;
    }
  }, {
    key: "renderHTML",
    value: function renderHTML() {
      var scoreDescription = Object.keys(this.allScores());
      var timeDescription = Object.keys(this.allTimes());
      var scoreIds = this.allScoreIdentifiers();
      var overallScoreId = scoreIds.pop();
      var timeIds = this.allTimeIdentifiers();
      var text = `<div class="benchmark" id="benchmark-${this.name}">
            <h3 class="benchmark-name">${this.name} <a class="info" href="in-depth.html#${this.name}">i</a></h3>
            <h4 class="score" id="${overallScoreId}">&nbsp;</h4>
            <h4 class="plot" id="plot-${this.name}">&nbsp;</h4>
            <p>`;
      for (var i = 0; i < scoreIds.length; i++) {
        var scoreId = scoreIds[i];
        var label = scoreDescription[i];
        text += `<span class="result"><span id="${scoreId}">&nbsp;</span><label>${label}</label></span>`;
      }
      text += "<br/>";
      for (var _i = 0; _i < timeIds.length; _i++) {
        var timeId = timeIds[_i];
        var _label = timeDescription[_i];
        text += `<span class="result detail"><span id="${timeId}">&nbsp;</span><label>${_label}</label></span>`;
      }
      text += `</p></div>`;
      return text;
    }
  }, {
    key: "run",
    value: function run() {
      try {
        var _this0 = this;
        if (_this0.isDone) throw new Error(`Cannot run Benchmark ${_this0.name} twice`);
        _this0._state = BenchmarkState.PREPARE;
        if (JetStreamParams.forceGC) {
          // This will trigger for individual benchmarks in
          // GroupedBenchmarks since they delegate .run() to their inner
          // non-grouped benchmarks.
          globalThis?.gc();
        }
        var scripts = isInBrowser ? new BrowserScripts(_this0._preloadBlobData) : new ShellScripts(_this0._preloadBlobData);
        if (_this0._deterministicRandom) scripts.addDeterministicRandom();
        if (_this0._exposeBrowserTest) scripts.addBrowserTest();
        if (_this0._shellPrefetchedResources) {
          scripts.addPrefetchedResources(_this0._shellPrefetchedResources);
        }
        var prerunCode = _this0.prerunCode;
        if (prerunCode) scripts.add(prerunCode);
        if (!isInBrowser) {
          console.assert(_this0._scripts && _this0._scripts.length === _this0.files.length);
          for (var text of _this0._scripts) scripts.add(text);
        } else {
          var cache = browserFileLoader.blobDataCache;
          for (var file of _this0.files) {
            scripts.addWithURL(cache[file].blobURL);
          }
        }
        var promise = new Promise((resolve, reject) => {
          currentResolve = resolve;
          currentReject = reject;
        });
        scripts.add(_this0.runnerCode);
        performance.mark(_this0.name);
        _this0.startTime = performance.now();
        if (JetStreamParams.RAMification) resetMemoryPeak();
        var magicFrame;
        try {
          _this0._state = BenchmarkState.RUNNING;
          magicFrame = scripts.run();
        } catch (e) {
          _this0._state = BenchmarkState.ERROR;
          console.log("Error in runCode: ", e);
          console.log(e.stack);
          throw e;
        } finally {
          _this0._state = BenchmarkState.FINALIZE;
        }
        return _await(promise, function (results) {
          _this0.endTime = performance.now();
          performance.measure(_this0.name, _this0.name);
          if (JetStreamParams.RAMification) {
            var memoryFootprint = MemoryFootprint();
            _this0.currentFootprint = memoryFootprint.current;
            _this0.peakFootprint = memoryFootprint.peak;
          }
          _this0.processResults(results);
          _this0._state = BenchmarkState.DONE;
          if (isInBrowser) magicFrame.contentDocument.close();else if (isD8) Realm.dispose(magicFrame);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "updateCounter",
    value: function updateCounter() {
      var counter = JetStream.counter;
      ++counter.loadedResources;
      JetStream.updateCounterUI();
    }
  }, {
    key: "prefetchResourcesForBrowser",
    value: function prefetchResourcesForBrowser(counter) {
      var _this1 = this;
      console.assert(isInBrowser);
      var promises = this.files.map(file => browserFileLoader.loadBlob("file", null, file).then(blobData => {
        if (!globalThis.allIsGood) return;
        this.updateCounter();
      }).catch(error => {
        // We'll try again later in retryPrefetchResourceForBrowser(). Don't throw an error.
      }));
      var _loop = function (name) {
        promises.push(browserFileLoader.loadBlob("preload", name, resource).then(blobData => {
          if (!globalThis.allIsGood) return;
          _this1._preloadBlobData.push({
            name: blobData.prop,
            resource: blobData.resource,
            blobURLOrPath: blobData.blobURL
          });
          _this1.updateCounter();
        }).catch(error => {
          // We'll try again later in retryPrefetchResourceForBrowser(). Don't throw an error.
          if (!_this1.failedPreloads) _this1.failedPreloads = {};
          _this1.failedPreloads[name] = true;
          counter.failedPreloadResources++;
        }));
      };
      for (var [name, resource] of this.preloadEntries) {
        _loop(name);
      }
      JetStream.counter.totalResources += promises.length;
      return Promise.all(promises);
    }
  }, {
    key: "retryPrefetchResourcesForBrowser",
    value: function retryPrefetchResourcesForBrowser(counter) {
      try {
        var _exit6 = false;
        var _this10 = this;
        // FIXME: Move to BrowserFileLoader.
        console.assert(isInBrowser);
        return _await(_continue(_forOf(_this10.files, function (resource) {
          return _await(browserFileLoader.retryPrefetchResource("file", null, resource), function (allDone) {
            if (allDone) {
              _exit6 = true;
              return true;
            }
          });
        }, function () {
          return _exit6;
        }), function (_result6) {
          var _exit7 = false;
          if (_exit6) return _result6;
          return _continue(_forOf(_this10.preloadEntries, function (_ref2) {
            var [name, resource] = _ref2;
            return _await(browserFileLoader.retryPrefetchResource("preload", name, resource), function (allDone) {
              if (allDone) {
                _exit7 = true;
                return true;
              }
            });
          }, function () {
            return _exit7;
          }), function (_result7) {
            return _exit7 ? _result7 : !counter.failedPreloadResources && counter.loadedResources == counter.totalResources;
          });
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "prefetchResourcesForShell",
    value: function prefetchResourcesForShell() {
      // FIXME: move to ShellFileLoader.
      console.assert(!isInBrowser);
      console.assert(this._scripts === null, "This initialization should be called only once.");
      this._scripts = this.files.map(file => shellFileLoader.load(file));
      console.assert(this._preloadBlobData.length === 0, "This initialization should be called only once.");
      this._shellPrefetchedResources = Object.create(null);
      for (var [name, resource] of this.preloadEntries) {
        var compressed = isCompressed(resource);
        if (compressed && !JetStreamParams.prefetchResources) {
          resource = uncompressedName(resource);
        }
        if (JetStreamParams.prefetchResources) {
          var bytes = new Int8Array(read(resource, "binary"));
          if (compressed) {
            bytes = zlib.decompress(bytes);
          }
          this._shellPrefetchedResources[resource] = bytes;
        }
        this._preloadBlobData.push({
          name,
          resource,
          blobURLOrPath: resource
        });
      }
    }
  }, {
    key: "allScoreIdentifiers",
    value: function allScoreIdentifiers() {
      var ids = Object.keys(this.allScores()).map(name => this.scoreIdentifier(name));
      return ids;
    }
  }, {
    key: "scoreIdentifier",
    value: function scoreIdentifier(scoreName) {
      return `results-cell-${this.name}-${scoreName}`;
    }
  }, {
    key: "allTimeIdentifiers",
    value: function allTimeIdentifiers() {
      var ids = Object.keys(this.allTimes()).map(name => this.timeIdentifier(name));
      return ids;
    }
  }, {
    key: "timeIdentifier",
    value: function timeIdentifier(scoreName) {
      return `results-cell-${this.name}-${scoreName}-time`;
    }
  }, {
    key: "updateUIBeforeRun",
    value: function updateUIBeforeRun() {
      if (!JetStreamParams.dumpJSONResults) this.updateConsoleBeforeRun();
      if (isInBrowser) this.updateUIBeforeRunInBrowser();
    }
  }, {
    key: "updateConsoleBeforeRun",
    value: function updateConsoleBeforeRun() {
      console.log(`Running ${this.name}:`);
    }
  }, {
    key: "updateUIBeforeRunInBrowser",
    value: function updateUIBeforeRunInBrowser() {
      var resultsBenchmarkUI = document.getElementById(`benchmark-${this.name}`);
      resultsBenchmarkUI.classList.add("benchmark-running");
      resultsBenchmarkUI.scrollIntoView({
        block: "nearest"
      });
      for (var id of this.allScoreIdentifiers()) document.getElementById(id).innerHTML = "...";
      for (var _id2 of this.allTimeIdentifiers()) document.getElementById(_id2).innerHTML = "...";
    }
  }, {
    key: "updateUIAfterRun",
    value: function updateUIAfterRun() {
      if (isInBrowser) this.updateUIAfterRunInBrowser();
      if (JetStreamParams.dumpJSONResults) return;
      this.updateConsoleAfterRun();
    }
  }, {
    key: "updateUIAfterRunInBrowser",
    value: function updateUIAfterRunInBrowser() {
      var benchmarkResultsUI = document.getElementById(`benchmark-${this.name}`);
      benchmarkResultsUI.classList.remove("benchmark-running");
      benchmarkResultsUI.classList.add("benchmark-done");
      for (var [name, value] of Object.entries(this.allScores())) document.getElementById(this.scoreIdentifier(name)).innerHTML = uiFriendlyScore(value);
      for (var [_name, _value2] of Object.entries(this.allTimes())) document.getElementById(this.timeIdentifier(_name)).innerHTML = uiFriendlyDuration(_value2);
      this.renderScatterPlot();
    }
  }, {
    key: "updateConsoleAfterRun",
    value: function updateConsoleAfterRun() {
      for (var [name, value] of Object.entries(this.allScores())) {
        if (!name.endsWith("Score")) name = `${name}-Score`;
        this.logMetric(name, shellFriendlyScore(value));
      }
      for (var [_name2, _value3] of Object.entries(this.allTimes())) {
        this.logMetric(`${_name2}-Time`, shellFriendlyDuration(_value3));
      }
      if (JetStreamParams.RAMification) {
        this.logMetric("Current Footprint", uiFriendlyNumber(this.currentFootprint));
        this.logMetric("Peak Footprint", uiFriendlyNumber(this.peakFootprint));
      }
      console.log("");
    }
  }, {
    key: "logMetric",
    value: function logMetric(name, value) {
      console.log(shellFriendlyLabel(`${this.name} ${name}`), value);
    }
  }, {
    key: "renderScatterPlot",
    value: function renderScatterPlot() {
      var plotContainer = document.getElementById(`plot-${this.name}`);
      if (!plotContainer || !this.results || this.results.length === 0) return;
      var scores = this.results.map(time => toScore(time));
      var scoreElement = document.getElementById(this.scoreIdentifier("Score"));
      var width = scoreElement.offsetWidth;
      var height = scoreElement.offsetHeight;
      var padding = 5;
      var maxResult = Math.max.apply(Math, _toConsumableArray(scores));
      var minResult = Math.min.apply(Math, _toConsumableArray(scores));
      var xRatio = (width - 2 * padding) / (scores.length - 1 || 1);
      var yRatio = (height - 2 * padding) / (maxResult - minResult || 1);
      var radius = Math.max(1.5, Math.min(2.5, 10 - this.iterations / 10));
      var circlesSVG = "";
      for (var i = 0; i < scores.length; i++) {
        var result = scores[i];
        var cx = padding + i * xRatio;
        var cy = height - padding - (result - minResult) * yRatio;
        var title = `Iteration ${i + 1}: ${uiFriendlyScore(result)} (${uiFriendlyDuration(this.results[i])})`;
        circlesSVG += `<circle cx="${cx}" cy="${cy}" r="${radius}"><title>${title}</title></circle>`;
      }
      plotContainer.innerHTML = `<svg width="${width}px" height="${height}px">${circlesSVG}</svg>`;
    }
  }]);
}();
;
var GroupedBenchmark = /*#__PURE__*/function (_Benchmark) {
  function GroupedBenchmark(plan, benchmarks) {
    var _this11;
    _classCallCheck(this, GroupedBenchmark);
    _this11 = _callSuper(this, GroupedBenchmark, [plan]);
    console.assert(benchmarks.length);
    for (var benchmark of benchmarks) {
      // FIXME: Tags don't work for grouped tests anyway but if they did then this would be weird and probably wrong.
      console.assert(!benchmark.hasAnyTag("Default"), `Grouped benchmark sub-benchmarks shouldn't have the "Default" tag`, benchmark.tags);
    }
    benchmarks.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1);
    _this11.benchmarks = benchmarks;
    return _this11;
  }
  _inherits(GroupedBenchmark, _Benchmark);
  return _createClass(GroupedBenchmark, [{
    key: "prefetchResourcesForBrowser",
    value: function prefetchResourcesForBrowser(counter) {
      try {
        var _this12 = this;
        return _await(_continueIgnored(_forOf(_this12.benchmarks, function (benchmark) {
          return _awaitIgnored(benchmark.prefetchResourcesForBrowser(counter));
        })));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "retryPrefetchResourcesForBrowser",
    value: function retryPrefetchResourcesForBrowser(counter) {
      try {
        var _this13 = this;
        return _await(_continueIgnored(_forOf(_this13.benchmarks, function (benchmark) {
          return _awaitIgnored(benchmark.retryPrefetchResourcesForBrowser(counter));
        })));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "prefetchResourcesForShell",
    value: function prefetchResourcesForShell() {
      for (var benchmark of this.benchmarks) benchmark.prefetchResourcesForShell();
    }
  }, {
    key: "renderHTML",
    value: function renderHTML() {
      var text = _superPropGet(GroupedBenchmark, "renderHTML", this, 3)([]);
      if (JetStreamParams.groupDetails) {
        for (var benchmark of this.benchmarks) text += benchmark.renderHTML();
      }
      return text;
    }
  }, {
    key: "updateConsoleBeforeRun",
    value: function updateConsoleBeforeRun() {
      if (!JetStreamParams.groupDetails) _superPropGet(GroupedBenchmark, "updateConsoleBeforeRun", this, 3)([]);
    }
  }, {
    key: "updateConsoleAfterRun",
    value: function updateConsoleAfterRun(scoreEntries) {
      if (JetStreamParams.groupDetails) _superPropGet(GroupedBenchmark, "updateConsoleBeforeRun", this, 3)([]);
      _superPropGet(GroupedBenchmark, "updateConsoleAfterRun", this, 3)([scoreEntries]);
    }
  }, {
    key: "files",
    get: function () {
      return this.benchmarks.flatMap(benchmark => benchmark.files);
    }
  }, {
    key: "preloadEntries",
    get: function () {
      return this.benchmarks.flatMap(benchmark => benchmark.preloadEntries);
    }
  }, {
    key: "run",
    value: function run() {
      try {
        var _exit8 = false;
        var _this14 = this;
        _this14._state = BenchmarkState.PREPARE;
        performance.mark(_this14.name);
        _this14.startTime = performance.now();
        var benchmark;
        return _await(_continue(_finallyRethrows(function () {
          return _catch(function () {
            _this14._state = BenchmarkState.RUNNING;
            return _continueIgnored(_forOf(_this14.benchmarks, function (benchmark) {
              if (JetStreamParams.groupDetails) benchmark.updateUIBeforeRun();
              return _await(benchmark.run(), function () {
                if (JetStreamParams.groupDetails) benchmark.updateUIAfterRun();
              });
            }));
          }, function (e) {
            _this14._state = BenchmarkState.ERROR;
            console.log(`Error in runCode of grouped benchmark ${benchmark.name}: `, e);
            console.log(e.stack);
            throw e;
          });
        }, function (_wasThrown, _result8) {
          _this14._state = BenchmarkState.FINALIZE;
          return _rethrow(_wasThrown, _result8);
        }), function (_result8) {
          if (_exit8) return _result8;
          _this14.endTime = performance.now();
          performance.measure(_this14.name, _this14.name);
          _this14.processResults();
          _this14._state = BenchmarkState.DONE;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "processResults",
    value: function processResults() {
      this.results = [];
      for (var benchmark of this.benchmarks) this.results = this.results.concat(benchmark.results);
    }
  }, {
    key: "subScores",
    value: function subScores() {
      var results = {};
      for (var benchmark of this.benchmarks) {
        var scores = benchmark.subScores();
        for (var subScore in scores) {
          results[subScore] ??= [];
          results[subScore].push(scores[subScore]);
        }
      }
      for (var _subScore in results) results[_subScore] = geomeanScore(results[_subScore]);
      return results;
    }
  }, {
    key: "subTimes",
    value: function subTimes() {
      var results = {};
      for (var benchmark of this.benchmarks) {
        var times = benchmark.subTimes();
        for (var subTime in times) {
          results[subTime] ??= [];
          results[subTime].push(times[subTime]);
        }
      }
      for (var _subTimes in results) results[_subTimes] = sum(results[_subTimes]);
      return results;
    }
  }]);
}(Benchmark);
;
var DefaultBenchmark = /*#__PURE__*/function (_Benchmark2) {
  function DefaultBenchmark(_ref3) {
    var _this15;
    var {
        worstCaseCount
      } = _ref3,
      args = _objectWithoutProperties(_ref3, _excluded);
    _classCallCheck(this, DefaultBenchmark);
    _this15 = _callSuper(this, DefaultBenchmark, [args]);
    _this15.worstCaseCount = _this15._processWorstCaseCount(worstCaseCount);
    _this15.firstIterationTime = null;
    _this15.firstIterationScore = null;
    _this15.worstTime = null;
    _this15.worstScore = null;
    _this15.averageTime = null;
    _this15.averageScore = null;
    if (_this15.worstCaseCount) console.assert(_this15.iterations > _this15.worstCaseCount);
    console.assert(_this15.worstCaseCount >= 0);
    return _this15;
  }
  _inherits(DefaultBenchmark, _Benchmark2);
  return _createClass(DefaultBenchmark, [{
    key: "processResults",
    value: function processResults(results) {
      results = _superPropGet(DefaultBenchmark, "processResults", this, 3)([results]);
      this.firstIterationTime = results[0];
      this.firstIterationScore = toScore(results[0]);
      results = results.slice(1);
      results.sort((a, b) => a < b ? 1 : -1);
      for (var i = 0; i + 1 < results.length; ++i) console.assert(results[i] >= results[i + 1]);
      if (this.worstCaseCount) {
        var worstCase = [];
        for (var _i2 = 0; _i2 < this.worstCaseCount; ++_i2) worstCase.push(results[_i2]);
        this.worstTime = mean(worstCase);
        this.worstScore = toScore(this.worstTime);
      }
      this.averageTime = mean(results);
      this.averageScore = toScore(this.averageTime);
    }
  }, {
    key: "subScores",
    value: function subScores() {
      var scores = {
        "First": this.firstIterationScore
      };
      if (this.worstCaseCount) scores["Worst"] = this.worstScore;
      if (this.iterations > 1) scores["Average"] = this.averageScore;
      return scores;
    }
  }, {
    key: "subTimes",
    value: function subTimes() {
      var times = {
        "First": this.firstIterationTime
      };
      if (this.worstCaseCount) times["Worst"] = this.worstTime;
      if (this.iterations > 1) times["Average"] = this.averageTime;
      return times;
    }
  }]);
}(Benchmark);
var AsyncBenchmark = /*#__PURE__*/function (_DefaultBenchmark) {
  function AsyncBenchmark() {
    _classCallCheck(this, AsyncBenchmark);
    return _callSuper(this, AsyncBenchmark, arguments);
  }
  _inherits(AsyncBenchmark, _DefaultBenchmark);
  return _createClass(AsyncBenchmark, [{
    key: "prerunCode",
    get: function () {
      var str = "";
      // FIXME: It would be nice if these were available to any benchmark not just async ones but since these functions
      // are async they would only work in a context where the benchmark is async anyway. Long term, we should do away
      // with this class and make all benchmarks async.
      if (isInBrowser) {
        str += `
                JetStream.getBinary = async function(blobURL) {
                    const response = await fetch(blobURL);
                    return new Int8Array(await response.arrayBuffer());
                };

                JetStream.getString = async function(blobURL) {
                    const response = await fetch(blobURL);
                    return response.text();
                };

                JetStream.dynamicImport = async function(blobURL) {
                    return await import(blobURL);
                };
            `;
      } else {
        str += `
                JetStream.getBinary = async function(path) {
                    if ("ShellPrefetchedResources" in globalThis) {
                        return ShellPrefetchedResources[path];
                    }
                    return new Int8Array(read(path, "binary"));
                };

                JetStream.getString = async function(path) {
                    if ("ShellPrefetchedResources" in globalThis) {
                        return new ShellTextDecoder().decode(ShellPrefetchedResources[path]);
                    }
                    return read(path);
                };

                JetStream.dynamicImport = async function(path) {
                    try {
                        // TODO: this skips the prefetched resources, but I'm
                        // not sure of a way around that.
                        return await import(path);
                    } catch (e) {
                        // In shells, relative imports require different paths, so try with and
                        // without the "./" prefix (e.g., JSC requires it).
                        return await import(path.slice("./".length))
                    }
                };
            `;
      }
      return str;
    }
  }, {
    key: "prepareForNextIterationCode",
    get: function () {
      return "await benchmark.prepareForNextIteration?.();";
    }
  }, {
    key: "runnerCode",
    get: function () {
      return `
        async function doRun() {
            const benchmark = new Benchmark(${JSON.stringify(this.benchmarkArguments)});
            await benchmark.init?.();
            const results = [];
            const benchmarkName = "${this.name}";

            for (let i = 0; i < ${this.iterations}; i++) {
                ${this.preIterationCode}

                const iterationMarkLabel = benchmarkName + "-iteration-" + i;
                const iterationStartMark = performance.mark(iterationMarkLabel);

                const start = performance.now();
                await benchmark.runIteration(i);
                const end = performance.now();

                performance.measure(iterationMarkLabel, iterationMarkLabel);

                ${this.postIterationCode}

                results.push(Math.max(1, end - start));
            }
            benchmark.validate?.(${this.iterations});
            top.currentResolve(results);
        };
        doRun().catch((error) => { top.currentReject(error); });`;
    }
  }]);
}(DefaultBenchmark);
;

// Meant for wasm benchmarks that are directly compiled with an emcc build script. It might not work for benchmarks built as
// part of a larger project's build system or a wasm benchmark compiled from a language that doesn't compile with emcc.
var WasmEMCCBenchmark = /*#__PURE__*/function (_AsyncBenchmark) {
  function WasmEMCCBenchmark() {
    _classCallCheck(this, WasmEMCCBenchmark);
    return _callSuper(this, WasmEMCCBenchmark, arguments);
  }
  _inherits(WasmEMCCBenchmark, _AsyncBenchmark);
  return _createClass(WasmEMCCBenchmark, [{
    key: "prerunCode",
    get: function () {
      var str = `
            let verbose = false;

            let globalObject = this;

            abort = quit = function() {
                if (verbose)
                    console.log('Intercepted quit/abort');
            };

            const oldPrint = globalObject.print;
            globalObject.print = globalObject.printErr = (...args) => {
                if (verbose)
                    console.log('Intercepted print: ', ...args);
            };

            let Module = {
                preRun: [],
                postRun: [],
                noInitialRun: true,
                print: print,
                printErr: printErr
            };

            globalObject.Module = Module;
            ${_superPropGet(WasmEMCCBenchmark, "prerunCode", this, 1)};
        `;
      return str;
    }
  }]);
}(AsyncBenchmark);
;
var WSLBenchmark = /*#__PURE__*/function (_Benchmark3) {
  function WSLBenchmark(plan) {
    var _this16;
    _classCallCheck(this, WSLBenchmark);
    _this16 = _callSuper(this, WSLBenchmark, [plan]);
    _this16.stdlibTime = null;
    _this16.stdlibScore = null;
    _this16.mainRunTime = null;
    _this16.mainRunScore = null;
    return _this16;
  }
  _inherits(WSLBenchmark, _Benchmark3);
  return _createClass(WSLBenchmark, [{
    key: "processResults",
    value: function processResults(results) {
      results = _superPropGet(WSLBenchmark, "processResults", this, 3)([results]);
      this.stdlibTime = results[0];
      this.stdlibScore = toScore(results[0]);
      this.mainRunTime = results[1];
      this.mainRunScore = toScore(results[1]);
    }
  }, {
    key: "runnerCode",
    get: function () {
      return `{
            const benchmark = new Benchmark(${JSON.stringify(this.benchmarkArguments)});
            const benchmarkName = "${this.name}";

            const results = [];
            {
                const markLabel = benchmarkName + "-stdlib";
                const startMark = performance.mark(markLabel);

                const start = performance.now();
                benchmark.buildStdlib();
                results.push(performance.now() - start);

                performance.measure(markLabel, markLabel);
            }

            {
                const markLabel = benchmarkName + "-mainRun";
                const startMark = performance.mark(markLabel);

                const start = performance.now();
                benchmark.run();
                results.push(performance.now() - start);

                performance.measure(markLabel, markLabel);
            }
            top.currentResolve(results);
        }`;
    }
  }, {
    key: "subTimes",
    value: function subTimes() {
      return {
        "Stdlib": this.stdlibTime,
        "MainRun": this.mainRunTime
      };
    }
  }, {
    key: "subScores",
    value: function subScores() {
      return {
        "Stdlib": this.stdlibScore,
        "MainRun": this.mainRunScore
      };
    }
  }]);
}(Benchmark);
;
var AsyncWasmLegacyBenchmark = /*#__PURE__*/function (_Benchmark4) {
  function AsyncWasmLegacyBenchmark(plan) {
    var _this17;
    _classCallCheck(this, AsyncWasmLegacyBenchmark);
    _this17 = _callSuper(this, AsyncWasmLegacyBenchmark, [plan]);
    _this17.startupTime = null;
    _this17.startupScore = null;
    _this17.runTime = null;
    _this17.runScore = null;
    return _this17;
  }
  _inherits(AsyncWasmLegacyBenchmark, _Benchmark4);
  return _createClass(AsyncWasmLegacyBenchmark, [{
    key: "processResults",
    value: function processResults(results) {
      results = _superPropGet(AsyncWasmLegacyBenchmark, "processResults", this, 3)([results]);
      this.startupTime = results[0];
      this.startupScore = toScore(results[0]);
      this.runTime = results[1];
      this.runScore = toScore(results[1]);
    }
  }, {
    key: "prerunCode",
    get: function () {
      var str = `
            let verbose = false;

            let compileTime = null;
            let runTime = null;

            let globalObject = this;

            globalObject.benchmarkTime = performance.now.bind(performance);

            globalObject.reportCompileTime = (t) => {
                if (compileTime !== null)
                    throw new Error("called report compile time twice");
                compileTime = t;
            };

            globalObject.reportRunTime = (t) => {
                if (runTime !== null)
                    throw new Error("called report run time twice")
                runTime = t;
                top.currentResolve([compileTime, runTime]);
            };

            abort = quit = function() {
                if (verbose)
                    console.log('Intercepted quit/abort');
            };

            const oldConsoleLog = globalObject.console.log;
            globalObject.print = globalObject.printErr = (...args) => {
                if (verbose)
                    oldConsoleLog('Intercepted print: ', ...args);
            };

            let Module = {
                preRun: [],
                postRun: [],
                print: globalObject.print,
                printErr: globalObject.print
            };
            globalObject.Module = Module;
        `;
      return str;
    }
  }, {
    key: "runnerCode",
    get: function () {
      var str = `JetStream.loadBlob = function(key, path, andThen) {`;
      if (isInBrowser) {
        str += `
                const xhr = new XMLHttpRequest();
                xhr.open('GET', path, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function() {
                    Module[key] = new Int8Array(xhr.response);
                    andThen();
                };
                xhr.send(null);
            `;
      } else {
        str += `
            if (ShellPrefetchedResources) {
                Module[key] = ShellPrefetchedResources[path];
            } else {
                Module[key] = new Int8Array(read(path, "binary"));
            }
            if (andThen == doRun) {
                globalObject.read = (...args) => {
                    console.log("should not be inside read: ", ...args);
                    throw new Error;
                };
            };

            Promise.resolve(42).then(() => {
                try {
                    andThen();
                } catch(e) {
                    console.log("error running wasm:", e);
                    console.log(e.stack);
                    throw e;
                }
            });
            `;
      }
      str += "};\n";
      var preloadCount = 0;
      for (var [name, resource] of this.preloadEntries) {
        preloadCount++;
        str += `JetStream.loadBlob(${JSON.stringify(name)}, "${resource}", () => {\n`;
      }
      str += `doRun().catch((e) => {
            console.log("error running wasm:", e);
            console.log(e.stack)
            throw e;
        });`;
      for (var i = 0; i < preloadCount; ++i) {
        str += `})`;
      }
      str += `;`;
      return str;
    }
  }, {
    key: "subScores",
    value: function subScores() {
      return {
        "Startup": this.startupScore,
        "Runtime": this.runScore
      };
    }
  }, {
    key: "subTimes",
    value: function subTimes() {
      return {
        "Startup": this.startupTime,
        "Runtime": this.runTime
      };
    }
  }]);
}(Benchmark);
;
function dotnetPreloads(type) {
  return {
    dotnetUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/dotnet.js`,
    dotnetNativeUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/dotnet.native.js`,
    dotnetRuntimeUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/dotnet.runtime.js`,
    wasmBinaryUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/dotnet.native.wasm`,
    icuCustomUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/icudt_CJK.dat`,
    dllCollectionsConcurrentUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Collections.Concurrent.wasm`,
    dllCollectionsUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Collections.wasm`,
    dllComponentModelPrimitivesUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.ComponentModel.Primitives.wasm`,
    dllComponentModelTypeConverterUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.ComponentModel.TypeConverter.wasm`,
    dllDrawingPrimitivesUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Drawing.Primitives.wasm`,
    dllDrawingUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Drawing.wasm`,
    dllIOPipelinesUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.IO.Pipelines.wasm`,
    dllLinqUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Linq.wasm`,
    dllMemoryUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Memory.wasm`,
    dllObjectModelUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.ObjectModel.wasm`,
    dllPrivateCorelibUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Private.CoreLib.wasm`,
    dllRuntimeInteropServicesJavaScriptUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Runtime.InteropServices.JavaScript.wasm`,
    dllTextEncodingsWebUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Text.Encodings.Web.wasm`,
    dllTextJsonUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/System.Text.Json.wasm`,
    dllAppUrl: `./wasm/dotnet/build-${type}/wwwroot/_framework/dotnet.wasm`
  };
}
var BENCHMARKS = [
// ARES
new DefaultBenchmark({
  name: "Air",
  files: ["./ARES-6/Air/symbols.js", "./ARES-6/Air/tmp_base.js", "./ARES-6/Air/arg.js", "./ARES-6/Air/basic_block.js", "./ARES-6/Air/code.js", "./ARES-6/Air/frequented_block.js", "./ARES-6/Air/inst.js", "./ARES-6/Air/opcode.js", "./ARES-6/Air/reg.js", "./ARES-6/Air/stack_slot.js", "./ARES-6/Air/tmp.js", "./ARES-6/Air/util.js", "./ARES-6/Air/custom.js", "./ARES-6/Air/liveness.js", "./ARES-6/Air/insertion_set.js", "./ARES-6/Air/allocate_stack.js", "./ARES-6/Air/payload-gbemu-executeIteration.js", "./ARES-6/Air/payload-imaging-gaussian-blur-gaussianBlur.js", "./ARES-6/Air/payload-airjs-ACLj8C.js", "./ARES-6/Air/payload-typescript-scanIdentifier.js", "./ARES-6/Air/benchmark.js"],
  tags: ["default", "js", "ARES"]
}), new DefaultBenchmark({
  name: "Basic",
  files: ["./ARES-6/Basic/ast.js", "./ARES-6/Basic/basic.js", "./ARES-6/Basic/caseless_map.js", "./ARES-6/Basic/lexer.js", "./ARES-6/Basic/number.js", "./ARES-6/Basic/parser.js", "./ARES-6/Basic/random.js", "./ARES-6/Basic/state.js", "./ARES-6/Basic/benchmark.js"],
  tags: ["default", "js", "ARES"]
}), new DefaultBenchmark({
  name: "ML",
  files: ["./ARES-6/ml/index.js", "./ARES-6/ml/benchmark.js"],
  iterations: 60,
  tags: ["default", "js", "ARES"]
}), new AsyncBenchmark({
  name: "Babylon",
  files: ["./ARES-6/Babylon/index.js", "./ARES-6/Babylon/benchmark.js"],
  preload: {
    airBlob: "./ARES-6/Babylon/air-blob.js",
    basicBlob: "./ARES-6/Babylon/basic-blob.js",
    inspectorBlob: "./ARES-6/Babylon/inspector-blob.js",
    babylonBlob: "./ARES-6/Babylon/babylon-blob.js"
  },
  tags: ["default", "js", "ARES"],
  allowUtf16: true
}),
// CDJS
new DefaultBenchmark({
  name: "cdjs",
  files: ["./cdjs/constants.js", "./cdjs/util.js", "./cdjs/red_black_tree.js", "./cdjs/call_sign.js", "./cdjs/vector_2d.js", "./cdjs/vector_3d.js", "./cdjs/motion.js", "./cdjs/reduce_collision_set.js", "./cdjs/simulator.js", "./cdjs/collision.js", "./cdjs/collision_detector.js", "./cdjs/benchmark.js"],
  iterations: 60,
  worstCaseCount: 3,
  tags: ["default", "js"]
}),
// CodeLoad
new AsyncBenchmark({
  name: "first-inspector-code-load",
  files: ["./code-load/code-first-load.js"],
  preload: {
    inspectorPayloadBlob: "./code-load/inspector-payload-minified.js"
  },
  tags: ["default", "js", "inspector", "codeload"]
}), new AsyncBenchmark({
  name: "multi-inspector-code-load",
  files: ["./code-load/code-multi-load.js"],
  preload: {
    inspectorPayloadBlob: "./code-load/inspector-payload-minified.js"
  },
  tags: ["default", "js", "inspector", "codeload"]
}),
// Octane
new DefaultBenchmark({
  name: "Box2D",
  files: ["./Octane/box2d.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "octane-code-load",
  files: ["./Octane/code-first-load.js"],
  deterministicRandom: true,
  tags: ["default", "js", "codeload", "Octane"]
}), new DefaultBenchmark({
  name: "crypto",
  files: ["./Octane/crypto.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "delta-blue",
  files: ["./Octane/deltablue.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "earley-boyer",
  files: ["./Octane/earley-boyer.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "gbemu",
  files: ["./Octane/gbemu-part1.js", "./Octane/gbemu-part2.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "mandreel",
  files: ["./Octane/mandreel.js"],
  iterations: 80,
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "navier-stokes",
  files: ["./Octane/navier-stokes.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "pdfjs",
  files: ["./Octane/pdfjs.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "raytrace",
  files: ["./Octane/raytrace.js"],
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "regexp-octane",
  files: ["./Octane/regexp.js"],
  deterministicRandom: true,
  tags: ["default", "js", "regexp", "Octane"]
}), new DefaultBenchmark({
  name: "richards",
  files: ["./Octane/richards.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "splay",
  files: ["./Octane/splay.js"],
  deterministicRandom: true,
  tags: ["default", "js", "Octane"]
}), new DefaultBenchmark({
  name: "typescript-octane",
  files: ["./Octane/typescript-compiler.js", "./Octane/typescript-input.js", "./Octane/typescript.js"],
  iterations: 15,
  worstCaseCount: 2,
  deterministicRandom: true,
  tags: ["Octane", "js", "typescript"]
}),
// RexBench
new DefaultBenchmark({
  name: "FlightPlanner",
  files: ["./RexBench/FlightPlanner/airways.js", "./RexBench/FlightPlanner/waypoints.js.z", "./RexBench/FlightPlanner/flight_planner.js", "./RexBench/FlightPlanner/expectations.js", "./RexBench/FlightPlanner/benchmark.js"],
  tags: ["default", "js", "RexBench"]
}), new DefaultBenchmark({
  name: "OfflineAssembler",
  files: ["./RexBench/OfflineAssembler/registers.js", "./RexBench/OfflineAssembler/instructions.js", "./RexBench/OfflineAssembler/ast.js", "./RexBench/OfflineAssembler/parser.js", "./RexBench/OfflineAssembler/file.js", "./RexBench/OfflineAssembler/LowLevelInterpreter.js", "./RexBench/OfflineAssembler/LowLevelInterpreter32_64.js", "./RexBench/OfflineAssembler/LowLevelInterpreter64.js", "./RexBench/OfflineAssembler/InitBytecodes.js", "./RexBench/OfflineAssembler/expected.js", "./RexBench/OfflineAssembler/benchmark.js"],
  iterations: 80,
  tags: ["default", "js", "RexBench"]
}), new DefaultBenchmark({
  name: "UniPoker",
  files: ["./RexBench/UniPoker/poker.js", "./RexBench/UniPoker/expected.js", "./RexBench/UniPoker/benchmark.js"],
  deterministicRandom: true,
  // FIXME: UniPoker should not access isInBrowser.
  exposeBrowserTest: true,
  tags: ["default", "js", "RexBench"]
}), new DefaultBenchmark({
  name: "validatorjs",
  files: [
  // Use the unminified version for easier local profiling.
  // "./validatorjs/dist/bundle.es6.js",
  "./validatorjs/dist/bundle.es6.min.js", "./validatorjs/benchmark.js"],
  tags: ["default", "js", "regexp"]
}),
// Simple
new DefaultBenchmark({
  name: "hash-map",
  files: ["./simple/hash-map.js"],
  tags: ["default", "js", "Simple"]
}), new AsyncBenchmark({
  name: "doxbee-promise",
  files: ["./simple/doxbee-promise.js"],
  tags: ["default", "js", "promise", "Simple"]
}), new AsyncBenchmark({
  name: "doxbee-async",
  files: ["./simple/doxbee-async.js"],
  tags: ["default", "js", "Simple"]
}),
// SeaMonster
new DefaultBenchmark({
  name: "ai-astar",
  files: ["./SeaMonster/ai-astar.js"],
  tags: ["default", "js", "SeaMonster"]
}), new DefaultBenchmark({
  name: "gaussian-blur",
  files: ["./SeaMonster/gaussian-blur.js"],
  tags: ["default", "js", "SeaMonster"]
}), new DefaultBenchmark({
  name: "stanford-crypto-aes",
  files: ["./SeaMonster/sjlc.js", "./SeaMonster/stanford-crypto-aes.js"],
  tags: ["default", "js", "SeaMonster"]
}), new DefaultBenchmark({
  name: "stanford-crypto-pbkdf2",
  files: ["./SeaMonster/sjlc.js", "./SeaMonster/stanford-crypto-pbkdf2.js"],
  tags: ["default", "js", "SeaMonster"]
}), new DefaultBenchmark({
  name: "stanford-crypto-sha256",
  files: ["./SeaMonster/sjlc.js", "./SeaMonster/stanford-crypto-sha256.js"],
  tags: ["default", "js", "SeaMonster"]
}), new DefaultBenchmark({
  name: "json-stringify-inspector",
  files: ["./SeaMonster/inspector-json-payload.js.z", "./SeaMonster/json-stringify-inspector.js"],
  iterations: 20,
  worstCaseCount: 2,
  tags: ["default", "js", "json", "inspector", "SeaMonster"]
}), new DefaultBenchmark({
  name: "json-parse-inspector",
  files: ["./SeaMonster/inspector-json-payload.js.z", "./SeaMonster/json-parse-inspector.js"],
  iterations: 20,
  worstCaseCount: 2,
  tags: ["default", "js", "json", "inspector", "SeaMonster"]
}),
// BigInt
new AsyncBenchmark({
  name: "bigint-noble-bls12-381",
  files: ["./bigint/web-crypto-sham.js", "./bigint/noble-bls12-381-bundle.js", "./bigint/noble-benchmark.js"],
  iterations: 4,
  worstCaseCount: 1,
  deterministicRandom: true,
  tags: ["js", "bigint", "BigIntNoble"]
}), new AsyncBenchmark({
  name: "bigint-noble-secp256k1",
  files: ["./bigint/web-crypto-sham.js", "./bigint/noble-secp256k1-bundle.js", "./bigint/noble-benchmark.js"],
  deterministicRandom: true,
  tags: ["js", "bigint", "BigIntNoble"]
}), new AsyncBenchmark({
  name: "bigint-noble-ed25519",
  files: ["./bigint/web-crypto-sham.js", "./bigint/noble-ed25519-bundle.js", "./bigint/noble-benchmark.js"],
  iterations: 30,
  deterministicRandom: true,
  tags: ["default", "js", "bigint", "BigIntNoble"]
}), new DefaultBenchmark({
  name: "bigint-paillier",
  files: ["./bigint/web-crypto-sham.js", "./bigint/paillier-bundle.js", "./bigint/paillier-benchmark.js"],
  iterations: 10,
  worstCaseCount: 2,
  deterministicRandom: true,
  tags: ["js", "bigint", "BigIntMisc"]
}), new DefaultBenchmark({
  name: "bigint-bigdenary",
  files: ["./bigint/bigdenary-bundle.js", "./bigint/bigdenary-benchmark.js"],
  iterations: 160,
  worstCaseCount: 16,
  tags: ["js", "bigint", "BigIntMisc"]
}),
// Proxy
new AsyncBenchmark({
  name: "proxy-mobx",
  files: ["./proxy/common.js", "./proxy/mobx-bundle.js", "./proxy/mobx-benchmark.js"],
  iterations: defaultIterationCount * 3,
  worstCaseCount: defaultWorstCaseCount * 3,
  tags: ["default", "js", "Proxy"]
}), new AsyncBenchmark({
  name: "proxy-vue",
  files: ["./proxy/common.js", "./proxy/vue-bundle.js", "./proxy/vue-benchmark.js"],
  tags: ["default", "js", "Proxy"]
}), new AsyncBenchmark({
  name: "mobx-startup",
  files: ["./utils/StartupBenchmark.js", "./mobx/benchmark.js"],
  preload: {
    // Debug Sources for nicer profiling.
    // BUNDLE: "./mobx/dist/bundle.es6.js",
    BUNDLE: "./mobx/dist/bundle.es6.min.js"
  },
  tags: ["default", "js", "mobx", "startup", "es6"],
  iterations: 30,
  worstCaseCount: 3
}), new AsyncBenchmark({
  name: "jsdom-d3-startup",
  files: ["./utils/StartupBenchmark.js", "./jsdom-d3-startup/benchmark.js"],
  preload: {
    // Unminified sources for profiling.
    // BUNDLE: "./jsdom-d3-startup/dist/bundle.js",
    BUNDLE: "./jsdom-d3-startup/dist/bundle.min.js",
    US_DATA: "./jsdom-d3-startup/data/counties-albers-10m.json",
    AIRPORTS: "./jsdom-d3-startup/data/airports.csv"
  },
  tags: ["default", "js", "d3", "startup", "jsdom"],
  iterations: 15,
  worstCaseCount: 2
}), new AsyncBenchmark({
  name: "web-ssr",
  files: ["./utils/StartupBenchmark.js", "./web-ssr/benchmark.js"],
  preload: {
    // Debug Sources for nicer profiling.
    // BUNDLE: "./web-ssr/dist/bundle.js",
    BUNDLE: "./web-ssr/dist/bundle.min.js"
  },
  tags: ["default", "js", "web", "ssr"],
  iterations: 30
}),
// Class fields
new DefaultBenchmark({
  name: "raytrace-public-class-fields",
  files: ["./class-fields/raytrace-public-class-fields.js"],
  tags: ["default", "js", "ClassFields"]
}), new DefaultBenchmark({
  name: "raytrace-private-class-fields",
  files: ["./class-fields/raytrace-private-class-fields.js"],
  tags: ["default", "js", "ClassFields"]
}), new AsyncBenchmark({
  name: "typescript-lib",
  files: ["./TypeScript/src/mock/sys.js", "./TypeScript/dist/bundle.js", "./TypeScript/benchmark.js"],
  preload: {
    // Large test project:
    // "tsconfig": "./TypeScript/src/gen/zod-medium/tsconfig.json",
    // "files": "./TypeScript/src/gen/zod-medium/files.json",
    "tsconfig": "./TypeScript/src/gen/immer-tiny/tsconfig.json",
    "files": "./TypeScript/src/gen/immer-tiny/files.json"
  },
  iterations: 1,
  worstCaseCount: 0,
  tags: ["default", "js", "typescript"]
}),
// Generators
new AsyncBenchmark({
  name: "async-fs",
  files: ["./generators/async-file-system.js"],
  iterations: 80,
  worstCaseCount: 6,
  deterministicRandom: true,
  tags: ["default", "js", "Generators"]
}), new DefaultBenchmark({
  name: "sync-fs",
  files: ["./generators/sync-file-system.js"],
  iterations: 80,
  worstCaseCount: 6,
  deterministicRandom: true,
  tags: ["default", "js", "Generators"]
}), new DefaultBenchmark({
  name: "lazy-collections",
  files: ["./generators/lazy-collections.js"],
  tags: ["default", "js", "Generators"]
}), new DefaultBenchmark({
  name: "js-tokens",
  files: ["./generators/js-tokens.js"],
  tags: ["default", "js", "Generators"]
}), new DefaultBenchmark({
  name: "threejs",
  files: ["./threejs/three.js", "./threejs/benchmark.js"],
  deterministicRandom: true,
  tags: ["default", "js"]
}),
// Wasm
new WasmEMCCBenchmark({
  name: "HashSet-wasm",
  files: ["./wasm/HashSet/build/HashSet.js", "./wasm/HashSet/benchmark.js"],
  preload: {
    wasmBinary: "./wasm/HashSet/build/HashSet.wasm"
  },
  iterations: 50,
  // No longer run by-default: We have more realistic Wasm workloads by
  // now, and it was over-incentivizing inlining.
  tags: ["Wasm"]
}), new WasmEMCCBenchmark({
  name: "quicksort-wasm",
  files: ["./wasm/quicksort/build/quicksort.js", "./wasm/quicksort/benchmark.js"],
  preload: {
    wasmBinary: "./wasm/quicksort/build/quicksort.wasm"
  },
  iterations: 50,
  // No longer run by-default: We have more realistic Wasm workloads by
  // now, and it was a small microbenchmark.
  tags: ["Wasm"]
}), new WasmEMCCBenchmark({
  name: "gcc-loops-wasm",
  files: ["./wasm/gcc-loops/build/gcc-loops.js", "./wasm/gcc-loops/benchmark.js"],
  preload: {
    wasmBinary: "./wasm/gcc-loops/build/gcc-loops.wasm"
  },
  iterations: 50,
  // No longer run by-default: We have more realistic Wasm workloads by
  // now, and it was a small microbenchmark.
  tags: ["Wasm"]
}), new WasmEMCCBenchmark({
  name: "tsf-wasm",
  files: ["./wasm/TSF/build/tsf.js", "./wasm/TSF/benchmark.js"],
  preload: {
    wasmBinary: "./wasm/TSF/build/tsf.wasm"
  },
  iterations: 50,
  tags: ["default", "Wasm"]
}), new WasmEMCCBenchmark({
  name: "richards-wasm",
  files: ["./wasm/richards/build/richards.js", "./wasm/richards/benchmark.js"],
  preload: {
    wasmBinary: "./wasm/richards/build/richards.wasm"
  },
  iterations: 50,
  tags: ["default", "Wasm"]
}), new WasmEMCCBenchmark({
  name: "sqlite3-wasm",
  files: ["./utils/polyfills/fast-text-encoding/1.0.3/text.js", "./sqlite3/benchmark.js", "./sqlite3/build/jswasm/speedtest1.js"],
  preload: {
    wasmBinary: "./sqlite3/build/jswasm/speedtest1.wasm"
  },
  iterations: 30,
  worstCaseCount: 2,
  tags: ["default", "Wasm"]
}), new WasmEMCCBenchmark({
  name: "Dart-flute-complex-wasm",
  files: ["./Dart/benchmark.js"],
  preload: {
    jsModule: "./Dart/build/flute.complex.dart2wasm.mjs",
    wasmBinary: "./Dart/build/flute.complex.dart2wasm.wasm"
  },
  iterations: 15,
  worstCaseCount: 2,
  // Not run by default because the `CupertinoTimePicker` widget is very allocation-heavy,
  // leading to an unrealistic GC-dominated workload. See
  // https://github.com/WebKit/JetStream/pull/97#issuecomment-3139924169
  // The todomvc workload below is less allocation heavy and a replacement for now.
  // TODO: Revisit, once Dart/Flutter worked on this widget or workload.
  tags: ["Wasm"]
}), new WasmEMCCBenchmark({
  name: "Dart-flute-todomvc-wasm",
  files: ["./Dart/benchmark.js"],
  preload: {
    jsModule: "./Dart/build/flute.todomvc.dart2wasm.mjs",
    wasmBinary: "./Dart/build/flute.todomvc.dart2wasm.wasm"
  },
  iterations: 30,
  worstCaseCount: 2,
  tags: ["default", "Wasm"]
}), new WasmEMCCBenchmark({
  name: "Kotlin-compose-wasm",
  files: ["./Kotlin-compose/benchmark.js"],
  preload: {
    skikoJsModule: "./Kotlin-compose/build/skiko.mjs",
    skikoWasmBinary: "./Kotlin-compose/build/skiko.wasm",
    composeJsModule: "./Kotlin-compose/build/compose-benchmarks-benchmarks.uninstantiated.mjs",
    composeWasmBinary: "./Kotlin-compose/build/compose-benchmarks-benchmarks.wasm",
    inputImageCompose: "./Kotlin-compose/build/compose-multiplatform.png",
    inputImageCat: "./Kotlin-compose/build/example1_cat.jpg",
    inputImageComposeCommunity: "./Kotlin-compose/build/example1_compose-community-primary.png",
    inputFontItalic: "./Kotlin-compose/build/jetbrainsmono_italic.ttf",
    inputFontRegular: "./Kotlin-compose/build/jetbrainsmono_regular.ttf"
  },
  iterations: 5,
  worstCaseCount: 1,
  tags: ["default", "Wasm"]
}), new AsyncBenchmark({
  name: "transformersjs-bert-wasm",
  files: ["./utils/polyfills/fast-text-encoding/1.0.3/text.js", "./transformersjs/benchmark.js", "./transformersjs/task-bert.js"],
  preload: {
    transformersJsModule: "./transformersjs/build/transformers.js",
    onnxJsModule: "./transformersjs/build/onnxruntime-web/ort-wasm-simd-threaded.mjs",
    onnxWasmBinary: "./transformersjs/build/onnxruntime-web/ort-wasm-simd-threaded.wasm",
    modelWeights: "./transformersjs/build/models/Xenova/distilbert-base-uncased-finetuned-sst-2-english/onnx/model_uint8.onnx",
    modelConfig: "./transformersjs/build/models/Xenova/distilbert-base-uncased-finetuned-sst-2-english/config.json",
    modelTokenizer: "./transformersjs/build/models/Xenova/distilbert-base-uncased-finetuned-sst-2-english/tokenizer.json",
    modelTokenizerConfig: "./transformersjs/build/models/Xenova/distilbert-base-uncased-finetuned-sst-2-english/tokenizer_config.json"
  },
  iterations: 30,
  allowUtf16: true,
  tags: ["default", "Wasm", "transformersjs"]
}), new AsyncBenchmark({
  name: "transformersjs-whisper-wasm",
  files: ["./utils/polyfills/fast-text-encoding/1.0.3/text.js", "./transformersjs/benchmark.js", "./transformersjs/task-whisper.js"],
  preload: {
    transformersJsModule: "./transformersjs/build/transformers.js",
    onnxJsModule: "./transformersjs/build/onnxruntime-web/ort-wasm-simd-threaded.mjs",
    onnxWasmBinary: "./transformersjs/build/onnxruntime-web/ort-wasm-simd-threaded.wasm",
    modelEncoderWeights: "./transformersjs/build/models/Xenova/whisper-tiny.en/onnx/encoder_model_quantized.onnx",
    modelDecoderWeights: "./transformersjs/build/models/Xenova/whisper-tiny.en/onnx/decoder_model_merged_quantized.onnx",
    modelConfig: "./transformersjs/build/models/Xenova/whisper-tiny.en/config.json",
    modelTokenizer: "./transformersjs/build/models/Xenova/whisper-tiny.en/tokenizer.json",
    modelTokenizerConfig: "./transformersjs/build/models/Xenova/whisper-tiny.en/tokenizer_config.json",
    modelPreprocessorConfig: "./transformersjs/build/models/Xenova/whisper-tiny.en/preprocessor_config.json",
    modelGenerationConfig: "./transformersjs/build/models/Xenova/whisper-tiny.en/generation_config.json",
    inputFile: "./transformersjs/build/inputs/jfk.raw"
  },
  iterations: 5,
  worstCaseCount: 1,
  allowUtf16: true,
  tags: ["Wasm", "transformersjs"]
}), new AsyncWasmLegacyBenchmark({
  name: "tfjs-wasm",
  files: ["./wasm/tfjs-model-helpers.js", "./wasm/tfjs-model-mobilenet-v3.js", "./wasm/tfjs-model-mobilenet-v1.js", "./wasm/tfjs-model-coco-ssd.js", "./wasm/tfjs-model-use.js", "./wasm/tfjs-model-use-vocab.js", "./wasm/tfjs-bundle.js", "./wasm/tfjs.js", "./wasm/tfjs-benchmark.js"],
  preload: {
    tfjsBackendWasmBlob: "./wasm/tfjs-backend-wasm.wasm"
  },
  deterministicRandom: true,
  exposeBrowserTest: true,
  allowUtf16: true,
  tags: ["Wasm"]
}), new AsyncWasmLegacyBenchmark({
  name: "tfjs-wasm-simd",
  files: ["./wasm/tfjs-model-helpers.js", "./wasm/tfjs-model-mobilenet-v3.js", "./wasm/tfjs-model-mobilenet-v1.js", "./wasm/tfjs-model-coco-ssd.js", "./wasm/tfjs-model-use.js", "./wasm/tfjs-model-use-vocab.js", "./wasm/tfjs-bundle.js", "./wasm/tfjs.js", "./wasm/tfjs-benchmark.js"],
  preload: {
    tfjsBackendWasmSimdBlob: "./wasm/tfjs-backend-wasm-simd.wasm"
  },
  deterministicRandom: true,
  exposeBrowserTest: true,
  allowUtf16: true,
  tags: ["Wasm"]
}), new WasmEMCCBenchmark({
  name: "argon2-wasm",
  files: ["./wasm/argon2/build/argon2.js", "./wasm/argon2/benchmark.js"],
  preload: {
    wasmBinary: "./wasm/argon2/build/argon2.wasm.z"
  },
  iterations: 30,
  worstCaseCount: 3,
  deterministicRandom: true,
  allowUtf16: true,
  tags: ["default", "Wasm"]
}), new AsyncBenchmark({
  name: "babylonjs-startup-es5",
  files: ["./utils/StartupBenchmark.js", "./babylonjs/benchmark/startup.js"],
  preload: {
    BUNDLE: "./babylonjs/dist/bundle.es5.min.js"
  },
  args: {
    expectedCacheCommentCount: 23988
  },
  tags: ["startup", "js", "class", "es5", "babylonjs"],
  iterations: 10
}), new AsyncBenchmark({
  name: "babylonjs-startup-es6",
  files: ["./utils/StartupBenchmark.js", "./babylonjs/benchmark/startup.js"],
  preload: {
    BUNDLE: "./babylonjs/dist/bundle.es6.min.js"
  },
  args: {
    expectedCacheCommentCount: 21222
  },
  tags: ["Default", "js", "startup", "class", "es6", "babylonjs"],
  iterations: 10
}), new AsyncBenchmark({
  name: "babylonjs-scene-es5",
  files: [
  // Use non-minified sources for easier profiling:
  // "./babylonjs/dist/bundle.es5.js",
  "./babylonjs/dist/bundle.es5.min.js", "./babylonjs/benchmark/scene.js"],
  preload: {
    PARTICLES_BLOB: "./babylonjs/data/particles.json",
    PIRATE_FORT_BLOB: "./babylonjs/data/pirateFort.glb",
    CANNON_BLOB: "./babylonjs/data/cannon.glb"
  },
  tags: ["scene", "js", "es5", "babylonjs"],
  iterations: 5
}), new AsyncBenchmark({
  name: "babylonjs-scene-es6",
  files: [
  // Use non-minified sources for easier profiling:
  // "./babylonjs/dist/bundle.es6.js",
  "./babylonjs/dist/bundle.es6.min.js", "./babylonjs/benchmark/scene.js"],
  preload: {
    PARTICLES_BLOB: "./babylonjs/data/particles.json",
    PIRATE_FORT_BLOB: "./babylonjs/data/pirateFort.glb",
    CANNON_BLOB: "./babylonjs/data/cannon.glb"
  },
  tags: ["Default", "js", "scene", "es6", "babylonjs"],
  iterations: 5
}),
// WorkerTests
new AsyncBenchmark({
  name: "bomb-workers",
  files: ["./worker/bomb.js"],
  exposeBrowserTest: true,
  iterations: 80,
  preload: {
    rayTrace3D: "./worker/bomb-subtests/3d-raytrace.js",
    accessNbody: "./worker/bomb-subtests/access-nbody.js",
    morph3D: "./worker/bomb-subtests/3d-morph.js",
    cube3D: "./worker/bomb-subtests/3d-cube.js",
    accessFunnkuch: "./worker/bomb-subtests/access-fannkuch.js",
    accessBinaryTrees: "./worker/bomb-subtests/access-binary-trees.js",
    accessNsieve: "./worker/bomb-subtests/access-nsieve.js",
    bitopsBitwiseAnd: "./worker/bomb-subtests/bitops-bitwise-and.js",
    bitopsNsieveBits: "./worker/bomb-subtests/bitops-nsieve-bits.js",
    controlflowRecursive: "./worker/bomb-subtests/controlflow-recursive.js",
    bitops3BitBitsInByte: "./worker/bomb-subtests/bitops-3bit-bits-in-byte.js",
    botopsBitsInByte: "./worker/bomb-subtests/bitops-bits-in-byte.js",
    cryptoAES: "./worker/bomb-subtests/crypto-aes.js",
    cryptoMD5: "./worker/bomb-subtests/crypto-md5.js",
    cryptoSHA1: "./worker/bomb-subtests/crypto-sha1.js",
    dateFormatTofte: "./worker/bomb-subtests/date-format-tofte.js",
    dateFormatXparb: "./worker/bomb-subtests/date-format-xparb.js",
    mathCordic: "./worker/bomb-subtests/math-cordic.js",
    mathPartialSums: "./worker/bomb-subtests/math-partial-sums.js",
    mathSpectralNorm: "./worker/bomb-subtests/math-spectral-norm.js",
    stringBase64: "./worker/bomb-subtests/string-base64.js",
    stringFasta: "./worker/bomb-subtests/string-fasta.js",
    stringValidateInput: "./worker/bomb-subtests/string-validate-input.js",
    stringTagcloud: "./worker/bomb-subtests/string-tagcloud.js",
    stringUnpackCode: "./worker/bomb-subtests/string-unpack-code.js",
    regexpDNA: "./worker/bomb-subtests/regexp-dna.js"
  },
  tags: ["default", "js", "WorkerTests"]
}), new AsyncBenchmark({
  name: "segmentation",
  files: ["./worker/segmentation.js"],
  preload: {
    asyncTaskBlob: "./worker/async-task.js"
  },
  iterations: 36,
  worstCaseCount: 3,
  tags: ["default", "js", "WorkerTests"]
}),
// WSL
new WSLBenchmark({
  name: "WSL",
  files: ["./WSL/Node.js", "./WSL/Type.js", "./WSL/ReferenceType.js", "./WSL/Value.js", "./WSL/Expression.js", "./WSL/Rewriter.js", "./WSL/Visitor.js", "./WSL/CreateLiteral.js", "./WSL/CreateLiteralType.js", "./WSL/PropertyAccessExpression.js", "./WSL/AddressSpace.js", "./WSL/AnonymousVariable.js", "./WSL/ArrayRefType.js", "./WSL/ArrayType.js", "./WSL/Assignment.js", "./WSL/AutoWrapper.js", "./WSL/Block.js", "./WSL/BoolLiteral.js", "./WSL/Break.js", "./WSL/CallExpression.js", "./WSL/CallFunction.js", "./WSL/Check.js", "./WSL/CheckLiteralTypes.js", "./WSL/CheckLoops.js", "./WSL/CheckRecursiveTypes.js", "./WSL/CheckRecursion.js", "./WSL/CheckReturns.js", "./WSL/CheckUnreachableCode.js", "./WSL/CheckWrapped.js", "./WSL/Checker.js", "./WSL/CloneProgram.js", "./WSL/CommaExpression.js", "./WSL/ConstexprFolder.js", "./WSL/ConstexprTypeParameter.js", "./WSL/Continue.js", "./WSL/ConvertPtrToArrayRefExpression.js", "./WSL/DereferenceExpression.js", "./WSL/DoWhileLoop.js", "./WSL/DotExpression.js", "./WSL/DoubleLiteral.js", "./WSL/DoubleLiteralType.js", "./WSL/EArrayRef.js", "./WSL/EBuffer.js", "./WSL/EBufferBuilder.js", "./WSL/EPtr.js", "./WSL/EnumLiteral.js", "./WSL/EnumMember.js", "./WSL/EnumType.js", "./WSL/EvaluationCommon.js", "./WSL/Evaluator.js", "./WSL/ExpressionFinder.js", "./WSL/ExternalOrigin.js", "./WSL/Field.js", "./WSL/FindHighZombies.js", "./WSL/FlattenProtocolExtends.js", "./WSL/FlattenedStructOffsetGatherer.js", "./WSL/FloatLiteral.js", "./WSL/FloatLiteralType.js", "./WSL/FoldConstexprs.js", "./WSL/ForLoop.js", "./WSL/Func.js", "./WSL/FuncDef.js", "./WSL/FuncInstantiator.js", "./WSL/FuncParameter.js", "./WSL/FunctionLikeBlock.js", "./WSL/HighZombieFinder.js", "./WSL/IdentityExpression.js", "./WSL/IfStatement.js", "./WSL/IndexExpression.js", "./WSL/InferTypesForCall.js", "./WSL/Inline.js", "./WSL/Inliner.js", "./WSL/InstantiateImmediates.js", "./WSL/IntLiteral.js", "./WSL/IntLiteralType.js", "./WSL/Intrinsics.js", "./WSL/LateChecker.js", "./WSL/Lexer.js", "./WSL/LexerToken.js", "./WSL/LiteralTypeChecker.js", "./WSL/LogicalExpression.js", "./WSL/LogicalNot.js", "./WSL/LoopChecker.js", "./WSL/MakeArrayRefExpression.js", "./WSL/MakePtrExpression.js", "./WSL/NameContext.js", "./WSL/NameFinder.js", "./WSL/NameResolver.js", "./WSL/NativeFunc.js", "./WSL/NativeFuncInstance.js", "./WSL/NativeType.js", "./WSL/NativeTypeInstance.js", "./WSL/NormalUsePropertyResolver.js", "./WSL/NullLiteral.js", "./WSL/NullType.js", "./WSL/OriginKind.js", "./WSL/OverloadResolutionFailure.js", "./WSL/Parse.js", "./WSL/Prepare.js", "./WSL/Program.js", "./WSL/ProgramWithUnnecessaryThingsRemoved.js", "./WSL/PropertyResolver.js", "./WSL/Protocol.js", "./WSL/ProtocolDecl.js", "./WSL/ProtocolFuncDecl.js", "./WSL/ProtocolRef.js", "./WSL/PtrType.js", "./WSL/ReadModifyWriteExpression.js", "./WSL/RecursionChecker.js", "./WSL/RecursiveTypeChecker.js", "./WSL/ResolveNames.js", "./WSL/ResolveOverloadImpl.js", "./WSL/ResolveProperties.js", "./WSL/ResolveTypeDefs.js", "./WSL/Return.js", "./WSL/ReturnChecker.js", "./WSL/ReturnException.js", "./WSL/StandardLibrary.js", "./WSL/StatementCloner.js", "./WSL/StructLayoutBuilder.js", "./WSL/StructType.js", "./WSL/Substitution.js", "./WSL/SwitchCase.js", "./WSL/SwitchStatement.js", "./WSL/SynthesizeEnumFunctions.js", "./WSL/SynthesizeStructAccessors.js", "./WSL/TrapStatement.js", "./WSL/TypeDef.js", "./WSL/TypeDefResolver.js", "./WSL/TypeOrVariableRef.js", "./WSL/TypeParameterRewriter.js", "./WSL/TypeRef.js", "./WSL/TypeVariable.js", "./WSL/TypeVariableTracker.js", "./WSL/TypedValue.js", "./WSL/UintLiteral.js", "./WSL/UintLiteralType.js", "./WSL/UnificationContext.js", "./WSL/UnreachableCodeChecker.js", "./WSL/VariableDecl.js", "./WSL/VariableRef.js", "./WSL/VisitingSet.js", "./WSL/WSyntaxError.js", "./WSL/WTrapError.js", "./WSL/WTypeError.js", "./WSL/WhileLoop.js", "./WSL/WrapChecker.js", "./WSL/Test.js"],
  tags: ["default", "js", "WSL"]
}),
// 8bitbench
new WasmEMCCBenchmark({
  name: "8bitbench-wasm",
  files: ["./utils/polyfills/fast-text-encoding/1.0.3/text.js", "./8bitbench/build/rust/pkg/emu_bench.js", "./8bitbench/benchmark.js"],
  preload: {
    wasmBinary: "./8bitbench/build/rust/pkg/emu_bench_bg.wasm",
    romBinary: "./8bitbench/build/assets/program.bin"
  },
  iterations: 15,
  worstCaseCount: 2,
  tags: ["default", "Wasm"]
}),
// zlib-wasm
new WasmEMCCBenchmark({
  name: "zlib-wasm",
  files: ["./wasm/zlib/build/zlib.js", "./wasm/zlib/benchmark.js"],
  preload: {
    wasmBinary: "./wasm/zlib/build/zlib.wasm"
  },
  iterations: 40,
  tags: ["default", "Wasm"]
}),
// .NET
new AsyncBenchmark({
  name: "dotnet-interp-wasm",
  files: ["./wasm/dotnet/interp.js", "./wasm/dotnet/benchmark.js"],
  preload: dotnetPreloads("interp"),
  iterations: 10,
  worstCaseCount: 2,
  tags: ["default", "Wasm", "dotnet"]
}), new AsyncBenchmark({
  name: "dotnet-aot-wasm",
  files: ["./wasm/dotnet/aot.js", "./wasm/dotnet/benchmark.js"],
  preload: dotnetPreloads("aot"),
  iterations: 15,
  worstCaseCount: 2,
  tags: ["default", "Wasm", "dotnet"]
}),
// J2CL
new AsyncBenchmark({
  name: "j2cl-box2d-wasm",
  files: ["./wasm/j2cl-box2d/benchmark.js", "./wasm/j2cl-box2d/build/Box2dBenchmark_j2wasm_entry.js"],
  preload: {
    wasmBinary: "./wasm/j2cl-box2d/build/Box2dBenchmark_j2wasm_binary.wasm"
  },
  iterations: 40,
  tags: ["default", "Wasm"]
})];
var PRISM_JS_FILES = ["./utils/StartupBenchmark.js", "./prismjs/benchmark.js"];
var PRISM_JS_PRELOADS = {
  SAMPLE_CPP: "./prismjs/data/sample.cpp",
  SAMPLE_CSS: "./prismjs/data/sample.css",
  SAMPLE_HTML: "./prismjs/data/sample.html",
  SAMPLE_JS: "./prismjs/data/sample.js",
  SAMPLE_JSON: "./prismjs/data/sample.json",
  SAMPLE_MD: "./prismjs/data/sample.md",
  SAMPLE_PY: "./prismjs/data/sample.py",
  SAMPLE_SQL: "./prismjs/data/sample.sql",
  SAMPLE_TS: "./prismjs/data/sample.ts"
};
var PRISM_JS_TAGS = ["js", "parser", "regexp", "startup", "prismjs"];
BENCHMARKS.push(new AsyncBenchmark({
  name: "prismjs-startup-es6",
  files: PRISM_JS_FILES,
  preload: _objectSpread({
    // Use non-minified bundle for better local profiling.
    // BUNDLE: "./prismjs/dist/bundle.es6.js",
    BUNDLE: "./prismjs/dist/bundle.es6.min.js"
  }, PRISM_JS_PRELOADS),
  tags: ["default"].concat(PRISM_JS_TAGS, ["es6"])
}), new AsyncBenchmark({
  name: "prismjs-startup-es5",
  files: PRISM_JS_FILES,
  preload: _objectSpread({
    // Use non-minified bundle for better local profiling.
    // BUNDLE: "./prismjs/dist/bundle.es5.js",
    BUNDLE: "./prismjs/dist/bundle.es5.min.js"
  }, PRISM_JS_PRELOADS),
  tags: [].concat(PRISM_JS_TAGS, ["es5"])
}));
var INTL_TESTS = ["DateTimeFormat", "ListFormat", "RelativeTimeFormat", "NumberFormat", "PluralRules"];
var INTL_TAGS = ["js", "internationalization"];
var INTL_BENCHMARKS = [];
for (var test of INTL_TESTS) {
  var benchmark = new AsyncBenchmark({
    name: `${test}-intl`,
    files: ["./intl/src/helper.js", `./intl/src/${test}.js`, "./intl/benchmark.js"],
    iterations: 2,
    worstCaseCount: 1,
    deterministicRandom: true,
    tags: INTL_TAGS
  });
  INTL_BENCHMARKS.push(benchmark);
}
BENCHMARKS.push(new GroupedBenchmark({
  name: "intl",
  tags: INTL_TAGS
}, INTL_BENCHMARKS));

// SunSpider tests
var SUNSPIDER_TESTS = ["3d-cube", "3d-raytrace", "base64", "crypto-aes", "crypto-md5", "crypto-sha1", "date-format-tofte", "date-format-xparb", "n-body",
// Rhino: Not working "regex-dna",
"string-unpack-code"
// Rhino: Hangs benchmark framework "tagcloud",*/
];
var SUNSPIDER_BENCHMARKS = [];
for (var _test of SUNSPIDER_TESTS) {
  SUNSPIDER_BENCHMARKS.push(new DefaultBenchmark({
    name: `${_test}-SP`,
    files: [`./SunSpider/${_test}.js`],
    tags: []
  }));
}
BENCHMARKS.push(new GroupedBenchmark({
  name: "Sunspider",
  tags: ["default", "js", "SunSpider"]
}, SUNSPIDER_BENCHMARKS));

// WTB (Web Tooling Benchmark) tests
var WTB_TESTS = {
  "acorn": true,
  "babel": true,
  "babel-minify": true,
  "babylon": true,
  "chai": true,
  "espree": true,
  "esprima-next": true,
  // Disabled: Converting ES5 code to ES6+ is no longer a realistic scenario.
  "lebab": false,
  "postcss": true,
  "prettier": true,
  "source-map": true
};
var WPT_FILES = ["angular-material-20.1.6.css", "backbone-1.6.1.js", "bootstrap-5.3.7.css", "foundation-6.9.0.css", "jquery-3.7.1.js", "lodash.core-4.17.21.js", "lodash-4.17.4.min.js.map", "mootools-core-1.6.0.js", "preact-8.2.5.js", "preact-10.27.1.min.module.js.map", "redux-5.0.1.min.js", "redux-5.0.1.esm.js", "source-map.min-0.5.7.js.map", "source-map/lib/mappings.wasm", "speedometer-es2015-test-2.0.js", "todomvc/react/app.jsx", "todomvc/react/footer.jsx", "todomvc/react/todoItem.jsx", "todomvc/typescript-angular.ts", "underscore-1.13.7.js", "underscore-1.13.7.min.js.map", "vue-3.5.18.runtime.esm-browser.js"].reduce((acc, file) => {
  acc[file] = `./web-tooling-benchmark/third_party/${file}`;
  return acc;
}, Object.create(null));
for (var [name, enabled] of Object.entries(WTB_TESTS)) {
  var tags = ["js", "WTB"];
  if (enabled) tags.push("Default");
  BENCHMARKS.push(new AsyncBenchmark({
    name: `${name}-wtb`,
    files: [`./web-tooling-benchmark/dist/${name}.bundle.js`, "./web-tooling-benchmark/benchmark.js"],
    preload: _objectSpread({
      BUNDLE: `./web-tooling-benchmark/dist/${name}.bundle.js`
    }, WPT_FILES),
    iterations: 15,
    worstCaseCount: 2,
    allowUtf16: true,
    tags: tags
  }));
}
var benchmarksByName = new Map();
var benchmarksByTag = new Map();
for (var _benchmark3 of BENCHMARKS) {
  var _name3 = _benchmark3.name.toLowerCase();
  if (benchmarksByName.has(_name3)) throw new Error(`Duplicate benchmark with name "${_name3}}"`);else benchmarksByName.set(_name3, _benchmark3);
  for (var tag of _benchmark3.tags) {
    if (benchmarksByTag.has(tag)) benchmarksByTag.get(tag).push(_benchmark3);else benchmarksByTag.set(tag, [_benchmark3]);
  }
}
function processTestList(testList) {
  var benchmarkNames = [];
  var benchmarks = [];
  if (testList instanceof Array) benchmarkNames = testList;else benchmarkNames = testList.split(/[\s,]/);
  for (var _name4 of benchmarkNames) {
    _name4 = _name4.toLowerCase();
    if (benchmarksByTag.has(_name4)) benchmarks = benchmarks.concat(findBenchmarksByTag(_name4));else benchmarks.push(findBenchmarkByName(_name4));
  }
  return benchmarks;
}
function findBenchmarkByName(name) {
  var benchmark = benchmarksByName.get(name.toLowerCase());
  if (!benchmark) throw new Error(`Couldn't find benchmark named "${name}"`);
  return benchmark;
}
function findBenchmarksByTag(tag, excludeTags) {
  var benchmarks = benchmarksByTag.get(tag.toLowerCase());
  if (!benchmarks) {
    var validTags = Array.from(benchmarksByTag.keys()).join(", ");
    throw new Error(`Couldn't find tag named: ${tag}.\n Choices are ${validTags}`);
  }
  if (excludeTags) {
    benchmarks = benchmarks.filter(benchmark => {
      return !benchmark.hasAnyTag.apply(benchmark, _toConsumableArray(excludeTags));
    });
  }
  return benchmarks;
}
var benchmarks = [];
var defaultDisabledTags = [];
// FIXME: add better support to run Worker tests in shells.
if (!isInBrowser) defaultDisabledTags.push("WorkerTests");
if (JetStreamParams.testList.length) {
  benchmarks = processTestList(JetStreamParams.testList);
} else {
  benchmarks = findBenchmarksByTag("Default", defaultDisabledTags);
}
this.JetStream = new Driver(benchmarks);

