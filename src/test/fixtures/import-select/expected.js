module.exports = {
  type: "value",
  property: "length",
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
      },
    },
    source: {
      type: "query",
      db: "todosDatabase",
      identifier: "todosDb",
      collection: "todos"
    }
  }
}
