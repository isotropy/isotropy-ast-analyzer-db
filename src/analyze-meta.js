export function analyzeImportDeclaration(path, state, config) {
  const sourceNode = path.get("source").node;
  if (
    sourceNode.type === "StringLiteral" &&
    sourceNode.value === config.clientPackageName
  ) {
    const specifier = path.get("specifiers.0").node.local.name;
    state.rootDeclarations = path.scope.bindings[
      specifier
    ].referencePaths.map(r =>
      r.findParent(path => path.isVariableDeclarator())
    );
  }
  return true;
}
