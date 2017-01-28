module.exports = {
  type: "query",
  method: "slice",
  from: 10,
  to: 20,
  source: {
    type: "query",
    db: "db",
    identifier: "db",
    collection: "todos"
  }
}
