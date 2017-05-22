// function memberOnFilterParam(path, filterParam) {
//   return path.type === "MemberExpression" && path.get("object").type === "Identifier" && path.get("object").node.name === filterParam.node.name;
// }
//
// function getOperator(op) {
//   const map = [
//     [["==", "==="], "$eq"],
//     [[">"], "$gt"],
//     [[">="], "$gte"],
//     [["<="], "$lte"],
//     [["<"], "$lt"],
//     [["!=", !==], "$ne"],
//     [[">"], "$gt"],
//     [[">"], "$gt"],
//   ]
// }
//
// const visitors = {
//   LogicalExpression(path, filterParam) {
//     const node = path.node;
//     const left = path.get("left");
//     const right = path.get("right");
//     const key = node.operator === "&&" ? "$and" : node.operator === "||" ? "$or" : new Skip(`Unsupported operator ${node.operator} in LogicalExpression.`);
//     return !(key instanceof Skip)
//       ? { [key]: [ visitors[left.type](left, filterParam), visitors[right.type](right, filterParam) ] }
//       : key;
//   },
//
//   BinaryExpression(path, filterParam) {
//     const node = path.node;
//     const left = path.get("left");
//     const right = path.get("right");
//
//     //See if left or right references the collection variable.
//     const { field, operator, value } = memberOnFilterParam(left, filterParam) && !(memberOnFilterParam(right, filterParam))
//       ? { field: left, operator:  }
//
//     return ["==", "==="].includes(node.operator)
//       ? {  }
//
//      === "===" ? "$and" : node.operator === "||" ? "$or" : new Skip(`Unsupported operator ${node.operator} in LogicalExpression.`);
//     return !(key instanceof Skip)
//       ? { [key]: [ visitors[left.type](left), visitors[right.type](right) ] }
//       : key;
//   }
//
// }
//
// export default function(path) {
//   return path.type === "LogicalExpression"
// }
