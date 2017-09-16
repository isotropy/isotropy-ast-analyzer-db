export function createCollection(args) {
  const { module, identifier, collection } = args;
  return { type: "query", module, identifier, collection };
}

export function createQuery(operation, props, source) {
  return { type: "query", operation, ...props, source };
}

export function createValue(operation, props, source) {
  return { type: "value", operation, ...props, source };
}

export function createModification(operation, props, source) {
  return { type: "modification", operation, ...props, source };
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

export function count(command) {
  return createValue("count", {}, command);
}

export function insert(command, args) {
  const { itemsNode } = args;
  return createModification("insert", { itemsNode }, command);
}

export function update(command, args) {
  const { fields, predicate } = args;
  return createModification("update", { fields, predicate }, command);
}

export function remove(command, args) {
  const { predicate } = args;
  return createModification("remove", { predicate }, command);
}
