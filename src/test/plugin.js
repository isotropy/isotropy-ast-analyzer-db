import analyzers from "../";

export default function(opts) {
  let _analysis, _analysisState;

  function analyze(fn, path, state) {
    const analysis = fn(path, state);
    path.skip();
    if (analysis !== undefined) {
      _analysis = analysis.value;
    }
  }

  const { meta, read, write } = analyzers();

  return {
    plugin: {
      visitor: {
        ImportDeclaration(path, state) {
          analyze(meta.analyzeImportDeclaration, path, state);
          path.skip;
        },

        AssignmentExpression(path, state) {
          analyze(write.analyzeAssignmentExpression, path, state);
        },

        MemberExpression(path, state) {
          analyze(read.analyzeMemberExpression, path, state);
        },

        CallExpression(path, state) {
          analyze(read.analyzeCallExpression, path, state);
        }
      }
    },
    getResult: () => {
      return { analysis: _analysis };
    }
  };
}
