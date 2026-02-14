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
var GlobalAnnotation = "global";
var LocalAnnotation = "local";
var SourceFile = /*#__PURE__*/function () {
  function SourceFile(fileName) {
    _classCallCheck(this, SourceFile);
    this._fileName = fileName;
    var fileNumber = SourceFile.fileNames.indexOf(fileName);
    if (fileNumber == -1) {
      SourceFile.fileNames.push(fileName);
      fileNumber = SourceFile.fileNames.length;
    } else fileNumber++; // File numbers are 1 based

    this._fileNumber = fileNumber;
  }
  return _createClass(SourceFile, [{
    key: "name",
    get: function () {
      return this._fileName;
    }
  }, {
    key: "fileNumber",
    get: function () {
      return this._fileNumber;
    }
  }]);
}();
SourceFile.fileNames = [];
var CodeOrigin = /*#__PURE__*/function () {
  function CodeOrigin(sourceFile, lineNumber) {
    _classCallCheck(this, CodeOrigin);
    this._sourceFile = sourceFile;
    this._lineNumber = lineNumber;
  }
  return _createClass(CodeOrigin, [{
    key: "fileName",
    value: function fileName() {
      return this._sourceFile.name;
    }
  }, {
    key: "debugDirective",
    value: function debugDirective() {
      return emitWinAsm ? undefined : "\".loc " + this._sourceFile.fileNumber + " " + this._lineNumber + "\\n\"";
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.fileName() + ":" + this._lineNumber;
    }
  }, {
    key: "lineNumber",
    get: function () {
      return this._lineNumber;
    }
  }]);
}();
var IncludeFile = /*#__PURE__*/function () {
  function IncludeFile(moduleName, defaultDir) {
    _classCallCheck(this, IncludeFile);
    this._fileName = moduleName + ".asm";
  }
  return _createClass(IncludeFile, [{
    key: "toString",
    value: function toString() {
      return fileName;
    }
  }, {
    key: "fileName",
    get: function () {
      return this._fileName;
    }
  }]);
}();
IncludeFile.includeDirs = [];
var Token = /*#__PURE__*/function () {
  function Token(codeOrigin, string) {
    _classCallCheck(this, Token);
    this._codeOrigin = codeOrigin;
    this._string = string;
  }
  return _createClass(Token, [{
    key: "isEqualTo",
    value: function isEqualTo(other) {
      if (other instanceof Token) return this.string === other.string;
      return this.string === other;
    }
  }, {
    key: "isNotEqualTo",
    value: function isNotEqualTo(other) {
      return !this.isEqualTo(other);
    }
  }, {
    key: "string",
    get: function () {
      return this._string;
    }
  }, {
    key: "codeOrigin",
    get: function () {
      return this._codeOrigin;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "" + this._string + "\" at " + this._codeOrigin;
    }
  }, {
    key: "parseError",
    value: function parseError(comment) {
      if (!comment || !comment.length) throw "Parse error: " + this;
      throw "Parse error: " + this + ": " + comment;
    }
  }]);
}();
var Annotation = /*#__PURE__*/function () {
  function Annotation(codeOrigin, type, string) {
    _classCallCheck(this, Annotation);
    this.codeOrigin = codeOrigin;
    this.type = type;
    this.string = string;
  }
  return _createClass(Annotation, [{
    key: "codeOrigin",
    get: function () {
      return this.codeOrigin;
    }
  }, {
    key: "type",
    get: function () {
      return this.type;
    }
  }, {
    key: "string",
    get: function () {
      return this.string;
    }
  }]);
}(); // The lexer. Takes a string and returns an array of tokens.
function lex(str, file) {
  function scanRegExp(source, regexp) {
    return source.match(regexp);
  }
  var result = [];
  var lineNumber = 1;
  var annotation = null;
  var annotationType;
  var whitespaceFound = false;
  while (str.length) {
    var tokenMatch = void 0;
    var _annotation = void 0;
    var _annotationType = void 0;
    if (tokenMatch = scanRegExp(str, /^#([^\n]*)/)) ; // comment, ignore
    else if (tokenMatch = scanRegExp(str, /^\/\/\ ?([^\n]*)/)) {
      // annotation
      _annotation = tokenMatch[0];
      _annotationType = whitespaceFound ? LocalAnnotation : GlobalAnnotation;
    } else if (tokenMatch = scanRegExp(str, /^\n/)) {
      /* We've found a '\n'.  Emit the last comment recorded if appropriate:
       * We need to parse annotations regardless of whether the backend does
       * anything with them or not. This is because the C++ backend may make
       * use of this for its cloopDo debugging utility even if
       * enableInstrAnnotations is not enabled.
       */
      if (_annotation) {
        result.push(new Annotation(new CodeOrigin(file, lineNumber), _annotationType, _annotation));
        _annotation = null;
      }
      result.push(new Token(new CodeOrigin(file, lineNumber), tokenMatch[0]));
      lineNumber++;
    } else if (tokenMatch = scanRegExp(str, /^[a-zA-Z]([a-zA-Z0-9_.]*)/)) result.push(new Token(new CodeOrigin(file, lineNumber), tokenMatch[0]));else if (tokenMatch = scanRegExp(str, /^\.([a-zA-Z0-9_]*)/)) result.push(new Token(new CodeOrigin(file, lineNumber), tokenMatch[0]));else if (tokenMatch = scanRegExp(str, /^_([a-zA-Z0-9_]*)/)) result.push(new Token(new CodeOrigin(file, lineNumber), tokenMatch[0]));else if (tokenMatch = scanRegExp(str, /^([ \t]+)/)) {
      // whitespace, ignore
      whitespaceFound = true;
      str = str.slice(tokenMatch[0].length);
      continue;
    } else if (tokenMatch = scanRegExp(str, /^0x([0-9a-fA-F]+)/)) result.push(new Token(new CodeOrigin(file, lineNumber), Number.parseInt(tokenMatch[1], 16)));else if (tokenMatch = scanRegExp(str, /^0([0-7]+)/)) result.push(new Token(new CodeOrigin(file, lineNumber), Number.parseInt(tokenMatch[1], 8)));else if (tokenMatch = scanRegExp(str, /^([0-9]+)/)) result.push(new Token(new CodeOrigin(file, lineNumber), tokenMatch[0]));else if (tokenMatch = scanRegExp(str, /^::/)) result.push(new Token(new CodeOrigin(file, lineNumber), tokenMatch[0]));else if (tokenMatch = scanRegExp(str, /^[:,\(\)\[\]=\+\-~\|&^*]/)) result.push(new Token(new CodeOrigin(file, lineNumber), tokenMatch[0]));else if (tokenMatch = scanRegExp(str, /^\".*\"/)) result.push(new Token(new CodeOrigin(file, lineNumber), tokenMatch[0]));else throw "Lexer error at " + new CodeOrigin(file, lineNumber) + ", unexpected sequence " + str.slice(0, 20);
    whitespaceFound = false;
    str = str.slice(tokenMatch[0].length);
  }
  return result;
}

// Token identification.

function isRegister(token) {
  registerPattern.test(token.string);
}
function isInstruction(token) {
  return instructionSet.has(token.string);
}
function isKeyword(token) {
  return /^((true)|(false)|(if)|(then)|(else)|(elsif)|(end)|(and)|(or)|(not)|(global)|(macro)|(const)|(constexpr)|(sizeof)|(error)|(include))$/.test(token.string) || isRegister(token) || isInstruction(token);
}
function isIdentifier(token) {
  return /^[a-zA-Z]([a-zA-Z0-9_.]*)$/.test(token.string) && !isKeyword(token);
}
function isLabel(token) {
  var tokenString;
  if (token instanceof Token) tokenString = token.string;else tokenString = token;
  return /^_([a-zA-Z0-9_]*)$/.test(tokenString);
}
function isLocalLabel(token) {
  var tokenString;
  if (token instanceof Token) tokenString = token.string;else tokenString = token;
  return /^\.([a-zA-Z0-9_]*)$/.test(tokenString);
}
function isVariable(token) {
  return isIdentifier(token) || isRegister(token);
}
function isInteger(token) {
  return /^[0-9]/.test(token.string);
}
function isString(token) {
  return /^".*"/.test(token.string);
}

// The parser. Takes an array of tokens and returns an AST. Methods
// other than parse(tokens) are not for public consumption.
var Parser = /*#__PURE__*/function () {
  function Parser(data, fileName) {
    _classCallCheck(this, Parser);
    this.tokens = lex(data, fileName);
    this.idx = 0;
    this.annotation = null;
  }
  return _createClass(Parser, [{
    key: "parseError",
    value: function parseError(comment) {
      if (this.tokens[this.idx]) this.tokens[this.idx].parseError(comment);else {
        if (!comment.length) throw "Parse error at end of file";
        throw "Parse error at end of file: " + comment;
      }
    }
  }, {
    key: "consume",
    value: function consume(regexp) {
      if (regexp) {
        if (!regexp.test(this.tokens[this.idx].string)) this.parseError();
      } else if (this.idx != this.tokens.length) this.parseError();
      this.idx++;
    }
  }, {
    key: "skipNewLine",
    value: function skipNewLine() {
      while (this.tokens[this.idx].isEqualTo("\n")) this.idx++;
    }
  }, {
    key: "parsePredicateAtom",
    value: function parsePredicateAtom() {
      if (this.tokens[this.idx].isEqualTo("not")) {
        var codeOrigin = this.tokens[this.idx].codeOrigin;
        this.idx++;
        return new Not(codeOrigin, this.parsePredicateAtom());
      }
      if (this.tokens[this.idx].isEqualTo("(")) {
        this.idx++;
        skipNewLine();
        var result = this.parsePredicate();
        if (this.tokens[this.idx].isNotEqualTo(")")) parseError();
        this.idx++;
        return result;
      }
      if (this.tokens[this.idx].isEqualTo("true")) {
        var _result = True.instance();
        this.idx++;
        return _result;
      }
      if (this.tokens[this.idx].isEqualTo("false")) {
        var _result2 = False.instance();
        this.idx++;
        return _result2;
      }
      if (isIdentifier(this.tokens[this.idx])) {
        var _result3 = Setting.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string);
        this.idx++;
        return _result3;
      }
      this.parseError();
    }
  }, {
    key: "parsePredicateAnd",
    value: function parsePredicateAnd() {
      var result = this.parsePredicateAtom();
      while (this.tokens[this.idx].isEqualTo("and")) {
        var codeOrigin = this.tokens[this.idx].codeOrigin;
        this.idx++;
        this.skipNewLine();
        var right = this.parsePredicateAtom();
        result = new And(codeOrigin, result, right);
      }
      return result;
    }
  }, {
    key: "parsePredicate",
    value: function parsePredicate() {
      // some examples of precedence:
      // not a and b -> (not a) and b
      // a and b or c -> (a and b) or c
      // a or b and c -> a or (b and c)

      var result = this.parsePredicateAnd();
      while (this.tokens[this.idx].isEqualTo("or")) {
        var codeOrigin = this.tokens[this.idx].codeOrigin;
        this.idx++;
        this.skipNewLine();
        var right = this.parsePredicateAnd();
        result = new Or(codeOrigin, result, right);
      }
      return result;
    }
  }, {
    key: "parseVariable",
    value: function parseVariable() {
      var result;
      if (isRegister(this.tokens[this.idx])) {
        if (fprPattern.test(this.tokens[this.idx].string)) result = FPRegisterID.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string);else result = RegisterID.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string);
      } else if (isIdentifier(this.tokens[this.idx])) result = Variable.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string);else this.parseError();
      this.idx++;
      return result;
    }
  }, {
    key: "parseAddress",
    value: function parseAddress(offset) {
      if (this.tokens[this.idx].isNotEqualTo("[")) this.parseError();
      var codeOrigin = this.tokens[this.idx].codeOrigin;
      var result;

      // Three possibilities:
      // []       -> AbsoluteAddress
      // [a]      -> Address
      // [a,b]    -> BaseIndex with scale = 1
      // [a,b,c]  -> BaseIndex

      this.idx++;
      if (this.tokens[this.idx].isEqualTo("]")) {
        this.idx++;
        return new AbsoluteAddress(codeOrigin, offset);
      }
      var a = this.parseVariable();
      if (this.tokens[this.idx].isEqualTo("]")) result = new Address(codeOrigin, a, offset);else {
        if (this.tokens[this.idx].isNotEqualTo(",")) this.parseError();
        this.idx++;
        var b = this.parseVariable();
        if (this.tokens[this.idx].isEqualTo("]")) result = new BaseIndex(codeOrigin, a, b, 1, offset);else {
          if (this.tokens[this.idx].isNotEqualTo(",")) this.parseError();
          this.idx++;
          if (!["1", "2", "4", "8"].includes(this.tokens[this.idx].string)) this.parseError();
          var c = Number.parseInt(this.tokens[this.idx]);
          this.idx++;
          if (this.tokens[this.idx].isNotEqualTo("]")) this.parseError();
          result = new BaseIndex(codeOrigin, a, b, c, offset);
        }
      }
      this.idx++;
      return result;
    }
  }, {
    key: "parseColonColon",
    value: function parseColonColon() {
      this.skipNewLine();
      var firstToken = this.tokens[this.idx];
      var codeOrigin = this.tokens[this.idx].codeOrigin;
      if (!isIdentifier(this.tokens[this.idx])) this.parseError();
      var names = [this.tokens[this.idx].string];
      this.idx++;
      while (this.tokens[this.idx].isEqualTo("::")) {
        this.idx++;
        if (!isIdentifier(this.tokens[this.idx])) this.parseError();
        names.push(this.tokens[this.idx].string);
        this.idx++;
      }
      if (!names.length) firstToken.parseError();
      return {
        codeOrigin: codeOrigin,
        names: names
      };
    }
  }, {
    key: "parseTextInParens",
    value: function parseTextInParens() {
      this.skipNewLine();
      var codeOrigin = this.tokens[this.idx].codeOrigin;
      if (this.tokens[this.idx].isNotEqualTo("(")) throw "Missing \"(\" at " + codeOrigin;
      this.idx++;
      // need at least one item
      if (this.tokens[this.idx].isEqualTo(")")) throw "No items in list at " + codeOrigin;
      var numEnclosedParens = 0;
      var text = [];
      while (this.tokens[this.idx].isNotEqualTo(")") || numEnclosedParens > 0) {
        if (this.tokens[this.idx].isEqualTo("(")) numEnclosedParens++;else if (this.tokens[this.idx].isEqualTo(")")) numEnclosedParens--;
        text.push(this.tokens[this.idx].string);
        this.idx++;
      }
      this.idx++;
      return {
        codeOrigin: codeOrigin,
        text: text
      };
    }
  }, {
    key: "parseExpressionAtom",
    value: function parseExpressionAtom() {
      var result;
      this.skipNewLine();
      if (this.tokens[this.idx].isEqualTo("-")) {
        this.idx++;
        return new NegImmediate(this.tokens[this.idx - 1].codeOrigin, this.parseExpressionAtom());
      }
      if (this.tokens[this.idx].isEqualTo("~")) {
        this.idx++;
        return new BitnotImmediate(this.tokens[this.idx - 1].codeOrigin, this.parseExpressionAtom());
      }
      if (this.tokens[this.idx].isEqualTo("(")) {
        this.idx++;
        result = this.parseExpression();
        if (this.tokens[this.idx].isNotEqualTo(")")) this.parseError();
        this.idx++;
        return result;
      }
      if (isInteger(this.tokens[this.idx])) {
        result = new Immediate(this.tokens[this.idx].codeOrigin, Number.parseInt(this.tokens[this.idx]));
        this.idx++;
        return result;
      }
      if (isString(this.tokens[this.idx])) {
        result = new StringLiteral(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string);
        this.idx++;
        return result;
      }
      if (isIdentifier(this.tokens[this.idx])) {
        var {
          codeOrigin,
          names
        } = this.parseColonColon();
        if (names.length > 1) return StructOffset.forField(codeOrigin, names.slice(0, -1).join('::'), names[names.length - 1]);
        return Variable.forName(codeOrigin, names[0]);
      }
      if (isRegister(this.tokens[this.idx])) return this.parseVariable();
      if (this.tokens[this.idx].isEqualTo("sizeof")) {
        this.idx++;
        var {
          codeOrigin: _codeOrigin,
          names: _names
        } = this.parseColonColon();
        return Sizeof.forName(_codeOrigin, _names.join("::"));
      }
      if (this.tokens[this.idx].isEqualTo("constexpr")) {
        this.idx++;
        this.skipNewLine();
        var _codeOrigin2;
        var text;
        var _names2;
        if (this.tokens[this.idx].isEqualTo("(")) {
          ({
            codeOrigin: _codeOrigin2,
            text
          } = this.parseTextInParens());
          text = text.join("");
        } else {
          ({
            codeOrigin: _codeOrigin2,
            names: _names2
          } = this.parseColonColon());
          text = _names2.join("::");
        }
        return ConstExpr.forName(_codeOrigin2, text);
      }
      if (isLabel(this.tokens[this.idx])) {
        result = new LabelReference(this.tokens[this.idx].codeOrigin, Label.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string));
        this.idx++;
        return result;
      }
      if (isLocalLabel(this.tokens[this.idx])) {
        result = new LocalLabelReference(this.tokens[this.idx].codeOrigin, LocalLabel.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string));
        this.idx++;
        return result;
      }
      this.parseError();
    }
  }, {
    key: "parseExpressionMul",
    value: function parseExpressionMul() {
      this.skipNewLine();
      var result = this.parseExpressionAtom();
      while (this.tokens[this.idx].isEqualTo("*")) {
        if (this.tokens[this.idx].isEqualTo("*")) {
          this.idx++;
          result = new MulImmediates(this.tokens[this.idx - 1].codeOrigin, result, this.parseExpressionAtom());
        } else throw "Invalid token " + this.tokens[this.idx] + " in multiply expression";
      }
      return result;
    }
  }, {
    key: "couldBeExpression",
    value: function couldBeExpression() {
      return this.tokens[this.idx].isEqualTo("-") || this.tokens[this.idx].isEqualTo("~") || this.tokens[this.idx].isEqualTo("constexpr") || this.tokens[this.idx].isEqualTo("sizeof") || isInteger(this.tokens[this.idx]) || isString(this.tokens[this.idx]) || isVariable(this.tokens[this.idx]) || this.tokens[this.idx].isEqualTo("(");
    }
  }, {
    key: "parseExpressionAdd",
    value: function parseExpressionAdd() {
      this.skipNewLine();
      var result = this.parseExpressionMul();
      while (this.tokens[this.idx].isEqualTo("+") || this.tokens[this.idx].isEqualTo("-")) {
        if (this.tokens[this.idx].isEqualTo("+")) {
          this.idx++;
          result = new AddImmediates(this.tokens[this.idx - 1].codeOrigin, result, this.parseExpressionMul());
        } else if (this.tokens[this.idx].isEqualTo("-")) {
          this.idx++;
          result = new SubImmediates(this.tokens[this.idx - 1].codeOrigin, result, this.parseExpressionMul());
        } else throw "Invalid token " + this.tokens[this.idx] + " in addition expression";
      }
      return result;
    }
  }, {
    key: "parseExpressionAnd",
    value: function parseExpressionAnd() {
      this.skipNewLine();
      var result = this.parseExpressionAdd();
      while (this.tokens[this.idx].isEqualTo("&")) {
        this.idx++;
        result = new AndImmediates(this.tokens[this.idx - 1].codeOrigin, result, this.parseExpressionAdd());
      }
      return result;
    }
  }, {
    key: "parseExpression",
    value: function parseExpression() {
      this.skipNewLine();
      var result = this.parseExpressionAnd();
      while (this.tokens[this.idx].isEqualTo("|") || this.tokens[this.idx].isEqualTo("^")) {
        if (this.tokens[this.idx].isEqualTo("|")) {
          this.idx++;
          result = new OrImmediates(this.tokens[this.idx - 1].codeOrigin, result, this.parseExpressionAnd());
        } else if (this.tokens[this.idx].isEqualTo("^")) {
          this.idx++;
          result = new XorImmediates(this.tokens[this.idx - 1].codeOrigin, result, this.parseExpressionAnd());
        } else throw "Invalid token " + this.tokens[this.idx] + " in expression";
      }
      return result;
    }
  }, {
    key: "parseOperand",
    value: function parseOperand(comment) {
      this.skipNewLine();
      if (this.couldBeExpression()) {
        var expr = this.parseExpression();
        if (this.tokens[this.idx].isEqualTo("[")) return this.parseAddress(expr);
        return expr;
      }
      if (this.tokens[this.idx].isEqualTo("[")) return this.parseAddress(new Immediate(this.tokens[this.idx].codeOrigin, 0));
      if (isLabel(this.tokens[this.idx])) {
        var result = new LabelReference(this.tokens[this.idx].codeOrigin, Label.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string));
        this.idx++;
        return result;
      }
      if (isLocalLabel(this.tokens[this.idx])) {
        var _result4 = new LocalLabelReference(this.tokens[this.idx].codeOrigin, LocalLabel.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string));
        this.idx++;
        return _result4;
      }
      this.parseError(comment);
    }
  }, {
    key: "parseMacroVariables",
    value: function parseMacroVariables() {
      this.skipNewLine();
      this.consume(/^\($/);
      var variables = [];
      while (true) {
        this.skipNewLine();
        if (this.tokens[this.idx].isEqualTo(")")) {
          this.idx++;
          break;
        } else if (isIdentifier(this.tokens[this.idx])) {
          variables.push(Variable.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string));
          this.idx++;
          this.skipNewLine();
          if (this.tokens[this.idx].isEqualTo(")")) {
            this.idx++;
            break;
          } else if (this.tokens[this.idx].isEqualTo(",")) this.idx++;else this.parseError();
        } else this.parseError();
      }
      return variables;
    }
  }, {
    key: "parseSequence",
    value: function parseSequence(final, comment) {
      var firstCodeOrigin = this.tokens[this.idx].codeOrigin;
      var list = [];
      while (true) {
        if (this.idx == this.tokens.length && !final || final && final.test(this.tokens[this.idx].string)) break;else if (this.tokens[this.idx] instanceof Annotation) {
          // This is the only place where we can encounter a global
          // annotation, and hence need to be able to distinguish between
          // them.
          // globalAnnotations are the ones that start from column 0. All
          // others are considered localAnnotations.  The only reason to
          // distinguish between them is so that we can format the output
          // nicely as one would expect.

          var codeOrigin = this.tokens[this.idx].codeOrigin;
          var annotationOpcode = this.tokens[this.idx].type == GlobalAnnotation ? "globalAnnotation" : "localAnnotation";
          list.push(new Instruction(codeOrigin, annotationOpcode, [], this.tokens[this.idx].string));
          this.annotation = null;
          this.idx += 2; // Consume the newline as well.
        } else if (this.tokens[this.idx].isEqualTo("\n")) {
          // ignore
          this.idx++;
        } else if (this.tokens[this.idx].isEqualTo("const")) {
          this.idx++;
          if (!isVariable(this.tokens[this.idx])) this.parseError();
          var variable = Variable.forName(this.tokens[this.idx].codeOrigin, this.tokens[this.idx].string);
          this.idx++;
          if (this.tokens[this.idx].isNotEqualTo("=")) this.parseError();
          this.idx++;
          var value = this.parseOperand("while inside of const " + variable.name);
          list.push(new ConstDecl(this.tokens[this.idx].codeOrigin, variable, value));
        } else if (this.tokens[this.idx].isEqualTo("error")) {
          list.push(new Error(this.tokens[this.idx].codeOrigin));
          this.idx++;
        } else if (this.tokens[this.idx].isEqualTo("if")) {
          var _codeOrigin3 = this.tokens[this.idx].codeOrigin;
          this.idx++;
          this.skipNewLine();
          var predicate = this.parsePredicate();
          this.consume(/^((then)|(\n))$/);
          this.skipNewLine();
          var ifThenElse = new IfThenElse(_codeOrigin3, predicate, this.parseSequence(/^((else)|(end)|(elsif))$/, "while inside of \"if " + predicate.dump() + "\""));
          list.push(ifThenElse);
          while (this.tokens[this.idx].isEqualTo("elsif")) {
            _codeOrigin3 = this.tokens[this.idx].codeOrigin;
            this.idx++;
            this.skipNewLine();
            predicate = this.parsePredicate();
            this.consume(/^((then)|(\n))$/);
            this.skipNewLine();
            var elseCase = new IfThenElse(_codeOrigin3, predicate, this.parseSequence(/^((else)|(end)|(elsif))$/, "while inside of \"if " + predicate.dump() + "\""));
            ifThenElse.elseCase = elseCase;
            ifThenElse = elseCase;
          }
          if (this.tokens[this.idx].isEqualTo("else")) {
            this.idx++;
            ifThenElse.elseCase = this.parseSequence(/^end$/, "while inside of else case for \"if " + predicate.dump() + "\"");
            this.idx++;
          } else {
            if (this.tokens[this.idx].isNotEqualTo("end")) this.parseError();
            this.idx++;
          }
        } else if (this.tokens[this.idx].isEqualTo("macro")) {
          var _codeOrigin4 = this.tokens[this.idx].codeOrigin;
          this.idx++;
          this.skipNewLine();
          if (!isIdentifier(this.tokens[this.idx])) this.parseError();
          var name = this.tokens[this.idx].string;
          this.idx++;
          var variables = this.parseMacroVariables();
          var body = this.parseSequence(/^end$/, "while inside of macro " + name);
          this.idx++;
          list.push(new Macro(_codeOrigin4, name, variables, body));
        } else if (this.tokens[this.idx].isEqualTo("global")) {
          var _codeOrigin5 = this.tokens[this.idx].codeOrigin;
          this.idx++;
          this.skipNewLine();
          if (!isLabel(this.tokens[this.idx])) this.parseError();
          var _name = this.tokens[this.idx].string;
          this.idx++;
          Label.setAsGlobal(_codeOrigin5, _name);
        } else if (isInstruction(this.tokens[this.idx])) {
          var _codeOrigin6 = this.tokens[this.idx].codeOrigin;
          var _name2 = this.tokens[this.idx].string;
          this.idx++;
          if (!final && this.idx == this.tokens.size || final && final.test(this.tokens[this.idx].string)) {
            // Zero operand instruction, and it's the last one.
            list.push(new Instruction(_codeOrigin6, _name2, [], this.annotation));
            this.annotation = null;
            break;
          } else if (this.tokens[this.idx] instanceof Annotation) {
            list.push(new Instruction(_codeOrigin6, _name2, [], this.tokens[this.idx].string));
            this.annotation = null;
            this.idx += 2; // Consume the newline as well.
          } else if (this.tokens[this.idx].isEqualTo("\n")) {
            // Zero operand instruction.
            list.push(new Instruction(_codeOrigin6, _name2, [], this.annotation));
            this.annotation = null;
            this.idx++;
          } else {
            // It's definitely an instruction, and it has at least one operand.
            var operands = [];
            var endOfSequence = false;
            while (true) {
              operands.push(this.parseOperand("while inside of instruction " + _name2));
              if (!final && this.idx == this.tokens.size || final && final.test(this.tokens[this.idx].string)) {
                // The end of the instruction and of the sequence.
                endOfSequence = true;
                break;
              } else if (this.tokens[this.idx].isEqualTo(",")) {
                // Has another operand.
                this.idx++;
              } else if (this.tokens[this.idx] instanceof Annotation) {
                this.annotation = this.tokens[this.idx].string;
                this.idx += 2; // Consume the newline as well.
                break;
              } else if (this.tokens[this.idx].isEqualTo("\n")) {
                // The end of the instruction.
                this.idx++;
                break;
              } else this.parseError("Expected a comma, newline, or " + final + " after " + operands[operands.length - 1].dump());
            }
            list.push(new Instruction(_codeOrigin6, _name2, operands, this.annotation));
            this.annotation = null;
            if (endOfSequence) break;
          }
        } else if (isIdentifier(this.tokens[this.idx])) {
          // Check for potential macro invocation:
          var _codeOrigin7 = this.tokens[this.idx].codeOrigin;
          var _name3 = this.tokens[this.idx].string;
          this.idx++;
          if (this.tokens[this.idx].isEqualTo("(")) {
            // Macro invocation.
            this.idx++;
            var _operands = [];
            this.skipNewLine();
            if (this.tokens[this.idx].isEqualTo(")")) this.idx++;else {
              while (true) {
                this.skipNewLine();
                if (this.tokens[this.idx].isEqualTo("macro")) {
                  // It's a macro lambda!
                  var codeOriginInner = this.tokens[this.idx].codeOrigin;
                  this.idx++;
                  var _variables = this.parseMacroVariables();
                  var _body = this.parseSequence(/^end$/, "while inside of anonymous macro passed as argument to " + _name3);
                  this.idx++;
                  _operands.push(new Macro(codeOriginInner, "", _variables, _body));
                } else _operands.push(this.parseOperand("while inside of macro call to " + _name3));
                this.skipNewLine();
                if (this.tokens[this.idx].isEqualTo(")")) {
                  this.idx++;
                  break;
                } else if (this.tokens[this.idx].isEqualTo(",")) this.idx++;else this.parseError("Unexpected " + this.tokens[this.idx].string + " while parsing invocation of macro " + _name3);
              }
            }
            // Check if there's a trailing annotation after the macro invoke:
            if (this.tokens[this.idx] instanceof Annotation) {
              this.annotation = this.tokens[this.idx].string;
              this.idx += 2; // Consume the newline as well.
            }
            list.push(new MacroCall(_codeOrigin7, _name3, _operands, this.annotation));
            this.annotation = null;
          } else this.parseError("Expected \"(\" after " + _name3);
        } else if (isLabel(this.tokens[this.idx]) || isLocalLabel(this.tokens[this.idx])) {
          var _codeOrigin8 = this.tokens[this.idx].codeOrigin;
          var _name4 = this.tokens[this.idx].string;
          this.idx++;
          if (this.tokens[this.idx].isNotEqualTo(":")) this.parseError();
          // It's a label.
          if (isLabel(_name4)) list.push(Label.forName(_codeOrigin8, _name4, true));else list.push(LocalLabel.forName(_codeOrigin8, _name4));
          this.idx++;
        } else if (this.tokens[this.idx].isEqualTo("include")) {
          this.idx++;
          if (!isIdentifier(this.tokens[this.idx])) this.parseError();
          var moduleName = this.tokens[this.idx].string;
          var _fileName = new IncludeFile(moduleName, this.tokens[this.idx].codeOrigin.fileName.dirname).fileName;
          this.idx++;
          list.push(parse(_fileName));
        } else this.parseError("Expecting terminal " + final + " " + comment);
      }
      return new Sequence(firstCodeOrigin, list);
    }
  }, {
    key: "parseIncludes",
    value: function parseIncludes(final, comment) {
      var firstCodeOrigin = this.tokens[this.idx].codeOrigin;
      var fileList = [];
      fileList.push(this.tokens[this.idx].codeOrigin.fileName);
      while (true) {
        if (this.idx == this.tokens.length && !final || final && final.test(this.tokens[this.idx].string)) break;else if (this.tokens[this.idx].isEqualTo("include")) {
          this.idx++;
          if (!isIdentifier(this.tokens[this.idx])) this.parseError();
          var moduleName = this.tokens[this.idx].string;
          var _fileName2 = new IncludeFile(moduleName, this.tokens[this.idx].codeOrigin.fileName.dirname).fileName;
          this.idx++;
          fileList.push(_fileName2);
        } else this.idx++;
      }
      return fileList;
    }
  }]);
}();
function parseData(data, fileName) {
  var parser = new Parser(data, new SourceFile(fileName));
  return parser.parseSequence(null, "");
}
function parse(fileName) {
  return parseData(File.open(fileName).read(), fileName);
}

