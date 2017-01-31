module.exports = {
  type: "update",
  predicate: {
    type: "fieldExpression",
    operator: "===",
    field: "assignee",
    comparandNode: {
      type: "Identifier",
      name: "who"
    }
  },
  fieldNodes: [
    {
      type: "ObjectProperty",
      method: false,
      key: {
        type: "Identifier",
        name: "assignee"
      },
      value: {
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
