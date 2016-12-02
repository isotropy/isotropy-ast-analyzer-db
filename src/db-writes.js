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

    //...

  } else {
    return undefined;
  }
}


function parseDelete(path, config) {
  return
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
