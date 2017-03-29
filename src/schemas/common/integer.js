import { capture, any, traverse } from "chimpanzee";

function negativeInteger(key) {
  return traverse(
    {
      type: "UnaryExpression",
      operator: "-",
      argument: {
        type: "NumericLiteral",
        value: capture("val")
      }
    },
    {
      builders: [{ get: (_, { state }) => ({ [key]: -state.val }) }]
    }
  );
}

function positiveInteger(key) {
  return traverse({
    type: "NumericLiteral",
    value: capture(key)
  });
}

export default function integer(key) {
  return any([negativeInteger(key), positiveInteger(key)], { replace: true });
}
