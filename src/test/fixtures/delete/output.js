import __mongodb from "isotropy-mongodb-server";
async function deleteTodo(title, assignee) {
  db.todos = db.todos.filter(todo => !(todo.assignee === assignee && todo.title === title));
}
