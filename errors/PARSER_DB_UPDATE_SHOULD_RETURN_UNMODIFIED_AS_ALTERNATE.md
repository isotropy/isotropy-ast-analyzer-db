Update alternate should return unmodified item
==============================================
The ternary operation has two results which follow the test. (eg: isValid: result1 : result2).
The first result is called the consequent and the second is called alternate.

In an update, the alternate should return the unmodified item.
See example below.

The follow is valid.
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo)
}
```

The follow is NOT valid because the alternate is not the unmodified item.
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : { who: "me" })
}
```
