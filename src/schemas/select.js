import { parse, array, capture, wrap, builtins as $ } from "chimpanzee";
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
      arguments: [{ type: "ArrowFunctionExpression", body: capture(), params: $.arr([capture()], { selector: "default" }) }]
      //arguments: capture()
      // arguments: [
      //   {
      //     type: "ArrowFunctionExpression",
      //     params: $.arr([capture()], { selector: "path" }),
      //     body: capture()
      //   }
      // ]
    },
    {
      build: obj => context => result => {
        console.log("RESS", result.value);
        throw new Error("---->")
        const _params = result.value.arguments[0].params[0];
        const _body = result.value.arguments[0].body;
        const bodySchema = $.func(predicate(state, analysisState), { selector: "path" })
        const body = parse(bodySchema)(_body)(context);
        console.log("-----");
        console.log(bodySchema)
        console.log(body)
        throw new Error("djdj")
        return filter(result.value.object, { predicate: result.value.arguments[0] }) 
      }        
    }
  );
}
