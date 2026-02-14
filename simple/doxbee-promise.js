function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// MIT License

// Copyright (c) 2013 Gorgi Kosev

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

// Copyright 2018 Google LLC, Benedikt Meurer
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     <https://www.apache.org/licenses/LICENSE-2.0>
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

    var fakes = require("../lib/fakes-promises.js");
    module.exports = function doxbee(stream, idOrPath) {
      var blob = fakes.blobManager.create(fakes.account);
      var tx = fakes.db.begin();
      var version, blobId, fileId, file;
      return blob.put(stream).then(blobIdV => {
        blobId = blobIdV;
        return fakes.self.byUuidOrPath(idOrPath).get();
      }).then(fileV => {
        file = fileV;
        var previousId = file ? file.version : null;
        version = {
          userAccountId: fakes.userAccount.id,
          blobId: blobId,
          creatorId: fakes.userAccount.id,
          previousId: previousId
        };
        version.id = fakes.Version.createHash(version);
        return fakes.Version.insert(version).execWithin(tx);
      }).then(_ => {
        if (!file) {
          var splitPath = idOrPath.lastIndexOf("/") + 1;
          var fileName = idOrPath.substring(splitPath);
          var newId = fakes.uuid.v1();
          return fakes.self.createQuery(idOrPath, {
            id: newId,
            userAccountId: fakes.userAccount.id,
            name: fileName,
            version: version.id
          }).then(q => {
            return q.execWithin(tx);
          }).then(_ => {
            return newId;
          });
        } else {
          return file.id;
        }
      }).then(fileIdV => {
        fileId = fileIdV;
        return fakes.FileVersion.insert({
          fileId: fileId,
          versionId: version.id
        }).execWithin(tx);
      }).then(_ => {
        return fakes.File.whereUpdate({
          id: fileId
        }, {
          version: version.id
        }).execWithin(tx);
      }).then(_ => {
        return tx.commit();
      }).catch(err => {
        return tx.rollback().then(_ => Promise.reject(err));
      });
    };
  }, {
    "../lib/fakes-promises.js": 2
  }],
  2: [function (require, module, exports) {
    "use strict";

    function dummy_1() {
      return Promise.resolve(undefined);
    }
    function dummy_2(a) {
      return Promise.resolve(undefined);
    }

    // a queryish object with all kinds of functions
    function Queryish() {}
    Queryish.prototype.all = dummy_1;
    Queryish.prototype.exec = dummy_1;
    Queryish.prototype.execWithin = dummy_2;
    Queryish.prototype.get = dummy_1;
    function queryish() {
      return new Queryish();
    }
    var Uuid = /*#__PURE__*/function () {
      function Uuid() {
        _classCallCheck(this, Uuid);
      }
      return _createClass(Uuid, [{
        key: "v1",
        value: function v1() {}
      }]);
    }();
    var uuid = new Uuid();
    var userAccount = {
      id: 1
    };
    var account = {};
    function Blob() {}
    Blob.prototype.put = dummy_2;
    var BlobManager = /*#__PURE__*/function () {
      function BlobManager() {
        _classCallCheck(this, BlobManager);
      }
      return _createClass(BlobManager, [{
        key: "create",
        value: function create() {
          return new Blob();
        }
      }]);
    }();
    var blobManager = new BlobManager();
    var cqQueryish = queryish();
    function Self() {}
    Self.prototype.byUuidOrPath = queryish;
    Self.prototype.createQuery = function createQuery(x, y) {
      return Promise.resolve(cqQueryish);
    };
    var self = new Self();
    function File() {}
    File.insert = queryish;
    File.whereUpdate = queryish;
    function FileVersion() {}
    FileVersion.insert = queryish;
    function Version() {}
    Version.createHash = function createHash(v) {
      return 1;
    };
    Version.insert = queryish;
    function Transaction() {}
    Transaction.prototype.commit = dummy_1;
    Transaction.prototype.rollback = dummy_1;
    var Db = /*#__PURE__*/function () {
      function Db() {
        _classCallCheck(this, Db);
      }
      return _createClass(Db, [{
        key: "begin",
        value: function begin() {
          return new Transaction();
        }
      }]);
    }();
    var db = new Db();
    module.exports = {
      uuid,
      userAccount,
      account,
      blobManager,
      self,
      File,
      FileVersion,
      Version,
      db
    };
  }, {}],
  3: [function (require, module, exports) {
    var doxbee = require("../lib/doxbee-promises");
    globalThis.Benchmark = /*#__PURE__*/function () {
      function _class() {
        _classCallCheck(this, _class);
      }
      return _createClass(_class, [{
        key: "runIteration",
        value: function runIteration() {
          var promises = new Array(10_000);
          for (var i = 0; i < 10_000; i++) promises[i] = doxbee(i, "foo");
          return Promise.all(promises);
        }
      }]);
    }();
  }, {
    "../lib/doxbee-promises": 1
  }]
}, {}, [3]);

