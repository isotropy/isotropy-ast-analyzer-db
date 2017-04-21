import { traverse, any } from "chimpanzee";

export default function(schemas) {
  return (state, config) =>
    traverse(
      (obj, context, keys, parents, parentKeys) =>
        any(schemas.map(fn => fn(state, config))).fn(
          obj,
          context,
          keys,
          parents,
          parentKeys
        ),
      {
        defer: true,
        selector: "path",
        key: "query"
      }
    );
}
