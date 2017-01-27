/*
  Must pass an arrow function.
  Because some babel presets parse it is a FunctionExpression, we're going to cheat and allow that as well.
  Ideally, it should only be an ArrowFunctionExpression.
*/

function isTrivialFunction(path) {
  return path.isFunctionExpression() &&
    path.node.body &&  path.node.body.body && path.node.body.body.length === 1 &&
    path.node.body.body[0].type === "ReturnStatement";
}

export function ensureArrowFunction(path) {
  if (!path.isArrowFunctionExpression() && !isTrivialFunction(path)) {
    throw new Error(`Must pass an arrow function. Found ${path.node.type} instead.`)
  }
}

/*
  Function must be an arrow function and have a single parameter.
*/

export function ensureUnaryArrowFunction(path) {
  ensureArrowFunction(path);
  const params = path.get("params");
  if (params.length !== 1) {
    throw new Error(`Function must be an arrow function and have a single parameter. Found ${params.length} instead.`)
  }
}



/*
  Function must have a two parameters.
*/

export function ensureBinaryArrowFunction(path) {
  ensureArrowFunction(path);
  const params = path.get("params");
  if (params.length !== 2) {
    throw new Error(`Function must be an arrow function and have two parameters. Found ${params.length} instead.`)
  }
}


/*
  Check if a method call exists in the call chain.
*/
export function ensureMethodIsNotInTree(path, methodName) {
  const callee = path.get("callee");
  if (callee) {
    if (callee.node.property.name === methodName) {
      throw new Error(`${methodName} should not be in tree.`)
    }
    if (callee.get("object").isCallExpression()) {
      ensureMethodIsNotInTree(callee.get("object"), methodName);
    }
  }
}


/*
  Makes sure unary function parameter is exclusively used in member expression
*/
export function ensureMemberExpressionUsesParameter(expr, paramNames) {
  if (
    !expr.isMemberExpression() ||
    !expr.get("property").isIdentifier() ||
    !expr.get("object").isIdentifier() ||
    !paramNames.includes(expr.get("object").get("name").node)
  ) {
    throw new Error(`The map expression should return an object expression that references fields on the parameter. Parameters were ${paramNames.join(", ")}.`);
  }
}
