import { composite } from "chimpanzee";

export default function(schema, params, paramListModifiers = {}) {
  return composite(
    schema,
    [
      {
        name: "default",
        modifiers: { object: path => path.node },
        ...(paramListModifiers.default ? paramListModifiers.default : {})
      },
      {
        name: "path",
        modifiers: { property: (path, key) => path.get(key) },
        ...(paramListModifiers.path ? paramListModifiers.path : {})
      }
    ],
    params
  );
}
