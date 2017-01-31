module.exports = {
  type: "remove",
  predicate: {
    type: "fieldExpression",
    operator: "===",
    field: "assignee",
    comparandNode: {
      type: "Identifier",
      name: "assignee"
    }
  },
  source: {
    type: "query",
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
