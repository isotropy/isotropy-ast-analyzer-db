async function getTodos(who) {
  return db.todos
    .slice(10, 20)
    .map(todo => ({ owner: todo.assignee, timestamp: todo.createdAt }));
}
