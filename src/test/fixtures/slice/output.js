import __mongodb from "isotropy-mongodb-server";
async function getTodos(who) {
  return db.todos.slice(10, 20);
}
