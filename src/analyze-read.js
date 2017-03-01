import { collection } from "./schemas";

/*
  Ending with a method call
  eg:
    db.todos.filter()
    db.todos.filter().filter()
    db.todos.map().filter()
    db.todos.map().slice()
    db.todos.sort()
*/

export function analyzeCallExpression(path, state, config) {
  return analyzer(path, ["filter", "map", "slice", "sort"], state, config);
}


/*
  Ending with a member expression
  eg:
    db.todos
    db.todos.filter().length
*/

export function analyzeMemberExpression(path, state, config) {
  return analyzer(path, ["root", "length"], state, config);
}
