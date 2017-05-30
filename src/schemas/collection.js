import { capture, composite, wrap, Match } from "chimpanzee";
import { createCollection } from "../db-statements";
import { root } from "./";

export default function(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: wrap(root(state, analysisState), { key: "root", selector: "path" }),
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
          ? createCollection({
              identifier: result.value.root.identifier,
              module: result.value.root.module,
              collection: result.value.collection
            })
          : result;
      }
    }
  );
}
