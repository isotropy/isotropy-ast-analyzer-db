  /* @flow */
import * as dbReads from "./db-reads";
//import * as dbWrites from "./db-writes";

/*

*/
export default function(fnRewriter, config) {

  function analyzeNodeType(path, analyzers) {
    function findResult(args) {
      if (args.length) {
        const [analyzer, ...rest] = args;
        return analyzer(path, config) || findResult(rest);
      }
    }

    const result = findResult(analyzers);
    if (result) {
      path.skip();
      fnRewriter(path, result);
    }
  }

  return {
    visitor: {

      //Writes will be an ExpressionStatement.
      //  eg (delete): db.todos = db.todos.filter(todo => todo !== db.todos.find(todo => todo.assignee == assignee && todo.title === title))

      //Reads can be assignments as well
      //  eg: foo.bar = db.todos.filter(...)

      // AssignmentExpression(path) {
      //   analyzeNodeType(path, [dbWrites.analyzeAssignmentExpression]);
      // },


      //These will always be reads.
      //MemberExpressions under db writes would have been handled in ExpressionStatement

      MemberExpression(path) {
        analyzeNodeType(path, [dbReads.analyzeMemberExpression])
      },

      //These will always be reads.
      //CallExpressions under db writes would have been handled in ExpressionStatement

      CallExpression(path) {
        analyzeNodeType(path, [dbReads.analyzeCallExpression]);
      }

    }
  }
}
