module.exports = {
  type: "query",
  method: "filter",
  predicate: {
    type: "fieldExpression",
    operator: "===",
    field: "assignee",
    comparandNode: {
      type: "Identifier",
      name: "who"
    }
  },
  source: {
    type: "query",
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
