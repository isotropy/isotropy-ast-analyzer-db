import myDb from "my-db";

async function getTodos(isAssigned) {
  return myDb.todos.filter(
    todo => (todo.priority === "normal" && todo.assignee === who) || todo.priority === "high"
  );
}
