module.exports = {
  type: "value",
  property: "length",
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
      db: "db",
      identifier: "db",
      collection: "todos"
    }
  }
}
