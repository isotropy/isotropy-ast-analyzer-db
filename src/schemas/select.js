import {
  parse,
  capture,
  composite,
  any,
  array,
  map as mapResult,
  optionalItem,
  Match
} from "chimpanzee";

import { source } from "../utils";
import { collection, map, sort } from "./";
import { filter } from "../db-statements";
import predicate from "./common/predicate";

export default function(state, config) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection])(state, config),
        property: {
          type: "Identifier",
          name: "filter"
        }
      },
      arguments: [
        predicate(state, config)
      ]
    },
    [
      { name: "default", modifiers: { object: path => path.node } },
      { name: "path", modifiers: { property: (path, key) => path.get(key) } }
    ],
    {
      build: obj => context => result =>
        result instanceof Match
          ? filter(result.value.object, {
              filter: predicate(
                result.value.arguments[0].body,
                result.value.arguments[0].params[0]
              )
            })
          : result
    }
  );
}
