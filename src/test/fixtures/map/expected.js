module.exports = {
  type: "query",
  operation: "map",
  fields: [
    {
      field: "assignee",
      newField: "owner"
    },
    {
      field: "createdAt",
      newField: "timestamp"
    }
  ],
  source: {
    type: "query",
    module: "mongodb://localhost:27017/isotropy-test-db",
    identifier: "myDb",
    collection: "todos"
  }
};
