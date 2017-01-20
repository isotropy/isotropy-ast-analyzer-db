  /* @flow */

import * as analyzers from "./analyzers";
import * as builtInTransformers from "./transformers";


function assertValidConfiguration(config) {
  if (config.simple) {
    if (!client.identifier) {
      throw new Error("Simple configuration requires the config.identifier to be set.")
    } else {
      if (!config.clientPackageName) {
        throw new Error("config.clientPackageName is missing.");
      } else if (!config.serverPackageName) {
        throw new Error("config.serverPackageName is missing.");
      }
    }
  }
}

export default function(transformers, config) {
  assertValidConfiguration(config);

  let state = {};

  function transformPath(path, analyze, transform) {
    const analysis = analyze(path, state, config);
    if (analysis) {
      path.skip();
      transform(path, analysis, state, config);
    }
  }

  return {
    visitor: {
      ImportDeclaration(path) {
        transformPath(path, analyzers.meta.analyzeImportDeclaration, builtInTransformers.meta.transformImportDeclaration);
      },

      //Writes will be an ExpressionStatement.
      //  eg (delete): db.todos = db.todos.filter(todo => todo !== db.todos.find(todo => todo.assignee == assignee && todo.title === title))

      //Reads can be assignments as well
      //  eg: foo.bar = db.todos.filter(...)

      AssignmentExpression(path) {
        transformPath(path, analyzers.write.analyzeAssignmentExpression, transformers.write.transformAssignmentExpression);
      },

      //Db ops which masquerade as properties
      //  eg: db.todos.length
      MemberExpression(path) {
        transformPath(path, analyzers.read.analyzeMemberExpression, transformers.read.transformMemberExpression);
      },

      //The most common type of db operations
      // eg: db.todos.filter(t => t.assignee === "me")
      CallExpression(path) {
        transformPath(path, analyzers.read.analyzeCallExpression, transformers.read.transformCallExpression);
      }

    }
  }
}
