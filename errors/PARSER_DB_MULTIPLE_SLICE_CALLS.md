Multiple slice() calls 
====================
The query expression must have only one slice() call. Try merging them into one.

The follow is valid
```javascript
async function getTodos(who) {
  return db.todos
    .filter(x => x.assignee === "me")
    .slice(10, 20)
}
```

The follow is NOT valid
```javascript
async function getTodos(who) {
  return db.todos
    .filter(x => x.assignee === "me")
    .slice(10, 20)
    .slice(2, 3)
}
```
