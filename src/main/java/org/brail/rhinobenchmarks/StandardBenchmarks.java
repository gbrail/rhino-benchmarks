package org.brail.rhinobenchmarks;

import java.io.IOException;
import java.util.List;

public class StandardBenchmarks {
  /** Load the standard benchmark suite. */
  public static void load(BenchmarkDriver driver) throws BenchmarkException, IOException {
    driver.loadFile("sunspider-3d-cube", "./SunSpider/3d-cube.js");
    driver.loadFile("sunspider-3d-raytrace", "./SunSpider/3d-raytrace.js");
    driver.loadFile("sunspider-base64", "./SunSpider/base64.js");
    driver.loadFile("sunspider-crypto-aes", "./SunSpider/crypto-aes.js");
    driver.loadFile("sunspider-crypto-md5", "./SunSpider/crypto-md5.js");
    driver.loadFile("sunspider-crypto-sha1", "./SunSpider/crypto-sha1.js");
    driver.loadFile("sunspider-date-format-tofte", "./SunSpider/date-format-tofte.js");
    driver.loadFile("sunspider-date-format-xparb", "./SunSpider/date-format-xparb.js");
    driver.loadFile("sunspider-n-body", "./SunSpider/n-body.js");
    driver.loadFile("sunspider-regex-dna", "./SunSpider/regex-dna.js");
    driver.loadFile("sunspider-string-unpack-code", "./SunSpider/string-unpack-code.js");
    driver.loadFile("sunspider-tagcloud", "./SunSpider/tagcloud.js");

    driver.loadFile("octane-box2d", "./Octane/box2d.js");
    driver.loadFile("octane-code-first-load", "./Octane/code-first-load.js");
    driver.loadFile("octane-crypto", "./Octane/crypto.js");
    driver.loadFile("octane-deltablue", "./Octane/deltablue.js");
    driver.loadFile("octane-earley-boyer", "./Octane/earley-boyer.js");
    /* Fails in a weird way:
    driver.loadCollection("octane-gbemu", List.of("./Octane/gbemu-part1.js",
            "./Octane/gbemu-part2.js")); */
    driver.loadFile("octane-navier-stokes", "./Octane/navier-stokes.js");
    // Fails
    // driver.loadFile("octane-pdfjs", "./Octane/pdfjs.js");
    driver.loadFile("octane-raytrace", "./Octane/raytrace.js");
    // Fails
    // driver.loadFile("octane-regexp", "./Octane/regexp.js");
    driver.loadFile("octane-richards", "./Octane/richards.js");

    driver.loadFile("simple-hash-map", "./simple/hash-map.js");
    driver.loadFile("simple-doxbee-promise", "./simple/doxbee-promise.js");
    driver.loadFile("simple-doxbee-async", "./simple/doxbee-async.js");

    // TODO 60 iterations
    driver.loadCollection(
        "cdjs",
        List.of(
            "./cdjs/constants.js",
            "./cdjs/util.js",
            "./cdjs/red_black_tree.js",
            "./cdjs/call_sign.js",
            "./cdjs/vector_2d.js",
            "./cdjs/vector_3d.js",
            "./cdjs/motion.js",
            "./cdjs/reduce_collision_set.js",
            "./cdjs/simulator.js",
            "./cdjs/collision.js",
            "./cdjs/collision_detector.js",
            "./cdjs/benchmark.js"));

    driver.loadCollection(
        "RexBench-UniPoker",
        List.of(
            "./RexBench/UniPoker/poker.js",
            "./RexBench/UniPoker/expected.js",
            "./RexBench/UniPoker/benchmark.js"));

    // TODO 80 iterations
    driver.loadCollection(
        "RexBench-OfflineAssembler",
        List.of(
            "./RexBench/OfflineAssembler/registers.js",
            "./RexBench/OfflineAssembler/instructions.js",
            "./RexBench/OfflineAssembler/ast.js",
            "./RexBench/OfflineAssembler/parser.js",
            "./RexBench/OfflineAssembler/file.js",
            "./RexBench/OfflineAssembler/LowLevelInterpreter.js",
            "./RexBench/OfflineAssembler/LowLevelInterpreter32_64.js",
            "./RexBench/OfflineAssembler/LowLevelInterpreter64.js",
            "./RexBench/OfflineAssembler/InitBytecodes.js",
            "./RexBench/OfflineAssembler/expected.js",
            "./RexBench/OfflineAssembler/benchmark.js"));

    driver.loadCollection(
        "RexBench-FlightPlanner",
        List.of(
            "./RexBench/FlightPlanner/airways.js",
            "./RexBench/FlightPlanner/waypoints.js.z",
            "./RexBench/FlightPlanner/flight_planner.js",
            "./RexBench/FlightPlanner/expectations.js",
            "./RexBench/FlightPlanner/benchmark.js"));

    // TODO Iterations: 160
    driver.loadCollection(
        "bigint-bigdenary",
        List.of("./bigint/bigdenary-bundle.js", "./bigint/bigdenary-benchmark.js"));

    driver.loadCollection(
        "ARES-6-Air",
        List.of(
            "./ARES-6/Air/symbols.js",
            "./ARES-6/Air/tmp_base.js",
            "./ARES-6/Air/arg.js",
            "./ARES-6/Air/basic_block.js",
            "./ARES-6/Air/code.js",
            "./ARES-6/Air/frequented_block.js",
            "./ARES-6/Air/inst.js",
            "./ARES-6/Air/opcode.js",
            "./ARES-6/Air/reg.js",
            "./ARES-6/Air/stack_slot.js",
            "./ARES-6/Air/tmp.js",
            "./ARES-6/Air/util.js",
            "./ARES-6/Air/custom.js",
            "./ARES-6/Air/liveness.js",
            "./ARES-6/Air/insertion_set.js",
            "./ARES-6/Air/allocate_stack.js",
            "./ARES-6/Air/payload-gbemu-executeIteration.js",
            "./ARES-6/Air/payload-imaging-gaussian-blur-gaussianBlur.js",
            "./ARES-6/Air/payload-airjs-ACLj8C.js",
            "./ARES-6/Air/payload-typescript-scanIdentifier.js",
            "./ARES-6/Air/benchmark.js"));
    // ARES-6-Basic: Stack overflow
    // ARES-6-ml: Missing "set"
    /*driver.loadCollection("ARES-6-ml", List.of("./ARES-6/ml/index.js",
    "./ARES-6/ml/benchmark.js"));*/
    // ARES-6-Babylon: Missing TmpBase

    // ai-astar: Weird assertion error, maybe too big?
    // gaussian-blur: IllegalStateException on activation
    // other SeaMonster crypto tests: Same IllegalStateException as above

    // TODO 20 iterations for the next two
    driver.loadCollection(
        "SeaMonster-json-stringify",
        List.of(
            "./SeaMonster/inspector-json-payload.js.z",
            "./SeaMonster/json-stringify-inspector.js"));
    driver.loadCollection(
        "SeaMonster-json-parse",
        List.of(
            "./SeaMonster/inspector-json-payload.js.z", "./SeaMonster/json-parse-inspector.js"));

    driver.loadCollection("threejs", List.of("./threejs/three.js", "./threejs/benchmark.js"));

    driver.loadCollection(
        "WSL",
        List.of(
            "./WSL/Node.js",
            "./WSL/Type.js",
            "./WSL/ReferenceType.js",
            "./WSL/Value.js",
            "./WSL/Expression.js",
            "./WSL/Rewriter.js",
            "./WSL/Visitor.js",
            "./WSL/CreateLiteral.js",
            "./WSL/CreateLiteralType.js",
            "./WSL/PropertyAccessExpression.js",
            "./WSL/AddressSpace.js",
            "./WSL/AnonymousVariable.js",
            "./WSL/ArrayRefType.js",
            "./WSL/ArrayType.js",
            "./WSL/Assignment.js",
            "./WSL/AutoWrapper.js",
            "./WSL/Block.js",
            "./WSL/BoolLiteral.js",
            "./WSL/Break.js",
            "./WSL/CallExpression.js",
            "./WSL/CallFunction.js",
            "./WSL/Check.js",
            "./WSL/CheckLiteralTypes.js",
            "./WSL/CheckLoops.js",
            "./WSL/CheckRecursiveTypes.js",
            "./WSL/CheckRecursion.js",
            "./WSL/CheckReturns.js",
            "./WSL/CheckUnreachableCode.js",
            "./WSL/CheckWrapped.js",
            "./WSL/Checker.js",
            "./WSL/CloneProgram.js",
            "./WSL/CommaExpression.js",
            "./WSL/ConstexprFolder.js",
            "./WSL/ConstexprTypeParameter.js",
            "./WSL/Continue.js",
            "./WSL/ConvertPtrToArrayRefExpression.js",
            "./WSL/DereferenceExpression.js",
            "./WSL/DoWhileLoop.js",
            "./WSL/DotExpression.js",
            "./WSL/DoubleLiteral.js",
            "./WSL/DoubleLiteralType.js",
            "./WSL/EArrayRef.js",
            "./WSL/EBuffer.js",
            "./WSL/EBufferBuilder.js",
            "./WSL/EPtr.js",
            "./WSL/EnumLiteral.js",
            "./WSL/EnumMember.js",
            "./WSL/EnumType.js",
            "./WSL/EvaluationCommon.js",
            "./WSL/Evaluator.js",
            "./WSL/ExpressionFinder.js",
            "./WSL/ExternalOrigin.js",
            "./WSL/Field.js",
            "./WSL/FindHighZombies.js",
            "./WSL/FlattenProtocolExtends.js",
            "./WSL/FlattenedStructOffsetGatherer.js",
            "./WSL/FloatLiteral.js",
            "./WSL/FloatLiteralType.js",
            "./WSL/FoldConstexprs.js",
            "./WSL/ForLoop.js",
            "./WSL/Func.js",
            "./WSL/FuncDef.js",
            "./WSL/FuncInstantiator.js",
            "./WSL/FuncParameter.js",
            "./WSL/FunctionLikeBlock.js",
            "./WSL/HighZombieFinder.js",
            "./WSL/IdentityExpression.js",
            "./WSL/IfStatement.js",
            "./WSL/IndexExpression.js",
            "./WSL/InferTypesForCall.js",
            "./WSL/Inline.js",
            "./WSL/Inliner.js",
            "./WSL/InstantiateImmediates.js",
            "./WSL/IntLiteral.js",
            "./WSL/IntLiteralType.js",
            "./WSL/Intrinsics.js",
            "./WSL/LateChecker.js",
            "./WSL/Lexer.js",
            "./WSL/LexerToken.js",
            "./WSL/LiteralTypeChecker.js",
            "./WSL/LogicalExpression.js",
            "./WSL/LogicalNot.js",
            "./WSL/LoopChecker.js",
            "./WSL/MakeArrayRefExpression.js",
            "./WSL/MakePtrExpression.js",
            "./WSL/NameContext.js",
            "./WSL/NameFinder.js",
            "./WSL/NameResolver.js",
            "./WSL/NativeFunc.js",
            "./WSL/NativeFuncInstance.js",
            "./WSL/NativeType.js",
            "./WSL/NativeTypeInstance.js",
            "./WSL/NormalUsePropertyResolver.js",
            "./WSL/NullLiteral.js",
            "./WSL/NullType.js",
            "./WSL/OriginKind.js",
            "./WSL/OverloadResolutionFailure.js",
            "./WSL/Parse.js",
            "./WSL/Prepare.js",
            "./WSL/Program.js",
            "./WSL/ProgramWithUnnecessaryThingsRemoved.js",
            "./WSL/PropertyResolver.js",
            "./WSL/Protocol.js",
            "./WSL/ProtocolDecl.js",
            "./WSL/ProtocolFuncDecl.js",
            "./WSL/ProtocolRef.js",
            "./WSL/PtrType.js",
            "./WSL/ReadModifyWriteExpression.js",
            "./WSL/RecursionChecker.js",
            "./WSL/RecursiveTypeChecker.js",
            "./WSL/ResolveNames.js",
            "./WSL/ResolveOverloadImpl.js",
            "./WSL/ResolveProperties.js",
            "./WSL/ResolveTypeDefs.js",
            "./WSL/Return.js",
            "./WSL/ReturnChecker.js",
            "./WSL/ReturnException.js",
            "./WSL/StandardLibrary.js",
            "./WSL/StatementCloner.js",
            "./WSL/StructLayoutBuilder.js",
            "./WSL/StructType.js",
            "./WSL/Substitution.js",
            "./WSL/SwitchCase.js",
            "./WSL/SwitchStatement.js",
            "./WSL/SynthesizeEnumFunctions.js",
            "./WSL/SynthesizeStructAccessors.js",
            "./WSL/TrapStatement.js",
            "./WSL/TypeDef.js",
            "./WSL/TypeDefResolver.js",
            "./WSL/TypeOrVariableRef.js",
            "./WSL/TypeParameterRewriter.js",
            "./WSL/TypeRef.js",
            "./WSL/TypeVariable.js",
            "./WSL/TypeVariableTracker.js",
            "./WSL/TypedValue.js",
            "./WSL/UintLiteral.js",
            "./WSL/UintLiteralType.js",
            "./WSL/UnificationContext.js",
            "./WSL/UnreachableCodeChecker.js",
            "./WSL/VariableDecl.js",
            "./WSL/VariableRef.js",
            "./WSL/VisitingSet.js",
            "./WSL/WSyntaxError.js",
            "./WSL/WTrapError.js",
            "./WSL/WTypeError.js",
            "./WSL/WhileLoop.js",
            "./WSL/WrapChecker.js",
            "./WSL/Test.js"));
  }
}
