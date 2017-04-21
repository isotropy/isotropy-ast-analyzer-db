module.exports = {
  type: "query",
  method: "map",
  fields: [
    { newField: "owner", field: "assignee" },
    { newField: "timestamp", field: "createdAt" }
  ],
  source: {
    type: "query",
    method: "slice",
    from: 10,
    to: 20,
    source: { type: "query", db: "db", identifier: "db", collection: "todos" }
  }
};
