Isotropy AST Analyzer for DB
============================
This module abstracts AST analysis for common  database operations so that they don't have to be repeated in every database plugin.
This is part of the isotropy framework (www.isotropy.org).

This README is not complete. However, parsing the following examples is supported.

Perform a database insert
```javascript
//Insert a single item
async function addTodo(title, assignee) {
  db.todos = db.todos.concat({ title, assignee });
}

//Insert a list of new items
async function addManyTodos(title, assignee) {
  const todosList = [
    { title: "get milk", assignee: "you", priority: 1 },
    { title: "buy eggs", assignee: "you", priority: 2 }
  ];
  db.todos = db.todos.concat(todosList)
}
```

Get all records
```javascript
async function getAllTodos(who) {
  return db.todos;
}
```

Query a table
```javascript
async function getTodos(who) {
  return db.todos.filter(todo => todo.assignee === who);
}
```

Query and return specific fields
```javascript
async function getTodos(who) {
  return db.todos
    .filter(todo => todo.assignee === who)
    .map(todo => ({ assignee: todo.assignee }));
}
```

Limit the number of results
```javascript
//Returns rows 10-20
async function getTodos(who) {
  return db.todos
    .filter(todo => todo.assignee === who)
    .slice(10, 20);
}
```

Order by a specific field
```javascript
async function getTodos(who) {
  return db.todos
    .filter(todo => todo.assignee === who)
    .sort((x, y) => x.assignee > y.assignee);
}
```

Update a record
```javascript
async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo);
}
```

Delete a record
```javascript
async function deleteTodo(title, assignee) {
  db.todos = db.todos.filter(todo => !(todo.assignee == assignee && todo.title === title));
}
```

Count the number of items
```javascript
async function countTodos(who) {
  return db.todos.filter(todo => todo.assignee === who).length;
}
```

Multiple databases
```javascript
async function getTodos(who) {
  return todosDb.todos.filter(todo => todo.assignee === who);
  return authDb.users.filter(u => u.name === "jack");
}
```

Use imports to avoid globals. Recommended.
```javascript
import db from "isotropy-db";
const todosDb = db("todosDatabase");
const authDb = db("authDatabase");

async function getTodos(who) {
  return todosDb.todos.filter(todo => todo.assignee === who);
  return authDb.users.filter(u => u.name === "jack");
}
```
