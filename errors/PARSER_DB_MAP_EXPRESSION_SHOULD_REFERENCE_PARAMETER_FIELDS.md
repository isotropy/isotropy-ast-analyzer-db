Map expression should reference fields on the parameter
=======================================================
The object expression returned by map should only reference fields on the parameter.

This is best illustrated with an example. Here is a valid map expression.
```javascript
async function getTodos(who) {
  return db.todos.map(t => ({ a: t.assignee, b: t.when }))
}
```

The object expression { a: ..., b: ... } returned by the map() references fields defined on the parameter "t". 
That is, the value of "a" in the new object is "t.assignee" and that of "b" is "t.when".


