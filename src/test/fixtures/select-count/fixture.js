async function countTodos(who) {
  return db.todos.filter(todo => todo.assignee === who).length;
}
