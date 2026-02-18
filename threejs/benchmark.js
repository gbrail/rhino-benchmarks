function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * Copyright (C) 2025 Mozilla. All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var NUM_PARTICLES = 8000;
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
var innerHeight = 1080;
var innerWidth = 1920;
camera.position.z = 500;
var canvas = {
  addEventListener() {},
  style: {},
  getContext(kind) {
    return {
      getExtension(extension) {
        if (extension == 'EXT_blend_minmax') {
          return {
            MIN_EXT: 32775,
            MAX_EXT: 32776
          };
        }
        if (extension == 'OES_vertex_array_object') {
          return {
            createVertexArrayOES() {
              return 1;
            },
            bindVertexArrayOES() {},
            deleteVertexArrayOES() {}
          };
        }
      },
      createTexture() {},
      bindTexture() {},
      texImage2D() {},
      texImage3D() {},
      texParameteri() {},
      uniform1i() {},
      uniform1f() {},
      uniform2f() {},
      uniform3f() {},
      uniform4f() {},
      clearColor() {},
      clear() {},
      clearDepth() {},
      clearStencil() {},
      enable() {},
      disable() {},
      depthFunc() {},
      depthMask() {},
      frontFace() {},
      cullFace() {},
      getContextAttributes() {},
      createBuffer() {},
      createFramebuffer() {},
      bindBuffer() {},
      bufferData() {},
      createProgram() {},
      attachShader() {},
      linkProgram() {},
      useProgram() {},
      getAttribLocation() {},
      getUniformLocation() {},
      createShader() {},
      shaderSource() {},
      compileShader() {},
      getShaderParameter() {},
      getProgramInfoLog() {
        return "";
      },
      getShaderInfoLog() {
        return "";
      },
      getProgramParameter() {},
      deleteShader() {},
      colorMask() {},
      stencilMask() {},
      createVertexArray() {},
      bindVertexArray() {},
      drawElements() {},
      lineWidth() {},
      drawArrays() {},
      viewport() {},
      getParameter(param) {
        if (param == 34930) {
          return 16;
        }
        if (param == 35660) {
          return 16;
        }
        if (param == 3379) {
          return 8192;
        }
        if (param == 36347) {
          return 1024;
        }
        if (param == 36348) {
          return 32;
        }
        if (param == 36349) {
          return 1024;
        }
        if (param == 35661) {
          return 80;
        }
        if (param == 7938) {
          return "WebGL 2.0";
        }
        if (param == 3088) {
          return [0, 0, 1024, 480];
        }
        if (param == 2978) {
          return [0, 0, 1024, 480];
        }
      },
      MAX_TEXTURE_IMAGE_UNITS: 34930,
      MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
      MAX_TEXTURE_SIZE: 3379,
      MAX_VERTEX_UNIFORM_VECTORS: 36347,
      MAX_VARYING_VECTORS: 36348,
      MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
      MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
      VERSION: 7938,
      SCISSOR_BOX: 3088,
      VIEWPORT: 2978
    };
  }
};
var renderer = new THREE.WebGLRenderer({
  antialias: false,
  canvas,
  powerPreference: 'low-power',
  precision: 'lowp'
});
renderer.setSize(innerWidth, innerHeight);
var createGeometryParticle = size => {
  var visibleHeight = 2 * Math.tan(75 * Math.PI / 360) * 500;
  var radius = size / innerHeight * visibleHeight / 2;

  // Main circle
  var geometry = new THREE.CircleGeometry(radius, 32);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    depthTest: false
  });
  var circle = new THREE.Mesh(geometry, material);
  var posArray = geometry.attributes.position.array;
  var outlineVertices = [];
  for (var i = 3; i < posArray.length; i += 3) {
    outlineVertices.push(new THREE.Vector3(posArray[i], posArray[i + 1], posArray[i + 2]));
  }
  var outlineGeometry = new THREE.BufferGeometry().setFromPoints(outlineVertices);
  var outline = new THREE.LineLoop(outlineGeometry, new THREE.LineBasicMaterial({
    color: 0x000000,
    depthTest: false
  }));
  var group = new THREE.Group();
  group.add(circle);
  group.add(outline);
  return group;
};

// Initialize particles
var initialized = false;
var particles = [];
function initialize() {
  for (var i = 0; i < NUM_PARTICLES; i++) {
    var size = 10 + Math.random() * 80;
    var particle = createGeometryParticle(size);

    // Random initial position
    var _visibleWidth = 2 * Math.tan(75 * Math.PI / 360) * 500 * camera.aspect;
    particle.position.set(THREE.MathUtils.randFloatSpread(_visibleWidth), THREE.MathUtils.randFloatSpread(_visibleWidth / camera.aspect), 0);

    // Velocity storage
    particle.velocity = new THREE.Vector2((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    scene.add(particle);
    particles.push(particle);
  }
  initialized = true;
}

// Metrics and animation
var visibleWidth = 2 * Math.tan(75 * Math.PI / 360) * 500 * camera.aspect;
var visibleHeight = visibleWidth / camera.aspect;
function animate() {
  particles.forEach(particle => {
    particle.position.x += particle.velocity.x;
    particle.position.y += particle.velocity.y;

    // Boundary checks
    if (Math.abs(particle.position.x) > visibleWidth / 2) particle.velocity.x *= -1;
    if (Math.abs(particle.position.y) > visibleHeight / 2) particle.velocity.y *= -1;
  });
  renderer.render(scene, camera);
}
var Benchmark = /*#__PURE__*/function () {
  function Benchmark() {
    _classCallCheck(this, Benchmark);
  }
  return _createClass(Benchmark, [{
    key: "runIteration",
    value: function runIteration() {
      if (!initialized) {
        initialize();
      }
      animate();
    }
  }]);
}();

