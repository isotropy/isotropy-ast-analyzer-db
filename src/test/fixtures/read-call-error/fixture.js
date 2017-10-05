import myFs from "../my-fs";

async function readCallError() {
  return myFs.docs.pop();
}
