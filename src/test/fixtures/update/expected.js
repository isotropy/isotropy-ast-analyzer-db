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
