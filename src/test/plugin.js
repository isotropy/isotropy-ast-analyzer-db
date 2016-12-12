import parserDb from "../";

function transformPath(path, query) {
  console.log(query);
  return query;
}

export default parserDb(transformPath, { identifier: "db" });
