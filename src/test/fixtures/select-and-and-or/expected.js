module.exports = {
  type: "query",
  method: "filter",
  predicate: {
    type: "logicalExpression",
    operator: "||",
    left: {
      type: "logicalExpression",
      operator: "&&",
      left: {
        type: "fieldExpression",
        operator: "===",
        field: "priority",
        comparandNode: {
          type: "StringLiteral",
          value: "normal"
        }
      },
      right: {
        type: "fieldExpression",
        operator: "===",
        field: "assignee",
        comparandNode: {
          type: "Identifier",
          name: "who"
        }
      }
    },
    right: {
      type: "fieldExpression",
      operator: "===",
      field: "priority",
      comparandNode: {
        type: "StringLiteral",
        value: "normal"
      }
    }
  },
  source: {
    type: "query",
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
