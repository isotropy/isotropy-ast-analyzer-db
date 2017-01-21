import Error from "isotropy-error";

import makeAnalyzer from "ast-crumbs";
import * as rootAnalyzer from "./analyze-root";
import * as dbStatements from "../db-statements";

import { assertArrowFunction, assertMethodIsNotInTree, assertMemberExpressionUsesParameter,
  assertUnaryArrowFunction, assertBinaryArrowFunction } from "../ast-asserts";

/*
  The write analyzer handles operations where we mutate the db collection.
  eg:
    inserts, updates, deletes etc.
*/

const nodeDefinitions = [
  {
    id: "root",
    type: "predicate",
    predicate: rootAnalyzer.isRoot,
    builder: dbStatements.createCollection,
    args: rootAnalyzer.getRootArgs
  },
  {
    id: "insert",
    name: "concat",
    type: "CallExpression",
    follows: ["root"],
    builder: dbStatements.insert,
    args: getInsertArgs
  },
  {
    id: "update",
    name: "map",
    type: "CallExpression",
    follows: ["root"],
    builder: dbStatements.update,
    args: getUpdateArgs
  },
  {
    id: "remove",
    name: "filter",
    type: "CallExpression",
    follows: ["root"],
    builder: dbStatements.remove,
    args: getRemoveArgs
  },
];

const analyzer = makeAnalyzer(
  nodeDefinitions,
  rootAnalyzer.isRoot
);

export function analyzeAssignmentExpression(path, state, config) {
  if (
    path.isAssignmentExpression() &&
    rootAnalyzer.isRoot(path.get("left"), state, config)
  ) {
    return analyzer(path.get("right"), ["insert", "update", "remove"], state, config);
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

    return {
      predicate: body.get("test").node,
      fields: consequent.get("properties").map(i => i.node)
    };

  } else {
    throw new Error(`The update() method must use a conditional expression. Found ${body.node.type} instead.`);
  }
}


function getRemoveArgs(path, state, config) {
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
