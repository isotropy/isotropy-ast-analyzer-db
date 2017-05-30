import { collection } from "./";
import { capture, any, Match } from "chimpanzee";
import { length } from "../db-statements";
import composite from "../utils/composite";

export default function(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: any([collection].map(fn => fn(state, analysisState)), { selector: "path" }),
      property: {
        type: "Identifier",
        name: "length"
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match ? length(result.value.object) : result
    }
  );
}
