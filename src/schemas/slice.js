import { source } from "../chimpanzee-utils";
import { collection, map, sort } from "./";
import { capture, array, map as mapResult, optionalItem, Match } from "chimpanzee";
import { slice } from "../db-statements";
import composite from "../chimpanzee-utils/composite";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection, map, sort])(state, analysisState),
        property: {
          type: "Identifier",
          name: "slice"
        }
      },
      arguments: array(
        [
          mapResult(
            {
              type: "NumericLiteral",
              value: capture()
            },
            s => s.value
          ),
          optionalItem(
            mapResult(
              {
                type: "NumericLiteral",
                value: capture()
              },
              s => s.value
            )
          )
        ],
        { key: "args" }
      )
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? slice(result.value.object, {
              from: result.value.args[0],
              to: result.value.args[1]
            })
          : result
    }
  );
}
