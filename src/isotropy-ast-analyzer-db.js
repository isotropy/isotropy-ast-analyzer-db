  /* @flow */

import * as analyzers from "./analyzers";
import * as builtInTransformers from "./transformers";
import * as babylon from "babylon";
import * as t from "babel-types";
import template from "babel-template";

function ensureValidConfiguration(config) {
  if (!config.identifiers && !(config.clientPackageName || config.serverPackageName)) {
    throw new Error("Either a db identifier, or both clientPackageName and serverPackageName has to be set in configuration.");
  }
}


export default function(transformers, config) {
  let state = {
    importsAdded: []
  };

  function transformPath(path, analyze, transform, config) {
    const analysis = analyze(path, state, config);
    if (analysis) {
      const program = path.findParent(path => path.isProgram());
      if (config.identifiers && !state.importsAdded.includes(program)) {
        const importAST = template(`import __mongodb from "isotropy-mongodb-server";`, { sourceType: "module" })();
        program.unshiftContainer('body', importAST);
        state.importsAdded.push(program);
      }
      path.skip();
      transform(path, analysis, state, config);
    }
  }

  return {
    pre(state) {
      this.config = this.opts ? { ...config, ...this.opts } : config;
      ensureValidConfiguration(this.config);
    },
    visitor: {
      ImportDeclaration(path, state) {
        transformPath(path, analyzers.meta.analyzeImportDeclaration, builtInTransformers.meta.transformImportDeclaration, this.config);
      },

      //Writes will be an ExpressionStatement.
      //  eg (delete): db.todos = db.todos.filter(todo => todo !== db.todos.find(todo => todo.assignee == assignee && todo.title === title))

      //Reads can be assignments as well
      //  eg: foo.bar = db.todos.filter(...)

      AssignmentExpression(path) {
        transformPath(path, analyzers.write.analyzeAssignmentExpression, transformers.write.transformAssignmentExpression, this.config);
      },

      //Db ops which masquerade as properties
      //  eg: db.todos.length
      MemberExpression(path) {
        transformPath(path, analyzers.read.analyzeMemberExpression, transformers.read.transformMemberExpression, this.config);
      },

      //The most common type of db operations
      // eg: db.todos.filter(t => t.assignee === "me")
      CallExpression(path) {
        transformPath(path, analyzers.read.analyzeCallExpression, transformers.read.transformCallExpression, this.config);
      }

    }
  }
}
