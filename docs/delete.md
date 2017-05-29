Delete a record
```javascript
async function deleteTodo(title, assignee) {
  myDb.todos = myDb.todos.filter(todo => !(todo.assignee === assignee && todo.title === title))
}
```

```json
{
  "type": "ExpressionStatement",
  "expression": {
    "type": "AssignmentExpression",
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "myDb"
      },
      "property": {
        "type": "Identifier",
        "name": "todos"
      }
    },
    "right": {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": {
          "type": "MemberExpression",
          "object": {
            "type": "Identifier",
            "name": "myDb"
          },
          "property": {
            "type": "Identifier",
            "name": "todos"
          }
        },
        "property": {
          "type": "Identifier",
          "name": "filter"
        }
      },
      "arguments": {
        "0": {
          "type": "ArrowFunctionExpression",
          "id": {},
          "generator": false,
          "expression": true,
          "async": false,
          "params": {
            "0": {
              "type": "Identifier",
              "name": "todo"
            }
          },
          "body": {
            "type": "UnaryExpression",
            "operator": "!",
            "prefix": true,
            "argument": {
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
        }
      }
    }
  }
}
```
