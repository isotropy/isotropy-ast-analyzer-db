export function createCollection(args) {
  const { db, identifier, collection } = args;
  return { type: "query", db, identifier, collection };
}

export function createQuery(name, props, source) {
  return { type: "query", method: name, ...props, source };
}

export function createValue(name, props, source) {
  return { type: "value", property: name, ...props, source }
}

export function createModification(name, props, source) {
  return { type: name, ...props, source };
}

export function filter(command, predicate) {
  return createQuery("filter", { predicate }, command);
}

export function map(command, fields) {
  return createQuery("map", { fields }, command);
}

export function slice(command, args) {
  const { from, to } = args;
  return createQuery("slice", { from, to }, command);
}

export function sort(command, fields) {
  return createQuery("sort", { fields }, command);
}

export function length(command) {
  return createValue("length", {}, command);
}

export function insert(command, items) {
  return createModification("insert", { items }, command)
}

export function update(command, args) {
  const { fields, predicate } = args;
  return createModification("update", { fields, predicate }, command)
}

export function remove(command, predicate) {
  return createModification("remove", { predicate }, command)
}
