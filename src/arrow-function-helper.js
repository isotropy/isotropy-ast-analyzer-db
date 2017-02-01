export function getArrowFunctionBody(path) {
  return path.isArrowFunctionExpression() ? path.get("body") : path.get("body").get("body.0").get("argument");
}

export function getParameterBindings(path) {
  return path.get("params").map(p => path.scope.bindings[p.node.name]);
}

export function createLogicalOrBinaryExpression(path, paramBindings) {
  return {}
}

export function createLogicalExpression(path, paramBindings) {

}

export function createBinaryExpression(path, paramBindings) {

}
