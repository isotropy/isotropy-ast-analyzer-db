A map() call cannot precede a filter() call
===========================================
The filter() method should be called before calling the map() function. After the map() call, only slice() is allowed. 

The follow is valid
```javascript
async function getTodos(who) {
  return db.todos
    .filter(x => x.assignee === "me")
    .map(x => ({ assignee: x.assignee, date: x.date }))
}
```

The follow is NOT valid
```javascript
async function getTodos(who) {
  return db.todos
    .map(x => ({ assigneeName: x.assignee, date: x.date }))
    .filter(x => x.assigneeName === "me")
}
```
