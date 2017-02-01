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
  getArrowFunctionBody } from "./arrow-function-helper";

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
  const fnPath = path[0];
  ensureUnaryArrowFunction(fnPath);

  return {
    predicate: createLogicalOrBinaryExpression(fnPath),
    path
  }
}


/*
  db.todos.map(...)
*/

function getMapArgs(path, state, config) {
  const fnPath = path[0];
  ensureUnaryArrowFunction(fnPath);
  const [paramBindings] = getParameterBindings(fnPath);

  const body = getArrowFunctionBody(fnPath);
  ensureObjectExpression(body);

  const paramName = fnPath.get("params")[0].get("name").node;
  const values = body.get("properties").map(p => p.get("value"));
  ensureExpressionsReferenceBindings(values, paramBindings)

  return {
    fields: body
      .get("properties")
      .map(p => [
        p.node.key.name,
        p.node.value.property.name
      ]),
    path
  }
}


/*
  db.todos.filter(...).slice(...)
*/

function getSliceArgs(path, state, config) {
  return {
    from: path[0].node.value,
    to: path[1].node.value,
    path
  };
}


function memberExpressionReferencesBindings(expr, bindings) {
  throw new Error("FIXME");
}


/*
  db.todos.filter(...).sort((x, y) => x.f1 > y.f1)
  We only support utterly simple, single-field sorts.
  Can sort only by one column for now.

  Eventually, we can support multiple sort fields with
  db.todos.sort((x, y) => x.f1 > y.f1 || (x.f1 === y.f1 && x.f2 > y.f2))
*/

function getSortArgs(path, state, config) {
  const fnPath = path[0];
  ensureBinaryArrowFunction(fnPath);
  const [param1Bindings, param2Bindings] = getParameterBindings(fnPath);

  const body = getArrowFunctionBody(fnPath);
  ensureBinaryExpression(body);
  ensureBinaryExpressionOperators(body, ["<", ">"]);

  const left = body.get("left");
  const right = body.get("right");

  ensureExpressionsUniquelyReferenceAllBindings([left, right], [param1Bindings, param2Bindings])
  ensureMemberExpressionsReferenceSameProperty([left, right]);

  return {
    fields: [
      {
        field: leftField,
        ascending:
          (operator === ">" && memberExpressionReferencesBindings(left, param1Bindings)) ||
          (operator === "<" && memberExpressionReferencesBindings(right, param1Bindings)),
      }
    ],
    path
  }
}
