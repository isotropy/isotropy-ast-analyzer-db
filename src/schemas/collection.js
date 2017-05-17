import { capture, composite, Match } from "chimpanzee";
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
      {
        name: "default",
        modifiers: {
          object: path => path.node
        }
      },
      {
        name: "path",
        modifiers: {
          property: (path, key) => path.get(key)
        }
      }
    ],
    {
      build: obj => context => result => {
        return result instanceof Match
          ? new Match(
              createCollection({
                identifier: result.value.root.identifier,
                db: result.value.root.db,
                collection: result.value.collection
              })
            )
          : result;
      }
    }
  );
}
