import myDb from "my-db";

async function updateTodo(assignee, newAssignee) {
  myDb.todos = myDb.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo)
}
