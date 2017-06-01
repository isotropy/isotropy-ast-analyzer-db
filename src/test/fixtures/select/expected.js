//todo.assignee === who && (todo.priority > 2 || todo.immediate) && todo.new
module.exports = {
  type: "query",
  method: "filter",
  predicate: {
    operator: "$and",
    left: {
      operator: "$and",
      left: {
        operator: "$eq",
        left: "assignee",
        right: {
          type: "Identifier",
          name: "who"
        }
      },
      right: {
        operator: "$and",
        left: {
          operator: "eq",
          left: "priority",
          right: {
            type: "NumericLiteral",
            value: 2
          }
        }
      }
    },
    right: {
      operator: "eq",
      left: "new",
      right: true
    },
    operator: "===",
    field: "assignee",
    comparandNode: {
      type: "Identifier",
      name: "who"
    }
  },
  source: {
    type: "query",
    module: "todosDbModule",
    identifier: "myDb",
    collection: "todos"
  }
};
