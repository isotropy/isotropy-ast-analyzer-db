import * as dbCommand from "./db-command";
import { assertArrowFunction, assertMethodIsNotInTree, assertMemberExpressionUsesParameter,
  assertUnaryArrowFunction, assertBinaryArrowFunction } from "../ast-asserts";

/*
  The write visitor handles operations where we mutate the db collection.
  eg:
    inserts, updates, deletes etc.
*/

function isCollection(path, config) {
  return path.isMemberExpression() && path.get("object").isIdentifier() && path.node.object.name === config.identifier;
}

function parseCollection(path, config) {
  return path.isMemberExpression() && path.get("object").isIdentifier() && path.node.object.name === config.identifier ?
    path.node.property.name :
    undefined;
}

function isRoot(path, config) {
  return path.isMemberExpression() && path.get("object").isIdentifier() && path.node.object.name === config.identifier;
}

function getRootArgs(path, config) {
  return path.node.property.name;
}

const analyzer = makeAnalyzer(
  nodeDefinitions,
  isRoot
);


export function analyzeAssignmentExpression(path, config) {
  if (path.isAssignmentExpression() && isRoot(path.get("left"), config)) {
    const rhs = path.get("right");
  }
}


function getInsertArgs(path) {
  return path[0].node;
}

function getUpdateArgs(path) {
  const fnExpr = path[0];
  assertUnaryArrowFunction(fnExpr)

  const body = fnExpr.get("body");
  if (body.isConditionalExpression()) {
    const firstParam = fnExpr.get("params")[0].node.name;

    const consequent = body.get("consequent");
    const alternate = body.get("alternate");

    //In the ternary expression, the consequent (1st item) should be the updated item, and alternate should be the unmodified item
    // eg: db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } /* consequent */ : todo /* alternate */)
    // The consequent should be an ObjectExpression and the spread must be the first property of the consequent.
    if (!consequent.isObjectExpression()) {
      throw new Error(`In the ternary expression, the consequent (1st item) should be an ObjectExpression.`)
    }

    if (!consequent.get("properties.0").isSpreadProperty()) {
      throw new Error(`In the ternary expression, the consequent should be an ObjectExpression and the spread must be the first property of the consequent.`);
    }

    if (!alternate.isIdentifier() || alternate.get("name").node !== firstParam) {
      throw new Error(`In the ternary expression, the consequent (1st item) should be the updated item, and alternate (2nd item) should be unmodified.`);
    }

    Object.keys(consequent.get("properties"))

    return {
      predicate: body.get("test").node,
      fields: consequent.get("properties").node
    };

  } else {
    throw new Error(`The update() method must use a conditional expression. Found ${body.node.type} instead.`);
  }
}

function parseDelete(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "filter" ?
    expressions.any(
      [() => parseCollection(path.get("callee").get("object"), config)],
      collection => ({ type: "delete", collection, predicate: getDeleteArgs(path.get("arguments"), config) }),
    ) :
    undefined;
}


function getDeleteArgs(path, config) {
  const fnExpr = path[0];
  assertUnaryArrowFunction(fnExpr)

  const body = fnExpr.get("body");
  //The filter expression should negate the predicate that identifies the item to be deleted.
  // eg: db.todos = db.todos.filter(todo => !(todo.assignee === assignee && todo.title === title))
  if (body.isUnaryExpression() && body.get("operator").node === "!") {
    return body.get("argument").node;
  } else {
    throw new Error(`The filter expression should negate the predicate that identifies the item to be deleted.`);
  }
}
