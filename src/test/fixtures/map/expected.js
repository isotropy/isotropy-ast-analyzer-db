module.exports = {
  type: "query",
  method: "map",
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
    module: "todosDbModule",
    identifier: "myDb",
    collection: "todos"
  }
}
