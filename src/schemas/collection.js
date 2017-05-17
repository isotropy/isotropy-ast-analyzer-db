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
          object: path => {
            debugger;
            return path.node;
          }
        }
      },
      {
        name: "path",
        modifiers: {
          property: (path, key) => {
            debugger;
            path.get(key);
          }
        }
      }
    ],
    {
      build: obj => context => result => {
        debugger;
        return result instanceof Match
          ? createCollection({
              identifier: root.identifier,
              db: root.db,
              collection
            })
          : result;
      }
    }
  );
}
