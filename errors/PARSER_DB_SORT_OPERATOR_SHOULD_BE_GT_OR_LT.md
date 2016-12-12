Sort operator must be greater than or less than
===============================================

You must use ">" or "<" as the operator in the sort expression.
">=" and "<=" can also be used, but it is interpreted as ">" and "<" respectively.

This is valid.
```javascript
async function getTodos(who) {
  return db.todos.sort((x, y) => x.assignee > y.assignee);
}
```

This is NOT valid. It doesn't make much sense either.
```javascript
async function getTodos(who) {
  return db.todos.sort(function(x, y) { return x.assignee === y.assignee; });
}
```
