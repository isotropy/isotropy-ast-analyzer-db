Query a table
```javascript
async function getTodos(who) {
  return myDb.todos.filter(todo => todo.assignee === who);
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
  }
}
```
