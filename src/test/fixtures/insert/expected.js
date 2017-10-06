module.exports = {
  type: "modification",
  operation: "insert",
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
    module: "mongodb://localhost:27017/isotropy-test-db",
    identifier: "myDb",
    collection: "todos"
  }
};
