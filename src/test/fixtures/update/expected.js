module.exports = {
  type: "update",
  predicate: {
    type: 'BinaryExpression',
    left: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'todo'
      },
      property: {
        type: 'Identifier',
        name: 'assignee'
      }
    },
    operator: '===',
    right: {
      type: 'Identifier',
      name: 'assignee'
    }
  },
  fields: [
    {
      "type": "SpreadProperty",
      "argument": {
        "type": "Identifier",
        "name": "todo"
      }
    },
    {
      "type": "ObjectProperty",
      "method": false,
      "key": {
        "type": "Identifier",
        "name": "assignee"
      },
      "value": {
        "type": "Identifier",
        "name": "newAssignee"
      }
    }
  ],
  source: {
    type: "query",
    db: "db",
    collection: "todos"
  }
}
