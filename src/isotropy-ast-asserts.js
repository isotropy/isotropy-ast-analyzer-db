/*
  Must pass an arrow function.
  Because some babel presets parse it is a FunctionExpression, we're going to cheat and allow that as well.
  Ideally, it should only be an ArrowFunctionExpression.
*/

function isTrivialFunction(path) {
  return path.isFunctionExpression() &&
    path.node.body &&
    path.node.body.body &&
    path.node.body.body.length === 1 &&
    path.node.body.body[0].type === "ReturnStatement";
}

export function ensureArrowFunction(path) {
  if (!path.isArrowFunctionExpression() && !isTrivialFunction(path)) {
    throw new Error(
      `Must pass an arrow function. Found ${path.node.type} instead.`
    );
  }
}

export function ensureBinaryArrowFunction(path) {
  ensureArrowFunction(path);
  const params = path.get("params");
  if (params.length !== 2) {
    throw new Error(
      `Function must be an arrow function and have two parameters. Found ${params.length} instead.`
    );
  }
}

export function ensureBinaryExpressionOperators(path, operators) {
  const operator = path.get("operator").node;
  if (!operators.includes(operator)) {
    throw new Error(
      `Expected operator to be ${operators.join(" or ")} but got ${operator}.`
    );
  }
}

export function ensureConditionalExpression(path) {
  if (!path.isConditionalExpression()) {
    throw new Error(
      `Expected conditional expression (ternary) but got ${path.type}.`
    );
  }
}

export function ensureLogicalOrBinaryExpressionExpression(path) {
  if (path.type !== "LogicalExpression" && path.type !== "BinaryExpression") {
    throw new Error(
      `Expected a LogicalExpression or a BinaryExpression but got ${path.type}.`
    );
  }
}

export function ensureMemberExpression(expression) {
  if (!expression.isMemberExpression()) {
    throw new Error(`Expected MemberExpression but got ${expression.type}.`);
  }
}

export function ensureMemberExpressionsReferenceSameProperty(expressions) {
  const fields = expressions.map(e => e.get("property").node.name);
  if (fields.length) {
    const name = fields[0];
    if (!fields.every(f => f === name)) {
      throw new Error("The expression should use the same fields.");
    }
  }
}

export function ensureMethodIsNotInTree(path, methodName) {
  const callee = path.get("callee");
  if (callee) {
    if (callee.node.property.name === methodName) {
      throw new Error(`${methodName} should not be in tree.`);
    }
    if (callee.get("object").isCallExpression()) {
      ensureMethodIsNotInTree(callee.get("object"), methodName);
    }
  }
}

export function ensureNegatedUnaryExpression(path) {
  if (!path.isUnaryExpression() || path.get("operator").node !== "!") {
    throw new Error(
      `The filter expression should negate the predicate boolean expression.`
    );
  }
}

export function ensureObjectExpression(path) {
  if (!path.isObjectExpression()) {
    throw new Error(`Expected an ObjectExpression but got ${path.type}.`);
  }
}

export function ensureObjectSpreadUsesParameter(path, paramBindings) {}

export function ensureSpreadProperty(path) {
  if (!path.isSpreadProperty()) {
    throw new Error(`Expected SpreadProperty but got ${path.type}.`);
  }
}

export function ensureUnaryArrowFunction(path) {
  ensureArrowFunction(path);
  const params = path.get("params");
  if (params.length !== 1) {
    throw new Error(
      `Function must be an arrow function and have a single parameter. Found ${params.length} instead.`
    );
  }
}
