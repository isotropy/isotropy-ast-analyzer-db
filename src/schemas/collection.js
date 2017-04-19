import { capture, composite } from "chimpanzee";
import { createCollection } from "../db-statements";
import { root } from "./";

export default function(state, config) {
  return composite(
    {
      type: "MemberExpression",
      object: {
        type: "Identifier",
        name: root(state, config)({ key: "root", selector: "path" })
      },
      property: {
        type: "Identifier",
        name: capture("collection")
      }
    },
    [
      { name: "default", modifiers: { object: path => path.node } },
      { name: "path", modifiers: { property: (path, key) => path.get(key) } }
    ],
    {
      builders: [
        {
          get: (obj, { state: { collection, root } }) =>
            createCollection({
              identifier: root.identifier,
              db: root.db,
              collection: collection
            })
        }
      ]
    }
  );
}
