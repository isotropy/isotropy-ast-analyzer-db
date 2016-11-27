Query and return specific fields
```javascript
async function getTodos(who) {
  return db.todos
    .filter(todo => todo.assignee === who)
    .map(todo => ({ assignee: todo.assignee }));
}
```

```json
{
  "type": "ReturnStatement",
  "argument": {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "object": {
            "type": "MemberExpression",
            "object": {
              "type": "Identifier",
              "name": "db"
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
            }
          }
        }
      },
      "property": {
        "type": "Identifier",
        "name": "map"
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
          "type": "ObjectExpression",
          "properties": {
            "0": {
              "type": "ObjectProperty",
              "method": false,
              "key": {
                "type": "Identifier",
                "name": "assignee"
              },
              "value": {
                "type": "MemberExpression",
                "object": {
                  "type": "Identifier",
                  "name": "todo"
                },
                "property": {
                  "type": "Identifier",
                  "name": "assignee"
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
