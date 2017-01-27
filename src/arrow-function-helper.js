export function getArrowFunctionBody(path) {
  return path.isArrowFunctionExpression() ? path.get("body") : path.get("body").get("body.0").get("argument");
}
