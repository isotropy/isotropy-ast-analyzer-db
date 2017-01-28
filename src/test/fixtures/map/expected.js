module.exports = {
  type: "query",
  method: "map",
  fields: [
    ["mainAssignee", "assignee"]
  ],
  source: {
    type: "query",
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
