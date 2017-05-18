import { collection } from "./";
import { capture, composite, any, Match } from "chimpanzee";
import { length } from "../db-statements";

export default function(state, config) {
  return composite(
    {
      type: "MemberExpression",
      object: any([collection].map(fn => fn(state, config)), { selector: "path" }),
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
      build: obj => context => result => result instanceof Match ? length(result.value.object) : result
    }
  );
}
