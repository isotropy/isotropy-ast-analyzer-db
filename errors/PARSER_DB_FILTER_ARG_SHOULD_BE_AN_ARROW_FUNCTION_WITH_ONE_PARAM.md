Filter argument must be an arrow function
=========================================

We can't handle regular functions yet. You must pass an arrow function with a single parameter.

The follow is valid.
```javascript
async function getTodos(who) {
  return db.todos.filter(t => t.assignee === who);
}
```

The follow is NOT valid because the argument to filter is a regular function.
```javascript
async function getTodos(who) {
  return db.todos.filter(function(t) { return t.assignee === who; });
}
```
