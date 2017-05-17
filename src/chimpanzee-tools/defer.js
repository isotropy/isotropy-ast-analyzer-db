import { builtins as $, any } from "chimpanzee";

export default function(schemas) {
  return (state, config) =>
    $.obj(
      (obj, context, keys, parents, parentKeys) =>
        any(schemas.map(fn => fn(state, config))).fn(obj, context, keys, parents, parentKeys),
      {
        selector: "path",
        key: "query"
      }
    );
}
