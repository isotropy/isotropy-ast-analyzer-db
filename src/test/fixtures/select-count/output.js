import __mongodb from "isotropy-mongodb-server";
async function countTodos(who) {
  return db.todos.filter(todo => todo.assignee === who).length;
}
