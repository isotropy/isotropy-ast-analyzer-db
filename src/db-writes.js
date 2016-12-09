import * as expressions from "./parser-expressions";

/*
  The write visitor handles operations where we mutate the db collection.
  eg:
    inserts, updates, deletes etc.
*/

function isCollection(path, config) {
  //db.todos...
  return path.isMemberExpression() && path.get("object").isIdentifier() && path.node.object.name === config.identifier;
}


function parseInsert(path, config) {
  return path.isCallExpression() && path.node.callee.property.name === "concat" ?
    { type: "insert", items: path.get("arguments") } :
    undefined;
}


function parseUpdate(path, config) {
  if (path.isCallExpression() && path.node.callee.property.name === "map") {
    if (!path.get("body").isConditionalExpression()) {

    } else {
      throw new Error(
        "PARSER_DB_UPDATE_SHOULD_BE_A_CONDITONAL_EXPRESSION",
        `The update() method must use a conditional expression. Found ${path.get("body").node.type} instead.`
      );
    }

    const firstParam = path[0].get("params")[0].node.name;

    //In the ternary expression, the consequent (1st item) should be the updated item, and alternate should be the unmodified item
    // eg: db.todos = db.todos.map(todo => todo.assignee === assignee ? { assignee: newAssignee, ...todo } /* consequent */ : todo /* alternate */)
    // The spread operator must be in the consequent
    // Alternate must be an unmodified argument (just 'todo').
    if (true) { //TODO
      throw new Error(
        "PARSER_DB_UPDATE_SHOULD_RETURN_MODIFIED_AS_CONSEQUENT",
        `In the ternary expression, the consequent (1st item) should be the updated item, and alternate should be the unmodified item.`
      );
    }

    if (true) { //TODO
      throw new Error(
        "PARSER_DB_UPDATE_SHOULD_RETURN_UNMODIFIED_AS_ALTERNATE",
        `In the ternary expression, the consequent (1st item) should be the updated item, and alternate should be the unmodified item.`
      );
    }

  } else {
    return undefined;
  }
}


function parseDelete(path, config) {
  //The filter expression should negate the predicate that identifies the item to be deleted.
  // eg: db.todos = db.todos.filter(todo => !(todo.assignee === assignee && todo.title === title))
  if (true) { //TODO
    throw new Error(
      "PARSER_DB_DELETE_SHOULD_NEGATE_PREDICATE",
      `The filter expression should negate the predicate that identifies the item to be deleted.`
    );
  }

  return;
}


export function parseAssignment(path, config, then) {
  return path.isAssignmentExpression() && isCollection(path.get("left")) ?
    expression.any(
      [
        () => parseInsert(path.get("right"), config),
        () => parseDelete(path.get("right"), config),
        () => parseUpdate(path.get("right"), config),
      ],
      then
    ) :
    undefined;
}
