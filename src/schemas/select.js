import { parse, array, capture, wrap, builtins as $ } from "chimpanzee";
import { source } from "../chimpanzee-utils";
import { collection, map, sort } from "./";
import { filter } from "../db-statements";
import predicateSchema from "./common/predicate";
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
      arguments: [
        {
          type: "ArrowFunctionExpression",
          params: $.arr([capture()], { selector: "path" }),
          body: wrap(capture(), { selector: "path" })
        }
      ]
    },
    {
      build: obj => context => result => {
        const _params = result.value.arguments[0].params[0];
        const body = result.value.arguments[0].body;
        const wrappedPredicateSchema = $.func(predicateSchema(state, analysisState), {
          selector: "path"
        });
        const predicate = parse(wrappedPredicateSchema)(body)(context);
        console.log(predicate);
        return filter(result.value.object, {
          predicate
        });
      }
    },
    {
      path: { mergeArray: true }
    }
  );
}
