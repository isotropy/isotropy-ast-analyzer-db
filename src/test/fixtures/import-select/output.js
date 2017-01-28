import mongodb from "isotropy-mongodb-server";

const todosDb = mongodb("todosDatabase", {
  todos: []
});

async function countTodos(who) {
  return todosDb.todos.filter(todo => todo.assignee === who).length;
}
