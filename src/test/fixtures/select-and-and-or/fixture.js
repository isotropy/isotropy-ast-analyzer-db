async function getTodos(isAssigned) {
  return db.todos.filter(todo => todo.priority === "normal" && todo.assignee === who || todo.priority === "high");
}
