module.exports = {
  type: "query",
  method: "sort",
  fields: [
    {
      field: "priority",
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
