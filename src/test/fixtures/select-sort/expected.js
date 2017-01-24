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
      "type": "BinaryExpression",
      "left": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": "todo"
        },
        "property": {
          "type": "Identifier",
          "name": "assignee"
        }
      },
      "operator": "===",
      "right": {
        "type": "Identifier",
        "name": "who"
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
