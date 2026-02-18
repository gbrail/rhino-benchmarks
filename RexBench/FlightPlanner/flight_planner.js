/*
 * Copyright (C) 2017 Apple Inc. All rights reserved.
 * Copyright (C) 2016-2017 Michael Saboff. All rights reserved.
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

function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
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
var earthRadius = 3440; // In nautical miles.
var TwoPI = Math.PI * 2;
var degreeCharacter = "\u00b0";
var regExpOptionalUnicodeFlag;
var keywords;
if (this.useUnicode) {
  regExpOptionalUnicodeFlag = "u";
  keywords = UnicodeStrings;
} else {
  regExpOptionalUnicodeFlag = "";
  keywords = {
    get: function (str) {
      return str;
    }
  };
}
function status(text) {
  console.debug("Status: " + text);
}
function error(text) {
  console.error("Error: " + text);
}
if (typeof Number.prototype.toRadians === "undefined") {
  Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
  };
}
if (typeof Number.prototype.toDegrees === "undefined") {
  Number.prototype.toDegrees = function () {
    return this * 180 / Math.PI;
  };
}
function distanceFromSpeedAndTime(speed, time) {
  return speed * time.hours();
}
var LatRE = new RegExp("^([NS\\-])?(90|[0-8]?\\d)(?:( [0-5]?\\d\\.\\d{0,3})'?|(\\.\\d{0,6})|( ([0-5]?\\d)\" ?([0-5]?\\d)'?))?", "i" + regExpOptionalUnicodeFlag);
function decimalLatitudeFromString(latitudeString) {
  if (typeof latitudeString != "string") return 0;
  var match = latitudeString.match(LatRE);
  if (!match) return 0;
  var result = 0;
  var sign = 1;
  if (match[1] && (match[1].toUpperCase() == "S" || match[1] == "-")) sign = -1;
  result = Number(match[2]);
  if (result != 90) {
    if (match[3]) {
      // e.g. N37 42.874
      var minutes = Number(match[3]);
      result = result + minutes / 60;
    } else if (match[4]) {
      // e.g. N37.30697
      var decimalDegrees = Number(match[4]);
      result = result + decimalDegrees;
    } else if (match[5]) {
      // e.g. N37 18" 27'
      var degrees = Number(match[6]);
      var _minutes = Number(match[7]);
      result = result + (degrees + _minutes / 60) / 60;
    }
  }
  return result * sign;
}
var LongRE = new RegExp("^([EW\\-]?)(180|(?:1[0-7]|\\d)?\\d)(?:( [0-5]?\\d\\.\\d{0,3})|(\\.\\d{0,6})|( ([0-5]?\\d)\" ?([0-5]?\\d)'?)?)", "i" + regExpOptionalUnicodeFlag);
function decimalLongitudeFromString(longitudeString) {
  if (typeof longitudeString != "string") return 0;
  var match = longitudeString.match(LongRE);
  if (!match) return 0;
  var result = 0;
  var sign = 1;
  if (match[1] && (match[1].toUpperCase() == "W" || match[1] == "-")) sign = -1;
  result = Number(match[2]);
  if (result != 180) {
    if (match[3]) {
      // e.g. W121 53.254
      var minutes = Number(match[3]);
      result = result + minutes / 60;
    } else if (match[4]) {
      // e.g. W121.8876
      var decimalDegrees = Number(match[4]);
      result = result + decimalDegrees;
    } else if (match[5]) {
      // e.g. W121 53" 15'
      var degrees = Number(match[6]);
      var _minutes2 = Number(match[7]);
      result = result + (degrees + _minutes2 / 60) / 60;
    }
  }
  return result * sign;
}
var TimeRE = new RegExp("^([0-9][0-9]?)(?:\:([0-5][0-9]))?(?:\:([0-5][0-9]))?$");
var Time = /*#__PURE__*/function () {
  function Time(time) {
    _classCallCheck(this, Time);
    if (time instanceof Date) {
      this._seconds = Math.Round(time.valueOf() / 1000);
      return;
    }
    if (typeof time == "string") {
      var match = time.match(TimeRE);
      if (!match) {
        this._seconds = 0;
        return;
      }
      if (match[3]) {
        var hours = parseInt(match[1].toString());
        var minutes = parseInt(match[2].toString());
        var seconds = parseInt(match[3].toString());
        this._seconds = (hours * 60 + minutes) * 60 + seconds;
      } else if (match[2]) {
        var _minutes3 = parseInt(match[1].toString());
        var _seconds = parseInt(match[2].toString());
        this._seconds = _minutes3 * 60 + _seconds;
      } else this._seconds = parseInt(match[1].toString());
      return;
    }
    if (typeof time == "number") {
      this._seconds = Math.round(time);
      return;
    }
    this._seconds = 0;
  }
  return _createClass(Time, [{
    key: "add",
    value: function add(otherTime) {
      return new Time(this._seconds + otherTime._seconds);
    }
  }, {
    key: "addDate",
    value: function addDate(otherDate) {
      return new Date(this._seconds * 1000 + otherDate.valueOf());
    }
  }, {
    key: "seconds",
    value: function seconds() {
      return this._seconds;
    }
  }, {
    key: "minutes",
    value: function minutes() {
      return this._seconds / 60;
    }
  }, {
    key: "hours",
    value: function hours() {
      return this._seconds / 3600;
    }
  }, {
    key: "toString",
    value: function toString() {
      var result = "";
      var seconds = this._seconds % 60;
      if (seconds < 0) {
        result = "-";
        seconds = -seconds;
      }
      var minutes = this._seconds / 60 | 0;
      var hours = minutes / 60 | 0;
      minutes = minutes % 60;
      if (hours) result = result + hours + ":";
      if (minutes < 10 && hours) result = result + "0";
      result = result + minutes + ":";
      if (seconds < 10) result = result + "0";
      result = result + seconds;
      return result;
    }
  }], [{
    key: "differenceBetween",
    value: function differenceBetween(time2, time1) {
      var seconds1;
      var seconds2;
      if (time1 instanceof Time) seconds1 = time1.seconds();else seconds1 = Math.Round(time1.valueOf() / 1000);
      if (time2 instanceof Time) seconds2 = time2.seconds();else seconds2 = Math.Round(time2.valueOf() / 1000);
      return new Time(seconds2 - seconds1);
    }
  }]);
}();
var GeoLocation = /*#__PURE__*/function () {
  function GeoLocation(latitude, longitude) {
    _classCallCheck(this, GeoLocation);
    this.latitude = latitude;
    this.longitude = longitude;
  }
  return _createClass(GeoLocation, [{
    key: "latitudeString",
    value: function latitudeString() {
      var latitude = this.latitude;
      var latitudePrefix = "N";
      if (latitude < 0) {
        latitude = -latitude;
        latitudePrefix = "S";
      }
      var latitudeDegrees = Math.floor(latitude);
      var latitudeMinutes = ((latitude - latitudeDegrees) * 60).toFixed(3);
      var latitudeMinutesFiller = latitudeMinutes < 10 ? " " : "";
      return latitudePrefix + latitudeDegrees + degreeCharacter + latitudeMinutesFiller + latitudeMinutes + "'";
    }
  }, {
    key: "longitudeString",
    value: function longitudeString() {
      var longitude = this.longitude;
      var longitudePrefix = "E";
      if (longitude < 0) {
        longitude = -longitude;
        longitudePrefix = "W";
      }
      var longitudeDegrees = Math.floor(longitude);
      var longitudeMinutes = ((longitude - longitudeDegrees) * 60).toFixed(3);
      var longitudeMinutesFiller = longitudeMinutes < 10 ? " " : "";
      return longitudePrefix + longitudeDegrees + degreeCharacter + longitudeMinutesFiller + longitudeMinutes + "'";
    }
  }, {
    key: "distanceTo",
    value: function distanceTo(otherLocation) {
      var dLat = (otherLocation.latitude - this.latitude).toRadians();
      var dLon = (otherLocation.longitude - this.longitude).toRadians();
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.latitude.toRadians()) * Math.cos(otherLocation.latitude.toRadians()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return earthRadius * c;
    }
  }, {
    key: "bearingFrom",
    value: function bearingFrom(otherLocation, magneticVariation) {
      if (magneticVariation == undefined) magneticVariation = 0;
      var dLon = (this.longitude - otherLocation.longitude).toRadians();
      var thisLatitudeRadians = this.latitude.toRadians();
      var otherLatitudeRadians = otherLocation.latitude.toRadians();
      var y = Math.sin(dLon) * Math.cos(this.latitude.toRadians());
      var x = Math.cos(otherLatitudeRadians) * Math.sin(thisLatitudeRadians) - Math.sin(otherLatitudeRadians) * Math.cos(thisLatitudeRadians) * Math.cos(dLon);
      return (Math.atan2(y, x).toDegrees() + 720 + magneticVariation) % 360;
    }
  }, {
    key: "bearingTo",
    value: function bearingTo(otherLocation, magneticVariation) {
      if (magneticVariation == undefined) magneticVariation = 0;
      var dLon = (otherLocation.longitude - this.longitude).toRadians();
      var thisLatitudeRadians = this.latitude.toRadians();
      var otherLatitudeRadians = otherLocation.latitude.toRadians();
      var y = Math.sin(dLon) * Math.cos(otherLocation.latitude.toRadians());
      var x = Math.cos(thisLatitudeRadians) * Math.sin(otherLatitudeRadians) - Math.sin(thisLatitudeRadians) * Math.cos(otherLatitudeRadians) * Math.cos(dLon);
      return (Math.atan2(y, x).toDegrees() + 720 + magneticVariation) % 360;
    }
  }, {
    key: "locationFrom",
    value: function locationFrom(bearing, distance, magneticVariation) {
      if (magneticVariation == undefined) magneticVariation = 0;
      var bearingRadians = (bearing - magneticVariation).toRadians();
      var thisLatitudeRadians = this.latitude.toRadians();
      var angularDistance = distance / earthRadius;
      var latitudeRadians = Math.asin(Math.sin(thisLatitudeRadians) * Math.cos(angularDistance) + Math.cos(thisLatitudeRadians) * Math.sin(angularDistance) * Math.cos(bearingRadians));
      var longitudeRadians = this.longitude.toRadians() + Math.atan2(Math.sin(bearingRadians) * Math.sin(angularDistance) * Math.cos(thisLatitudeRadians), Math.cos(angularDistance) - Math.sin(thisLatitudeRadians) * Math.sin(latitudeRadians));
      return new GeoLocation(latitudeRadians.toDegrees(), longitudeRadians.toDegrees());
    }
  }, {
    key: "toString",
    value: function toString() {
      return "(" + this.latitudeString() + ", " + this.longitudeString() + ")";
    }
  }]);
}();
function findFaaWaypoint(waypoint) {
  return faaWaypoints[waypoint];
}
var FaaWaypoints = /*#__PURE__*/function () {
  function FaaWaypoints() {
    _classCallCheck(this, FaaWaypoints);
    if (!FaaWaypoints.instance) {
      FaaWaypoints.instance = this;
      this.waypoints = _faaWaypoints;
    }
    return FaaWaypoints.instance;
  }
  return _createClass(FaaWaypoints, [{
    key: "find",
    value: function find(waypoint) {
      return this.waypoints[waypoint];
    }
  }]);
}();
FaaWaypoints.instance = undefined;
var faaWaypoints = new FaaWaypoints();
var FaaAirways = /*#__PURE__*/function () {
  function FaaAirways() {
    _classCallCheck(this, FaaAirways);
    if (!FaaAirways.instance) {
      FaaAirways.instance = this;
      this.airways = _faaAirways;
    }
    return FaaAirways.instance;
  }
  return _createClass(FaaAirways, [{
    key: "isAirway",
    value: function isAirway(identifier) {
      return !!this.airways[identifier];
    }
  }, {
    key: "resolveAirway",
    value: function resolveAirway(airwayID, entryPoint, exitPoint) {
      var airway = this.airways[airwayID];
      if (!airway) return "";
      var entryIndex = airway.fixes.indexOf(entryPoint);
      var exitIndex = airway.fixes.indexOf(exitPoint);
      if (entryIndex == -1 || exitIndex == -1) return "";
      var stride = entryIndex <= exitIndex ? 1 : -1;
      var route = [];
      for (var idx = entryIndex; idx != exitIndex; idx = idx + stride) route.push(airway.fixes[idx]);
      route.push(airway.fixes[exitIndex]);
      return route;
    }
  }]);
}();
FaaAirways.instance = undefined;
var faaAirways = new FaaAirways();
var UserWaypoints = /*#__PURE__*/function () {
  function UserWaypoints() {
    _classCallCheck(this, UserWaypoints);
    if (!UserWaypoints.instance) {
      UserWaypoints.instance = this;
      this.waypoints = {};
    }
    return UserWaypoints.instance;
  }
  return _createClass(UserWaypoints, [{
    key: "clear",
    value: function clear() {
      this.waypoints = {};
    }
  }, {
    key: "find",
    value: function find(waypoint) {
      return this.waypoints[waypoint];
    }
  }, {
    key: "update",
    value: function update(name, description, latitude, longitude) {
      if (typeof latitude == "string") latitude = decimalLatitudeFromString(latitude);
      if (typeof longitude == "string") longitude = decimalLongitudeFromString(longitude);
      this.waypoints[name.toUpperCase()] = {
        "name": name,
        "description": description,
        "latitude": latitude,
        "longitude": longitude
      };
    }
  }]);
}();
UserWaypoints.instance = undefined;
var userWaypoints = new UserWaypoints();
var EngineConfig = /*#__PURE__*/function () {
  function EngineConfig(type, fuelFlow, trueAirspeed) {
    _classCallCheck(this, EngineConfig);
    this.type = type;
    this._fuelFlow = fuelFlow;
    this._trueAirspeed = trueAirspeed;
  }
  return _createClass(EngineConfig, [{
    key: "trueAirspeed",
    value: function trueAirspeed() {
      return this._trueAirspeed;
    }
  }, {
    key: "fuelFlow",
    value: function fuelFlow() {
      return this._fuelFlow;
    }
  }], [{
    key: "appendConfig",
    value: function appendConfig(type, fuelFlow, trueAirspeed) {
      if (this.allConfigsByType[type]) {
        status("Duplicate Engine configuration: " + type);
        return;
      }
      var newConfig = new EngineConfig(type, fuelFlow, trueAirspeed);
      this.allConfigs.push(newConfig);
      this.allConfigsByType[type] = newConfig;
    }
  }, {
    key: "getConfig",
    value: function getConfig(n) {
      if (n >= this.allConfigs.length) return undefined;
      return this.allConfigs[n];
    }
  }]);
}();
EngineConfig.allConfigs = [];
EngineConfig.allConfigsByType = {};
EngineConfig.Taxi = 0;
EngineConfig.Runup = 1;
EngineConfig.Takeoff = 2;
EngineConfig.Climb = 3;
EngineConfig.Cruise = 4;
EngineConfig.Pattern = 5;
var Waypoint = /*#__PURE__*/_createClass(function Waypoint(name, type, description, latitude, longitude) {
  _classCallCheck(this, Waypoint);
  this.name = name;
  this.type = type;
  this.description = description;
  this.latitude = latitude;
  this.longitude = longitude;
});
var Leg = /*#__PURE__*/function () {
  function Leg(fix, location) {
    _classCallCheck(this, Leg);
    this.previous = undefined;
    this.next = undefined;
    this.fix = fix;
    this.location = location;
    this.course = 0;
    this.distance = 0;
    this.trueAirspeed = 0;
    this.windDirection = 0;
    this.windSpeed = 0;
    this.heading = 0;
    this.estGS = 0;
    this.startFlightTiming = false;
    this.stopFlightTiming = false;
    this.engineConfig = EngineConfig.Cruise;
    this.fuelFlow = 0;
    this.distanceRemaining = 0;
    this.estimatedTimeEnroute = undefined;
    this.estTimeRemaining = 0;
    this.estFuel = 0;
  }
  return _createClass(Leg, [{
    key: "fixName",
    value: function fixName() {
      return this.fix;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.fix;
    }
  }, {
    key: "setPrevious",
    value: function setPrevious(leg) {
      this.previous = leg;
    }
  }, {
    key: "previousLeg",
    value: function previousLeg() {
      return this.previous;
    }
  }, {
    key: "setNext",
    value: function setNext(leg) {
      this.next = leg;
    }
  }, {
    key: "nextLeg",
    value: function nextLeg() {
      return this.next;
    }
  }, {
    key: "setWind",
    value: function setWind(windDirection, windSpeed) {
      this.windDirection = windDirection;
      this.windSpeed = windSpeed;
    }
  }, {
    key: "isSameWind",
    value: function isSameWind(windDirection, windSpeed) {
      return this.windDirection == windDirection && this.windSpeed == windSpeed;
    }
  }, {
    key: "windToString",
    value: function windToString() {
      if (!this.windSpeed) return "";
      return (this.windDirection ? this.windDirection : "360") + "@" + this.windSpeed;
    }
  }, {
    key: "setTrueAirspeed",
    value: function setTrueAirspeed(trueAirspeed) {
      this.trueAirspeed = trueAirspeed;
    }
  }, {
    key: "isStandardTrueAirspeed",
    value: function isStandardTrueAirspeed() {
      var engineConfig = EngineConfig.getConfig(this.engineConfig);
      return this.trueAirspeed == engineConfig.trueAirspeed();
    }
  }, {
    key: "trueAirspeedToString",
    value: function trueAirspeedToString() {
      return this.trueAirspeed + "kts";
    }
  }, {
    key: "updateDistanceAndBearing",
    value: function updateDistanceAndBearing(other) {
      this.distance = this.location.distanceTo(other);
      this.course = Math.round(this.location.bearingFrom(other));
      if (this.estimatedTimeEnroute == undefined && this.estGS != 0) {
        var estimatedTimeEnrouteInSeconds = Math.round(this.distance * 3600 / this.estGS);
        this.estimatedTimeEnroute = new Time(estimatedTimeEnrouteInSeconds);
      }
      if (this.estimatedTimeEnroute.seconds()) this.estFuel = this.fuelFlow * this.estimatedTimeEnroute.hours();
    }
  }, {
    key: "propagateWind",
    value: function propagateWind() {
      var windDirection = this.windDirection;
      var windSpeed = this.windSpeed;
      windDirection = (windDirection + 360) % 360;
      if (!windDirection) windDirection = 360;
      for (var currLeg = this; currLeg; currLeg = currLeg.nextLeg()) {
        currLeg.windDirection = windDirection;
        currLeg.windSpeed = windSpeed;
        if (currLeg.stopFlightTiming) break;
      }
    }
  }, {
    key: "updateForWind",
    value: function updateForWind() {
      if (!this.windSpeed || !this.trueAirspeed) {
        this.heading = this.course;
        this.estGS = this.trueAirspeed;
        return;
      }
      var windDirectionRadians = this.windDirection.toRadians();
      var courseRadians = this.course.toRadians();
      var swc = this.windSpeed / this.trueAirspeed * Math.sin(windDirectionRadians - courseRadians);
      if (Math.abs(swc) > 1) {
        status("Wind to strong to fly!");
        return;
      }
      var headingRadians = courseRadians + Math.asin(swc);
      if (headingRadians < 0) headingRadians += TwoPI;
      if (headingRadians > TwoPI) headingRadians -= TwoPI;
      var groundSpeed = this.trueAirspeed * Math.sqrt(1 - swc * swc) - this.windSpeed * Math.cos(windDirectionRadians - courseRadians);
      if (groundSpeed < 0) {
        status("Wind to strong to fly!");
        return;
      }
      this.estGS = groundSpeed;
      this.heading = Math.round(headingRadians.toDegrees());
    }
  }, {
    key: "calculate",
    value: function calculate() {
      var engineConfig = EngineConfig.getConfig(this.engineConfig);
      if (!this.trueAirspeed) this.trueAirspeed = engineConfig.trueAirspeed();
      this.fuelFlow = engineConfig.fuelFlow();
      this.updateForWind();
    }
  }, {
    key: "updateForward",
    value: function updateForward() {
      if (this.specialUpdateForward) this.specialUpdateForward();
      var previousLeg = this.previousLeg();
      var havePrevious = true;
      if (!previousLeg) {
        havePrevious = false;
        previousLeg = this;
        if (!this.estimatedTimeEnroute) this.estimatedTimeEnroute = new Time(0);
      }
      var thisLegType = this.type;
      if (thisLegType == "Climb" && havePrevious) this.location = previousLeg.location;else {
        this.updateDistanceAndBearing(previousLeg.location);
        this.updateForWind();
        var nextLeg = this.nextLeg();
        var previousLegType = previousLeg.type;
        if (havePrevious) {
          if (previousLegType == "Climb") {
            var climbDistance = distanceFromSpeedAndTime(previousLeg.estGS, previousLeg.climbTime);
            if (climbDistance < this.distance) {
              var climbStartLocation = previousLeg.location;
              var climbEndLocation = climbStartLocation.locationFrom(this.course, climbDistance);
              previousLeg.location = climbEndLocation;
              previousLeg.updateDistanceAndBearing(climbStartLocation);
              this.estimatedTimeEnroute = undefined;
              this.updateDistanceAndBearing(climbEndLocation);
            } else {
              status("Not enough distance to climb in leg #" + previousLeg.index);
            }
          } else if ((thisLegType == "Left" || thisLegType == "Right") && nextLeg && nextLeg.location) {
            var standardRateCircumference = this.trueAirspeed / 30;
            var standardRateRadius = standardRateCircumference / TwoPI;
            var offsetInboundBearing = 360 + previousLeg.course + (thisLegType == "Left" ? -90 : 90);
            offsetInboundBearing = Math.round((offsetInboundBearing + 360) % 360);
            // Save original location
            if (!previousLeg.originalLocation) previousLeg.originalLocation = previousLeg.location;
            var previousLocation = previousLeg.originalLocation;
            var inboundLocation = previousLocation.locationFrom(offsetInboundBearing, standardRateRadius);
            var bearingToNext = Math.round(nextLeg.location.bearingFrom(previousLocation));
            var offsetOutboundBearing = bearingToNext + (thisLegType == "Left" ? 90 : -90);
            offsetOutboundBearing = (offsetOutboundBearing + 360) % 360;
            var outboundLocation = previousLocation.locationFrom(offsetOutboundBearing, standardRateRadius);
            var turnAngle = thisLegType == "Left" ? 360 + bearingToNext - previousLeg.course : 360 + previousLeg.course - bearingToNext;
            turnAngle = (turnAngle + 360) % 360;
            var totalDegrees = turnAngle + 360 * this.extraTurns;
            var secondsInTurn = Math.round(totalDegrees / 3);
            this.estimatedTimeEnroute = new Time(Math.round((turnAngle + 360 * this.extraTurns) / 3));
            this.estFuel = this.fuelFlow * this.estimatedTimeEnroute.hours();
            this.location = outboundLocation;
            this.distance = distanceFromSpeedAndTime(this.trueAirspeed, this.estimatedTimeEnroute);
            previousLeg.location = inboundLocation;
            var prevPrevLeg = previousLeg.previousLeg();
            if (prevPrevLeg && prevPrevLeg.location) {
              previousLeg.estimatedTimeEnroute = undefined;
              previousLeg.updateDistanceAndBearing(prevPrevLeg.location);
            }
          }
        }
      }
    }
  }, {
    key: "updateBackward",
    value: function updateBackward() {
      var nextLeg = this.nextLeg();
      var distanceRemaining;
      var timeRemaining;
      if (nextLeg) {
        distanceRemaining = nextLeg.distanceRemaining;
        timeRemaining = nextLeg.estTimeRemaining;
      } else {
        distanceRemaining = 0;
        timeRemaining = new Time(0);
      }
      if (this.stopFlightTiming || timeRemaining.seconds()) {
        this.distanceRemaining = distanceRemaining + this.distance;
        ;
        this.estTimeRemaining = timeRemaining.add(this.estimatedTimeEnroute);
      } else this.estTimeRemaining = new Time(0);
    }
  }]);
}();
var RallyLegWithFixRE = new RegExp("^([0-9a-z\.]{3,16})\\|(" + keywords.get("START") + "|" + keywords.get("TIMING") + ")", "i" + regExpOptionalUnicodeFlag);
var RallyLeg = /*#__PURE__*/function (_Leg) {
  function RallyLeg(type, fix, location, engineConfig) {
    var _this;
    _classCallCheck(this, RallyLeg);
    _this = _callSuper(this, RallyLeg, [fix, location]);
    _this.type = type;
    _this.engineConfig = engineConfig;
    return _this;
  }
  _inherits(RallyLeg, _Leg);
  return _createClass(RallyLeg, [{
    key: "fixName",
    value: function fixName() {
      return this.type;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.fixName();
    }
  }], [{
    key: "reset",
    value: function reset() {
      RallyLeg.startLocation = undefined;
      RallyLeg.startFix = "";
      RallyLeg.totalTaxiTime = new Time(0);
      RallyLeg.taxiSegments = [];
    }
  }, {
    key: "fixNeeded",
    value: function fixNeeded(fix) {
      var match = fix.match(RallyLegWithFixRE);
      if (!match) return "";
      return match[1].toString();
    }
  }, {
    key: "getLegWithFix",
    value: function getLegWithFix(waypointText, fix, location) {
      var match = waypointText.match(RallyLegWithFixRE);
      if (!match) return undefined;
      var legType = match[2].toString();
      if (legType == keywords.get("START")) {
        if (this.startLocation) {
          status("Trying to create second start leg");
          return undefined;
        }
        this.startLocation = location;
        this.startFix = fix;
        this.totalTaxiTime = new Time(0);
        this.taxiSegments = [];
        return new StartLeg(waypointText, fix, location);
      }
      if (legType == keywords.get("TIMING")) return new TimingLeg(waypointText, fix, location);
      error("Unhandled Rally Leg type " + legType);
      return undefined;
    }
  }]);
}(Leg);
RallyLeg.startLocation = undefined;
RallyLeg.startFix = "";
RallyLeg.totalTaxiTime = new Time(0);
RallyLeg.taxiSegments = [];
var StartLeg = /*#__PURE__*/function (_RallyLeg) {
  function StartLeg(fixText, fix, location) {
    _classCallCheck(this, StartLeg);
    return _callSuper(this, StartLeg, ["Start", fix, location, EngineConfig.Taxi]);
  }
  _inherits(StartLeg, _RallyLeg);
  return _createClass(StartLeg, [{
    key: "fixName",
    value: function fixName() {
      return this.fix + "|Start";
    }
  }]);
}(RallyLeg);
var TimingLeg = /*#__PURE__*/function (_RallyLeg2) {
  function TimingLeg(fixText, fix, location) {
    var _this2;
    _classCallCheck(this, TimingLeg);
    _this2 = _callSuper(this, TimingLeg, ["Timing", fix, location, EngineConfig.Cruise]);
    _this2.stopFlightTiming = true;
    return _this2;
  }
  _inherits(TimingLeg, _RallyLeg2);
  return _createClass(TimingLeg, [{
    key: "fixName",
    value: function fixName() {
      return this.fix + "|Timing";
    }
  }]);
}(RallyLeg);
var RallyLegNoFixRE = new RegExp(keywords.get("TAXI") + "|" + keywords.get("RUNUP") + "|" + keywords.get("TAKEOFF") + "|" + keywords.get("CLIMB") + "|" + keywords.get("PATTERN") + "|" + keywords.get("LEFT") + "|" + keywords.get("RIGHT"), "i" + regExpOptionalUnicodeFlag);
var RallyLegWithoutFix = /*#__PURE__*/function (_RallyLeg3) {
  function RallyLegWithoutFix(type, CommentsAsFix, location, engineConfig) {
    _classCallCheck(this, RallyLegWithoutFix);
    return _callSuper(this, RallyLegWithoutFix, [type, CommentsAsFix, location, engineConfig]);
  }
  _inherits(RallyLegWithoutFix, _RallyLeg3);
  return _createClass(RallyLegWithoutFix, [{
    key: "setPrevious",
    value: function setPrevious(previous) {
      if (this.setLocationFromPrevious() && previous) this.location = previous.location;
      _superPropGet(RallyLegWithoutFix, "setPrevious", this, 3)([previous]);
    }
  }, {
    key: "setLocationFromPrevious",
    value: function setLocationFromPrevious() {
      return false;
    }
  }], [{
    key: "isRallyLegWithoutFix",
    value: function isRallyLegWithoutFix(fix) {
      var barPosition = fix.indexOf("|");
      var firstPart = barPosition < 0 ? fix : fix.substring(0, barPosition);
      return RallyLegNoFixRE.test(firstPart);
    }
  }, {
    key: "getLegNoFix",
    value: function getLegNoFix(waypointText) {
      var barPosition = waypointText.indexOf("|");
      var firstPart = barPosition < 0 ? waypointText : waypointText.substring(0, barPosition);
      firstPart = firstPart.toUpperCase();
      var match = firstPart.match(RallyLegNoFixRE);
      if (!match) return undefined;
      var legType = match[0].toString();
      if (legType == keywords.get("TAXI")) return new TaxiLeg(waypointText);
      if (legType == keywords.get("RUNUP")) return new RunupLeg(waypointText);
      if (legType == keywords.get("TAKEOFF")) {
        if (!this.startLocation) {
          status("Trying to create a Takeoff leg without start leg");
          return undefined;
        }
        return new TakeoffLeg(waypointText);
      }
      if (legType == keywords.get("CLIMB")) return new ClimbLeg(waypointText);
      if (legType == keywords.get("PATTERN")) return new PatternLeg(waypointText);
      if (legType == keywords.get("LEFT") || legType == keywords.get("RIGHT")) return new TurnLeg(waypointText, legType == keywords.get("RIGHT"));
      error("Unhandled Rally Leg type " + legType);
      return undefined;
    }
  }]);
}(RallyLeg); // TAXI[|<time>]  e.g. TAXI|2:30
var TaxiLegRE = new RegExp("^" + keywords.get("TAXI") + "(?:\\|([0-9][0-9]?(?:\:[0-5][0-9])?))?$", "i" + regExpOptionalUnicodeFlag);
var TaxiLeg = /*#__PURE__*/function (_RallyLegWithoutFix) {
  function TaxiLeg(fixText) {
    var _this3;
    _classCallCheck(this, TaxiLeg);
    var match = fixText.match(TaxiLegRE);
    _this3 = _callSuper(this, TaxiLeg, ["Taxi", "", new GeoLocation(-1, -1), EngineConfig.Taxi]);
    var taxiTimeString = "5:00";
    if (match[1]) taxiTimeString = match[1].toString();
    _this3.estimatedTimeEnroute = new Time(taxiTimeString);
    return _this3;
  }
  _inherits(TaxiLeg, _RallyLegWithoutFix);
  return _createClass(TaxiLeg, [{
    key: "setLocationFromPrevious",
    value: function setLocationFromPrevious() {
      return true;
    }
  }, {
    key: "fixName",
    value: function fixName() {
      return "Taxi|" + this.estimatedTimeEnroute.toString();
    }
  }]);
}(RallyLegWithoutFix); // RUNUP[|<time>]  e.g. RUNUP|0:30
var RunupLegRE = new RegExp("^" + keywords.get("RUNUP") + "(?:\\|([0-9][0-9]?(?:\:[0-5][0-9])?))?$", "i" + regExpOptionalUnicodeFlag);
var RunupLeg = /*#__PURE__*/function (_RallyLegWithoutFix2) {
  function RunupLeg(fixText) {
    var _this4;
    _classCallCheck(this, RunupLeg);
    var match = fixText.match(RunupLegRE);
    _this4 = _callSuper(this, RunupLeg, ["Runup", "", new GeoLocation(-1, -1), EngineConfig.Runup]);
    var runupTimeString = "30";
    if (match[1]) runupTimeString = match[1].toString();
    _this4.estimatedTimeEnroute = new Time(runupTimeString);
    return _this4;
  }
  _inherits(RunupLeg, _RallyLegWithoutFix2);
  return _createClass(RunupLeg, [{
    key: "setLocationFromPrevious",
    value: function setLocationFromPrevious() {
      return true;
    }
  }, {
    key: "fixName",
    value: function fixName() {
      return "Runup|" + this.estimatedTimeEnroute.toString();
    }
  }]);
}(RallyLegWithoutFix); // TAKEOFF[|<time>][|<bearing>|<distance>]  e.g. TAKEOFF|2:00|270@3.5
var TakeoffLegRE = new RegExp("^" + keywords.get("TAKEOFF") + "(?:\\|([0-9][0-9]?(?:\:[0-5][0-9])?))?(?:\\|([0-9]{1,2}|[0-2][0-9][0-9]|3[0-5][0-9]|360)(?:@)(\\d{1,2}(?:\\.\\d{1,4})?))?$", "i" + regExpOptionalUnicodeFlag);
var TakeoffLeg = /*#__PURE__*/function (_RallyLegWithoutFix3) {
  function TakeoffLeg(fixText) {
    var _this5;
    _classCallCheck(this, TakeoffLeg);
    var match = fixText.match(TakeoffLegRE);
    var bearingFromStart = 0;
    var distanceFromStart = 0;
    var takeoffEndLocation = RallyLeg.startLocation;
    if (match && match[2] && match[3]) {
      bearingFromStart = parseInt(match[2].toString()) % 360;
      distanceFromStart = parseFloat(match[3].toString());
      takeoffEndLocation = RallyLeg.startLocation.locationFrom(bearingFromStart, distanceFromStart);
    }
    _this5 = _callSuper(this, TakeoffLeg, ["Takeoff", "", takeoffEndLocation, EngineConfig.Takeoff]);
    _this5.bearingFromStart = bearingFromStart;
    _this5.distanceFromStart = distanceFromStart;
    var takeoffTimeString = "2:00";
    if (match[1]) takeoffTimeString = match[1].toString();
    _this5.estimatedTimeEnroute = new Time(takeoffTimeString);
    _this5.startFlightTiming = true;
    return _this5;
  }
  _inherits(TakeoffLeg, _RallyLegWithoutFix3);
  return _createClass(TakeoffLeg, [{
    key: "fixName",
    value: function fixName() {
      var result = "Takeoff";
      if (this.estimatedTimeEnroute.seconds() != 120) result += "|" + this.estimatedTimeEnroute.toString();
      if (this.distanceFromStart) result += "|" + this.bearingFromStart + "@" + this.distanceFromStart;
      return result;
    }
  }]);
}(RallyLegWithoutFix); // CLIMB|<alt>|<time>  e.g. CLIMB|5000|7:00
var ClimbLegRE = new RegExp("^" + keywords.get("CLIMB") + "(?:\\|)(\\d{3,5})(?:\\|([0-9][0-9]?(?:\:[0-5][0-9])?))$", "i" + regExpOptionalUnicodeFlag);
var ClimbLeg = /*#__PURE__*/function (_RallyLegWithoutFix4) {
  function ClimbLeg(fixText) {
    var _this6;
    _classCallCheck(this, ClimbLeg);
    var match = fixText.match(ClimbLegRE);
    var altitude = 5500;
    if (match && match[1]) altitude = match[1].toString();
    _this6 = _callSuper(this, ClimbLeg, ["Climb", altitude + "\"", undefined, EngineConfig.Climb]);
    var timeToClimb = "8:00";
    if (match && match[2]) timeToClimb = match[2].toString();
    _this6.altitude = altitude;
    _this6.climbTime = _this6.estimatedTimeEnroute = new Time(timeToClimb);
    return _this6;
  }
  _inherits(ClimbLeg, _RallyLegWithoutFix4);
  return _createClass(ClimbLeg, [{
    key: "setLocationFromPrevious",
    value: function setLocationFromPrevious() {
      return true;
    }
  }, {
    key: "fixName",
    value: function fixName() {
      return "Climb|" + this.altitude + "|" + this.estimatedTimeEnroute.toString();
    }
  }]);
}(RallyLegWithoutFix); // PATTERN|<time>  e.g. PATTERN|0:30
var PatternLegRE = new RegExp("^" + keywords.get("PATTERN") + "(?:\\|([0-9][0-9]?(?:\:[0-5][0-9])?))$", "i" + regExpOptionalUnicodeFlag);
var PatternLeg = /*#__PURE__*/function (_RallyLegWithoutFix5) {
  function PatternLeg(fixText) {
    var _this7;
    _classCallCheck(this, PatternLeg);
    _this7 = _callSuper(this, PatternLeg, ["Pattern", "", undefined, EngineConfig.Pattern]);
    var match = fixText.match(PatternLegRE);
    var patternTimeString = match[1].toString();
    _this7.estimatedTimeEnroute = new Time(patternTimeString);
    return _this7;
  }
  _inherits(PatternLeg, _RallyLegWithoutFix5);
  return _createClass(PatternLeg, [{
    key: "setLocationFromPrevious",
    value: function setLocationFromPrevious() {
      return true;
    }
  }, {
    key: "fixName",
    value: function fixName() {
      return "Pattern|" + this.estimatedTimeEnroute.toString();
    }
  }]);
}(RallyLegWithoutFix); // {LEFT,RIGHT}[|+<extra_turns>]  e.g. LEFT|2
var TurnLegRE = new RegExp("^(" + keywords.get("LEFT") + "|" + keywords.get("RIGHT") + ")(?:\\|\\+(\\d))?$", "i");
var TurnLeg = /*#__PURE__*/function (_RallyLegWithoutFix6) {
  function TurnLeg(fixText, isRightTurn) {
    var _this8;
    _classCallCheck(this, TurnLeg);
    var match = fixText.match(TurnLegRE);
    var direction = "Left";
    if (match && match[1]) direction = match[1].toString().toUpperCase() == keywords.get("LEFT") ? "Left" : "Right";
    var engineConfig = EngineConfig.Cruise;
    _this8 = _callSuper(this, TurnLeg, [direction, "", new GeoLocation(-1, -1), engineConfig]);
    _this8.extraTurns = match && match[2] ? parseInt(match[2]) : 0;
    return _this8;
  }
  _inherits(TurnLeg, _RallyLegWithoutFix6);
  return _createClass(TurnLeg, [{
    key: "fixName",
    value: function fixName() {
      var result = this.type;
      if (this.extraTurns) result += "|+" + this.extraTurns;
      return result;
    }
  }]);
}(RallyLegWithoutFix);
var LegModifier = new RegExp("(360|3[0-5][0-9]|[0-2][0-9]{2}|[0-9]{1,2})@([0-9]{1,3})|([1-9][0-9]{1,2}|0)kts", "i");
var FlightPlan = /*#__PURE__*/function () {
  function FlightPlan(name, route) {
    _classCallCheck(this, FlightPlan);
    this._name = name;
    this._route = route;
    this._firstLeg = undefined;
    this._lastLeg = undefined;
    this._legCount = 0;
    this._defaultWindDirection = 0;
    this._defaultWindSpeed = 0;
    this._trueAirspeedOverride = 0;
    this._timeToGate = undefined;
    this._estimatedTimeEnroute = undefined;
    this._totalFuel = 0;
    this._totalTime = new Time();
    this._gateTime = new Time();
    RallyLeg.reset(); //  Refactor to make this more OO
  }
  return _createClass(FlightPlan, [{
    key: "clear",
    value: function clear() {}
  }, {
    key: "appendLeg",
    value: function appendLeg(leg) {
      if (!this._firstLeg) this._firstLeg = leg;
      if (this._lastLeg) this._lastLeg.setNext(leg);
      leg.setPrevious(this._lastLeg);
      leg.setNext(undefined);
      if (this._trueAirspeedOverride) {
        leg.setTrueAirspeed(this._trueAirspeedOverride);
        this.clearTrueAirspeedOverride(0);
      }
      if (this._defaultWindSpeed) leg.setWind(this._defaultWindDirection, this._defaultWindSpeed);
      this._lastLeg = leg;
      this._legCount++;
    }
  }, {
    key: "setDefaultWind",
    value: function setDefaultWind(windDirection, windSpeed) {
      this._defaultWindDirection = windDirection;
      this._defaultWindSpeed = windSpeed;
    }
  }, {
    key: "clearTrueAirspeedOverride",
    value: function clearTrueAirspeedOverride() {
      this._trueAirspeedOverride = 0;
    }
  }, {
    key: "setTrueAirspeedOverride",
    value: function setTrueAirspeedOverride(trueAirspeed) {
      this._trueAirspeedOverride = trueAirspeed;
    }
  }, {
    key: "isLegModifier",
    value: function isLegModifier(fix) {
      return LegModifier.test(fix);
    }
  }, {
    key: "processLegModifier",
    value: function processLegModifier(fix) {
      var match = fix.match(LegModifier);
      if (match) {
        if (match[1] && match[2]) {
          var windDirection = parseInt(match[1].toString()) % 360;
          var windSpeed = parseInt(match[2].toString());
          this.setDefaultWind(windDirection, windSpeed);
        } else if (match[3]) {
          var trueAirspeed = parseInt(match[3].toString());
          this.setTrueAirspeedOverride(trueAirspeed);
        }
      }
    }
  }, {
    key: "resolveWaypoint",
    value: function resolveWaypoint(waypointText) {
      if (this.isLegModifier(waypointText)) this.processLegModifier(waypointText);else if (RallyLegWithoutFix.isRallyLegWithoutFix(waypointText)) {
        var rallyLeg = RallyLegWithoutFix.getLegNoFix(waypointText);
        if (rallyLeg) this.appendLeg(rallyLeg);
      } else {
        var fixName = RallyLeg.fixNeeded(waypointText);
        var isRallyWaypoint = false;
        if (fixName) isRallyWaypoint = true;else fixName = waypointText;
        var waypoint = userWaypoints.find(fixName);
        if (!waypoint) waypoint = faaWaypoints.find(fixName);
        if (!waypoint) {
          error("Couldn't find waypoint \"" + waypointText + "\"");
          return;
        }
        var location = new GeoLocation(waypoint.latitude, waypoint.longitude);
        if (isRallyWaypoint) {
          var _rallyLeg = RallyLeg.getLegWithFix(waypointText, fixName, location);
          this.appendLeg(_rallyLeg);
        } else this.appendLeg(new Leg(waypoint.name, location));
      }
    }
  }, {
    key: "parseRoute",
    value: function parseRoute() {
      var waypointsToLookup = this._route.split(/ +/);
      var priorWaypoint = "";
      for (var waypointIndex = 0; waypointIndex < waypointsToLookup.length; waypointIndex++) {
        var currentWaypoint = waypointsToLookup[waypointIndex].toUpperCase();
        if (faaAirways.isAirway(currentWaypoint) && waypointIndex + 1 < waypointsToLookup.length) {
          var exitWaypointFix = waypointsToLookup[waypointIndex + 1];
          var airwayFixes = faaAirways.resolveAirway(currentWaypoint, priorWaypoint, exitWaypointFix);

          // We skip the entry and exit fixes, because they are handled in the prior / next
          // iterations of the outer loop.
          for (var airwayFixIndex = 1; airwayFixIndex < airwayFixes.length - 1; airwayFixIndex++) this.resolveWaypoint(airwayFixes[airwayFixIndex]);
        } else this.resolveWaypoint(currentWaypoint);
        priorWaypoint = currentWaypoint;
      }
    }
  }, {
    key: "calculate",
    value: function calculate() {
      if (!this._firstLeg) return;
      var haveStartTiming = false;
      var haveStopTiming = false;
      for (var thisLeg = this._firstLeg; thisLeg; thisLeg = thisLeg.nextLeg()) {
        thisLeg.calculate();
        if (thisLeg.startFlightTiming) {
          if (haveStartTiming) status("Have duplicate Start timing leg in row " + thisLeg.toString());
          haveStartTiming = true;
        }
        if (thisLeg.stopFlightTiming) {
          if (haveStopTiming) status("Have duplicate Timing leg in row " + thisLeg.toString());
          haveStopTiming = true;
        }
      }
      if (!haveStartTiming) this._firstLeg.startFlightTiming = true;
      if (!haveStopTiming) this._lastLeg.stopFlightTiming = true;
      for (var _thisLeg = this._firstLeg; _thisLeg; _thisLeg = _thisLeg.nextLeg()) _thisLeg.updateForward();
      for (var _thisLeg2 = this._lastLeg; _thisLeg2; _thisLeg2 = _thisLeg2.previousLeg()) _thisLeg2.updateBackward();
      for (var _thisLeg3 = this._firstLeg; _thisLeg3; _thisLeg3 = _thisLeg3.nextLeg()) {
        if (_thisLeg3.startFlightTiming) this._gateTime = _thisLeg3.estTimeRemaining;
      }
      this._totalTime = this._firstLeg.estTimeRemaining;
    }
  }, {
    key: "resolvedRoute",
    value: function resolvedRoute() {
      var result = "";
      var lastWindDirection = 0;
      var lastWindSpeed = 0;
      var legIndex = 0;
      var currentLeg = this._firstLeg;
      for (; currentLeg; currentLeg = currentLeg.nextLeg(), legIndex++) {
        if (legIndex) result = result + " ";
        if (!currentLeg.isSameWind(lastWindDirection, lastWindSpeed)) {
          result = result + currentLeg.windToString() + " ";
          lastWindDirection = currentLeg.windDirection;
          lastWindSpeed = currentLeg.windSpeed;
        }
        if (!currentLeg.isStandardTrueAirspeed()) result = result + currentLeg.trueAirspeedToString() + " ";
        result = result + currentLeg.toString();
      }
      return result;
    }
  }, {
    key: "name",
    value: function name() {
      return this._name;
    }
  }, {
    key: "totalTime",
    value: function totalTime() {
      return this._totalTime;
    }
  }, {
    key: "gateTime",
    value: function gateTime() {
      return this._gateTime;
    }
  }, {
    key: "toString",
    value: function toString() {
      var result = "";
      var lastWindDirection = 0;
      var lastWindSpeed = 0;
      var legIndex = 0;
      var currentLeg = this._firstLeg;
      for (; currentLeg; currentLeg = currentLeg.nextLeg(), legIndex++) {
        if (legIndex) result = result + " ";
        if (!currentLeg.isSameWind(lastWindDirection, lastWindSpeed)) {
          result = result + currentLeg.windToString() + " ";
          lastWindDirection = currentLeg.windDirection;
          lastWindSpeed = currentLeg.windSpeed;
        }
        if (!currentLeg.isStandardTrueAirspeed()) result = result + currentLeg.trueAirspeedToString() + " ";
        result = result + currentLeg.toString();
        result = result + " " + currentLeg.location + " " + currentLeg.distance.toFixed(2) + "nm " + currentLeg.estGS.toFixed(2) + "kts " + currentLeg.estimatedTimeEnroute + " ";
      }
      if (this._gateTime) result = result + " gate time " + this._gateTime;
      result = result + " total time " + this._firstLeg.estTimeRemaining;
      return result;
    }
  }]);
}();
EngineConfig.appendConfig("Taxi", 2, 0);
EngineConfig.appendConfig("Runup", 8, 0);
EngineConfig.appendConfig("Takeoff", 27, 105);
EngineConfig.appendConfig("Climb", 22, 125);
EngineConfig.appendConfig("Cruise", 15, 142);
EngineConfig.appendConfig("Pattern", 11, 95);
var ExpectedFlightPlan = /*#__PURE__*/function () {
  function ExpectedFlightPlan(name, route, expectedRoute, expectedTotalTime, expectedGateTime) {
    _classCallCheck(this, ExpectedFlightPlan);
    this._name = name;
    this._route = route;
    this._expectedRoute = expectedRoute;
    this._expectedTotalTime = expectedTotalTime;
    this._expectedGateTime = expectedGateTime;
  }
  return _createClass(ExpectedFlightPlan, [{
    key: "reset",
    value: function reset() {
      this._flightPlan = new FlightPlan(this._name, this._route);
    }
  }, {
    key: "resolveRoute",
    value: function resolveRoute() {
      this._flightPlan.parseRoute();
    }
  }, {
    key: "calculate",
    value: function calculate() {
      this._flightPlan.calculate();
    }
  }, {
    key: "checkExpectations",
    value: function checkExpectations() {
      if (this._expectedRoute) {
        var computedRoute = this._flightPlan.resolvedRoute();
        if (this._expectedRoute != computedRoute) error("Flight plan " + this._flightPlan.name() + " route different than expected (\"" + this._expectedRoute + "\"), got (\"" + computedRoute + "\")");
      }
      if (this._expectedTotalTime) {
        var computedTotalTime = this._flightPlan.totalTime();
        var deltaTime = Math.abs(Time.differenceBetween(this._expectedTotalTime, computedTotalTime).seconds());
        if (deltaTime > 5) error("Flight plan " + this._flightPlan.name() + " total time different than expected (" + this._expectedTotalTime + "), got (" + computedTotalTime + ")");
      }
      if (this._expectedGateTime) {
        var computedGateTime = this._flightPlan.gateTime();
        var _deltaTime = Math.abs(Time.differenceBetween(this._expectedGateTime, computedGateTime).seconds());
        if (_deltaTime > 5) error("Flight plan " + this._flightPlan.name() + " gate time different than expected (" + this._expectedGateTime + "), got (" + computedGateTime + ")");
      }
    }
  }]);
}();
function setupUserWaypoints() {
  userWaypoints.clear();
  userWaypoints.update("Oilcamp", "Oil storage in the middle of no where", "36.68471", "-120.50277");
  userWaypoints.update("I5.Westshields", "I5 & West Shields", "36.77774", "-120.72426");
  userWaypoints.update("I5.165", "Intersection of I5 and CA165", "36.93022", "-120.84068");
  userWaypoints.update("I5.VOLTA", "I5 & Volta Road", "37.01419", "-120.92878");
  userWaypoints.update("PT.ALPHA", "Intersection of I5 and CA152", "37.05665", "-120.96990");
  userWaypoints.update("Jellysferry", "Jelly's Ferry bridge across Sacramento River", "N40 19.037", "W122 11.359");
  userWaypoints.update("Howie", "RDD Timing Point", "N40 21.893", "W122 13.042");
  userWaypoints.update("Hale", "2014 Leg 1 Timing", "N39 33.621", "W119 14.438");
  userWaypoints.update("Winnie", "2014 Leg 2 Timing", "N40 50.499", "W114 12.595");
  userWaypoints.update("WindRiver", "2014 Leg 3 Timing", "N42 43.733", "W108 38.800");
  userWaypoints.update("Buff", "2014 Leg 4 Timing", "N43 59.455", "W103 16.171");
  userWaypoints.update("Omega", "2014 Leg 5 Timing", "N44 53.388", "W95 38.935");
  userWaypoints.update("Paul", "2014 Leg 6 Timing", "N43 22.027", "W89 37.111");
  userWaypoints.update("MicrowaveSt", "2014 Microwave Station", "N40 24.89", "W117 12.37");
  userWaypoints.update("RanchTower", "2014 Ranch/Tower", "N41 6.16", "W115 5.43");
  userWaypoints.update("FremontIsland", "2014 Fremont Island", "N41 10.49", "W112 20.64");
  userWaypoints.update("Tremonton", "2014 Tremonton", "N41 42.86", "W112 11.05");
  userWaypoints.update("RandomPoint", "2014 Random Point", "N42", "W111 03");
  userWaypoints.update("Farson", "2014 Farson", "N42 6.40", "W109 26.95");
  userWaypoints.update("Midwest", "2014 Midwest", "N43 24.49", "W109 16.68");
  userWaypoints.update("Bill", "2014 Bill", "N43 13.96", "W105 15.60");
  userWaypoints.update("MMNHS", "2014 MMNHS", "N43 52.67", "W101 57.65");
  userWaypoints.update("Tracks", "2014 Tracks", "N44 21", "W100 22");
  userWaypoints.update("Towers", "2014 Towers", "N43 34.25", "W92 25.64");
  userWaypoints.update("IsletonBridge", "Isleton Bridge", "N38 10.32", "W121 35.62");
  userWaypoints.update("Mystery15", "2015 Mystery", "N38 46.22", "W122 34.25");
  userWaypoints.update("Paskenta", "Paskenta Town", "N39 53.13", "W122 32.36");
  userWaypoints.update("Bonanza", "Bonanza Town", "N42 12.15", "W121 24.53");
  userWaypoints.update("Silverlake", "Silverlake", "N43 07.41", "W121 03.74");
  userWaypoints.update("Millican", "Bend Timing Start", "N43 52.75", "W120 55.13");
  userWaypoints.update("Goering", "Bend Timing", "N44 05.751", "W120 56.834");
  userWaypoints.update("Constantia2", "Our Constantia Wpt", "N39 56.068", "W120 0.831");
  userWaypoints.update("Hallelujah2", "Reno Timing", "N39 46.509", "W120 2.336");
  userWaypoints.update("Redding.Pond", "Pond 6nm North of KRDD", "N40 36", "W122 17");
  userWaypoints.update("Thunderhill", "Thunder Hill Race Track", "N39 32.36", "W122 19.83");
  userWaypoints.update("CascadeHighway", "Cascade Wonderland Highway", "N40 46.63", "W122 19.12");
  userWaypoints.update("Eagleville", "Eagleville closed airport", "N41 18.73", "W120 3.00");
  userWaypoints.update("DuckLakePass", "Saddle near Duck Lake", "N41 3.00", "W120 3.00");
}
function createTestRoutes() {
  var flightPlans = [{
    name: "Rally Practice 1",
    route: "C83|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|5500|5:00 CA67 0CN1 28CA 126kts I5.165 PT.ALPHA KLSN|Timing Pattern|0:45 Taxi|2:00"
  }, {
    name: "Rally Practice 2",
    route: "C83|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|5500|5:00 ECA 343@4 5CL3 67CA 314@12 126kts I5.165 126kts PT.ALPHA|Timing  126kts KLSN Pattern|0:45 Taxi|2:00"
  }, {
    name: "Rally Practice 3",
    route: "KTCY|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|3500|5:00 O27 67CA OILCAMP I5.WESTSHIELDS I5.165 I5.VOLTA PT.ALPHA|Timing KLSN Pattern|0:45 Taxi|2:00"
  }, {
    name: "Rally Practice 4",
    route: "C83|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|5500|5:00 62@3 9CL0 342@9 CL84 28CA 315@10 126kts I5.165 126kts PT.ALPHA|Timing  126kts KLSN Pattern|0:45 Taxi|2:00"
  }, {
    name: "Rally Practice 5",
    route: "C83|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|5500|7:00 O27 9CL0 CL01 I5.165 PT.ALPHA KLSN Pattern|0:45 Taxi|2:00"
  }, {
    name: "2014 HWD Rally Leg 1",
    route: "KHWD|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|5500|4:35 VPDUB Climb|8500|6:25 2CL9 Left|+1 09CL Left|+1 O02 Left|+1 77NV Left 126kts HALE|Timing KSPZ Pattern|0:45 Taxi|2:00"
  }, {
    name: "2014 HWD Rally Leg 2",
    route: "KSPZ|Start Taxi|4:00 Runup|0:30 Taxi|1:00 Takeoff Climb|7500|9:00 NV30 Left MicrowaveSt Left DOBYS Left RanchTower Left 126kts Winnie|Timing KENV Pattern|0:45 Taxi|2:00"
  }, {
    name: "2014 HWD Rally Leg 3",
    route: "KENV|Start Taxi|5:00 Runup|0:30 Taxi|1:00 Takeoff Climb|7500|8:30 FremontIsland Left|+1 Tremonton Left|+1 RandomPoint Left|+1 Farson Left 126kts WindRiver|Timing KLND Pattern|0:45 Taxi|2:00"
  }, {
    name: "2014 HWD Rally Leg 4",
    route: "KLND|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|7500|10:00 Midwest Left Bill Right|+1 WY09 Left KCUT Left 126kts BUFF|Timing KRAP Pattern|0:45 Taxi|2:00"
  }, {
    name: "2014 HWD Rally Leg 5",
    route: "KRAP|Start Taxi|5:00 Runup|0:30 Taxi|3:00 Takeoff Climb|7500|9:00 MMNHS Left|+1 Tracks Left|+1 8D7 Left 5H3 Left 126kts Omega KMVE Pattern|0:45 Taxi|2:00"
  }, {
    name: "2014 HWD Rally Leg 6",
    route: "KMVE|Start Taxi|6:00 Runup|0:30 Taxi|2:00 Takeoff Climb|5500|6:00 1D6 Left 68Y Right|+1 Towers Left KCHU Left 126kts Paul|Timing KMSN Pattern|0:45 Taxi|2:00"
  }, {
    name: "2015 HWD Rally Leg 1",
    route: "KHWD|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|5500|4:35 VPDUB Climb|5500|3:25 IsletonBridge Mystery15 Left|+1 71CL Left|+1 Paskenta Left|+1 O37 Left|+1 JELLYSFERRY HOWIE|Timing KRDD Pattern|0:45 Taxi|2:00"
  }, {
    name: "2015 HWD Rally Leg 2",
    route: "KRDD|Start Taxi|6:00 Runup|0:30 Taxi|2:00 Takeoff Climb|8500|1:20 REDDING.POND Climb|8500|7:40 A26 O81 Left 340@6 Bonanza Left|+1 Silverlake Left|+1 Millican 126kts Goering|Timing KBDN pattern|30 taxi|2:00"
  }, {
    name: "2016 HWD Rally Leg 1",
    route: "KHWD|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|5500|4:35 VPDUB Climb|5500|3:25 65CN 3CN7 57CN Left|+1 2CL1 Left|+1 O37 Left|+1 JELLYSFERRY HOWIE|Timing KRDD Pattern|0:45 Taxi|2:00"
  }, {
    name: "2016 HWD Rally Leg 2",
    route: "KRDD|Start Taxi|6:00 Runup|0:30 Taxi|2:00 Takeoff Climb|8500|1:20 REDDING.POND Climb|8500|7:40 O89 KAAT Left 1Q2 KSVE Left H37 Left CONSTANTIA2 HALLELUJAH2|Timing KRTS pattern|30 taxi|2:00"
  }, {
    name: "2017 HWD Rally Leg 1",
    route: "KHWD|Start Taxi|6:00 Runup|0:30 Taxi|1:00 Takeoff Climb|4500|8:00 10@6 9CL9 63CL THUNDERHILL 60@10 90CL 0O4 350@10 126kts JELLYSFERRY 126kts HOWIE|Timing KRDD Pattern|0:45 Taxi|4:00"
  }, {
    name: "2017 HWD Rally Leg 2",
    route: "KRDD|Start Taxi|6:00 Runup|0:30 Taxi|2:00 Takeoff Climb|8500|6:40 CASCADEHIGHWAY Climb|8500|8:20 KLKV 210@2 EAGLEVILLE DUCKLAKEPASS 210@5 O39 209@8 AHC 148@6 126kts CONSTANTIA2 126kts Hallelujah2|Timing KRTS Pattern|0:30 Taxi|2:00"
  }, {
    name: "San Jose to San Diego",
    route: "KSJC LICKE SNS V25 REDIN KMYF"
  }, {
    name: "San Diego to San Jose",
    route: "KMYF JOPDO CARIF V23 LAX V299 VTU V25 PRB SARDO RANCK V485 LICKE KSJC"
  }, {
    name: "San Jose to Renton",
    route: "KSJC SUNOL RBL V23 SEA KRNT"
  }, {
    name: "Renton to Willows",
    route: "KRNT SEA V495 BTG V23 RBL KWLW"
  }, {
    name: "SJC to SEA #1",
    route: "ksjc sunol 135kts 300@12 rdd 0kts pdx ksea"
  }, {
    name: "SJC to SEA #2",
    route: "KSJC SJC V334 SAC V23 BTG V495 SEA KSEA"
  }, {
    name: "SJC to SEA #3",
    route: "KSJC SJC V334 SAC V23 FJS V495 SEA KSEA"
  }, {
    name: "Roseburg to San Jose",
    route: "KRBG RBG KOLER V495 FJS V23 RBL SUNOL KSJC"
  }, {
    name: "SAN to DEN",
    route: "KSAN HAILE V514 LYNSY V8 JNC V134 BINBE KDEN"
  }, {
    name: "Denver to Minneapolis",
    route: "KDEN DVV V8 AKO V80 FSD V148 RWF V412 FCM KMSP"
  }, {
    name: "Reno to Chicago",
    route: "KRNO FMG V6 LLC V32 CEVAR V200 STACO V32 FBR V6 MBW V100 RFD V171 SIMMN V172 DPA KORD"
  }, {
    name: "Denver to Oklahoma City",
    route: "KDEN AVNEW V366 HGO V263 LAA V304 LBL V507 MMB V17 IRW KOKC"
  }, {
    name: "Stockton to Hawthorne 1",
    route: "KSCK MOD V113 PXN V107 AVE V137 GMN V23 LAX KHHR"
  }, {
    name: "Stockton to Hawthorne 2",
    route: "ksck patyy v113 rom v485  exert v25 lax khhr"
  }, {
    name: "Long View to Corpus Christi",
    route: "KGGG PIPES V289 LFK V13 WORRY KCRP"
  }, {
    name: "Austin Exec to Beaumont 1",
    route: "KEDC HOOKK V306 TNV V574 IAH V222 SHINA KBPT"
  }, {
    name: "Austin Exec to Beaumont 2",
    route: "KEDC HOOKK V306 DAS KBPT"
  }, {
    name: "Austin Exec to Beaumont 3",
    route: "KEDC HOOKK V306 TNV DAS KBPT"
  }, {
    name: "Savannah to Daytona Beach",
    route: "KSAV KELER V437 COKES KDAB"
  }, {
    name: "Philly to Hartford 1",
    route: "KPNE ARD V276 DIXIE V16 JFK V229 SNIVL KHFD"
  }, {
    name: "Philly to Hartford 2",
    route: "KPNE ARD V276 MANTA V139 RICED MAD KHFD"
  }, {
    name: "Philly to Hartford 3",
    route: "KPNE DITCH V312 DRIFT V139 SARDI V308 ORW KHFD"
  }, {
    name: "Philly to Hartford 4",
    route: "KPNE ZIDET V479 ARD V433 LGA V99 YALER KHFD"
  }, {
    name: "West Georgie Regional to Frankfort, KY 1",
    route: "kctj noone nello v5 gqo kfft"
  }, {
    name: "West Georgie Regional to Frankfort, KY 2",
    route: "kctj felto v243 gqo v333 hyk v512 clegg kfft"
  }, {
    name: "West Georgie Regional to Frankfort, KY 3",
    route: "kctj rmg v333 hyk v512 clegg kfft"
  }, {
    name: "West Georgie Regional to Frankfort, KY 4",
    route: "kctj rmg v333 hch v51 lvt v493 hyk kfft"
  }, {
    name: "Raleigh / Durham to Baltimore Martin State 1",
    route: "KRDU aimhi  KMTN"
  }, {
    name: "Raleigh / Durham to Baltimore Martin State 2",
    route: "KRDU rdu v155 lvl ric ott KMTN"
  }, {
    name: "Raleigh / Durham to Baltimore Martin State 3",
    route: "KRDU rdu v155 mange v157 colin v33 ott v433 paleo KMTN"
  }, {
    name: "Raleigh / Durham to Baltimore Martin State 4",
    route: "KRDU rdu v155 LVL V157 RIC V16 PXT V93 GRACO KMTN"
  }, {
    name: "Roswell, NM to Longview, TX",
    route: "KROW Climb|9500|6:00 070@14 HOB V68 PIZON 050@16 V16 ABI V62 JEN V94 OTTIF KGGG"
  }, {
    name: "Lubbock to Longview 1",
    route: "KLBB JEN CQY KGGG"
  }, {
    name: "Lubbock to Longview 2",
    route: "KLBB ralls v102 gth v278 byp v114 awlar KGGG"
  }, {
    name: "Lubbock to Longview 3",
    route: "KLBB hydro v62 jen v94 ottif KGGG"
  }, {
    name: "Stockton, CA to North Las Vegas 1",
    route: "KSCK ECA V244 OAL V105 LUCKY KVGT"
  }, {
    name: "Stockton, CA to North Las Vegas 2",
    route: "KSCK ehf v197 pmd v12 basal v394 oasys KVGT"
  }, {
    name: "Bakersfield to Santa Rosa 1",
    route: "KBFL EHF V248 AVE OAK SAU KSTS"
  }, {
    name: "Bakersfield to Santa Rosa 2",
    route: "KBFL EHF V248 AVE PXN V301 SUNOL KSTS"
  }, {
    name: "Bakersfield to Santa Rosa 3",
    route: "KBFL SCRAP V248 AVE V107 OAK V195 CROIT V108 STS KSTS"
  }, {
    name: "Bakersfield to Santa Rosa 4",
    route: "KBFL EHF V23 SAC V494 SNUPY KSTS"
  }, {
    name: "Bakersfield to Santa Rosa 5",
    route: "KBFL EHF V248 AVE V137 SNS V230 SHOEY V27 PYE KSTS"
  }, {
    name: "Bakersfield to Santa Rosa 6",
    route: "KBFL EHF V23 CZQ MOD OAKEY KSTS"
  }, {
    name: "Bakersfield to Santa Rosa 7",
    route: "KBFL EHF V23 LIN CCR CROIT SGD KSTS"
  }, {
    name: "Bakersfield to Santa Rosa 8",
    route: "KBFL EHF V248 AVE V107 PXN SGD KSTS"
  }, {
    name: "Great Falls to Boeing King Field 1",
    route: "KGTF GTF V120 MLP V2 GEG V120 NORMY KBFI"
  }, {
    name: "Great Falls to Boeing King Field 2",
    route: "KGTF GTF V120 MLP J70 SEA KBFI"
  }, {
    name: "Great Falls to Boeing King Field 3",
    route: "KGTF GTF V187 ELN V2 SEA KBFI"
  }, {
    name: "Great Falls to Boeing King Field 4",
    route: "KGTF KEETA Q144 ZIRAN KBFI"
  }, {
    name: "Boise to Centenial 1",
    route: "KBOI BOI V4 LAR RAMMS NIWOT KAPA"
  }, {
    name: "Boise to Centenial 2",
    route: "KBOI ROARR PIH J20 OCS J154 AVVVS KAPA"
  }, {
    name: "Boise to Centenial 3",
    route: "KBOI CANEK V4 OCS V328 DOBEE V356 ELORE KAPA"
  }, {
    name: "Boise to Centenial 4",
    route: "KBOI BOI J54 PIH J20 OCS J52 FQF KAPA"
  }, {
    name: "St. Louis to Birmingham 1",
    route: "KSTL SPUDZ V125 DUEAS V540 CNG V67 SYI V321 BOAZE V115 COLIG KBHM"
  }, {
    name: "St. Louis to Birmingham 2",
    route: "KSTL ODUJY FAM CGI JKS MSL VUZ KBHM"
  }, {
    name: "Chattanoga to Augusta 1",
    route: "KCHA ODF AHN V417 MSTRS KAGS"
  }, {
    name: "Chattanoga to Augusta 2",
    route: "KCHA GQO NELLO CCATT T292 JACET KAGS"
  }, {
    name: "Chattanoga to Augusta 3",
    route: "KCHA GQO ATL ANNAN KAGS"
  }, {
    name: "Chattanoga to Augusta 4",
    route: "KCHA HOCHE V5 AHN V417 IRQ KAGS"
  }, {
    name: "Concord, NC to Richmond, VA 1",
    route: "KJQF SBV V20 RIC KRIC"
  }, {
    name: "Concord, NC to Richmond, VA 2",
    route: "KJQF GIZMO V143 GSO V266 SBV V20 RIC KRIC"
  }, {
    name: "Concord, NC to Richmond, VA 3",
    route: "KJQF GSO SBV V20 RIC KRIC"
  }, {
    name: "Concord, NC to Richmond, VA 4",
    route: "KJQF GIZMO V454 LVL V157 RIC KRIC"
  }, {
    name: "Buffalo, NY to Portland, ME 1",
    route: "KBUF BUF V2 UCA V496 NEETS V39 LIMER KPWM"
  }, {
    name: "Buffalo, NY to Portland, ME 2",
    route: "KBUF HANKK AUDIL PUPPY GFL KPWM"
  }, {
    name: "Buffalo, NY to Portland, ME 3",
    route: "KBUF BUF V14 GGT V428 UCA V496 ENE KPWM"
  }, {
    name: "Buffalo, NY to Portland, ME 4",
    route: "KBUF JOSSY Q935 PONCT ARIME CDOGG ENE KPWM"
  }, {
    name: "Moline, IL to Battle Creek, MI 1",
    route: "KMLI GENSO V8 NOMES V156 AZO KBTL"
  }, {
    name: "Moline, IL to Battle Creek, MI 2",
    route: "KMLI OBK J547 PMM KBTL"
  }, {
    name: "Moline, IL to Battle Creek, MI 3",
    route: "KMLI PLL OBK ELX KBTL"
  }, {
    name: "Moline, IL to Battle Creek, MI 4",
    route: "KMLI PLL RFD V100 ELX AZO KBTL"
  }, {
    name: "Green Bay, WI to Indianapolis, IN 1",
    route: "KGRB OKK V305 WELDO KIND"
  }, {
    name: "Green Bay, WI to Indianapolis, IN 2",
    route: "KGRB GRB J101 BAE J89 OBK EON V24 VHP KIND"
  }, {
    name: "Green Bay, WI to Indianapolis, IN 3",
    route: "KGRB WAFLE V7 BVT V399 ADVAY KIND"
  }, {
    name: "Green Bay, WI to Indianapolis, IN 4",
    route: "KGRB WAFLE V7 BVT VHP KIND"
  }, {
    name: "Anoka County, MN to Springfield, IL 1",
    route: "KANE KANAC V97 ODI V129 GROWL KSPI"
  }, {
    name: "Anoka County, MN to Springfield, IL 2",
    route: "KANE GEP PRIOR FGT V411 RST V67 ULAXY KSPI"
  }, {
    name: "Anoka County, MN to Springfield, IL 3",
    route: "KANE GEP PRIOR FGT V411 RST V503 CID V67 ULAXY KSPI"
  }, {
    name: "Anoka County, MN to Springfield, IL 4",
    route: "KANE WAGNR V510 ODI V129 SPI KSPI"
  }, {
    name: "Little Rock to Souix City 1",
    route: "KLIT MCI J41 OVR KSUX"
  }, {
    name: "Little Rock to Souix City 2",
    route: "KLIT ROLAN V534 HAAWK V71 SGF V159 SUX KSUX"
  }, {
    name: "Little Rock to Souix City 3 ",
    route: "KLIT ROLAN V534 SCRAN V527 RZC V13 BUM V71 PANNY KSUX"
  }, {
    name: "Little Rock to Souix City 4",
    route: "KLIT ROLAN V534 SCRAN V527 RZC V13 EOS V307 CNU V131 TOP PWE SUX KSUX"
  }];
  setupUserWaypoints();
  print("let expectedFlightPlans = [");
  for (var i = 0; i < flightPlans.length; ++i) {
    var flightPlanName = flightPlans[i].name;
    var flightPlanRoute = flightPlans[i].route;
    var flightPlan = new FlightPlan(flightPlanName, flightPlanRoute);
    flightPlan.parseRoute();
    flightPlan.calculate();
    var totalTime = flightPlan.totalTime();
    var gateTime = flightPlan.gateTime();
    var expectedGateTimeString = void 0;
    if (Math.abs(Time.differenceBetween(totalTime, gateTime).seconds()) == 0) expectedGateTimeString = "undefined";else expectedGateTimeString = "new Time(\"" + gateTime + "\")";
    print("    new ExpectedFlightPlan(\"" + flightPlanName + "\", \"" + flightPlanRoute + "\", \"" + flightPlan.resolvedRoute() + "\", new Time(\"" + totalTime + "\"), " + expectedGateTimeString + "),");
  }
  print("];");
  print("# Created " + flightPlans.length + " flight plans");
}

// createTestRoutes();

