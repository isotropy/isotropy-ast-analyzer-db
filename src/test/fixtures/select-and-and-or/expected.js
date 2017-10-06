module.exports = {
  type: "query",
  operation: "filter",
  predicate: {
    type: "logicalExpression",
    operator: "||",
    left: {
      type: "logicalExpression",
      operator: "&&",
      left: {
        type: "binaryFieldExpression",
        operator: "===",
        field: "priority",
        comparandNode: {
          type: "StringLiteral",
          value: "normal"
        }
      },
      right: {
        type: "binaryFieldExpression",
        operator: "===",
        field: "assignee",
        comparandNode: {
          type: "Identifier",
          name: "who"
        }
      }
    },
    right: {
      type: "binaryFieldExpression",
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
    module: "mongodb://localhost:27017/isotropy-test-db",
    identifier: "myDb",
    collection: "todos"
  }
}
