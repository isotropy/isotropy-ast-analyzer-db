import R from "ramda";
import {
  builtins as $,
  capture,
  composite,
  any,
  array,
  optionalItem,
  literal,
  Match,
  Skip
} from "chimpanzee";

import { source } from "../utils";
import { collection, select, slice } from "./";
import integer from "./common/integer";
import { sort } from "../db-statements";

const operators = any([">", "<", ">=", "<=", "==="].map(i => literal(i)));

/*
async function getTodos(who) {
  return db.todos
    .sort(
      (x, y) => x.assignee > y.assignee ? 1 : x.assignee === y.assignee ? 0 : -1
    );
}
*/
function getSortExpression1({
  lhsProp1,
  rhsProp1,
  operator1,
  val1,
  lhsProp2,
  rhsProp2,
  operator2,
  val2,
  val3
}) {
  return (
    /*
      Variants of (a,b) => a.total > b.total ? 1 : a.total < b.total ? -1 : 0;
      Terminology:
        1   Swap
        0   Same
       -1   Keep
    */
    lhsProp1 === rhsProp1 && lhsProp1 === lhsProp2 && lhsProp1 === rhsProp2
      ? R.difference([1, 0, -1], [val1, val2, val3]).length === []
          ? (() => {
              const indexOf = what => [val1, val2, val3].findIndex(what);
              const operatorOf = what => [operator1, operator2][indexOf(what)];

              const [indexSwap, indexSame, indexKeep] = [1, 0, -1].map(indexOf);
              const [opSwap, opSame, opKeep] = [1, 0, -1].map(operatorOf);

              return indexSame === 2 || opSame === "==="
                ? (() => {
                    //1 is either val1 or val2
                    return indexSwap < 2
                      ? (() => {
                          return [">", ">="].includes(opSwap)
                            ? ["<", "<="].includes(opSwap) || indexKeep === 2
                                ? { field: lhsProp1, ascending: true }
                                : new Skip(
                                    "The operator in the comparison returning -1 should always be the opposite of the operator which reutrns 1."
                                  )
                            : ["<", "<="].includes(opSwap)
                                ? [">", ">="].includes(opSwap) || indexKeep === 2
                                    ? { field: lhsProp1, ascending: false }
                                    : new Skip(
                                        "The operator in the comparison returning -1 should always be the opposite of the operator which reutrns 1."
                                      )
                                : new Skip("Incorrect sort expression.");
                        })()
                      : //1 is val3, right-most.
                        [">", ">="].includes(opKeep)
                          ? { field: lhsProp1, ascending: false }
                          : ["<", "<="].includes(opKeep)
                              ? { field: lhsProp1, ascending: true }
                              : new Skip("Incorrect sort expression.");
                  })()
                : new Skip(
                    "The operator in the comparison returning 0 should always be '==='."
                  );
            })()
          : new Skip(
              "The sort expression is incorrect. Should return 1, 0 and -1 according to JS specifications."
            )
      : new Skip("All fields in the sort expression must be the same.")
  );
}

const compareFn1 = $.obj(
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
    build: obj => context => result =>
      console.log("::::", result) ||
      result instanceof Match ? getSortExpression1(result.value) : result
  }
);

/*
async function getTodos(who) {
  // Ascending
  return db.todos
    .sort(
      (x, y) => x.assignee - y.assignee
    );

  // Descending
  return db.todos
    .sort(
      (x, y) => y.assignee - x.assignee
      );

  //well, we also support
  // Ascending
  return db.todos
    .sort(
      (x, y) => -(x.assignee - y.assignee)
    );

  // Descending
  return db.todos
    .sort(
      (x, y) => -(y.assignee - x.assignee)
      );
}
*/
const sortExpression2Ascending = {
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
};

const sortExpression2Descending = {
  type: "UnaryExpression",
  operator: capture("operator"),
  argument: sortExpression2Ascending
};

function getSortExpression2({
  param1,
  param2,
  lhsObject,
  lhsProp,
  rhsObject,
  rhsProp,
  operator
}) {
  const getSortOrder = negated =>
    (!negated && param1 === lhsObject) || (negated && param1 === rhsObject);
  return [param1, param2].every(p => [lhsObject, rhsObject].includes(p))
    ? lhsProp === rhsProp
        ? { field: lhsProp, ascending: getSortOrder(operator === "-") }
        : new Skip(`The sort expression must reference the same property on compared objects.`)
    : new Skip(`The sort expression must reference parameters ${param1} and ${param2}.`);
}

const compareFn2 = $.obj(
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
    body: any([sortExpression2Ascending, sortExpression2Descending])
  },
  {
    build: obj => context => result =>
      result instanceof Match
        ? getSortExpression2({
            param1: result.value.params[0].name,
            param2: result.value.params[1].name,
            ...result.value.body
          })
        : result
  }
);

export default function(state, config) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection])(state, config),
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
      build: obj => context => result =>
        result instanceof Match
          ? sort(result.value.object, { fields: result.value.arguments })
          : result
    }
  );
}
