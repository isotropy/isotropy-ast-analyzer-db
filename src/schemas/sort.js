export default function() {
  return {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": any[root(), select(), slice()],
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
            "name": capture("lhs1")
          },
          "1": {
            "type": "Identifier",
            "name": capture("lhs2")
          }
        },
        "body": {
          "type": "BinaryExpression",
          "left": {
            "type": "MemberExpression",
            "object": {
              "type": "Identifier",
              "name": capture("rhs1")
            },
            "property": {
              "type": "Identifier",
              "name": capture("field1")
            }
          },
          "operator": capture("operator"),
          "right": {
            "type": "MemberExpression",
            "object": {
              "type": "Identifier",
              "name": capture("rhs2")
            },
            "property": {
              "type": "Identifier",
              "name": capture("field2")
            }
          }
        }
      }
    }
  }
}
