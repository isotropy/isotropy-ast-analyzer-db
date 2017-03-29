import collection from "./collection";
import { capture, composite, any } from "chimpanzee";
import { length } from "../db-statements";

export default function(state, config) {
  return composite(
    {
      type: "MemberExpression",
      object: any(
        [collection /* , select(), sort(),  */].map(fn => fn(state, config)),
        { selector: "path", key: "query" }
      ),
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
