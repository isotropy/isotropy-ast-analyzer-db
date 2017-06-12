import { source } from "../chimpanzee-utils";
import { collection } from "./";
import { capture, Match } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { insert } from "../db-statements";

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: source([collection])(state, analysisState),
      right: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: source([collection])(state, analysisState),
          property: {
            type: "Identifier",
            name: "concat"
          }
        },
        arguments: capture()
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? R.equals(result.value.left, result.value.object)
            ? insert(result.value.left, { itemsNode: result.value.arguments[0] })
            : new Skip(`The result of the concat() must be assigned to the same collection.`)
          : result
    }
  );
}
