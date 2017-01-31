module.exports = {
  type: "update",
  predicate: {
    type: 'fieldExpression',
    operator: '===',
    field: "assignee",
    comparandNode: {
      type: 'Identifier',
      name: 'assignee'
    }
  },
  fields: [
    {
      name: "assignee",
      valueNode: {
        type: "Identifier",
        name: "newAssignee"
      }
    }
  ],
  source: {
    type: "query",
    db: "todosDatabase",
    identifier: "todosDb",
    collection: "todos"
  }
}
