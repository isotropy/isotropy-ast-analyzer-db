import { collection, map } from "./";
import { capture, composite, any, array, optionalItem } from "chimpanzee";
import { slice } from "../db-statements";
import { defer } from "../chimpanzee-tools";

export default function(state, config) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: defer([collection])(state, config),
        property: {
          type: "Identifier",
          name: "slice"
        }
      },
      arguments: array(
        [
          {
            type: "NumericLiteral",
            value: capture("from")
          },
          optionalItem({
            type: "NumericLiteral",
            value: capture("to")
          })
        ],
        { key: "args" }
      )
    },
    [
      { name: "default", modifiers: { object: path => path.node } },
      { name: "path", modifiers: { property: (path, key) => path.get(key) } }
    ],
    {
      builders: [
        {
          get: (obj, { state }) =>
            slice(state.query, {
              from: state.args[0].from,
              to: state.args[1].to
            })
        }
      ]
    }
  );
}
