Sort expression should use the same field
=========================================
The sort expression should use the same field in the comparison.

The follow is valid because the assignee field is being compared on both x and y.
```javascript
async function getTodos(who) {
  return db.todos.sort((x, y) => x.assignee > y.assignee);
}
```

The follow is NOT valid because the fields being compared ("assignee" and "assigner") are different.
```javascript
async function getTodos(who) {
  return db.todos.sort((x, y) => x.assignee > y.assigner);
}
```
