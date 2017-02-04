import arrowFunction from "./arrow-function";

const sort = traverse(
  {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: any([traverse(root), traverse(filter)]),
      property: {
        type: "Identifier",
        name: "sort"
      }
    },
    arguments: {
      "0": arrowFunction({
        params: capture("params", {
          "0": {
            type: "Identifier",
            name: "x"
          },
          "1": {
            "type": "Identifier",
            "name": "y"
          }
        }),
        body: traverse(
          {
            type: "BinaryExpression",
            left: {
              "type": "MemberExpression",
              "object": capture("leftParam", {
                "type": "Identifier",
              }),
              "property": {
                "type": "Identifier",
                "name": capture("leftField")
              }
            },
            operator: captureIf(i => [">", "<"].includes(i)),
            right: {
              "type": "MemberExpression",
              "object": capture("rightParam", {
                "type": "Identifier",
              }),
              "property": {
                "type": "Identifier",
                "name": capture("rightField")
              }
            }
          },
          {
            preconditions: [state => parent.params],
            asserts: [[state => state.leftField !== state.rightField, "Sort expression should reference the same property."]],
            result: state => ({
              fields: [
                {
                  field: state.leftField,
                  ascending:
                    (operator === ">" && checkBinding(state.leftParam, param1Bindings)) ||
                    (operator === "<" && checkBinding(state.rightParam, param1Bindings)),
                }
              ]
            })
          }
        ),
      },
      {
        asserts: [
          [
            state => {
              const bindings = state.map(p => path.scope.bindings[p.node.name]);
              bindings.some(t => true);
            },
            "Sort expression must uniquely reference all bindings"
          ]
        ]
      })
    }
  },
  {
    result: state => {}
  }
);

export default sort;
