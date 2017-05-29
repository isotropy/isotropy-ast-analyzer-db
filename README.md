Isotropy AST Analyzer for DB
============================
This module abstracts AST analysis for common  database operations so that they don't have to be repeated in every database plugin.
This is part of the isotropy framework (www.isotropy.org).

This README is not complete. However, parsing the following examples is supported.

Create a module "db.js" containing an array that mocks the database.
The filename can be changed in configuration.
```javascript
//In db.js
export default [
  {
    { title: "buy tickets", assignee: "you", priority: 1 },
    { title: "search for extra-terrestrials", assignee: "you", priority: 2 }
  }
]
```

Perform a database insert
```javascript
import myDb from "./my-db.js";

//Insert a single item
async function addTodo(title, assignee) {
  myDb.todos = myDb.todos.concat({ title, assignee });
}

//Insert a list of new items
async function addManyTodos(title, assignee) {
  const todosList = [
    { title: "get milk", assignee: "you", priority: 1 },
    { title: "buy eggs", assignee: "you", priority: 2 }
  ];
  myDb.todos = myDb.todos.concat(todosList)
}
```

Get all records
```javascript
import myDb from "./my-db.js";

async function getAllTodos(who) {
  return myDb.todos;
}
```

Query a table
```javascript
import myDb from "./my-db.js";

async function getTodos(who) {
  return myDb.todos.filter(todo => todo.assignee === who);
}
```

Query and return specific fields
```javascript
import myDb from "./my-db.js";

async function getTodos(who) {
  return myDb.todos
    .filter(todo => todo.assignee === who)
    .map(todo => ({ assignee: todo.assignee }));
}
```

Limit the number of results
```javascript
//Returns rows 10-20
import myDb from "./my-db.js";

async function getTodos(who) {
  return myDb.todos
    .filter(todo => todo.assignee === who)
    .slice(10, 20);
}
```

Order by a specific field
```javascript
import myDb from "./my-db.js";

async function getTodos(who) {
  return myDb.todos
    .filter(todo => todo.assignee === who)
    .sort((x, y) => x.assignee > y.assignee);
}
```

Update a record
```javascript
import myDb from "./my-db.js";

async function updateTodo(assignee, newAssignee) {
  myDb.todos = myDb.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo);
}
```

Delete a record
```javascript
import myDb from "./my-db.js";

async function deleteTodo(title, assignee) {
  myDb.todos = myDb.todos.filter(todo => !(todo.assignee == assignee && todo.title === title));
}
```

Count the number of items
```javascript
import myDb from "./my-db.js";

async function countTodos(who) {
  return myDb.todos.filter(todo => todo.assignee === who).length;
}
```

Multiple databases
```javascript
import todosDb from "./todos-db.js";
import authDb from "./auth-db.js";

async function getTodos(who) {
  return todosDb.todos.filter(todo => todo.assignee === who);
  return authDb.users.filter(u => u.name === "jack");
}
```
