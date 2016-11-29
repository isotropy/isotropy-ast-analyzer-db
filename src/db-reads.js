import template from "babel-template";
import * as t from "babel-types";
import generate from "babel-generator";
import util from "util";
import * as expressions from "./parser-expressions";
import * as queryable from "./queryable";
import Error from "isotropy-error";

/*
  The read visitor handles operations where we don't mutate the db collection.
  eg:
    selects, count, map etc.
*/

function parseCollection(path) {
  //db.todos...
  return path.isMemberExpression() && path.get("object").isIdentifier() && path.node.object.name === "db" ?
    queryable.create(path.node.property.name) :
    undefined;
}


/*
  Any expression on which you can chain more methods.

  //db.todos.filter()
  //db.todos.filter().filter()
  //db.todos.map().filter()
  //db.todos.map().slice()
  //db.todos.sort()
*/

export function parseQueryables(path, then) {
  return expressions.any(
    [
      () => parseCollection(path),
      () => parseFilter(path),
      () => parseMap(path),
      () => parseSlice(path),
      () => parseSort(path)
    ],
    then
  );
}


/*
  db.todos.filter().length
  or generally, a property accessor you attach at the end of a queryable chain.
  No more chanining is possible.
*/

export function parsePostQueryables(path, then) {
  return expressions.single(
    () => parseLength(path),
    then
  )
}

/*
  Must pass an arrow function.
*/

function ensureArrowFunction(path, errorCode) {
  if (!path.isArrowFunctionExpression()) {
    throw new Error(errorCode, `Must pass an arrow function. Found ${path.node.type} instead.`)
  }
}

/*
  Function must have a single parameter.
*/

function ensureFunctionHasOneArg(path, errorCode) {
  if (path.length !== 1) {
    throw new Error(errorCode, `Function must have a single parameter. Found ${path.get("params").node.length} instead.`)
  }
}


/*
  Function must have a two parameters.
*/

function ensureFunctionHasTwoArgs(path, errorCode) {
  if (path.length !== 2) {
    throw new Error(errorCode, `Function must have two parameters. Found ${path.get("params").node.length} instead.`)
  }
}


/*
  db.todos.filter(...)
*/

function parseFilter(path) {
  return path.isCallExpression() && path.node.callee.property.name === "filter" ?
    expressions.single(
      () => parseQueryables(path.get("callee").get("object")),
      query => queryable.filter(query, getFilterArgs(path.get("arguments")))
    ) :
    undefined;
}


function getFilterArgs(path) {
  const fnExpr = path[0];
  ensureArrowFunction(fnExpr, "PARSER_DB_FILTER_ARG_SHOULD_BE_ARROW_FUNCTION");
  return fnExpr.get("body").node;
}


/*
  db.todos.map(...)
*/

function parseMap(path) {
  return path.isCallExpression() && path.node.callee.property.name === "map" ?
    expressions.single(
      () => parseQueryables(path.get("callee").get("object")),
      query => queryable.map(query, getMapArgs(path.get("arguments")))
    ) :
    undefined;
}


function getMapArgs(path) {
  const fnExpr = path[0];
  ensureArrowFunction(fnExpr, "PARSER_DB_MAP_ARG_SHOULD_BE_ARROW_FUNCTION");
  return fnExpr.get("body").node;
}


/*
  db.todos.filter(...).slice(...)
*/

function parseSlice(path) {
  return path.isCallExpression() && path.node.callee.property.name === "slice" ?
    expressions.single(
      () => parseQueryables(path.get("callee").get("object")),
      query => queryable.slice(query, getSliceArgs(path.get("arguments")))
    ) :
    undefined;
}

function getSliceArgs(path) {
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

function parseSort(path) {
  return path.isCallExpression() && path.node.callee.property.name === "sort" ?
    expressions.single(
      () => parseQueryables(path.get("callee").get("object")),
      query => queryable.sort(query, getSortArgs(path.get("arguments")))
    ) :
    undefined;
}


function getSortArgs(path) {
  const fnExpr = path[0];
  ensureArrowFunction(fnExpr, "PARSER_DB_SORT_ARG_SHOULD_BE_ARROW_FUNCTION");
  const firstParam = path[0].get("params")[0].node.name;
  const secondParam = path[0].get("params")[1].node.name;
  const left = path[0].get("body").get("left");
  const right = path[0].get("body").get("right");

  const operator = path[0].get("body").get("operator").node;
  if (![">", ">=", "<", "<="].includes(operator)) {
    throw new Error("PARSER_DB_SORT_OPERATOR_SHOULD_BE_GT_OR_LT", "The sort function should use the greater than or less than operator.");
  }

  if (
    !left.isMemberExpression() ||
    !right.isMemberExpression() ||
    !left.get("object").isIdentifier() ||
    !right.get("object").isIdentifier() ||
    !left.get("property").isIdentifier() ||
    !right.get("property").isIdentifier()
  ) {
    throw new Error("PARSER_DB_SORT_EXPRESSION_SHOULD_BE_SIMPLE", "The sort function should use a simple expression.");
  }

  const leftField = left.get("property").node.name;
  const rightField = right.get("property").node.name;

  if (leftField !== rightField) {
    throw new Error("PARSER_DB_SORT_EXPRESSION_SHOULD_HAVE_THE_SAME_FIELD", "The sort expression should use the same field.")
  }

  const leftObject = left.get("object").node.name;
  const rightObject = right.get("object").node.name;

  return [
    {
      field: leftField,
      ascending: (operator === ">" && firstParam === leftObject) || (operator === "<" && firstParam === rightObject)
    }
  ]
}


/*
  db.todos.filter(...).length
*/

function parseLength(path) {
  return path.isMemberExpression() && path.get("property").isIdentifier() && path.node.property.name === "length" ?
    parseQueryables(path.get("object"), query => queryable.length(query)) :
    undefined;
}
