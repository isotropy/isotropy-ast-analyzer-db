import myDb from "my-db";

async function getTodos(who) {
  return myDb.todos.sort(
    (x, y) => (x.assignee > y.assignee ? -1 : x.assignee === y.assignee ? 0 : 1)
  );
}
