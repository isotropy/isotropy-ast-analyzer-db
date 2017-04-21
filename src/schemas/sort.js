import integer from "./common/integer";
import { collection, select, slice } from "./";
import defer from "../chimpanzee-tools/defer";
import R from "ramda";

import {
  capture,
  composite,
  any,
  array,
  optionalItem,
  literal,
  traverse,
  Match,
  Skip
} from "chimpanzee";

import { sort } from "../db-statements";

const operators = any([">", "<", ">=", "<=", "==="].map(i => literal(i)));


function validateCompareFn1({ lhsProp1, rhsProp1, operator1, val1, lhsProp2, rhsProp2, operator2, val2, val3 }) {
  return lhsProp1 === rhsProp1 && lhsProp1 === lhsProp2 && lhsProp1 === rhsProp2
    ? R.difference([">", "<", ">=", "<=", "==="], [operator1, operator2]).length === 3
      ?
      : new Skip("Invalid sort expression.")
    : new Skip("All fields in the sort expression must be the same.")
}

/*
async function getTodos(who) {
  return db.todos
    .sort(
      (x, y) => x.assignee > y.assignee ? 1 : x.assignee === y.assignee ? 0 : -1
    );
}
*/
const compareFn1 = traverse(
  {
    type: "ArrowFunctionExpression",
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
      type: "ConditionalExpression",
      test: {
        type: "BinaryExpression",
        left: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: capture("lhs1")
          },
          property: {
            type: "Identifier",
            name: capture("lhsProp1")
          }
        },
        operator: capture("operator1"),
        right: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: capture("rhs1")
          },
          property: {
            type: "Identifier",
            name: capture("rhsProp1")
          }
        }
      },
      consequent: integer("val1"),
      alternate: {
        type: "ConditionalExpression",
        test: {
          type: "BinaryExpression",
          left: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: capture("lhs2")
            },
            property: {
              type: "Identifier",
              name: capture("lhsProp2")
            }
          },
          operator: capture("operator2"),
          right: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: capture("rhs2")
            },
            property: {
              type: "Identifier",
              name: capture("rhsProp2")
            }
          }
        },
        consequent: integer("val2"),
        alternate: integer("val3")
      }
    }
  },
  {
    builders: [
      {
        get: (obj, { state }) => ({
          field: state.lhsProp1,
          ascending: ([">", ">="].includes(state.operator1) &&
            state.val1 === 1) ||
            ([">", ">="].includes(state.operator2) &&
              state.val2 === 1) ||
            (["<", "<="].includes(state.operator1) && state.val1 === -1)
        })
      }
    ]
  }
);

/*
async function getTodos(who) {
  return db.todos
    .sort(
      (x, y) => x.assignee - y.assignee
    );
}
*/
const compareFn2 = traverse(
  {
    type: "ArrowFunctionExpression",
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
          name: capture("lhsObject")
        },
        property: {
          type: "Identifier",
          name: capture("lhsProp")
        }
      },
      operator: "-",
      right: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: capture("rhsObject")
        },
        property: {
          type: "Identifier",
          name: capture("rhsProp")
        }
      }
    }
  },
  {
    builders: [
      {
        get(obj, { state }) {
          const { lhsObject, lhsProp, rhsObject, rhsProp, params } = state;
          return lhsProp === rhsProp
            ? [lhsObject, rhsObject].every(x =>
                [params[0].name, params[1].name].includes(x)
              )
                ? { field: lhsProp, ascending: params[0].name === lhsObject }
                : new Skip(
                    `Both ${params[0].name} and ${params[1].name} need to be used in the sort expression.`
                  )
            : new Skip(``);
        }
      }
    ]
  }
);

export default function(state, config) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: defer([collection]),
        property: {
          type: "Identifier",
          name: "sort"
        }
      },
      arguments: array([any([compareFn1, compareFn2])])
    },
    [
      { modifiers: { object: path => path.node } },
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
            sort(state.query, { fields: state.arguments })
        }
      ]
    }
  );
}
