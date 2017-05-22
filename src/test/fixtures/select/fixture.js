async function getTodos(who) {
  return db.todos.filter(todo => todo.assignee === who && (todo.priority > 2 || todo.immediate) && todo.new);
}
