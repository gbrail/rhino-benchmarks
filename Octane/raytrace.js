function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// The ray tracer code in this file is written by Adam Burmister.
// It is available in its original form from:
//
//   http://labs.flog.nz.co/raytracer/
//
// It has been modified slightly by Google to work as a standalone benchmark,
// but all the computational code remains untouched.
// For JetStream3, this code was rewritten using ES6 classes,
// dropping namespaces and Prototype.js class system, as well as slightly refactored.
// All the computational code still remains untouched.
var Color = /*#__PURE__*/function () {
  function Color(red, green, blue) {
    _classCallCheck(this, Color);
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
  return _createClass(Color, [{
    key: "limit",
    value: function limit() {
      this.red = this.red > 0 ? this.red > 1 ? 1 : this.red : 0;
      this.green = this.green > 0 ? this.green > 1 ? 1 : this.green : 0;
      this.blue = this.blue > 0 ? this.blue > 1 ? 1 : this.blue : 0;
      return this;
    }
  }, {
    key: "brightness",
    value: function brightness() {
      var r = Math.floor(this.red * 255);
      var g = Math.floor(this.green * 255);
      var b = Math.floor(this.blue * 255);
      return r * 77 + g * 150 + b * 29 >> 8;
    }
  }, {
    key: "toString",
    value: function toString() {
      var r = Math.floor(this.red * 255);
      var g = Math.floor(this.green * 255);
      var b = Math.floor(this.blue * 255);
      return `rgb(${r},${g},${b})`;
    }
  }], [{
    key: "add",
    value: function add(c1, c2) {
      return new Color(c1.red + c2.red, c1.green + c2.green, c1.blue + c2.blue);
    }
  }, {
    key: "addScalar",
    value: function addScalar(c1, s) {
      return new Color(c1.red + s, c1.green + s, c1.blue + s).limit();
    }
  }, {
    key: "multiply",
    value: function multiply(c1, c2) {
      return new Color(c1.red * c2.red, c1.green * c2.green, c1.blue * c2.blue);
    }
  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(c1, f) {
      return new Color(c1.red * f, c1.green * f, c1.blue * f);
    }
  }, {
    key: "blend",
    value: function blend(c1, c2, w) {
      return Color.add(Color.multiplyScalar(c1, 1 - w), Color.multiplyScalar(c2, w));
    }
  }]);
}();
var Light = /*#__PURE__*/function () {
  function Light(position, color) {
    _classCallCheck(this, Light);
    this.position = position;
    this.color = color;
  }
  return _createClass(Light, [{
    key: "toString",
    value: function toString() {
      return `Light [${this.position}]`;
    }
  }]);
}();
var Vector = /*#__PURE__*/function () {
  function Vector(x, y, z) {
    _classCallCheck(this, Vector);
    this.x = x;
    this.y = y;
    this.z = z;
  }
  return _createClass(Vector, [{
    key: "normalize",
    value: function normalize() {
      var m = this.magnitude();
      return new Vector(this.x / m, this.y / m, this.z / m);
    }
  }, {
    key: "negateY",
    value: function negateY() {
      this.y *= -1;
    }
  }, {
    key: "magnitude",
    value: function magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
  }, {
    key: "cross",
    value: function cross(w) {
      return new Vector(-this.z * w.y + this.y * w.z, this.z * w.x - this.x * w.z, -this.y * w.x + this.x * w.y);
    }
  }, {
    key: "dot",
    value: function dot(w) {
      return this.x * w.x + this.y * w.y + this.z * w.z;
    }
  }, {
    key: "toString",
    value: function toString() {
      return `Vector [${this.x},${this.y},${this.z}]`;
    }
  }], [{
    key: "add",
    value: function add(v, w) {
      return new Vector(w.x + v.x, w.y + v.y, w.z + v.z);
    }
  }, {
    key: "subtract",
    value: function subtract(v, w) {
      return new Vector(v.x - w.x, v.y - w.y, v.z - w.z);
    }
  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(v, w) {
      return new Vector(v.x * w, v.y * w, v.z * w);
    }
  }]);
}();
var Ray = /*#__PURE__*/function () {
  function Ray(position, direction) {
    _classCallCheck(this, Ray);
    this.position = position;
    this.direction = direction;
  }
  return _createClass(Ray, [{
    key: "toString",
    value: function toString() {
      return `Ray [${this.position},${this.direction}]`;
    }
  }]);
}();
var Scene = /*#__PURE__*/_createClass(function Scene(camera, background, shapes, lights) {
  _classCallCheck(this, Scene);
  this.camera = camera;
  this.background = background;
  this.shapes = shapes;
  this.lights = lights;
});
var Material = /*#__PURE__*/function () {
  function Material(reflection, transparency, gloss, hasTexture) {
    _classCallCheck(this, Material);
    this.reflection = reflection;
    this.transparency = transparency;
    this.gloss = gloss;
    this.hasTexture = hasTexture;
  }
  return _createClass(Material, [{
    key: "getColor",
    value: function getColor() {
      throw new Error("getColor() isn't implemented");
    }
  }, {
    key: "toString",
    value: function toString() {
      return `Material [gloss=${this.gloss}, transparency=${this.transparency}, hasTexture=${this.hasTexture}]`;
    }
  }]);
}();
var SolidMaterial = /*#__PURE__*/function (_Material) {
  function SolidMaterial(color, reflection, transparency, gloss) {
    var _this;
    _classCallCheck(this, SolidMaterial);
    _this = _callSuper(this, SolidMaterial, [reflection, transparency, gloss, true]);
    _defineProperty(_this, "color", SolidMaterial.defaultColor);
    _this.color = color;
    return _this;
  }
  _inherits(SolidMaterial, _Material);
  return _createClass(SolidMaterial, [{
    key: "getColor",
    value: function getColor() {
      return this.color;
    }
  }, {
    key: "toString",
    value: function toString() {
      return `SolidMaterial [gloss=${this.gloss}, transparency=${this.transparency}, hasTexture=${this.hasTexture}]`;
    }
  }]);
}(Material);
_defineProperty(SolidMaterial, "defaultColor", new Color(0, 0, 0));
var ChessboardMaterial = /*#__PURE__*/function (_Material2) {
  function ChessboardMaterial(colorEven, colorOdd, reflection, transparency, gloss, density) {
    var _this2;
    _classCallCheck(this, ChessboardMaterial);
    _this2 = _callSuper(this, ChessboardMaterial, [reflection, transparency, gloss, true]);
    _this2.colorEven = colorEven;
    _this2.colorOdd = colorOdd;
    _this2.density = density;
    return _this2;
  }
  _inherits(ChessboardMaterial, _Material2);
  return _createClass(ChessboardMaterial, [{
    key: "wrapUp",
    value: function wrapUp(t) {
      t %= 2;
      if (t < -1) t += 2;
      if (t >= 1) t -= 2;
      return t;
    }
  }, {
    key: "getColor",
    value: function getColor(u, v) {
      var t = this.wrapUp(u * this.density) * this.wrapUp(v * this.density);
      return t < 0 ? this.colorEven : this.colorOdd;
    }
  }, {
    key: "toString",
    value: function toString() {
      return `ChessMaterial [gloss=${this.gloss}, transparency=${this.transparency}, hasTexture=${this.hasTexture}]`;
    }
  }]);
}(Material);
var Shape = /*#__PURE__*/function () {
  function Shape(position, material) {
    _classCallCheck(this, Shape);
    this.position = position;
    this.material = material;
  }
  return _createClass(Shape, [{
    key: "intersect",
    value: function intersect(ray) {
      throw new Error("intersect() isn't implemented");
    }
  }]);
}();
var Sphere = /*#__PURE__*/function (_Shape) {
  function Sphere(position, material, radius) {
    var _this3;
    _classCallCheck(this, Sphere);
    _this3 = _callSuper(this, Sphere, [position, material]);
    _this3.radius = radius;
    return _this3;
  }
  _inherits(Sphere, _Shape);
  return _createClass(Sphere, [{
    key: "intersect",
    value: function intersect(ray) {
      var info = new IntersectionInfo();
      info.shape = this;
      var dst = Vector.subtract(ray.position, this.position);
      var B = dst.dot(ray.direction);
      var C = dst.dot(dst) - this.radius * this.radius;
      var D = B * B - C;
      if (D > 0) {
        // intersection!
        info.isHit = true;
        info.distance = -B - Math.sqrt(D);
        info.position = Vector.add(ray.position, Vector.multiplyScalar(ray.direction, info.distance));
        info.normal = Vector.subtract(info.position, this.position).normalize();
        info.color = this.material.getColor(0, 0);
      } else {
        info.isHit = false;
      }
      return info;
    }
  }, {
    key: "toString",
    value: function toString() {
      return `Sphere [position=${this.position}, radius=${this.radius}]`;
    }
  }]);
}(Shape);
var Plane = /*#__PURE__*/function (_Shape2) {
  function Plane(position, material, d) {
    var _this4;
    _classCallCheck(this, Plane);
    _this4 = _callSuper(this, Plane, [position, material]);
    _this4.d = d;
    return _this4;
  }
  _inherits(Plane, _Shape2);
  return _createClass(Plane, [{
    key: "intersect",
    value: function intersect(ray) {
      var info = new IntersectionInfo();
      info.shape = this;
      var Vd = this.position.dot(ray.direction);
      if (Vd === 0) return info; // no intersection

      var t = -(this.position.dot(ray.position) + this.d) / Vd;
      if (t <= 0) return info;
      info.isHit = true;
      info.position = Vector.add(ray.position, Vector.multiplyScalar(ray.direction, t));
      info.normal = this.position;
      info.distance = t;
      if (this.material.hasTexture) {
        var vU = new Vector(this.position.y, this.position.z, -this.position.x);
        var vV = vU.cross(this.position);
        var u = info.position.dot(vU);
        var v = info.position.dot(vV);
        info.color = this.material.getColor(u, v);
      } else {
        info.color = this.material.getColor(0, 0);
      }
      return info;
    }
  }, {
    key: "toString",
    value: function toString() {
      return `Plane [${this.position}, d=${this.d}]`;
    }
  }]);
}(Shape);
var IntersectionInfo = /*#__PURE__*/function () {
  function IntersectionInfo() {
    _classCallCheck(this, IntersectionInfo);
    this.isHit = false;
    this.hitCount = 0;
    this.shape = null;
    this.position = null;
    this.normal = null;
    this.color = IntersectionInfo.defaultColor;
    this.distance = null;
  }
  return _createClass(IntersectionInfo, [{
    key: "toString",
    value: function toString() {
      return `Intersection [${this.position}]`;
    }
  }]);
}();
IntersectionInfo.defaultColor = new Color(0, 0, 0);
var Camera = /*#__PURE__*/function () {
  function Camera(position, lookAt, up) {
    _classCallCheck(this, Camera);
    this.position = position;
    this.lookAt = lookAt;
    this.up = up;
    this.equator = this.lookAt.normalize().cross(this.up);
    this.screen = Vector.add(this.position, this.lookAt);
  }
  return _createClass(Camera, [{
    key: "getRay",
    value: function getRay(vx, vy) {
      var pos = Vector.subtract(this.screen, Vector.subtract(Vector.multiplyScalar(this.equator, vx), Vector.multiplyScalar(this.up, vy)));
      pos.negateY();
      var dir = Vector.subtract(pos, this.position);
      return new Ray(pos, dir.normalize());
    }
  }, {
    key: "toString",
    value: function toString() {
      return `Camera [${this.position}]`;
    }
  }]);
}();
var Background = /*#__PURE__*/function () {
  function Background(color, ambience) {
    _classCallCheck(this, Background);
    this.color = color;
    this.ambience = ambience;
  }
  return _createClass(Background, [{
    key: "toString",
    value: function toString() {
      return `Background [${this.color}]`;
    }
  }]);
}();
var Engine = /*#__PURE__*/function () {
  function Engine(options) {
    _classCallCheck(this, Engine);
    // Variable used to hold a number that can be used to verify that
    // the scene was ray traced correctly.
    this.checkNumber = 0;
    this.options = _objectSpread({
      canvasHeight: 100,
      canvasWidth: 100,
      pixelWidth: 2,
      pixelHeight: 2,
      renderDiffuse: false,
      renderShadows: false,
      renderHighlights: false,
      renderReflections: false,
      rayDepth: 2
    }, options);
    this.options.canvasHeight /= this.options.pixelHeight;
    this.options.canvasWidth /= this.options.pixelWidth;
  }
  return _createClass(Engine, [{
    key: "renderScene",
    value: function renderScene(scene) {
      for (var x = 0; x < this.options.canvasWidth; x++) {
        for (var y = 0; y < this.options.canvasHeight; y++) {
          var xp = x * 1 / this.options.canvasWidth * 2 - 1;
          var yp = y * 1 / this.options.canvasHeight * 2 - 1;
          var ray = scene.camera.getRay(xp, yp);
          var color = this.getPixelColor(ray, scene);
          this.setPixel(x, y, color);
        }
      }
      if (this.checkNumber !== 2321) throw new Error("Scene rendered incorrectly");
    }
  }, {
    key: "getPixelColor",
    value: function getPixelColor(ray, scene) {
      var info = this.testIntersection(ray, scene, null);
      if (info.isHit) return this.rayTrace(info, ray, scene, 0);
      return scene.background.color;
    }
  }, {
    key: "setPixel",
    value: function setPixel(x, y, color) {
      if (x === y) this.checkNumber += color.brightness();
    }
  }, {
    key: "testIntersection",
    value: function testIntersection(ray, scene, exclude) {
      var hitCount = 0;
      var best = new IntersectionInfo();
      best.distance = 2000;
      for (var i = 0; i < scene.shapes.length; i++) {
        var shape = scene.shapes[i];
        if (shape !== exclude) {
          var info = shape.intersect(ray);
          if (info.isHit && info.distance >= 0 && info.distance < best.distance) {
            best = info;
            hitCount++;
          }
        }
      }
      best.hitCount = hitCount;
      return best;
    }
  }, {
    key: "getReflectionRay",
    value: function getReflectionRay(P, N, V) {
      var c1 = -N.dot(V);
      var R1 = Vector.add(Vector.multiplyScalar(N, 2 * c1), V);
      return new Ray(P, R1);
    }
  }, {
    key: "rayTrace",
    value: function rayTrace(info, ray, scene, depth) {
      // Calc ambient
      var color = Color.multiplyScalar(info.color, scene.background.ambience);
      var shininess = 10 ** (info.shape.material.gloss + 1);
      for (var i = 0; i < scene.lights.length; i++) {
        var light = scene.lights[i];

        // Calc diffuse lighting
        var v = Vector.subtract(light.position, info.position).normalize();
        if (this.options.renderDiffuse) {
          var L = v.dot(info.normal);
          if (L > 0) {
            color = Color.add(color, Color.multiply(info.color, Color.multiplyScalar(light.color, L)));
          }
        }

        // The greater the depth the more accurate the colours, but
        // this is exponentially (!) expensive
        if (depth <= this.options.rayDepth) {
          // calculate reflection ray
          if (this.options.renderReflections && info.shape.material.reflection > 0) {
            var reflectionRay = this.getReflectionRay(info.position, info.normal, ray.direction);
            var refl = this.testIntersection(reflectionRay, scene, info.shape);
            if (refl.isHit && refl.distance > 0) {
              refl.color = this.rayTrace(refl, reflectionRay, scene, depth + 1);
            } else {
              refl.color = scene.background.color;
            }
            color = Color.blend(color, refl.color, info.shape.material.reflection);
          }
        }

        // Render shadows and highlights
        var shadowInfo = new IntersectionInfo();
        if (this.options.renderShadows) {
          var shadowRay = new Ray(info.position, v);
          shadowInfo = this.testIntersection(shadowRay, scene, info.shape);
          if (shadowInfo.isHit && shadowInfo.shape !== info.shape) {
            var vA = Color.multiplyScalar(color, 0.5);
            var dB = 0.5 * shadowInfo.shape.material.transparency ** 0.5;
            color = Color.addScalar(vA, dB);
          }
        }

        // Phong specular highlights
        if (this.options.renderHighlights && !shadowInfo.isHit && info.shape.material.gloss > 0) {
          var Lv = Vector.subtract(info.shape.position, light.position).normalize();
          var E = Vector.subtract(scene.camera.position, info.shape.position).normalize();
          var H = Vector.subtract(E, Lv).normalize();
          var glossWeight = Math.max(info.normal.dot(H), 0) ** shininess;
          color = Color.add(Color.multiplyScalar(light.color, glossWeight), color);
        }
      }
      return color.limit();
    }
  }]);
}();
function renderScene() {
  var camera = new Camera(new Vector(0, 0, -15), new Vector(-0.2, 0, 5), new Vector(0, 1, 0));
  var background = new Background(new Color(0.5, 0.5, 0.5), 0.4);
  var shapes = [new Sphere(new Vector(-1.5, 1.5, 2), new SolidMaterial(new Color(0, 0.5, 0.5), 0.3, 0, 2), 1.5), new Sphere(new Vector(1, 0.25, 1), new SolidMaterial(new Color(0.9, 0.9, 0.9), 0.1, 0, 1.5), 0.5), new Plane(new Vector(0.1, 0.9, -0.5).normalize(), new ChessboardMaterial(new Color(1, 1, 1), new Color(0, 0, 0), 0.2, 0, 1, 0.7), 1.2)];
  var lights = [new Light(new Vector(5, 10, -1), new Color(0.8, 0.8, 0.8)), new Light(new Vector(-3, 5, -15), new Color(0.8, 0.8, 0.8))];
  var scene = new Scene(camera, background, shapes, lights);
  var raytracer = new Engine({
    canvasWidth: 100,
    canvasHeight: 100,
    pixelWidth: 5,
    pixelHeight: 5,
    renderDiffuse: true,
    renderHighlights: true,
    renderShadows: true,
    renderReflections: true,
    rayDepth: 2
  });
  raytracer.renderScene(scene);
}
var Benchmark = /*#__PURE__*/function () {
  function Benchmark() {
    _classCallCheck(this, Benchmark);
  }
  return _createClass(Benchmark, [{
    key: "runIteration",
    value: function runIteration() {
      for (var i = 0; i < 15; ++i) renderScene();
    }
  }]);
}();

