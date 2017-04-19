import { traverse } from "chimpanzee";

export default function(schema, fn) {
  return (obj, context, key, parents, parentKeys) => {
    console.log(fn ? fn(obj) : obj);
    return traverse(schema).fn(obj, context, key, parents, parentKeys)
  }
}
