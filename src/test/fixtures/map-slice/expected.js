module.exports = {
  type: "query",
  from: 10,
  to: 20,
  method: "slice",
  source: {
    type: "query",
    method: "map",
    fields: [
      { newField: "owner", field: "assignee" },
      { newField: "timestamp", field: "createdAt" }
    ],
    source: { type: "query", module: "todosDbModule", identifier: "myDb", collection: "todos" }
  }
};
