module.exports = {
  type: "query",
  method: "sort",
  fields: [
    {
      field: "priority",
      ascending: false
    }
  ],
  source: {
    type: "query",
    module: "todosDbModule",
    identifier: "myDb",
    collection: "todos"
  }
}
