import { traverse } from "chimpanzee";

export default function(schema) {
  return (obj, context, key, parents, parentKeys) =>
    return () => traverse(schema).fn(obj, context, key, parents, parentKeys)
}
