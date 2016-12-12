Multiple map() calls 
====================
The query expression must have only one map() call. Try merging them into one.

The follow is valid
```javascript
async function getTodos(who) {
  return db.todos
    .filter(x => x.assignee === "me")
    .map(x => ({ assigneeName: x.assignee }))
}
```

The follow is NOT valid
```javascript
async function getTodos(who) {
  return db.todos
    .filter(x => x.assignee === "me")
    .map(x => ({ assigneeName1: x.assignee }))
    .map(x => ({ assigneeName2: x.assigneeName1 }))
}
```
