import { collection } from "./";
import { capture, composite, any } from "chimpanzee";
import { length } from "../db-statements";
import defer from "../chimpanzee-tools/defer";

export default function(state, config) {
  return composite(
    {
      type: "MemberExpression",
      object: defer([collection]),
      property: {
        type: "Identifier",
        name: "length"
      }
    },
    [
      { modifiers: { object: path => path.node } },
      { name: "path", modifiers: { property: (path, key) => path.get(key) } }
    ],
    {
      builders: [{ get: (obj, { state: { query } }) => length(query) }]
    }
  );
}
