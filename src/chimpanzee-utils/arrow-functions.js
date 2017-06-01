import * as expressions from "./expressions";

export function isDefinedOnParameter(path) {
  const identifier = expressions.getIdentifier(path);
  return identifier
    ? (() => {
      const binding = path.parentPath.scope.bindings[identifier.node.name];
      return binding && binding.referencePaths.includes(path);
    })()
    : false;
}
