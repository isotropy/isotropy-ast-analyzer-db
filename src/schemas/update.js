export default function() {
  return mutation({
    method: "map",
    arguments: {
      "0": {
        type: "ArrowFunctionExpression",
        id: {},
        generator: false,
        expression: true,
        async: false,
        params: {
          "0": {
            type: "Identifier",
            name: "todo"
          }
        },
        body: {
          type: "ConditionalExpression",
          test: {
            type: "BinaryExpression",
            left: {
              type: "MemberExpression",
              object: {
                type: "Identifier",
                name: "todo"
              },
              property: {
                type: "Identifier",
                name: "assignee"
              }
            },
            operator: "===",
            right: {
              type: "Identifier",
              name: "assignee"
            }
          },
          consequent: {
            type: "ObjectExpression",
            properties: {
              "0": {
                type: "SpreadProperty",
                argument: {
                  type: "Identifier",
                  name: "todo"
                }
              },
              "1": {
                type: "ObjectProperty",
                method: false,
                key: {
                  type: "Identifier",
                  name: "assignee"
                },
                value: {
                  type: "Identifier",
                  name: "newAssignee"
                }
              }
            }
          },
          alternate: {
            type: "Identifier",
            name: "todo"
          }
        }
      }
    }
  });
}
