import { traverse, any } from "chimpanzee";

export default function(schemas) {
  return (state, config) =>
    traverse(any(schemas.map(fn => fn(state, config))), {
      defer: true,
      selector: "path",
      key: "query"
    });
}
