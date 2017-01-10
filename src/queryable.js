function assertQuery(query) {
  if (query.type !== "query") {
    throw new Error("Assertion failed: method was invoked on a non-query.")
  }
}

export function createQueryRoot(collection) {
  return { type: "query", collection };
}

export function createQuery(name, props, source) {
  return { type: "query", method: name, ...props, source };
}

export function createValue(name, props, source) {
  return { type: "value", name, ...props, source }
}

export function filter(query, predicate) {
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

export function count(query) {
  assertQuery(query);
  return createValue("length", {}, query);
}
