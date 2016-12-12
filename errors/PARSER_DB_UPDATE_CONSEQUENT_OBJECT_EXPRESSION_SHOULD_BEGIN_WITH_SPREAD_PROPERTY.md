Update consequent should begin with the spread operator
=======================================================

The consequent expression in a ternary operation must be an object expression that begins with the spread operator.
In the following valid example, it corresponds to { ...todo, assignee: newAssignee }.
The spread operator is the "...todo" a the beginning of the object expression.

The follow is valid.
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo)
}
```

The follow is NOT valid because the consequent does not start with the spread operator.
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { field1: 1, ...todo } : todo)
}
```
