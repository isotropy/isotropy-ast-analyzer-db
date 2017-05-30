module.exports = {
  type: "query",
  from: 10,
  to: 20,
  method: "slice",
  source: {
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
      module: "todosDbModule",
      identifier: "myDb",
      collection: "todos"
    }
  }
};
