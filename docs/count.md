Count the number of items
```javascript
async function countTodos(who) {
  return myDb.todos.filter(todo => todo.assignee === who).length;
}
```

```json
{
  "type": "ReturnStatement",
  "argument": {
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
      "name": "length"
    }
  }
}
```
