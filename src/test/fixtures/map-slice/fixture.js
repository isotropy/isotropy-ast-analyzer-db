async function getTodos(who) {
  return db.todos
    .map(todo => ({ owner: todo.assignee, timestamp: todo.createdAt }))
    .slice(10, 20);
}
