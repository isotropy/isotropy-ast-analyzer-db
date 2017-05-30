import {
  capture,
  any,
  array,
  optionalItem,
  literal,
  repeatingItem,
  Match,
  Skip
} from "chimpanzee";

import { map } from "../db-statements";
import { source } from "../utils";
import { collection, slice } from "./";
import composite from "../utils/composite";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection, slice])(state, analysisState)
      },
      arguments: array(
        [
          {
            type: "ArrowFunctionExpression",
            params: [
              {
                type: "Identifier",
                name: "todo"
              }
            ],
            body: {
              type: "ObjectExpression",
              properties: array(
                [
                  repeatingItem({
                    type: "ObjectProperty",
                    key: {
                      type: "Identifier",
                      name: capture("newField")
                    },
                    value: {
                      type: "MemberExpression",
                      object: {
                        type: "Identifier",
                        name: "todo"
                      },
                      property: {
                        type: "Identifier",
                        name: capture("field")
                      }
                    }
                  })
                ],
                { key: "items" }
              )
            }
          }
        ],
        { key: "fields" }
      )
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? map(result.value.object, { fields: result.value.fields[0].items })
          : result
    }
  );
}
