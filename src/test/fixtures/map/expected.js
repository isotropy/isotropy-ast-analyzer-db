module.exports = {
  type: "query",
  method: "map",
  fields: [
    {
      field: "assignee"
      newField: "mainAssignee"
    }
  ],
  source: {
    type: "query",
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
