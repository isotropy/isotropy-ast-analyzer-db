Order by a specific field
```javascript
async function getTodos(who) {
  return db.todos
    .filter(todo => todo.assignee === who)
    .sort((x, y) => x.assignee > y.assignee);
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
        "name": "sort"
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
            "name": "x"
          },
          "1": {
            "type": "Identifier",
            "name": "y"
          }
        },
        "body": {
          "type": "BinaryExpression",
          "left": {
            "type": "MemberExpression",
            "object": {
              "type": "Identifier",
              "name": "x"
            },
            "property": {
              "type": "Identifier",
              "name": "assignee"
            }
          },
          "operator": ">",
          "right": {
            "type": "MemberExpression",
            "object": {
              "type": "Identifier",
              "name": "y"
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
```
