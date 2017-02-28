export default function() {
  return {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": root(),
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
