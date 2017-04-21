import {
  capture,
  composite,
  any,
  array,
  optionalItem,
  literal,
  traverse,
  repeatingItem,
  Match,
  Skip
} from "chimpanzee";

import { map } from "../db-statements";
import { defer, print } from "../chimpanzee-tools";
import { collection, slice } from "./";

export default function(state, config) {
  return composite(
    {
      //type: "CallExpression",
      type: capture(),
      callee: {
        type: "MemberExpression",
        object: defer([collection, slice])(state, config)
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
    [
      { name: "default", modifiers: { object: path => path.node } },
      {
        name: "path",
        modifiers: {
          property: (path, key) => path.get(key)
        }
      }
    ],
    {
      builders: [
        {
          get: (obj, { state }) =>
            map(state.query, { fields: state.fields[0].items })
        }
      ]
    }
  );
}
