import __db from "isotropy-backend-mongodb";

async function getTodos() {
  let someVar = 1;
  const result = await __db("todos").toArray();
  someVar = 2;
  return result;
}
