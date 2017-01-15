async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo)
}
