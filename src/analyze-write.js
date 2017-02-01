import makeAnalyzer from "ast-crumbs";
import * as rootAnalyzer from "./analyze-root";
import * as dbStatements from "./db-statements";

import {
  ensureArrowFunction,
  ensureBinaryArrowFunction,
  ensureConditionalExpression,
  ensureLogicalOrBinaryExpressionExpression,
  ensureMemberExpressionUsesParameter,
  ensureMethodIsNotInTree,
  ensureNegatedUnaryExpression,
  ensureObjectExpression,
  ensureSpreadProperty,
  ensureUnaryArrowFunction,
  ensureUnmodifiedParameter,
} from "./isotropy-ast-asserts";

import {
  getArrowFunctionBody,
  getParameterBindings,
  createLogicalOrBinaryExpression
} from "./arrow-function-helper";

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
  return { items: path[0].node, path };
}


function getUpdateArgs(path) {
  const fnPath = path[0];
  ensureUnaryArrowFunction(fnPath)

  const body = getArrowFunctionBody(fnPath);
  ensureConditionalExpression(body);

  const [paramBindings] = getParameterBindings(fnPath);

  //In the ternary expression, the consequent (1st item) should be the updated item, and alternate should be the unmodified item
  // eg: db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } /* consequent */ : todo /* alternate */)
  // The consequent should be an ObjectExpression and the spread must be the first property of the consequent.

  const consequent = body.get("consequent");
  ensureObjectExpression(consequent);
  ensureSpreadProperty(consequent.get("properties.0"));

  const alternate = body.get("alternate");
  ensureUnmodifiedParameter(alternate, paramBindings);

  return {
    predicate: body.get("test").node,
    fields: consequent.get("properties").slice(1).map(i => ({
      field: i.node.key.name,
      valueNode: i.node.value
    })),
    path
  };
}


function getRemoveArgs(path, state, config) {
  const fnPath = path[0];
  ensureUnaryArrowFunction(fnPath)

  const body = getArrowFunctionBody(fnPath);
  ensureNegatedUnaryExpression(body);

  const predicatePath = body.get("argument");
  ensureLogicalOrBinaryExpressionExpression(predicatePath);

  const [paramBindings] = getParameterBindings(fnPath);

  return {
    predicate: createLogicalOrBinaryExpression(predicatePath, paramBindings),
    path
  };
}
