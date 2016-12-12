Map argument must be an arrow function
======================================

We can't handle regular functions yet. You must pass an arrow function with a single parameter.

The follow is valid.
```javascript
async function getTodos(who) {
  return db.todos.filter(t => t.assignee === who).map(t => ({ a: t.assignee }))
}
```

The follow is NOT valid because the argument is a regular function.
```javascript
async function getTodos(who) {
  return db.todos.filter(t => t.assignee === who).map(function(t) { return { a: t.assignee }; })
}
```
