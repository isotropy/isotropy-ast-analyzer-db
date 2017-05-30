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
    module: "todosDbModule",
    identifier: "myDb",
    collection: "todos"
  }
}
