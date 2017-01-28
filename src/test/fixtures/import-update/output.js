import mongodb from "isotropy-mongodb-server";

const todosDb = mongodb("todosDatabase", {
  todos: []
});

async function updateTodo(assignee, newAssignee) {
  todosDb.todos = todosDb.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo);
}
