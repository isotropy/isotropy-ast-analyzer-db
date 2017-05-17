import { builtins as $, Match, Skip } from "chimpanzee";

export default function(state, config) {
  return params => {
    function fn(path, key, parents, parentKeys) {
      return context => {
        const node = path.node;
        const objPath = path.parentPath;

        return config.identifiers
          ? config.identifiers.includes(node)
              ? new Match({ db: node, identifier: node }, { obj: path, context, key })
              : new Skip("Invalid", { obj: path, context, key, parents, parentKeys })
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
              : new Skip("Invalid", { obj: path, context, key, parents, parentKeys });
      };
    }
    return $.func(fn, params);
  };
}
