async function getTodos(who) {
  return db.todos.sort((x, y) => -(y.assignee - x.assignee));
}
