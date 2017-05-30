module.exports = {
  type: "query",
  method: "sort",
  fields: [
    {
      field: "assignee",
      ascending: true
    }
  ],
  source: {
    type: "query",
    method: "filter",
    predicate: {
      type: "binaryFieldExpression",
      operator: "===",
      field: "assignee",
      comparandNode: {
        type: "Identifier",
        name: "who"
      }
    },
    source: {
      type: "query",
      module: "todosDbModule",
      identifier: "myDb",
      collection: "todos"
    }
  }
}
