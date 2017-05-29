import myDb from "../my-db";

async function getTodos(who) {
  return myDb.todos
    .map(todo => ({ owner: todo.assignee, timestamp: todo.createdAt }))
    .slice(10, 20);
}
