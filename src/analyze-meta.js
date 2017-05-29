import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      const dbPaths = state.opts.databaseModules.map(p => path.resolve(p));
      const moduleName = babelPath.get("source").node.value;
      const resolvedName = path.resolve(path.dirname(state.file.opts.filename), moduleName);

      if (dbPaths.includes(resolvedName)) {
        const specifier = babelPath.get("specifiers.0").node.local.name;
        analysisState.importBindings = analysisState.importBindings.concat(
          babelPath.scope.bindings[specifier]
        );
      }
    }
  };
}
