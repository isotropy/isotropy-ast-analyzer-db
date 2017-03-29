import * as dbStatements from "./db-statements";

export function isRoot(path, state, config) {
  return path.isMemberExpression() && path.get("object").isIdentifier()
    ? config.identifiers
        ? config.identifiers.includes(path.node.object.name)
        : state.rootDeclarations.some(
            ref =>
              ref.scope.bindings[path.node.object.name] &&
              ref.scope.bindings[path.node.object.name].referencePaths.some(
                p => p.node === path.node.object
              )
          )
    : false;
}

export function getRootArgs(path, state, config) {
  if (config.identifiers) {
    return {
      db: path.node.object.name,
      identifier: path.node.object.name,
      collection: path.node.property.name
    };
  } else {
    const rootDeclaration = state.rootDeclarations.find(
      ref =>
        ref.scope.bindings[path.node.object.name] &&
        ref.scope.bindings[path.node.object.name].referencePaths.some(
          p => p.node === path.node.object
        )
    );
    const db = rootDeclaration.node.init.arguments[0].value;
    return dbStatements.createCollection({
      identifier: path.node.object.name,
      db,
      collection: path.node.property.name
    });
  }
}
