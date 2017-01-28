async function getTodos(who) {
  return db.todos.map(todo => ({ mainAssignee: todo.assignee }));
}
