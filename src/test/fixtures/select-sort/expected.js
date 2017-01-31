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
}
