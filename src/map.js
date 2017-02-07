import arrowFunction from "./arrow-function";

const map = traverse(
  {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": any([root, filter, sort]),
      "property": {
        "type": "Identifier",
        "name": "map"
      }
    },
    "arguments": {
      "0": arrowFunction({
        "params": {
          "0": {
            "type": "Identifier",
            "name": "todo"
          }
        },
        "body": {
          "type": "ObjectExpression",
          "properties": array("fields", {
            "type": "ObjectProperty",
            "method": false,
            "key": {
              "type": "Identifier",
              "name": capture("newField")
            },
            "value": {
              "type": "MemberExpression",
              "object": {
                "type": "Identifier",
                "name": "todo"
              },
              "property": {
                "type": "Identifier",
                "name": capture("originalField")
              }
            }
          })
        }
      })
    }
  }
);

export default map;
