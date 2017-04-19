import * as schemas from "./schemas";
import { Seq } from "lazily";
import { match, Match } from "chimpanzee";
import util from "util";
import { print } from "./tools/debug-util";

function makeAnalyzer(schemas, path, state, config) {
  return (
    Seq.of(schemas)
      .map(schema => schema(state, config))
      .map(schema => match(schema, path))
      //.map(x => console.log("\n------\n", util.inspect(x, { depth: 4 })) || print(x, "env.parents") || x)
      //.map(x => print(x) || x)
      .first(x => x instanceof Match)
  );
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
export function analyzeCallExpression(path, state, config) {
  return makeAnalyzer(
    [schemas.map, schemas.slice],
    path,
    state,
    config
  );
}

/*
  Ending with a member expression
  eg:
    db.todos
    db.todos.filter().length
*/
export function analyzeMemberExpression(path, state, config) {
  return makeAnalyzer([schemas.count, schemas.collection], path, state, config);
}
