module.exports = {
  type: "insert",
  items: {
    type: "ObjectExpression",
    properties: [
      {
        type: "ObjectProperty",
        method: false,
        key: {
          "type": "Identifier",
          "name": "title"
        },
        value: {
          type: "Identifier",
          name: "title"
        }
      },
      {
        type: "ObjectProperty",
        method: false,
        key: {
          type: "Identifier",
          name: "assignee"
        },
        value: {
          type: "Identifier",
          name: "assignee"
        }
      }
    ]
  },
  source: {
    type: "query",
    db: "db",
    collection: "todos"
  }
}
