Update consequent should be an object expression
================================================

The consequent expression in a ternary operation must be an object expression.
In the following valid example, it corresponds to { ...todo, assignee: newAssignee }.
Also note that the consequent should begin with the spread operator (...todo in the example).

The follow is valid.
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo)
}
```

The follow is NOT valid because the consequent is not an object expression.
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? someObj : todo)
}
```
