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
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
