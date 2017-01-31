module.exports = {
  type: "insert",
  itemsNode: {
    type: "ObjectExpression",
    properties: [
      {
        type: "ObjectProperty",
        method: false,
        key: {
          type: "Identifier",
          name: "title"
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
    identifier: "db",
    collection: "todos"
  }
}
