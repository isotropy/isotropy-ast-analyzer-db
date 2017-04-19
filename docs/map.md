```javascript
async function getTodos(who) {
  return db.todos.map(todo => ({ owner: todo.assignee, timestamp: todo.createdAt }));
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
                "name": "owner"
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
            },
            "1": {
              "type": "ObjectProperty",
              "method": false,
              "key": {
                "type": "Identifier",
                "name": "timestamp"
              },
              "value": {
                "type": "MemberExpression",
                "object": {
                  "type": "Identifier",
                  "name": "todo"
                },
                "property": {
                  "type": "Identifier",
                  "name": "createdAt"
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
