A slice() call cannot precede a sort() call
=============================================
The sort() method should be called before calling the slice() function. After the slice() call, only map() is allowed. 

The follow is valid
```javascript
async function getTodos(who) {
  return db.todos
    .sort((x, y) => x.assigneeName > y.assigneeName)
    .slice(10, 20)
}
```

The follow is NOT valid
```javascript
async function getTodos(who) {
  return db.todos
    .slice(10, 20)
    .sort((x, y) => x.assigneeName > y.assigneeName)    
}
```
