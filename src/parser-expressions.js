/*
  Returns an array of results of all of them are not undefined.
*/

export function all(expressions, then) {
  const results = [];

  for (const expr of expressions) {
    const result = expr();
    if (typeof result !== "undefined") {
      results.push(result);
    } else {
      return then && then();
    }
  }

  return then ? then(results) : results;
}


/*
  Returns result if not undefined.
*/

export function single(expression, then) {
  const result = expression();
  return then && then(result);
}


/*
  Returns the first result that is not undefined.
*/

export function any(expressions, then) {
  for (const expr of expressions) {
    const result = expr();
    if (typeof result !== "undefined") {
      return then ? then(result) : result;
    }
  }

  return then && then();
}
