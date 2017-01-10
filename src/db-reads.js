import template from "babel-template";
import * as t from "babel-types";
import generate from "babel-generator";
import util from "util";
import * as expressions from "./parser-expressions";
import * as queryable from "./queryable";
import Error from "isotropy-error";
import { assertArrowFunction, assertMethodIsNotInTree, assertMemberExpressionUsesParameter,
  assertUnaryArrowFunction, assertBinaryArrowFunction } from "./ast-asserts";

/*
  The read visitor handles operations where we don't mutate the db collection.
  eg:
    selects, count, map etc.
*/

function parseCollection(path, config) {
  //db.todos...
  return path.isMemberExpression() && path.get("object").isIdentifier() && path.node.object.name === config.identifier ?
    queryable.createQueryRoot(path.node.property.name) :
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

export function parseQueryables(path, config, then) {
  return expressions.any(
    [
      () => parseCollection(path, config),
      () => parseFilter(path, config),
      () => parseMap(path, config),
      () => parseSlice(path, config),
      () => parseSort(path, config)
    ],
    then
  );
}


/*
  db.todos.filter().length
  or generally, a property accessor you attach at the end of a queryable chain.
  No more chanining is possible.
*/

export function parsePostQueryables(path, config, then) {
  return expressions.single(
    () => parseCount(path, config),
    then
  )
}

/*
  db.todos.filter(...)
*/
function parseFilter(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "filter" ?
    expressions.any(
      [
        () => parseCollection(path.get("callee").get("object"), config),
        () => parseFilter(path.get("callee").get("object"), config),
        () => parseSort(path.get("callee").get("object"), config),
      ],
      query => queryable.filter(query, getFilterArgs(path.get("arguments"), config)),
      [
        () => assertMethodIsNotInTree(
          path.parentPath,
          "map",
          "PARSER_DB_MAP_CANNOT_PRECEDE_FILTER",
          "A map() function must not precede the filter() function. Try reordering."
        ),
        () => assertMethodIsNotInTree(
          path.parentPath,
          "slice",
          "PARSER_DB_SLICE_CANNOT_PRECEDE_FILTER",
          "A slice() function must not precede the filter() function. Try reordering."
        ),
      ]
    ) :
    undefined;
}


function getFilterArgs(path, config) {
  const fnExpr = path[0];
  assertUnaryArrowFunction(fnExpr, "PARSER_DB_FILTER_ARG_SHOULD_BE_AN_ARROW_FUNCTION_WITH_ONE_PARAM");
  return fnExpr.get("body");
}


/*
  db.todos.map(...)
*/

function parseMap(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "map" ?
    expressions.any(
      [
        () => parseCollection(path.get("callee").get("object"), config),
        () => parseFilter(path.get("callee").get("object"), config),
        () => parseSort(path.get("callee").get("object"), config),
        () => parseSlice(path.get("callee").get("object"), config),
      ],
      query => queryable.map(query, getMapArgs(path.get("arguments"), config)),
      [
        () => assertMethodIsNotInTree(
          path.parentPath,
          "slice",
          `PARSER_DB_MULTIPLE_MAP_CALLS`,
          `A map() function must not be preceded by another map(). Try merging them.`
        ),
      ]
    ) :
    undefined;
}


function getMapArgs(path, config) {
  const fnExpr = path[0];

  assertUnaryArrowFunction(fnExpr, "PARSER_DB_MAP_ARG_SHOULD_BE_AN_ARROW_FUNCTION_WITH_ONE_PARAM");

  const body = fnExpr.get("body");
  if (!body.isObjectExpression()) {
    throw new Error("PARSER_DB_MAP_EXPRESSION_SHOULD_RETURN_AN_OBJECT", "The map expression should return an object.");
  }

  const paramName = fnExpr.get("params")[0].get("name");
  for (const prop in body.get("properties")) {
    assertMemberExpressionUsesParameter(
      prop.get("value"),
      [paramName],
      "PARSER_DB_MAP_EXPRESSION_SHOULD_REFERENCE_PARAMETER_FIELDS",
      "The map expression should return an object expression that references fields on the parameter."
    );
  }

  return body
    .get("properties")
    .map(p => [
      p.get("key").get("name"),
      p.get("value").get("property").get("name")
    ]);
}


/*
  db.todos.filter(...).slice(...)
*/

function parseSlice(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "slice" ?
    expressions.any(
      [
        () => parseCollection(path.get("callee").get("object"), config),
        () => parseFilter(path.get("callee").get("object"), config),
        () => parseSort(path.get("callee").get("object"), config),
        () => parseMap(path.get("callee").get("object"), config),
      ],
      query => queryable.slice(query, getSliceArgs(path.get("arguments"), config)),
      [
        () => assertMethodIsNotInTree(
          path.parentPath,
          "slice",
          "PARSER_DB_MULTIPLE_SLICE_CALLS",
          "A slice() function must not be preceded by another slice()."
        )
      ]
    ) :
    undefined;
}

function getSliceArgs(path, config) {
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

function parseSort(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "sort" ?
    expressions.any(
      [
        () => parseCollection(path.get("callee").get("object"), config),
        () => parseFilter(path.get("callee").get("object"), config),
      ],
      query => queryable.sort(query, getSortArgs(path.get("arguments"))),
      [
        () => assertMethodIsNotInTree(
          path.parentPath,
          "map",
          "PARSER_DB_MAP_CANNOT_PRECEDE_SORT",
          "A map() function must not precede the sort() function. Try reordering."
        ),
        () => assertMethodIsNotInTree(
          path.parentPath,
          "slice",
          "PARSER_DB_SLICE_CANNOT_PRECEDE_SORT",
          "A slice() function must not precede the sort() function. Try reordering."
        ),
      ]
    ) :
    undefined;
}


function getSortArgs(path, config) {
  const fnExpr = path[0];
  assertBinaryArrowFunction(fnExpr, "PARSER_DB_SORT_ARG_SHOULD_BE_AN_ARROW_FUNCTION_WITH_TWO_PARAMS");

  const firstParam = path[0].get("params")[0].node.name;
  const secondParam = path[0].get("params")[1].node.name;

  const left = path[0].get("body").get("left");
  const right = path[0].get("body").get("right");

  const operator = path[0].get("body").get("operator").node;
  if (![">", ">=", "<", "<="].includes(operator)) {
    throw new Error("PARSER_DB_SORT_OPERATOR_SHOULD_BE_GT_OR_LT", "The sort function should use the greater than or less than operator.");
  }

  assertMemberExpressionUsesParameter(
    left,
    [firstParam, secondParam],
    "PARSER_DB_SORT_EXPRESSION_SHOULD_BE_SIMPLE",
    "The sort expression should be a simple predicate comparing a single field (as of now)."
  );

  const leftField = left.get("property").node.name;
  const rightField = right.get("property").node.name;

  if (leftField !== rightField) {
    throw new Error("PARSER_DB_SORT_EXPRESSION_SHOULD_HAVE_THE_SAME_FIELD", "The sort expression should use the same field.")
  }

  const leftObject = left.get("object").node.name;
  const rightObject = right.get("object").node.name;

  const areBothParamsReferenced = [firstParam, secondParam].every(i => [leftObject, rightObject].includes(i));
  if (!areBothParamsReferenced) {
    throw new Error("PARSER_DB_SORT_EXPRESSION_SHOULD_REFERENCE_BOTH_PARAMETERS", "The sort expression should reference both parameters in the arrow function.")
  }

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

function parseCount(path, config) {
  return path.isMemberExpression() && path.get("property").isIdentifier() && path.node.property.name === "length" ?
    expressions.single(
      () => parseQueryables(path.get("object"), config),
      query => queryable.count(query)
    ) :
    undefined;
}
