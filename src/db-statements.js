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

export function filter(command, args) {
  const { predicate, path } = args;
  return createQuery("filter", { predicate, path }, command);
}

export function map(command, args) {
  const { fields, path } = args;
  return createQuery("map", { fields, path }, command);
}

export function slice(command, args) {
  const { from, to, path } = args;
  return createQuery("slice", { from, to, path }, command);
}

export function sort(command, args) {
  const { fields, path } = args;
  return createQuery("sort", { fields, path }, command);
}

export function length(command) {
  return createValue("length", {}, command);
}

export function insert(command, args) {
  const { items, path } = args;
  return createModification("insert", { items, path }, command)
}

export function update(command, args) {
  const { fields, predicate, path } = args;
  return createModification("update", { fields, predicate, path }, command)
}

export function remove(command, args) {
  const { predicate, path } = args;
  return createModification("remove", { predicate, path }, command)
}
