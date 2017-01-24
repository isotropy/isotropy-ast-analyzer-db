import mongodb from "isotropy-mongodb-client";

const todosDb = mongodb("todosDatabase", {
  todos: [],
});

async function countTodos(who) {
  return todosDb.todos.filter(todo => todo.assignee === who).length;
}
