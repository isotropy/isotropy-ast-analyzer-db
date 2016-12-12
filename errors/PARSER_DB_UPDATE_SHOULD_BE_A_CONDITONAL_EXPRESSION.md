A update() method should be a conditional expression
====================================================
Only conditional expressions are allowed inside the update method. The condition must be a simple boolean query.

The following is a valid example:
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo);
}
```

The follow is NOT valid
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo =>
    todo !== db.todos.find(x => x.who === assignee) ? { ...todo, assignee: newAssignee } : todo
  );
}
```
