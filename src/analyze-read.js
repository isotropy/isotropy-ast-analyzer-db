import { collection, count } from "./schemas";
import { Seq } from "lazily";
import { match, Match } from "chimpanzee";

function getAnalyzer(schemas, path, state, config) {
  return Seq.of(schemas)
    .map(schema => match(schema(state, config), path))
    .first(x => x instanceof Match)
}

/*
  Ending with a method call
  eg:
    db.todos.filter()
    db.todos.filter().filter()
    db.todos.map().filter()
    db.todos.map().slice()
    db.todos.sort()
*/

// export function analyzeCallExpression(path, state, config) {
//   return analyzer([filter, map, slice, sort], path, state, config);
// }


/*
  Ending with a member expression
  eg:
    db.todos
    db.todos.filter().length
*/

export function analyzeMemberExpression(path, state, config) {
  return getAnalyzer([collection, count], path, state, config);
}
