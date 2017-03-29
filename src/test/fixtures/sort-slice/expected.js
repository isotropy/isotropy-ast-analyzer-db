module.exports = {
  type: "query",
  method: "slice",
  from: 10,
  to: 20,
  source: {
    type: "query",
    method: "sort",
    fields: [{ field: "assignee", ascending: true }],
    source: { type: "query", db: "db", identifier: "db", collection: "todos" }
  }
};
