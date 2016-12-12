A map() call cannot precede a sort() call
===========================================
The sort() method should be called before calling the map() function. After the map() call, only slice() is allowed. 

The follow is valid
```javascript
async function getTodos(who) {
  return db.todos
    .sort((x, y) => x.assignee > y.assignee)
    .map(x => ({ assignee: x.assignee, date: x.date }))
}
```

The follow is NOT valid
```javascript
async function getTodos(who) {
  return db.todos
    .map(x => ({ assigneeName: x.assignee, date: x.date }))
    .sort((x, y) => x.assigneeName > y.assigneeName)    
}
```
