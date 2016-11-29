export function create(name) {
  return [{ type: "root", name }];
}

export function filter(query, expression) {
  return query.concat({ type: "filter", expression });
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
