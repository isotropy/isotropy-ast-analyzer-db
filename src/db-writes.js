import * as expressions from "./parser-expressions";
import * as queryable from "./queryable";
import { assertArrowFunction, assertMethodIsNotInTree, assertMemberExpressionUsesParameter,
  assertUnaryArrowFunction, assertBinaryArrowFunction } from "./ast-asserts";

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


function parseInsert(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "concat" ?
    expressions.any(
      [() => parseCollection(path.get("callee").get("object"), config)],
      collection => ({ type: "insert", collection, items: path.get("arguments.0").node })
    ) :
    undefined;
}


function parseUpdate(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "map" ?
    expressions.any(
      [() => parseCollection(path.get("callee").get("object"), config)],
      collection => ({ type: "update", collection, args: getUpdateArgs(path.get("arguments"), config) }),
    ) :
    undefined;
}


function getUpdateArgs(path) {
  const fnExpr = path[0];
  assertUnaryArrowFunction(fnExpr, "PARSER_DB_UPDATE_ARG_SHOULD_BE_AN_ARROW_FUNCTION_WITH_ONE_PARAM")

  const body = fnExpr.get("body");
  if (body.isConditionalExpression()) {
    const firstParam = fnExpr.get("params")[0].node.name;

    const consequent = body.get("consequent");
    const alternate = body.get("alternate");

    //In the ternary expression, the consequent (1st item) should be the updated item, and alternate should be the unmodified item
    // eg: db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } /* consequent */ : todo /* alternate */)
    // The consequent should be an ObjectExpression and the spread must be the first property of the consequent.
    if (!consequent.isObjectExpression()) {
      throw new Error(
        "PARSER_DB_UPDATE_CONSEQUENT_SHOULD_BE_AN_OBJECT_EXPRESSION",
        `In the ternary expression, the consequent (1st item) should be an ObjectExpression.`
      )
    }

    if (!consequent.get("properties.0").isSpreadProperty()) {
      throw new Error(
        "PARSER_DB_UPDATE_CONSEQUENT_OBJECT_EXPRESSION_SHOULD_BEGIN_WITH_SPREAD_PROPERTY",
        `In the ternary expression, the consequent should be an ObjectExpression and the spread must be the first property of the consequent.`
      );
    }

    if (!alternate.isIdentifier() || alternate.get("name").node !== firstParam) {
      throw new Error(
        "PARSER_DB_UPDATE_SHOULD_RETURN_UNMODIFIED_AS_ALTERNATE",
        `In the ternary expression, the consequent (1st item) should be the updated item, and alternate (2nd item) should be the unmodified item.`
      );
    }
    return body.get("test");

  } else {
    throw new Error(
      "PARSER_DB_UPDATE_SHOULD_BE_A_CONDITONAL_EXPRESSION",
      `The update() method must use a conditional expression. Found ${body.node.type} instead.`
    );
  }

}

function parseDelete(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "filter" ?
    expressions.any(
      [() => parseCollection(path.get("callee").get("object"), config)],
      collection => ({ type: "delete", collection, args: getDeleteArgs(path.get("arguments"), config) }),
    ) :
    undefined;
}


function getDeleteArgs(path, config) {
  const fnExpr = path[0];
  assertUnaryArrowFunction(fnExpr, "PARSER_DB_DELETE_ARG_SHOULD_BE_AN_ARROW_FUNCTION_WITH_ONE_PARAM")

  const body = fnExpr.get("body");
  //The filter expression should negate the predicate that identifies the item to be deleted.
  // eg: db.todos = db.todos.filter(todo => !(todo.assignee === assignee && todo.title === title))
  if (body.isUnaryExpression() && body.get("operator").node === "!") {
    return body.get("argument");
  } else {
    throw new Error(
      "PARSER_DB_DELETE_SHOULD_NEGATE_PREDICATE",
      `The filter expression should negate the predicate that identifies the item to be deleted.`
    );
  }
}


export function parseAssignment(path, config, then) {
  return path.isAssignmentExpression() && isCollection(path.get("left"), config) ?
    expressions.any(
      [
        () => parseInsert(path.get("right"), config),
        () => parseUpdate(path.get("right"), config),
        () => parseDelete(path.get("right"), config),
      ],
      then
    ) :
    undefined;
}
