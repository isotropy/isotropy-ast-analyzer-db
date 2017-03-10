import collection from "./collection";
import {
  capture,
  composite,
  any,
  array,
  optionalItem,
  Match,
  Fault
} from "chimpanzee";
import { sort } from "../db-statements";

function createSort(query, args) {
  const { rhs1, rhs2, field1, field2, operator, params } = args;

  return ["<", ">", "<=", ">="].includes(operator)
    ? field1 === field2
        ? [rhs1, rhs2].every(rhs => params.find(p => p.name === rhs))
            ? new Match(
                sort(query, {
                  fields: [
                    {
                      field: field1,
                      ascending: (rhs1 === params[0].name &&
                        rhs2 === params[1].name &&
                        [">", ">="].includes(operator)) ||
                        (rhs1 === params[1].name &&
                          rhs2 === params[0].name &&
                          ["<", "<="].includes(operator))
                    }
                  ]
                })
              )
            : new Fault("Sort expression is invalid.")
        : new Fault("Sort expression should reference the same field.")
    : new Fault("Sort operator is invalid.");
}

export default function(state, config) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: any(
          [collection /* , select(), sort(),  */].map(fn => fn(state, config)),
          { selector: "path", key: "query" }
        ),
        property: {
          type: "Identifier",
          name: "sort"
        }
      },
      arguments: array(
        [
          {
            type: "ArrowFunctionExpression",
            id: {},
            generator: false,
            expression: true,
            async: false,
            params: [
              {
                type: "Identifier",
                name: capture("name")
              },
              {
                type: "Identifier",
                name: capture("name")
              }
            ],
            body: {
              type: "BinaryExpression",
              left: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: capture("rhs1")
                },
                property: {
                  type: "Identifier",
                  name: capture("field1")
                }
              },
              operator: capture("operator"),
              right: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: capture("rhs2")
                },
                property: {
                  type: "Identifier",
                  name: capture("field2")
                }
              }
            }
          }
        ],
        {
          key: "args",
          builders: [{ get: (obj, context) => console.log("......", context) }]
        }
      )
    },
    [
      { modifiers: { object: path => path.node } },
      { name: "path", modifiers: { property: (path, key) => path.get(key) } }
    ],
    {
      //builders: [{ get: (obj, context) => console.log(context.state.args[0]) }]
      builders: [
        { get: (obj, { state: { query, args } }) => createSort(query, args[0]) }
      ]
    }
  );
}
