import { collection, map } from "./";
import { capture, composite, any, array, map as mapResult, optionalItem } from "chimpanzee";
import { slice } from "../db-statements";

export default function(state, config) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: any([collection, map].map(fn => fn(state, config))),
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
      builders: [
        {
          get: (obj, { state }) =>
            slice(state.query, {
              from: state.args[0],
              to: state.args[1]
            })
        }
      ]
    }
  );
}
