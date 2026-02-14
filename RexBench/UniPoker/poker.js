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

function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CardDeck = /*#__PURE__*/function () {
  function CardDeck() {
    _classCallCheck(this, CardDeck);
    this.newDeck();
  }
  return _createClass(CardDeck, [{
    key: "newDeck",
    value: function newDeck() {
      // Make a shallow copy of a new deck
      this._cards = CardDeck._newDeck.slice(0);
    }
  }, {
    key: "shuffle",
    value: function shuffle() {
      this.newDeck();
      for (var index = 52; index !== 0;) {
        // Select a random card
        var randomIndex = Math.floor(Math.random() * index);
        index--;

        // Swap the current card with the random card
        var tempCard = this._cards[index];
        this._cards[index] = this._cards[randomIndex];
        this._cards[randomIndex] = tempCard;
      }
    }
  }, {
    key: "dealOneCard",
    value: function dealOneCard() {
      return this._cards.shift();
    }
  }], [{
    key: "cardRank",
    value: function cardRank(card) {
      // This returns a numeric value for a card.
      // Ace is highest.

      var rankOfCard = card.codePointAt(0) & 0xf;
      if (rankOfCard == 0x1)
        // Make Aces higher than Kings
        rankOfCard = 0xf;
      return rankOfCard;
    }
  }, {
    key: "cardName",
    value: function cardName(card) {
      if (typeof card == "string") card = card.codePointAt(0);
      return this._rankNames[card & 0xf];
    }
  }]);
}();
CardDeck._rankNames = ["", "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "", "Queen", "King"];
CardDeck._newDeck = [
// Spades
"\u{1f0a1}", "\u{1f0a2}", "\u{1f0a3}", "\u{1f0a4}", "\u{1f0a5}", "\u{1f0a6}", "\u{1f0a7}", "\u{1f0a8}", "\u{1f0a9}", "\u{1f0aa}", "\u{1f0ab}", "\u{1f0ad}", "\u{1f0ae}",
// Hearts
"\u{1f0b1}", "\u{1f0b2}", "\u{1f0b3}", "\u{1f0b4}", "\u{1f0b5}", "\u{1f0b6}", "\u{1f0b7}", "\u{1f0b8}", "\u{1f0b9}", "\u{1f0ba}", "\u{1f0bb}", "\u{1f0bd}", "\u{1f0be}",
// Clubs
"\u{1f0d1}", "\u{1f0d2}", "\u{1f0d3}", "\u{1f0d4}", "\u{1f0d5}", "\u{1f0d6}", "\u{1f0d7}", "\u{1f0d8}", "\u{1f0d9}", "\u{1f0da}", "\u{1f0db}", "\u{1f0dd}", "\u{1f0de}",
// Diamonds
"\u{1f0c1}", "\u{1f0c2}", "\u{1f0c3}", "\u{1f0c4}", "\u{1f0c5}", "\u{1f0c6}", "\u{1f0c7}", "\u{1f0c8}", "\u{1f0c9}", "\u{1f0ca}", "\u{1f0cb}", "\u{1f0cd}", "\u{1f0ce}"];
var Hand = /*#__PURE__*/function () {
  function Hand() {
    _classCallCheck(this, Hand);
    this.clear();
  }
  return _createClass(Hand, [{
    key: "clear",
    value: function clear() {
      this._cards = [];
      this._rank = 0;
    }
  }, {
    key: "takeCard",
    value: function takeCard(card) {
      this._cards.push(card);
    }
  }, {
    key: "score",
    value: function score() {
      // Sort highest rank to lowest
      this._cards.sort((a, b) => {
        return CardDeck.cardRank(b) - CardDeck.cardRank(a);
      });
      var handString = this._cards.join("");
      var flushResult = handString.match(Hand.FlushRegExp);
      var straightResult = handString.match(Hand.StraightRegExp);
      var ofAKindResult = handString.match(Hand.OfAKindRegExp);
      if (flushResult) {
        if (straightResult) {
          if (straightResult[1]) this._rank = Hand.RoyalFlush;else this._rank = Hand.StraightFlush;
        } else this._rank = Hand.Flush;
        this._rank |= CardDeck.cardRank(this._cards[0]) << 16 | CardDeck.cardRank(this._cards[1]) << 12;
      } else if (straightResult) this._rank = Hand.Straight | CardDeck.cardRank(this._cards[0]) << 16 | CardDeck.cardRank(this._cards[1]) << 12;else if (ofAKindResult) {
        // When comparing lengths, a matched unicode character has a length of 2.
        // Therefore expected lengths are doubled, e.g a pair will have a match length of 4.
        if (ofAKindResult[0].length == 8) this._rank = Hand.FourOfAKind | CardDeck.cardRank(this._cards[0]);else {
          // Found pair or three of a kind.  Check for two pair or full house.
          var firstOfAKind = ofAKindResult[0];
          var remainingCardsIndex = handString.indexOf(firstOfAKind) + firstOfAKind.length;
          var secondOfAKindResult;
          if (remainingCardsIndex <= 6 && (secondOfAKindResult = handString.slice(remainingCardsIndex).match(Hand.OfAKindRegExp))) {
            if (firstOfAKind.length == 6 && secondOfAKindResult[0].length == 4 || firstOfAKind.length == 4 && secondOfAKindResult[0].length == 6) {
              var threeOfAKindCardRank;
              var twoOfAKindCardRank;
              if (firstOfAKind.length == 6) {
                threeOfAKindCardRank = CardDeck.cardRank(firstOfAKind.slice(0, 2));
                twoOfAKindCardRank = CardDeck.cardRank(secondOfAKindResult[0].slice(0, 2));
              } else {
                threeOfAKindCardRank = CardDeck.cardRank(secondOfAKindResult[0].slice(0, 2));
                twoOfAKindCardRank = CardDeck.cardRank(firstOfAKind.slice(0, 2));
              }
              this._rank = Hand.FullHouse | threeOfAKindCardRank << 16 | threeOfAKindCardRank < 12 | threeOfAKindCardRank << 8 | twoOfAKindCardRank << 4 | twoOfAKindCardRank;
            } else if (firstOfAKind.length == 4 && secondOfAKindResult[0].length == 4) {
              var firstPairCardRank = CardDeck.cardRank(firstOfAKind.slice(0, 2));
              var SecondPairCardRank = CardDeck.cardRank(secondOfAKindResult[0].slice(0, 2));
              var otherCardRank;
              // Due to sorting, the other card is at index 0, 4 or 8
              if (firstOfAKind.codePointAt(0) == handString.codePointAt(0)) {
                if (secondOfAKindResult[0].codePointAt(0) == handString.codePointAt(4)) otherCardRank = CardDeck.cardRank(handString.slice(8, 10));else otherCardRank = CardDeck.cardRank(handString.slice(4, 6));
              } else otherCardRank = CardDeck.cardRank(handString.slice(0, 2));
              this._rank = Hand.TwoPair | firstPairCardRank << 16 | firstPairCardRank << 12 | SecondPairCardRank << 8 | SecondPairCardRank << 4 | otherCardRank;
            }
          } else {
            var ofAKindCardRank = CardDeck.cardRank(firstOfAKind.slice(0, 2));
            var otherCardsRank = 0;
            for (var card of this._cards) {
              var cardRank = CardDeck.cardRank(card);
              if (cardRank != ofAKindCardRank) otherCardsRank = otherCardsRank << 4 | cardRank;
            }
            if (firstOfAKind.length == 6) this._rank = Hand.ThreeOfAKind | ofAKindCardRank << 16 | ofAKindCardRank << 12 | ofAKindCardRank << 8 | otherCardsRank;else this._rank = Hand.Pair | ofAKindCardRank << 16 | ofAKindCardRank << 12 | otherCardsRank;
          }
        }
      } else {
        this._rank = 0;
        for (var _card of this._cards) {
          var _cardRank = CardDeck.cardRank(_card);
          this._rank = this._rank << 4 | _cardRank;
        }
      }
    }
  }, {
    key: "rank",
    get: function () {
      return this._rank;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this._cards.join("");
    }
  }]);
}();
Hand.FlushRegExp = new RegExp("([\u{1f0a1}-\u{1f0ae}]{5})|([\u{1f0b1}-\u{1f0be}]{5})|([\u{1f0c1}-\u{1f0ce}]{5})|([\u{1f0d1}-\u{1f0de}]{5})", "u");
Hand.StraightRegExp = new RegExp("([\u{1f0a1}\u{1f0b1}\u{1f0d1}\u{1f0c1}][\u{1f0ae}\u{1f0be}\u{1f0de}\u{1f0ce}][\u{1f0ad}\u{1f0bd}\u{1f0dd}\u{1f0cd}][\u{1f0ab}\u{1f0bb}\u{1f0db}\u{1f0cb}][\u{1f0aa}\u{1f0ba}\u{1f0da}\u{1f0ca}])|[\u{1f0ae}\u{1f0be}\u{1f0de}\u{1f0ce}][\u{1f0ad}\u{1f0bd}\u{1f0dd}\u{1f0cd}][\u{1f0ab}\u{1f0bb}\u{1f0db}\u{1f0cb}][\u{1f0aa}\u{1f0ba}\u{1f0da}\u{1f0ca}][\u{1f0a9}\u{1f0b9}\u{1f0d9}\u{1f0c9}]|[\u{1f0ad}\u{1f0bd}\u{1f0dd}\u{1f0cd}][\u{1f0ab}\u{1f0bb}\u{1f0db}\u{1f0cb}][\u{1f0aa}\u{1f0ba}\u{1f0da}\u{1f0ca}][\u{1f0a9}\u{1f0b9}\u{1f0d9}\u{1f0c9}][\u{1f0a8}\u{1f0b8}\u{1f0d8}\u{1f0c8}]|[\u{1f0ab}\u{1f0bb}\u{1f0db}\u{1f0cb}][\u{1f0aa}\u{1f0ba}\u{1f0da}\u{1f0ca}][\u{1f0a9}\u{1f0b9}\u{1f0d9}\u{1f0c9}][\u{1f0a8}\u{1f0b8}\u{1f0d8}\u{1f0c8}][\u{1f0a7}\u{1f0b7}\u{1f0d7}\u{1f0c7}]|[\u{1f0aa}\u{1f0ba}\u{1f0da}\u{1f0ca}][\u{1f0a9}\u{1f0b9}\u{1f0d9}\u{1f0c9}][\u{1f0a8}\u{1f0b8}\u{1f0d8}\u{1f0c8}][\u{1f0a7}\u{1f0b7}\u{1f0d7}\u{1f0c7}][\u{1f0a6}\u{1f0b6}\u{1f0d6}\u{1f0c6}]|[\u{1f0a9}\u{1f0b9}\u{1f0d9}\u{1f0c9}][\u{1f0a8}\u{1f0b8}\u{1f0d8}\u{1f0c8}][\u{1f0a7}\u{1f0b7}\u{1f0d7}\u{1f0c7}][\u{1f0a6}\u{1f0b6}\u{1f0d6}\u{1f0c6}][\u{1f0a5}\u{1f0b5}\u{1f0d5}\u{1f0c5}]|[\u{1f0a8}\u{1f0b8}\u{1f0d8}\u{1f0c8}][\u{1f0a7}\u{1f0b7}\u{1f0d7}\u{1f0c7}][\u{1f0a6}\u{1f0b6}\u{1f0d6}\u{1f0c6}][\u{1f0a5}\u{1f0b5}\u{1f0d5}\u{1f0c5}][\u{1f0a4}\u{1f0b4}\u{1f0d4}\u{1f0c4}]|[\u{1f0a7}\u{1f0b7}\u{1f0d7}\u{1f0c7}][\u{1f0a6}\u{1f0b6}\u{1f0d6}\u{1f0c6}][\u{1f0a5}\u{1f0b5}\u{1f0d5}\u{1f0c5}][\u{1f0a4}\u{1f0b4}\u{1f0d4}\u{1f0c4}][\u{1f0a3}\u{1f0b3}\u{1f0d3}\u{1f0c3}]|[\u{1f0a6}\u{1f0b6}\u{1f0d6}\u{1f0c6}][\u{1f0a5}\u{1f0b5}\u{1f0d5}\u{1f0c5}][\u{1f0a4}\u{1f0b4}\u{1f0d4}\u{1f0c4}][\u{1f0a3}\u{1f0b3}\u{1f0d3}\u{1f0c3}][\u{1f0a2}\u{1f0b2}\u{1f0d2}\u{1f0c2}]|[\u{1f0a1}\u{1f0b1}\u{1f0d1}\u{1f0c1}][\u{1f0a5}\u{1f0b5}\u{1f0d5}\u{1f0c5}][\u{1f0a4}\u{1f0b4}\u{1f0d4}\u{1f0c4}][\u{1f0a3}\u{1f0b3}\u{1f0d3}\u{1f0c3}][\u{1f0a2}\u{1f0b2}\u{1f0d2}\u{1f0c2}]", "u");
Hand.OfAKindRegExp = new RegExp("(?:[\u{1f0a1}\u{1f0b1}\u{1f0d1}\u{1f0c1}]{2,4})|(?:[\u{1f0ae}\u{1f0be}\u{1f0de}\u{1f0ce}]{2,4})|(?:[\u{1f0ad}\u{1f0bd}\u{1f0dd}\u{1f0cd}]{2,4})|(?:[\u{1f0ab}\u{1f0bb}\u{1f0db}\u{1f0cb}]{2,4})|(?:[\u{1f0aa}\u{1f0ba}\u{1f0da}\u{1f0ca}]{2,4})|(?:[\u{1f0a9}\u{1f0b9}\u{1f0d9}\u{1f0c9}]{2,4})|(?:[\u{1f0a8}\u{1f0b8}\u{1f0d8}\u{1f0c8}]{2,4})|(?:[\u{1f0a7}\u{1f0b7}\u{1f0d7}\u{1f0c7}]{2,4})|(?:[\u{1f0a6}\u{1f0b6}\u{1f0d6}\u{1f0c6}]{2,4})|(?:[\u{1f0a5}\u{1f0b5}\u{1f0d5}\u{1f0c5}]{2,4})|(?:[\u{1f0a4}\u{1f0b4}\u{1f0d4}\u{1f0c4}]{2,4})|(?:[\u{1f0a3}\u{1f0b3}\u{1f0d3}\u{1f0c3}]{2,4})|(?:[\u{1f0a2}\u{1f0b2}\u{1f0d2}\u{1f0c2}]{2,4})", "u");
Hand.RoyalFlush = 0x900000;
Hand.StraightFlush = 0x800000;
Hand.FourOfAKind = 0x700000;
Hand.FullHouse = 0x600000;
Hand.Flush = 0x500000;
Hand.Straight = 0x400000;
Hand.ThreeOfAKind = 0x300000;
Hand.TwoPair = 0x200000;
Hand.Pair = 0x100000;
var Player = /*#__PURE__*/function (_Hand) {
  function Player(name) {
    var _this;
    _classCallCheck(this, Player);
    _this = _callSuper(this, Player);
    _this._name = name;
    _this._wins = 0;
    _this._handTypeCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    return _this;
  }
  _inherits(Player, _Hand);
  return _createClass(Player, [{
    key: "scoreHand",
    value: function scoreHand() {
      this.score();
      var handType = this.rank >> 20;
      this._handTypeCounts[handType]++;
    }
  }, {
    key: "wonHand",
    value: function wonHand() {
      this._wins++;
    }
  }, {
    key: "name",
    get: function () {
      return this._name;
    }
  }, {
    key: "hand",
    get: function () {
      return _superPropGet(Player, "toString", this, 3)([]);
    }
  }, {
    key: "wins",
    get: function () {
      return this._wins;
    }
  }, {
    key: "handTypeCounts",
    get: function () {
      return this._handTypeCounts;
    }
  }]);
}(Hand);
function playHands(players) {
  var cardDeck = new CardDeck();
  var handsPlayed = 0;
  var highestRank = 0;
  do {
    cardDeck.shuffle();
    for (var player of players) player.clear();
    for (var i = 0; i < 5; i++) {
      for (var _player of players) _player.takeCard(cardDeck.dealOneCard());
    }
    for (var _player2 of players) _player2.scoreHand();
    handsPlayed++;
    highestRank = 0;
    for (var _player3 of players) {
      if (_player3.rank > highestRank) highestRank = _player3.rank;
    }
    for (var _player4 of players) {
      // We count ties as wins for each player.
      if (_player4.rank == highestRank) _player4.wonHand();
    }
  } while (handsPlayed < 2000);
}

