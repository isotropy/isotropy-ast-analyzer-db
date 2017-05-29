import myDb from "my-db";

async function getTodos(who) {
  return myDb.todos
    .slice(10, 20)
    .map(todo => ({ owner: todo.assignee, timestamp: todo.createdAt }));
}
