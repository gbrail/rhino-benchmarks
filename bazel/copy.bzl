def _copy_files_impl(ctx):
    all_outs = []
    for src in ctx.files.srcs:
        rel_path = src.path
        strip = ctx.attr.strip_prefix
        if strip and rel_path.startswith(strip + "/"):
            rel_path = rel_path[len(strip) + 1:]
        if ctx.attr.prefix:
            out_rel = ctx.attr.prefix + "/" + rel_path
        else:
            out_rel = rel_path
        out_file = ctx.actions.declare_file(out_rel)
        all_outs.append(out_file)
        ctx.actions.run(
            outputs = [out_file],
            inputs = [src],
            tools = [ctx.file._copy_js],
            executable = "node",
            arguments = [ctx.file._copy_js.path, src.path, out_file.path],
            mnemonic = "CopyFile",
            progress_message = "Copying %s" % src.path,
        )
    return [DefaultInfo(files = depset(all_outs))]

copy_files = rule(
    implementation = _copy_files_impl,
    attrs = {
        "srcs": attr.label_list(allow_files = True),
        "prefix": attr.string(doc = "Prefix for output; if empty, outputs keep the source paths"),
        "strip_prefix": attr.string(
            doc = "Leading path prefix (e.g. \"JetStream\") to strip from source paths when naming outputs",
        ),
        "_copy_js": attr.label(
            allow_single_file = True,
            default = ":copy.js",
        ),
    },
)
