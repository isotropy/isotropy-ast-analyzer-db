import { parse } from "chimpanzee";

export default function(schema, fn) {
  return (obj, key, parents, parentKeys) => context => {
    console.log(fn ? fn(obj) : obj);
    return parse(schema)(obj, key, parents, parentKeys)(context);
  };
}
