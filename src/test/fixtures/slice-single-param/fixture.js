import myDb from "../my-db";

async function getTodos(who) {
  return myDb.todos.slice(10);
}
