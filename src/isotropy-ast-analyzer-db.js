  /* @flow */

import * as analyzers from "./analyzers";
import * as builtInTransformers from "./transformers";


function ensureValidConfiguration(config) {
  if (!config.identifiers && !(config.clientPackageName || config.serverPackageName)) {
    throw new Error("Either a db identifier, or both clientPackageName and serverPackageName has to be set in configuration.");
  }
}


export default function(transformers, config) {
  ensureValidConfiguration(config);

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
