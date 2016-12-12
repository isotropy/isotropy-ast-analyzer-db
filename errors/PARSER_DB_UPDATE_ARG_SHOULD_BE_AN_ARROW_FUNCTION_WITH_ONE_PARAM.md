Update argument must be an arrow function
=========================================

We can't handle regular functions yet. You must pass an arrow function with a single parameter.

The follow is valid.
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo)
}
```

The follow is NOT valid because the argument is a regular function.
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(function(todo) {
    return todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo;
  });
}
```
