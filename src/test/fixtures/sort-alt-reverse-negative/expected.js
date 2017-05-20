module.exports = {
  type: "query",
  method: "sort",
  fields: [
    {
      field: "assignee",
      ascending: true
    }
  ],
  source: {
    type: "query",
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
