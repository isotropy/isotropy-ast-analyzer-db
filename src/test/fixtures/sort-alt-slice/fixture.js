import myDb from "../my-db";

async function getTodos(who) {
  return myDb.todos
    .sort((x, y) => x.priority - y.priority)
    .slice(10, 20);
}
