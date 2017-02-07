import arrowFunction from "./arrow-function";

const select = traverse(
  {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      object: any([root, sort]),
      property: {
        type: "Identifier",
        name: "filter"
      }
    },
    arguments: {
      "0": arrowFunction({
        params: {
          "0": capture("param", {
            type: "Identifier",
            name: "x"
          })
        },
        body: logicalExpression("predicate") 
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

export default select;
