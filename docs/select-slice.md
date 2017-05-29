Limit the number of results
```javascript
//Returns rows 10-20
async function getTodos(who) {
  return myDb.todos
    .filter(todo => todo.assignee === who)
    .slice(10, 20);
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
        "name": "slice"
      }
    },
    "arguments": {
      "0": {
        "type": "NumericLiteral",
        "value": 10
      },
      "1": {
        "type": "NumericLiteral",
        "value": 20
      }
    }
  }
}
```
