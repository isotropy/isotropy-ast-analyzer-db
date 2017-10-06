module.exports = {
  type: "query",
  from: 10,
  to: 20,
  operation: "slice",
  source: {
    type: "query",
    operation: "map",
    fields: [
      { newField: "owner", field: "assignee" },
      { newField: "timestamp", field: "createdAt" }
    ],
    source: {
      type: "query",
      module: "mongodb://localhost:27017/isotropy-test-db",
      identifier: "myDb",
      collection: "todos"
    }
  }
};
