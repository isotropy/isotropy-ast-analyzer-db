function assertQuery(query) {
  if (query.type !== "query") {
    throw new Error("Assertion failed: method was invoked on a non-query.")
  }
}

export function create(name) {
  return { type: "query", name, filters: [] }
}

export function filter(query, filter) {
  assertQuery(query);
  return { ...query, filters: query.filters.concat(filter) }
}

export function map(query, fields) {
  assertQuery(query);
  return { type: "query", source: query, fields }
}

export function slice(query, slice) {
  assertQuery(query);
  return { ...query, slice }
}

export function sort(query, sort) {
  assertQuery(query);
  return { ...query, sort }
}

export function length(query) {
  return { type: "length", source: query }
}
