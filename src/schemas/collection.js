import { traverse, Schema, capture } from "chimpanzee";

function alias(fn, key) {
  return new Schema(fn, { key })
}

export default function(state, config) {
  function db(node) {
    console.log("--->", node);
    return config.identifiers
      ? config.identifiers.includes(node.object.name)
        ? new Match(node.object.name)
        : new Skip()
      : state.rootDeclarations.some(
          ref => decl.scope.bindings[node.object.name] &&
            decl.scope.bindings[node.object.name].referencePaths.some(p => p.node === node.object)
        )
        ? new Match(
          state.rootDeclarations
            .find(ref =>
              decl.scope.bindings[path.node.object.name] &&
              decl.scope.bindings[path.node.object.name].referencePaths.some(p => p.node === path.node.object)
            )
            .node.init.arguments[0].value
          )
        : new Skip()
  }

  return traverse(
    {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": alias(db, "db")
      },
      "property": {
        "type": "Identifier",
        "name": capture("collection")
      }
    },
    { modifiers: { object: path => console.log(path.node) || path.node } }
  )
}
