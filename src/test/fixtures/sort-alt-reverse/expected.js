module.exports = {
  type: "query",
  method: "sort",
  fields: [
    {
      field: "assignee",
      ascending: false
    }
  ],
  source: {
    type: "query",
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
