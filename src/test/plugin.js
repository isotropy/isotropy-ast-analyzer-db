import parserDb from "../";

function transformPath(path, query) {
  return query;
}

export default parserDb(transformPath, { identifier: "db" });
