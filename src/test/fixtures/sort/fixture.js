async function getTodos(who) {
  return db.todos.sort(
    (x, y) => x.assignee > y.assignee ? 1 : x.assignee === y.assignee ? 0 : -1
  );
}
