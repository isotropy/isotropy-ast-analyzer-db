module.exports = {
  type: "query",
  operation: "slice",
  from: 10,
  to: 20,
  source: {
    type: "query",
    module: "mongodb://localhost:27017/isotropy-test-db",
    identifier: "myDb",
    collection: "todos"
  }
}
