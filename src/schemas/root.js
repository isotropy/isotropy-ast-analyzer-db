import { builtins as $, Match, Skip } from "chimpanzee";

export default function(state, config) {
  return params => (path, key, parents, parentKeys) => context => {
    debugger;
    const node = path.node;
    const objPath = path.parentPath;

    debugger;
    const fn = config.identifiers
      ? config.identifiers.includes(node)
          ? new Match({ db: node, identifier: node }, { obj: path, context, key })
          : new Skip("Invalid", { obj: path, context, key, parents, parentKeys })
      : state.rootDeclarations.some(
          ref =>
            decl.scope.bindings[node] &&
            decl.scope.bindings[node].referencePaths.some(p => p.node === objPath.node.object)
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
              console.log("--->", { db, identifier: node });
              return new Match({ db, identifier: node }, { obj: path, context, key });
            })()
          : new Skip("Invalid", { obj: path, context, key, parents, parentKeys });

    return $.func(fn, params);
  };
}
