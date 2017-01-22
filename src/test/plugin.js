import analyzeAST from "../isotropy-ast-analyzer-db";

export default function(opts) {
  let _analysis;
  let _state;

  const transformers = {
    read: {
      transformCallExpression(path, analysis, state) {
        _analysis = analysis;
        _state = state;
      },
      transformMemberExpression(path, analysis, state) {
        _analysis = analysis;
        _state = state;
      }
    },
    write: {
      transformAssignmentExpression(path, analysis, state) {
        _analysis = analysis;
        _state = state;
      }
    }
  }

  return {
    plugin: analyzeAST(transformers, { clientPackageName: 'isotropy-mongodb-client', serverPackageName: 'isotropy-mongodb-server' }),
    getResult: () => {
      return { analysis: _analysis, state: _state };
    }
  }
}
