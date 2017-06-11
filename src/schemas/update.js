import { source } from "../chimpanzee-utils";
import { collection } from "./";
import { capture, Match } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import R from "ramda";
import { update } from "../db-statements";

/*
  There are two types of update expressions.
    db.users = db.users.filter(x => x.id === 10 ? { ...x, active: true } : x)
      AND the converse
    db.users = db.users.filter(x => x.id !== 10`` ? x : { ...x, active: true })
*/
const updateExpression = $.obj(
  {
    type: "ArrowFunctionExpression",
    params: [
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
      consequent: capture(),
      alternate: capture()
    }
  },
  {
    build: obj => context => result =>
      result instanceof Match
        ? getSortExpression1({
            param1: result.value.params[0].name,
            param2: result.value.params[1].name,
            ...result.value
          })
        : result
  }
);

export default function(state, analysisState) {
  return composite(
    {
      type: "AssignmentExpression",
      operator: "=",
      left: source([collection])(state, analysisState),
      right: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          object: source([collection])(state, analysisState),
          property: {
            type: "Identifier",
            name: "map"
          }
        },
        arguments: updateExpression()
      }
    },
    {
      build: obj => context => result =>
        R.equals(result.value.left, result.value.object)
          ? (() => {
              return console.log(result) || Skip("NOPE!");
            })()
          : new Skip(`The result of the map() must be assigned to the same collection.`)
      // result instanceof Match ? insert(result.value.left, { itemsNode: result.value.arguments[0] }) : result
    }
  );
}
