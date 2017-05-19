import { parse, any, builtins as b } from "chimpanzee";

/*
  Defers eval of schema until we need it.
  This is necessary to avoid infinite recursion;
  schemas might contain schemas which contain themselves.
*/
export default function(schemas) {
  const defer = schema => (state, config) => (obj, key, parents, parentKeys) => context =>
    parse(schema(state, config))(obj, key, parents, parentKeys)(context);

  return (state, config) =>
    any(schemas.map(schema => defer(schema)(state, config)), { selector: "path" });
}
