export function print(obj, path) {
  path = typeof path === "string" ? path.split(".") : path;

  for (const frag of path) {
    if (typeof obj === "undefined") {
      console.log("undefined");
      return;
    }
    obj = obj[frag];
  }
  console.log(obj);
}
