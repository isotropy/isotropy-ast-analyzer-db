Order by a specific field
```javascript
async function getTodos(who) {
  return db.todos
    .sort(
      (x, y) => x.assignee > y.assignee ? 1 : x.assignee === y.assignee ? 0 : 1
    );
}

```

```javascript
a = {
  type: "ReturnStatement",
  argument: {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "db" },
        property: { type: "Identifier", name: "todos" }
      },
      property: { type: "Identifier", name: "sort" }
    },
    arguments: {
      "0": {
        type: "ArrowFunctionExpression",
        id: {},
        generator: false,
        expression: true,
        async: false,
        params: {
          "0": { type: "Identifier", name: "x" },
          "1": { type: "Identifier", name: "y" }
        },
        body: {
          type: "ConditionalExpression",
          test: {
            type: "BinaryExpression",
            left: {
              type: "MemberExpression",
              object: { type: "Identifier", name: "x" },
              property: {
                type: "Identifier",
                name: "assignee"
              }
            },
            operator: ">",
            right: {
              type: "MemberExpression",
              object: { type: "Identifier", name: "y" },
              property: {
                type: "Identifier",
                name: "assignee"
              }
            }
          },
          consequent: { type: "NumericLiteral", value: 1 },
          alternate: {
            type: "ConditionalExpression",
            test: {
              type: "BinaryExpression",
              left: {
                type: "MemberExpression",
                object: { type: "Identifier", name: "x" },
                property: {
                  type: "Identifier",
                  name: "assignee"
                }
              },
              operator: "===",
              right: {
                type: "MemberExpression",
                object: { type: "Identifier", name: "y" },
                property: {
                  type: "Identifier",
                  name: "assignee"
                }
              }
            },
            consequent: {
              type: "NumericLiteral",
              value: 0
            },
            alternate: { type: "NumericLiteral", value: 1 }
          }
        }
      }
    }
  }
}
```
