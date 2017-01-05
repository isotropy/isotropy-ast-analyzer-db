function assertQuery(query) {
  if (query.type !== "query") {
    throw new Error("Assertion failed: method was invoked on a non-query.")
  }
}

export function createQuery(name, props, source) {
  return parent ?
    { type: "query", method: name, ...props, source } :
    { type: "query", collection: name };
}

export function createValue(name, props, source) {
  return { type: "value", name, ...props, source }
}

export function filter(query, filter) {
  assertQuery(query);
  return createQuery("filter", { predicate }, query);
}

export function map(query, fields) {
  assertQuery(query);
  return createQuery("map", { fields }, query);
}

export function slice(query, from, to) {
  assertQuery(query);
  return createQuery("slice", { from, to }, query);
}

export function sort(query, fields) {
  assertQuery(query);
  return createQuery("sort", { fields }, query);
}

export function length(query) {
  assertQuery(query);
  return createQuery("length", {}, query);
}
