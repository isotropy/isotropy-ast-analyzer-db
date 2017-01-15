import parserDb from "../";

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
    plugin: parserDb(
      transformers,
      opts.simple ?
        { identifiers: ["db"] } :
        { clientPackageName: 'isotropy-mongodb-client' }
      ),
    getResult: () => {
      return { analysis: _analysis, state: _state };
    }
  }
}
