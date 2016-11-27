/* @flow */
import * as dbReads from "./db-reads";
import * as dbWrites from "./db-writes";

function parse(path, parsers) {
  for (const parser of parsers) {
    const result = parser(path);
    if (result) {
      return path.replaceWith(result.path);
    }
  }
  path.skip();
}


export default function () {
  return {
    visitor: {

      //Writes will be an ExpressionStatement.
      //  eg (delete): db.todos = db.todos.filter(todo => todo !== db.todos.find(todo => todo.assignee == assignee && todo.title === title))

      //Reads can be assignments as well
      //  eg: foo.bar = db.todos.filter(...)

      ExpressionStatement(path) {
        parse(path, [dbWrites.parseAssignment]);
      },

      //These will always be reads.
      //MemberExpressions under db writes would have been handled in ExpressionStatement

      MemberExpression(path) {
        parse(path, [dbReads.parsePostQueryables])
      },

      //These will always be reads.
      //CallExpressions under db writes would have been handled in ExpressionStatement

      CallExpression(path) {
        parse(path, [dbReads.parseQueryables]);
      }

    }
  }
}
