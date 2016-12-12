async function addTodo(title, assignee) {
  db.todos = db.todos.concat({ title, assignee });
}
