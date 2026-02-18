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
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function () { return !!t; })(); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function generateSPIRV(spirv, program) {
  function findEntryPoints() {
    var entryPoints = [];
    for (var functionNames of program.functions.values()) {
      for (var func of functionNames) {
        switch (func.shaderType) {
          case "vertex":
          case "fragment":
            entryPoints.push(func);
            break;
        }
      }
    }
    return entryPoints;
  }
  var currentId = 3;
  var currentLocation = 0;
  var typeMap = new Map();
  var reverseTypeMap = new Map();
  var entryPoints = [];
  typeMap.set(program.intrinsics.void, currentId++);
  typeMap.set(program.intrinsics.uint32, currentId++);
  for (var entryPoint of findEntryPoints()) {
    var inlinedShader = program.funcInstantiator.getUnique(entryPoint, []);
    _inlineFunction(program, inlinedShader, new VisitingSet(entryPoint));
    var typeAnalyzer = new SPIRVTypeAnalyzer(program, typeMap, currentId);
    inlinedShader.visit(typeAnalyzer);
    currentId = typeAnalyzer.currentId;
    currentLocation = 0;
    var valueAnalyzer = new SPIRVPrimitiveVariableAnalyzer(program, typeMap, currentId, currentLocation);
    inlinedShader.returnType.visit(valueAnalyzer);
    currentId = valueAnalyzer.currentId;
    var outputValues = valueAnalyzer.result;
    var inputValues = [];
    for (var parameter of inlinedShader.parameters) {
      if (parameter.type.type instanceof StructType) {
        var _valueAnalyzer = new SPIRVPrimitiveVariableAnalyzer(program, typeMap, currentId, currentLocation, parameter.name);
        parameter.visit(_valueAnalyzer);
        currentId = _valueAnalyzer.currentId;
        currentLocation = _valueAnalyzer.currentLocation;
        for (var inputValue of _valueAnalyzer.result) inputValues.push(inputValue);
      } else if (parameter.type.type instanceof ArrayRefType) {
        // FIXME: Implement this.
      }
    }
    entryPoints.push({
      id: currentId++,
      shader: inlinedShader,
      inputs: inputValues,
      outputs: outputValues
    });
  }
  for (var type of typeMap) {
    if (typeof type[1] == "object") reverseTypeMap.set(type[1].id, type[0]);else reverseTypeMap.set(type[1], type[0]);
  }
  function emitTypes(assembler) {
    var emittedTypes = new Set();
    function doEmitTypes(type) {
      if (emittedTypes.has(type[0])) return;
      emittedTypes.add(type[0]);
      if (typeof type[1] == "object") {
        if (type[1].fieldTypes) {
          for (var fieldType of type[1].fieldTypes) {
            var key = reverseTypeMap.get(fieldType);
            var value = typeMap.get(key);
            doEmitTypes([key, value]);
          }
          switch (type[0]) {
            case "struct vec2<> { int32 x; int32 y }":
            case "struct vec2<> { uint32 x; uint32 y; }":
            case "struct vec2<> { float32 x; float32 y; }":
            case "struct vec2<> { float64 x; float64 y; }":
            case "struct vec3<> { int32 x; int32 y; int32 z; }":
            case "struct vec3<> { uint32 x; uint32 y; uint32 z; }":
            case "struct vec3<> { float32 x; float32 y; float32 z; }":
            case "struct vec3<> { float64 x; float64 y; float64 z; }":
            case "struct vec4<> { int32 x; int32 y; int32 z; int32 w; }":
            case "struct vec4<> { uint32 x; uint32 y; uint32 z; uint32 w; }":
            case "struct vec4<> { float32 x; float32 y; float32 z; float32 w; }":
            case "struct vec4<> { float64 x; float64 y; float64 z; float64 w; }":
              assembler.append(new spirv.ops.TypeVector(type[1].id, type[1].fieldTypes[0], type[1].fieldTypes.length));
              break;
            default:
              assembler.append(_construct(spirv.ops.TypeStruct, [type[1].id].concat(_toConsumableArray(type[1].fieldTypes))));
              break;
          }
        } else {
          if (!type[1].elementType) throw new Error("Unknown type!");
          var elementType = type[1].elementType;
          var _key = reverseTypeMap.get(elementType);
          var _value = typeMap.get(_key);
          doEmitTypes([_key, _value]);
          var id = currentId++;
          assembler.append(new spirv.ops.Constant(typeMap.get(program.intrinsics.uint32), id, type[1].numElements));
          assembler.append(new spirv.ops.TypeArray(type[1].id, elementType, id));
        }
      } else {
        switch (type[0].name) {
          case "void":
            assembler.append(new spirv.ops.TypeVoid(type[1]));
            break;
          case "bool":
            assembler.append(new spirv.ops.TypeBool(type[1]));
            break;
          case "int32":
            assembler.append(new spirv.ops.TypeInt(type[1], 32, 1));
            break;
          case "uint32":
          case "uint8":
            assembler.append(new spirv.ops.TypeInt(type[1], 32, 0));
            break;
          case "float32":
            assembler.append(new spirv.ops.TypeFloat(type[1], 32));
            break;
          case "float64":
            assembler.append(new spirv.ops.TypeFloat(type[1], 64));
            break;
        }
      }
    }
    doEmitTypes([program.intrinsics.uint32, typeMap.get(program.intrinsics.uint32)]);
    for (var _type of typeMap) doEmitTypes(_type);
  }
  var constants = new Map();
  var ConstantFinder = /*#__PURE__*/function (_Visitor) {
    function ConstantFinder() {
      _classCallCheck(this, ConstantFinder);
      return _callSuper(this, ConstantFinder, arguments);
    }
    _inherits(ConstantFinder, _Visitor);
    return _createClass(ConstantFinder, [{
      key: "visitGenericLiteralType",
      value: function visitGenericLiteralType(node) {
        var type = node.type;
        while (type instanceof TypeRef) type = type.type;
        var values;
        switch (type) {
          case program.intrinsics.bool:
            values = [node.value];
            break;
          case program.intrinsics.int32:
          case program.intrinsics.uint32:
          case program.intrinsics.uint8:
            values = [node.value];
            break;
          case program.intrinsics.float:
            {
              var arrayBuffer = new ArrayBuffer(Math.max(Uint32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT));
              var floatView = new Float32Array(arrayBuffer);
              var uintView = new Uint32Array(arrayBuffer);
              floatView[0] = node.value;
              values = uintView;
              break;
            }
          case program.intrinsics.double:
            {
              var _arrayBuffer = new ArrayBuffer(Math.max(Uint32Array.BYTES_PER_ELEMENT, Float64Array.BYTES_PER_ELEMENT));
              var doubleView = new Float64Array(_arrayBuffer);
              var _uintView = new Uint32Array(_arrayBuffer);
              doubleView[0] = node.value;
              values = _uintView;
              break;
            }
          default:
            throw new Error("Unrecognized literal.");
        }
        constants.set(node, {
          id: currentId++,
          typeId: typeMap.get(type),
          type: type,
          values: values
        });
      }
    }]);
  }(Visitor);
  for (var _entryPoint of entryPoints) _entryPoint.shader.visit(new ConstantFinder());
  var assembler = new SPIRVAssembler();
  // 1. All OpCapability instructions
  assembler.append(new spirv.ops.Capability(spirv.kinds.Capability.Shader));
  assembler.append(new spirv.ops.Capability(spirv.kinds.Capability.Float64));
  // 2. Optional OpExtension instructions
  // 3. Optional OpExtInstImport instructions
  // 4. The single required OpMemoryModel instruction
  // FIXME: Figure out if we can use the Simple memory model instead of the GLSL memory model.
  // The spec says nothing about what the difference between them is. 💯
  assembler.append(new spirv.ops.MemoryModel(spirv.kinds.AddressingModel.Logical, spirv.kinds.MemoryModel.GLSL450));

  // 5. All entry point declarations
  for (var _entryPoint2 of entryPoints) {
    var executionModel = void 0;
    switch (_entryPoint2.shader.shaderType) {
      case "vertex":
        executionModel = spirv.kinds.ExecutionModel.Vertex;
        break;
      case "fragment":
        executionModel = spirv.kinds.ExecutionModel.Fragment;
        break;
    }
    var id = _entryPoint2.id;
    var name = _entryPoint2.shader.name;
    var interfaceIds = [];
    for (var value of _entryPoint2.inputs) interfaceIds.push(value.id);
    for (var _value2 of _entryPoint2.outputs) interfaceIds.push(_value2.id);
    assembler.append(_construct(spirv.ops.EntryPoint, [executionModel, id, name].concat(interfaceIds)));
  }

  // 6. All execution mode declarations
  for (var _entryPoint3 of entryPoints) {
    var _id = _entryPoint3.id;
    assembler.append(new spirv.ops.ExecutionMode(_id, spirv.kinds.ExecutionMode.OriginLowerLeft));
  }

  // 7. These debug instructions
  // 8. All annotation instructions
  // FIXME: There are probably more annotations that are required than just location.
  var locations = [];
  for (var _entryPoint4 of entryPoints) {
    switch (_entryPoint4.shader.shaderType) {
      case "vertex":
        for (var input of _entryPoint4.inputs) {
          assembler.append(new spirv.ops.Decorate(input.id, spirv.kinds.Decoration.Location, input.location));
          locations.push({
            name: _entryPoint4.shader.name + "." + input.name,
            location: input.location
          });
        }
        break;
      case "fragment":
        for (var output of _entryPoint4.outputs) {
          assembler.append(new spirv.ops.Decorate(output.id, spirv.kinds.Decoration.Location, output.location));
          locations.push({
            name: _entryPoint4.shader.name + "." + output.name,
            location: output.location
          });
        }
        break;
    }
  }

  // 9. All type declarations, all constant instructions, and all global variable declarations
  emitTypes(assembler);
  var functionType = currentId++;
  assembler.append(new spirv.ops.TypeFunction(functionType, typeMap.get(program.intrinsics.void)));
  for (var constant of constants) {
    if (constant[1].type == program.intrinsics.bool) {
      if (constant[1].value[0]) assembler.append(new spirv.ops.ConstantTrue(constant[1].id));else assembler.append(new spirv.ops.ConstantFalse(constant[1].id));
    } else assembler.append(_construct(spirv.ops.Constant, [constant[1].typeId, constant[1].id].concat(_toConsumableArray(constant[1].values))));
  }
  for (var _entryPoint5 of entryPoints) {
    for (var _input of _entryPoint5.inputs) assembler.append(new spirv.ops.Variable(_input.type, _input.id, spirv.kinds.StorageClass.Input));
    for (var _output of _entryPoint5.outputs) assembler.append(new spirv.ops.Variable(_output.type, _output.id, spirv.kinds.StorageClass.Output));
  }

  // 10. All function declarations
  // 11. All function definitions
  for (var _entryPoint6 of entryPoints) {
    assembler.append(new spirv.ops.Function(typeMap.get(program.intrinsics.void), _entryPoint6.id, [spirv.kinds.FunctionControl.None], functionType));
    assembler.append(new spirv.ops.FunctionEnd());
  }
  return {
    file: assembler.result,
    locations: locations
  };
}

