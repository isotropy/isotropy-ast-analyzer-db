import parserDb from "../";

export default function(subType) {
  let _query;

  const transformers = {
    read: {
      transformCallExpression(path, query) {
        _query = query;
      },
      transformMemberExpression(path, query) {
        _query = query;
      }
    },
    write: {
      transformAssignmentExpression(path, query) {
        _query = query;
      }
    }
  }

  return {
    plugin: parserDb(
      transformers, subType === "simple" ?
        { identifiers: ["db"] } :
        { clientPackageName: 'isotropy-mongodb-client' }
      ),
    getResult: () => {
      return _query;
    }
  }
}
