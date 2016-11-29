async function getTodos() {
  let someVar = 1;
  const result = db.todos.filter(x => x.y > 10).sort((x, y) => x.assignee > y.assignee);
  someVar = 2;
  return result;
}
