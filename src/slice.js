import arrowFunction from "./arrow-function";

const slice = traverse({
  type: "CallExpression",
  callee: {
    type: "MemberExpression",
    object: any([root, select, sort, map]),
    property: {
      type: "Identifier",
      name: "slice"
    }
  },
  arguments: {
    "0": {
      type: "NumericLiteral",
      value: capture("from")
    },
    "1": {
      type: "NumericLiteral",
      value: capture("to")
    }
  }
});

export default slice;
