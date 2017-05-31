import {
  parse,
  capture,
  any,
  array,
  map as mapResult,
  optionalItem,
  Match,
  builtins as $
} from "chimpanzee";

import { source } from "../chimpanzee-utils";
import { collection, map, sort } from "./";
import { filter } from "../db-statements";
import predicate from "./common/predicate";
import composite from "../chimpanzee-utils/composite";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection])(state, analysisState),
        property: {
          type: "Identifier",
          name: "filter"
        }
      },
      arguments: $.arr([
        predicate(state, analysisState)
      ], { selector: "path" })
    },
    {
      build: () => () => result =>
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
