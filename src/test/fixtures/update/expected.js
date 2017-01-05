{
  type: "update",
  collection: "todos",
  fields: {
    "0": {
      "type": "SpreadProperty",
      "argument": {
        "type": "Identifier",
        "name": "todo"
      }
    },
    "1": {
      "type": "ObjectProperty",
      "method": false,
      "key": {
        "type": "Identifier",
        "name": "assignee"
      },
      "value": {
        "type": "Identifier",
        "name": "newAssignee"
      }
    }
  }
}


async function updateTodo(assignee, newAssignee) {
  db.todos = db.todos.map(todo => todo.assignee === assignee ? { ...todo, assignee: newAssignee } : todo)
}
