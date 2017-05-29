import myDb from "../my-db";

async function getTodos(who) {
  return myDb.todos.sort((x, y) => x.assignee - y.assignee).slice(10, 20);
}
