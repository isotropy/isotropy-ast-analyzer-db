Sort argument must be an arrow function
=======================================

We can't handle regular functions yet. You must pass an arrow function which takes two parameters.

The follow is valid.
```javascript
async function getTodos(who) {
  return db.todos.sort((x, y) => x.assignee > y.assignee);
}
```

The follow is NOT valid because the argument to filter is a regular function.
```javascript
async function getTodos(who) {
  return db.todos.sort(function(x, y) { return x.assignee > y.assignee; });
}
```
