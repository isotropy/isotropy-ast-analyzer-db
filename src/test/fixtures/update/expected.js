module.exports = {
  type: "update",
  predicate: {
    type: "binaryFieldExpression",
    operator: "===",
    field: "assignee",
    comparandNode: {
      type: "Identifier",
      name: "who"
    }
  },
  fields: [
    {
      type: "ObjectProperty",
      method: false,
      field: "assignee",
      valueNode: {
        type: "Identifier",
        name: "newAssignee"
      }
    }
  ],
  source: {
    type: "query",
    module: "mongodb://localhost:27017/isotropy-test-db",
    identifier: "myDb",
    collection: "todos"
  }
}
