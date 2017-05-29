import { source } from "../utils";
import { collection, map, sort } from "./";
import {
  parse,
  capture,
  composite,
  any,
  array,
  map as mapResult,
  optionalItem,
  Match
} from "chimpanzee";
import { slice } from "../db-statements";

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
    [
      { name: "default", modifiers: { object: path => path.node } },
      { name: "path", modifiers: { property: (path, key) => path.get(key) } }
    ],
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
