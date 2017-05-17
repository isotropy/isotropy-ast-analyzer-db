import { builtins as $, capture, any } from "chimpanzee";

function negativeInteger(key) {
  return $.obj(
    {
      type: "UnaryExpression",
      operator: "-",
      argument: {
        type: "NumericLiteral",
        value: capture("val")
      }
    },
    {
      build: () => ({ state }) => ({ [key]: -state.val })
    }
  );
}

function positiveInteger(key) {
  return {
    type: "NumericLiteral",
    value: capture(key)
  };
}

export default function integer(key) {
  return any([negativeInteger(key), positiveInteger(key)], { replace: true });
}
