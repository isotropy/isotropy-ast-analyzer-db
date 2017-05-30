module.exports = {
  type: "query",
  method: "slice",
  from: 10,
  source: {
    type: "query",
    module: "todosDbModule",
    identifier: "myDb",
    collection: "todos"
  }
}
