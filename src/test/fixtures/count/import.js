import mongodb from "isotropy-mongoanalyze-client";

const db = mongodb("default", {
  todos: [],
  users: []
});

async function countTodos(who) {
  return db.todos.filter(todo => todo.assignee === who).length;
}
