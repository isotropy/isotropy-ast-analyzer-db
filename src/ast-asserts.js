/*
  Must pass an arrow function.
*/

function assertArrowFunction(path, errorCode) {
  if (!path.isArrowFunctionExpression()) {
    throw new Error(errorCode, `Must pass an arrow function. Found ${path.node.type} instead.`)
  }
}

/*
  Function must have a single parameter.
*/

function assertFunctionHasOneArg(path, errorCode) {
  if (path.length !== 1) {
    throw new Error(errorCode, `Function must have a single parameter. Found ${path.get("params").node.length} instead.`)
  }
}


/*
  Function must have a two parameters.
*/

function assertFunctionHasTwoArgs(path, errorCode) {
  if (path.length !== 2) {
    throw new Error(errorCode, `Function must have two parameters. Found ${path.get("params").node.length} instead.`)
  }
}


/*
  Check if a method call exists in the call chain.
*/
function assertMethodIsNotInTree(path, methodName, errorCode, errorMessage) {
  if (path.isCallExpression() && path.node.callee.property.name === methodName) {
    throw new Error(errorCode, errorMessage)
  }

  if (path.parentPath.isCallExpression()) {
    assertMethodIsNotInTree(path.parentPath, methodName);
  }
}
