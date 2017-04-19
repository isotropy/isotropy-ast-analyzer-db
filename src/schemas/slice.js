import { collection, map, sort } from "./";
import { capture, composite, any, array, optionalItem } from "chimpanzee";
import { slice } from "../db-statements";
import wrap from "../chimpanzee-tools/wrap";

export default function(state, config) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: selectSchemaFrom([collection, map, sort])(state, config)({
          selector: "path",
          key: "query"
        }),
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
      { modifiers: { object: path => path.node } },
      { name: "path", modifiers: { property: (path, key) => path.get(key) } }
    ],
    {
      builders: [
        {
          get: (obj, { state: { query, args } }) =>
            slice(query, { from: args[0].from, to: args[1].to })
        }
      ]
    }
  );
}
