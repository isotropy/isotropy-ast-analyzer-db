Sort expression must be simple
==============================

Only simple sort expressions are supported for now (involving a single field) for now.

The follow is valid.
```javascript
async function getTodos(who) {
  return db.todos.sort((x, y) => x.assignee > y.assignee);
}
```

The follow is NOT valid because it accepts only simple A > B type expressions
```javascript
async function getTodos(who) {
  return db.todos.sort((x, y) => x.assignee > y.assignee || (x.assignee === y.assignee && x.date > y.date));
}
```
