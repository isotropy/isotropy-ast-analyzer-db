Map expression should return an object
======================================
The map expression should return an object, and all properties in the new object should be "simply mapped" (with no changes) to existing fields.
See the following examples.

The follow is valid
```javascript
async function getTodos(who) {
  return db.todos.map(x => ({ assignee: x.assignee, date: x.date }))
}
```

The follow is NOT valid
```javascript
async function getTodos(who) {
  return db.todos.map(x => ({ assignee: x.assignee, changed: 1, time: x.time + 1 }))
}
```
