async function getTodos(who) {
  return db.todos
    .sort((x, y) => x.priority - y.priority)
    .slice(10, 20);
}
