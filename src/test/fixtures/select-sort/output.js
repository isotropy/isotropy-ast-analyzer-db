import __mongodb from "isotropy-mongodb-server";
async function getTodos(who) {
  return db.todos.filter(todo => todo.assignee === who).sort((x, y) => x.assignee > y.assignee);
}
