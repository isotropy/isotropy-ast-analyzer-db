module.exports = {
  type: "query",
  method: "sort",
  fields: [
    {
      field: "priority",
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
