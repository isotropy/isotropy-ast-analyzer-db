import { source } from "../utils";
import { collection, map } from "./";
import {
  parse,
  capture,
  composite,
  any,
  array,
  map as mapResult,
  optionalItem
} from "chimpanzee";
import { slice } from "../db-statements";

export default function(state, config) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection, map])(state, config),
        // object: any(
        //   [collection, map].map(fn => (obj, key, p, pk) => context =>
        //     parse(fn(state, config))(obj, key, p, pk)(context)),
        //   { selector: "path" }
        // ),
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
        slice(result.value.object, {
          from: result.value.args[0],
          to: result.value.args[1]
        })
    }
  );
}
