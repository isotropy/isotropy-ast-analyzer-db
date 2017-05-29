import myDb from "my-db";

async function getTodos(who) {
  return myDb.todos.sort((x, y) => -(y.priority - x.priority));
}
