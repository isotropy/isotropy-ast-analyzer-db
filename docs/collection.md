Get all records
```javascript
async function getAllTodos(who) {
  return myDb.todos;
}
```

```json
{
  "type": "ReturnStatement",
  "argument": {
    "type": "MemberExpression",
    "object": {
      "type": "Identifier",
      "name": "myDb"
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
  const x = myDb.todos;
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
          "name": "myDb"
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
