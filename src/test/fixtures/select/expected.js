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
        field: "assignee",
        right: {
          type: "Identifier",
          name: "who"
        }
      },
      right: {
        operator: "$and",
        left: {
          operator: "$eq",
          field: "priority",
          right: {
            type: "NumericLiteral",
            value: 2
          }
        }
      }
    },
    right: {
      operator: "$eq",
      field: "new",
      right: {
        type: "BooleanLiteral",
        value: true
      }
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
