A delete should negate the predicate identifying the item to delete
===================================================================
Deletion is done by filtering (or selecting) items which don't match the item to be deleted.

In the following example, note the negation of the predicate: !(todo.assignee === assignee && todo.title === title)
```javascript
async function deleteTodo(title, assignee) {
  db.todos = db.todos.filter(todo => !(todo.assignee === assignee && todo.title === title))
}
```
