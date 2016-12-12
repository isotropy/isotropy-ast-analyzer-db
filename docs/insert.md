Perform a database insert
```javascript
//Insert a single item
async function addTodo(title, assignee) {
  db.todos = db.todos.concat({ title, assignee });
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
        "name": "db"
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
            "name": "db"
          },
          "property": {
            "type": "Identifier",
            "name": "todos"
          }
        },
        "property": {
          "type": "Identifier",
          "name": "concat"
        }
      },
      "arguments": {
        "0": {
          "type": "ObjectExpression",
          "properties": {
            "0": {
              "type": "ObjectProperty",
              "method": false,
              "key": {
                "type": "Identifier",
                "name": "title"
              },
              "value": {
                "type": "Identifier",
                "name": "title"
              }
            },
            "1": {
              "type": "ObjectProperty",
              "method": false,
              "key": {
                "type": "Identifier",
                "name": "assignee"
              },
              "value": {
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
```
