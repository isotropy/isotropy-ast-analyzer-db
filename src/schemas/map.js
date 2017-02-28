export default function() {
  return {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": any[root(), select(), slice()],
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
