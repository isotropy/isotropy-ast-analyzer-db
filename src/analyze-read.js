import * as schemas from "./schemas";
import { Seq } from "lazily";
import { match, Match } from "chimpanzee";
import util from "util";
import { print } from "./tools/debug-util";

function makeAnalyzer(schemas, path, state, analysisState) {
  return (
    Seq.of(schemas)
      .map(schema => schema(state, analysisState))
      .map(schema => match(schema, path))
      //.map(x => console.log("\n------\n", util.inspect(x, { depth: 4 })) || print(x, "env.parents") || x)
      .first(x => x instanceof Match)
  );
}

export default function(analysisState) {
  return {
    /*
    Ending with a method call
      eg:
        myDb.todos.filter()
        myDb.todos.filter().filter()
        myDb.todos.map().filter()
        myDb.todos.map().slice()
        myDb.todos.sort()
    */
    analyzeCallExpression(path, state) {
      return makeAnalyzer([schemas.map, schemas.slice, schemas.sort, schemas.select], path, state, analysisState);
    },
    /*
      Ending with a member expression
      eg:
      myDb.todos
      myDb.todos.filter().length
    */
    analyzeMemberExpression(path, state) {
      return makeAnalyzer([schemas.count, schemas.collection], path, state, analysisState);
    }
  }
}
