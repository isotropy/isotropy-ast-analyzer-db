import parserDb from "../";

export default function() {
  let _query;

  function transformPath(path, query) {
    _query = query;
  }

  return {
    plugin: parserDb(transformPath, { identifier: "db" }),
    getResult: () => {
      return _query;
    }
  }
}
