import { collection } from "./";
import { capture, composite, any } from "chimpanzee";
import { length } from "../db-statements";
import defer from "../chimpanzee-tools/defer";

export default function(state, config) {
  return composite(
    {
      type: "MemberExpression",
      object: defer([collection])(state, config),
      property: {
        type: "Identifier",
        name: "length"
      }
    },
    [
      { name: "default", modifiers: { object: path => path.node } },
      { name: "path", modifiers: { property: (path, key) => path.get(key) } }
    ],
    {
      builders: [{ get: (obj, { state }) => length(state.query) }]
    }
  );
}
