import makeAnalyzer from "ast-crumbs";
import * as rootAnalyzer from "./analyze-root";
import * as dbStatements from "../db-statements";

import { assertArrowFunction, assertMethodIsNotInTree, assertMemberExpressionUsesParameter,
  assertUnaryArrowFunction, assertBinaryArrowFunction } from "../ast-asserts";

/*
  The read analyzer handles operations where we don't mutate the db collection.
  eg:
    selects, count, map etc.
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
    id: "filter",
    name: "filter",
    type: "CallExpression",
    follows: ["root", "sort"],
    builder: dbStatements.filter,
    args: getFilterArgs
  },
  {
    id: "map",
    name: "map",
    type: "CallExpression",
    follows: ["root", "filter", "sort", "slice"],
    builder: dbStatements.map,
    args: getMapArgs,
  },
  {
    id: "slice",
    name: "slice",
    type: "CallExpression",
    follows: ["root", "filter", "sort", "map"],
    builder: dbStatements.slice,
    args: getSliceArgs,
  },
  {
    id: "sort",
    name: "sort",
    type: "CallExpression",
    follows: ["root", "filter"],
    builder: dbStatements.sort,
    args: getSortArgs,
  },
  {
    id: "length",
    name: "length",
    type: "MemberExpression",
    follows: ["root", "filter"],
    builder: dbStatements.length,
  }
];

const analyzer = makeAnalyzer(
  nodeDefinitions,
  rootAnalyzer.isRoot
);

/*
  Any expression on which you can chain more methods.

  //db.todos.filter()
  //db.todos.filter().filter()
  //db.todos.map().filter()
  //db.todos.map().slice()
  //db.todos.sort()
*/

export function analyzeCallExpression(path, state, config) {
  return analyzer(path, ["filter", "map", "slice", "sort"], state, config);
}


/*
  db.todos.filter().length
  or generally, a property accessor you attach at the end of a query chain.
  No more chanining is possible.
*/

export function analyzeMemberExpression(path, state, config) {
  return analyzer(path, ["root", "length"], state, config);
}


/*
  db.todos.filter(...)
*/

function getFilterArgs(path, state, config) {
  const fnExpr = path[0];
  assertUnaryArrowFunction(fnExpr);
  return fnExpr.get("body").node;
}


/*
  db.todos.map(...)
*/

function getMapArgs(path, state, config) {
  const fnExpr = path[0];

  assertUnaryArrowFunction(fnExpr);

  const body = fnExpr.get("body");

  if (!body.isObjectExpression()) {
    throw new Error("The map expression should return an object.");
  }

  const paramName = fnExpr.get("params")[0].get("name").node;
  for (const prop of body.get("properties")) {
    assertMemberExpressionUsesParameter(
      prop.get("value"),
      [paramName]
    );
  }

  return body
    .get("properties")
    .map(p => [
      p.node.key.name,
      p.node.value.property.name
    ]);
}


/*
  db.todos.filter(...).slice(...)
*/

function getSliceArgs(path, state, config) {
  return {
    from: path[0].node.value,
    to: path[1].node.value,
  };
}


/*
  db.todos.filter(...).sort((x, y) => x.f1 > y.f1)
  We only support utterly simple, single-field sorts.
  Can sort only by one column for now.

  Eventually, we can support multiple sort fields with
  db.todos.sort((x, y) => x.f1 > y.f1 || (x.f1 === y.f1 && x.f2 > y.f2))
*/

function getSortArgs(path, state, config) {
  const fnExpr = path[0];
  assertBinaryArrowFunction(fnExpr);

  const firstParam = path[0].get("params")[0].node.name;
  const secondParam = path[0].get("params")[1].node.name;

  const left = path[0].get("body").get("left");
  const right = path[0].get("body").get("right");

  const operator = path[0].get("body").get("operator").node;
  if (![">", ">=", "<", "<="].includes(operator)) {
    throw new Error("The sort function should use the greater than or less than operator.");
  }

  assertMemberExpressionUsesParameter(
    left,
    [firstParam, secondParam]
  );

  const leftField = left.get("property").node.name;
  const rightField = right.get("property").node.name;

  if (leftField !== rightField) {
    throw new Error("The sort expression should use the same field.")
  }

  const leftObject = left.get("object").node.name;
  const rightObject = right.get("object").node.name;

  const areBothParamsReferenced = [firstParam, secondParam].every(i => [leftObject, rightObject].includes(i));
  if (!areBothParamsReferenced) {
    throw new Error("The sort expression should reference both parameters in the arrow function.")
  }

  return [
    {
      field: leftField,
      ascending: (operator === ">" && firstParam === leftObject) || (operator === "<" && firstParam === rightObject)
    }
  ]
}
