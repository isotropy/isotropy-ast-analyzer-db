import { collection } from "./";
import { capture, composite, any } from "chimpanzee";
import { length } from "../db-statements";

export default function(state, config) {
  return composite(
    {
      type: "MemberExpression",
      object: any([collection].map(fn => fn(state, config))),
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
      build: obj => context => result => console.log("NXT1", result) || length(result)
    }
  );
}
