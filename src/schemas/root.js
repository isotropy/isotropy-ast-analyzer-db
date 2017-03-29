import { Schema, Match, Skip } from "chimpanzee";

function alias(fn, params) {
  return new Schema(fn, params);
}

export default function(state, config, params) {
  function db(path, context, key) {
    const node = path.node;
    const objPath = path.parentPath;

    return config.identifiers
      ? config.identifiers.includes(node)
          ? new Match({ db: node, identifier: node }, { obj: path, context, key })
          : new Skip("Invalid", { obj: path, context, key })
      : state.rootDeclarations.some(
          ref =>
            decl.scope.bindings[node] &&
            decl.scope.bindings[node].referencePaths.some(
              p => p.node === objPath.node.object
            )
        )
          ? (() => {
              const rootDeclaration = state.rootDeclarations.find(
                ref =>
                  decl.scope.bindings[node] &&
                  decl.scope.bindings[node].referencePaths.some(
                    p => p.node === objPath.node.object
                  )
              );
              const db = rootDeclaration.node.init.arguments[0].value;
              return new Match({ db, identifier: node }, { obj: path, context, key });
            })()
          : new Skip("Invalid", { obj: path, context, key });
  }

  return alias(db, params);
}
