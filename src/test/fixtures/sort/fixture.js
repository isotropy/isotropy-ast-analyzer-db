async function getTodos(who) {
  return db.todos.sort((x, y) => x.assignee > y.assignee);
}
