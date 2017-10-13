/*
  todo.assignee === who && (todo.priority > 2 || todo.immediate) && todo.new
  
  {
    $and: [
      { assignee: who },
      { $or: [{ priority: { $gt: 2 } }, { immediate: true }] },
      { new: true }
    ];
  }
*/
module.exports = {
  type: "query",
  operation: "filter",
  predicate: {
    operator: "$and",
    left: {
      operator: "$and",
      left: {
        operator: "$eq",
        field: "assignee",
        valueNode: {
          type: "Identifier",
          name: "who"
        }
      },
      right: {
        operator: "$or",
        left: {
          operator: "$gt",
          field: "priority",
          valueNode: {
            type: "NumericLiteral",
            value: 2
          }
        },
        right: {
          operator: "$eq",
          field: "immediate",
          valueNode: { type: "BooleanLiteral", value: true }
        }
      }
    },
    right: {
      operator: "$eq",
      field: "new",
      valueNode: { type: "BooleanLiteral", value: true }
    }
  },
  source: {
    type: "query",
    module: "mongodb://localhost:27017/isotropy-test-db",
    identifier: "myDb",
    collection: "todos"
  }
};
