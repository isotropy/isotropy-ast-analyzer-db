A slice() call cannot precede a filter() call
===========================================
The filter() method should be called before calling the slice() function. After the slice() call, only map() is allowed. 

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
    .slice(10, 20)
    .filter(x => x.assigneeName === "me")
}
```
