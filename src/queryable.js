export function create(name) {
  return { name };
}

export function filter(query, expr) {
  return query;
}

export function map(query, args) {
  return query;
}

export function slice(query, args) {
  return query;
}

export function sort(query, args) {
  return query;
}

export function length(query) {
  query.eof = true;
  query.op = "length";
}
