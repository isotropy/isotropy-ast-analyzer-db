import mongodb from "isotropy-mongodb-client";

const todosDb = mongodb("todosDb", {
  todos: [],
});

async function updateTodo(assignee, newAssignee) {
  todosDb.todos = todosDb.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo)
}
