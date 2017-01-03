Get all records
```javascript
async function getAllTodos(who) {
  return db.todos;
}
```

```json
{
  "type": "ReturnStatement",
  "argument": {
    "type": "MemberExpression",
    "object": {
      "type": "Identifier",
      "name": "db"
    },
    "property": {
      "type": "Identifier",
      "name": "todos"
    }
  }
}
```

```javascript
async function getAllTodos(who) {
  const x = db.todos;
}
```

```json
{
  "type": "VariableDeclaration",
  "declarations": {
    "0": {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "x"
      },
      "init": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": "db"
        },
        "property": {
          "type": "Identifier",
          "name": "todos"
        }
      }
    }
  },
  "kind": "const"
}
```
