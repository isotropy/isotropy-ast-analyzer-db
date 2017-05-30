export function createCollection(args) {
  const { module, identifier, collection } = args;
  return { type: "query", module, identifier, collection };
}

export function createQuery(name, props, source) {
  return { type: "query", method: name, ...props, source };
}

export function createValue(name, props, source) {
  return { type: "value", property: name, ...props, source };
}

export function createModification(name, props, source) {
  return { type: name, ...props, source };
}

export function filter(command, args) {
  const { predicate } = args;
  return createQuery("filter", { predicate }, command);
}

export function map(command, args) {
  const { fields } = args;
  return createQuery("map", { fields }, command);
}

export function slice(command, args) {
  const { from, to } = args;
  return createQuery(
    "slice",
    typeof to !== "undefined" ? { from, to } : { from },
    command
  );
}

export function sort(command, args) {
  const { fields } = args;
  return createQuery("sort", { fields }, command);
}

export function length(command) {
  return createValue("length", {}, command);
}

export function insert(command, args) {
  const { items } = args;
  return createModification("insert", { items }, command);
}

export function update(command, args) {
  const { fields, predicate } = args;
  return createModification("update", { fields, predicate }, command);
}

export function remove(command, args) {
  const { predicate } = args;
  return createModification("remove", { predicate }, command);
}
