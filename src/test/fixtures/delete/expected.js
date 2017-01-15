module.exports = {
  type: "delete",
  db: "db",
  collection: "todos",
  predicate: {
    "type": "LogicalExpression",
    "left": {
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
        "name": "assignee"
      }
    },
    "operator": "&&",
    "right": {
      "type": "BinaryExpression",
      "left": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": "todo"
        },
        "property": {
          "type": "Identifier",
          "name": "title"
        }
      },
      "operator": "===",
      "right": {
        "type": "Identifier",
        "name": "title"
      }
    }
  }
}
