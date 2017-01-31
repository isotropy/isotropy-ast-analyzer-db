async function deleteTodos(assignee) {
  db.todos = db.todos.filter(todo => !(todo.assignee === assignee))
}
