import { Schema, Match, Skip } from "chimpanzee";

function alias(fn, params) {
  return new Schema(fn, params)
}

export default function(state, config, params) {
  function db(path) {
    const node = path.node;
    const objPath = path.parentPath;

    return config.identifiers
      ? config.identifiers.includes(node)
        ? new Match({ db: node, identifier: node })
        : new Skip()
      : state.rootDeclarations.some(
          ref => decl.scope.bindings[node] &&
            decl.scope.bindings[node].referencePaths.some(p => p.node === objPath.node.object)
        )
        ? (() => {
          const rootDeclaration = state.rootDeclarations
            .find(ref =>
              decl.scope.bindings[node] &&
              decl.scope.bindings[node].referencePaths.some(p => p.node === objPath.node.object)
            );
          const db = rootDeclaration.node.init.arguments[0].value;
          return { db, identifier: node }
        })()
        : new Skip()
  }

  return alias(db, params)
}
