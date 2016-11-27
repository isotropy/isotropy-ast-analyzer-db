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

function ensureSingleParam(path, errorCode) {
  if (path.length !== 1) {
    throw new Error(errorCode, `Function must have a single parameter. Found ${path.get("params").node.length} instead.`)
  }
}

/*
  db.todos.filter(...)
*/

function parseFilter(path) {
  return path.isCallExpression() && path.node.callee.property.name === "filter" ?
    expressions.single(
      () => parseQueryables(path.get("callee").get("object")),
      ([query]) => queryable.filter(query, getFilterParams(path.get("arguments")))
    ) :
    undefined;
}


function getFilterParams(path) {
  ensureSingleParam(path, "PARSER_DB_FILTER_PARAM_COUNT");
  const fnExpr = path[0];
  ensureArrowFunction(fnExpr, "PARSER_DB_FILTER_ARG_SHOULD_BE_ARROW_FUNCTION");
  return fnExpr.get("body");
}


/*
  db.todos.map(...)
*/

function parseMap(path) {
  return path.isCallExpression() && path.node.callee.property.name === "map" ?
    expressions.single(
      () => parseQueryables(path.get("callee").get("object")),
      ([query, mapping]) => queryable.map(query, parseMapParams(path.get("arguments")))
    ) :
    undefined;
}


function parseMapParams(path) {

}


/*
  db.todos.filter(...).slice(...)
*/

function parseSlice(path) {
  return path.isCallExpression() && path.node.callee.property.name === "slice" ?
    expressions.all(
      [
        () => parseQueryables(path.get("callee").get("object")),
        () => parseSliceParams(path.get("arguments"))
      ],
      ([query, slicing]) => queryable.slice(query, slicing)
    ) :
    undefined;
}

function parseSliceParams() {

}


/*
  db.todos.filter(...).sort(...)
*/

function parseSort(path) {
  return path.isCallExpression() && path.node.callee.property.name === "sort" ?
    expressions.all(
      [
        () => parseQueryables(path.get("callee").get("object")),
        () => parseSortParams(path.get("arguments"))
      ],
      ([query, sorting]) => queryable.sort(query, sorting)
    ) :
    undefined;
}


function parseSortParams(path) {

}


/*
  db.todos.filter(...).length
*/

function parseLength(path) {
  return path.isMemberExpression() && path.get("property").isIdentifier() && path.node.property.name === "length" ?
    parseQueryables(path.get("object"), query => queryable.length(query)) :
    undefined;
}
