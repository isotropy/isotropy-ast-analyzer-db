import * as expressions from "./parser-expressions";

/*
  The write visitor handles operations where we mutate the db collection.
  eg:
    inserts, updates, deletes etc.
*/

/*
  //Delete all todos associated with jeswin
  db.todos = db.todos.filter(x => x.name !== db.todos.find(x => x.who === "jeswin"))
*/

export function parseAssignment(path, then) {
  return expressions.any(
    [
      //() => parseLength(path)
    ],
    then
  )
}
