import mongodb from "isotropy-mongodb-client";

const todosDb = mongodb("todosDb", {
  todos: [],
});

async function countTodos(who) {
  return todosDb.todos.filter(todo => todo.assignee === who).length;
}
