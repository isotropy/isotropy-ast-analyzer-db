/*
  Must pass an arrow function.
*/

export function assertArrowFunction(path, errorCode) {
  if (!path.isArrowFunctionExpression()) {
    throw new Error(errorCode, `Must pass an arrow function. Found ${path.node.type} instead.`)
  }
}

/*
  Function must be an arrow function and have a single parameter.
*/

export function assertUnaryArrowFunction(path, errorCode) {
  assertArrowFunction(path, errorCode);
  const params = path.get("params");
  if (params.length !== 1) {
    throw new Error(errorCode, `Function must be an arrow function and have a single parameter. Found ${params.length} instead.`)
  }
}



/*
  Function must have a two parameters.
*/

export function assertBinaryArrowFunction(path, errorCode) {
  assertArrowFunction(path, errorCode);
  const params = path.get("params");
  if (params.length !== 2) {
    throw new Error(errorCode, `Function must be an arrow function and have two parameters. Found ${params.length} instead.`)
  }
}


/*
  Check if a method call exists in the call chain.
*/
export function assertMethodIsNotInTree(path, methodName, errorCode, errorMessage) {
  if (path.isCallExpression() && path.node.callee.property.name === methodName) {
    throw new Error(errorCode, errorMessage)
  }

  if (path.parentPath.isCallExpression()) {
    assertMethodIsNotInTree(path.parentPath, methodName);
  }
}


/*
  Makes sure unary function parameter is exclusively used in member expression
*/
export function assertMemberExpressionUsesParameter(expr, paramNames, errorCode, errorMessage) {
  if (
    !expr.isMemberExpression() ||
    !expr.get("property").isIdentifier() ||
    !expr.get("object").isIdentifier() ||
    !paramNames.includes(expr.get("object").get("name").node)
  ) {
    throw new Error(errorCode, errorMessage);
  }
}
