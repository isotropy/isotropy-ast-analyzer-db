import Error from "isotropy-error";

/*
  Returns an array of results of all of them are not undefined.
*/

export function all(expressions, then, preconditions = []) {
  checkPreconditions(preconditions);

  const results = [];

  for (const expr of expressions) {
    const result = expr();
    if (typeof result !== "undefined") {
      results.push(result);
    } else {
      return undefined;
    }
  }

  return then ? then(results) : results;
}


/*
  Returns result if not undefined.
*/

export function single(expression, then, preconditions = []) {
  checkPreconditions(preconditions);

  const result = expression();
  return result ?
    then ? then(result) : result :
    undefined;
}


/*
  Returns the first result that is not undefined.
*/

export function any(expressions, then, preconditions = []) {
  checkPreconditions(preconditions);

  for (const expr of expressions) {
    const result = expr();
    if (typeof result !== "undefined") {
      return then ? then(result) : result;
    }
  }

  return undefined;
}

/*
  Check preconditions; they throw if there is an error.
*/
function checkPreconditions(preconditions) {
  if (preconditions && preconditions.length) {
    for (const precondition of preconditions) {
      precondition();
    }
  }
}
