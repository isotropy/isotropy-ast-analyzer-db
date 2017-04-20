module.exports = {
  type: "query",
  from: 10,
  to: 20,
  method: "slice",
  source: {
    type: "query",
    method: "map",
    fields: [
      { newField: "owner", field: "assignee" },
      { newField: "timestamp", field: "createdAt" }
    ],
    source: { type: "query", db: "db", identifier: "db", collection: "todos" }
  }
};
