// function wait() {
//   return { type: "WAIT"};
// }
//
// function error(message) {
//   return { type: "ERROR", message };
// }
//
// function traverse(schema, options = {}) {
//   return function*run(obj, state, key) {
//     while (true) {
//       const canRun = !options.await || options.await.length === 0 || options.await.every(fn => fn(state));
//       if (canRun) {
//         for (const key in schema) {
//           const lhs = obj[key];
//           const rhs = schema[key];
//
//           if (["string", "number", "boolean"].includes(typeof rhs)) {
//             if (lhs !== rhs) {
//               return error(`Expected ${rhs} but got ${lhs}.`);
//             }
//           }
//
//           else if (Array.isArray(rhs)) {
//             if (!Array.isArray(lhs) {
//               return error(`Expected array but got ${typeof lhs}.`)
//             });
//             if (rhs.length !== lhs.length) {
//               return error(`Expected array of length ${rhs.length} but got ${lhs.length}.`)
//             }
//             for (const item of rhs) {
//               traverse(rhs, options)(lhs, state, key);
//             }
//           }
//
//           else if (typeof rhs === "object") {
//             traverse(rhs, { ...options,  })(lhs, state, key);
//           }
//
//           else if (typeof rhs === "function") {
//
//           }
//
//           else {
//
//           }
//
//           const gen = fn(key, schema, state);
//           const result = gen.next();
//         }
//       } else {
//         yield wait();
//       }
//     }
//   }
// }
//
// function capture(name, schema) {
//
// }
//
// function captureIf(predicate, name, schema) {
//
// }
//
// const arrow = (schema, options) => {
//   const { params, body } = schema;
//
// }
//
// const root = traverse(
//   {
//
//   },
//   {
//     result: state => {}
//   }
// )
//
//
// const sort = traverse(
//   {
//     type: "CallExpression",
//     callee: {
//       type: "MemberExpression",
//       object: any([traverse(root), traverse(filter)])
//       property: {
//         type: "Identifier",
//         name: "sort"
//       }
//     },
//     arguments: {
//       "0": traverseArrowFunction({
//         params: capture("params", {
//           "0": {
//             type: "Identifier",
//             name: "x"
//           },
//           "1": {
//             "type": "Identifier",
//             "name": "y"
//           }
//         }),
//         body: traverse(
//           {
//             type: "BinaryExpression",
//             left: {
//               "type": "MemberExpression",
//               "object": capture("leftParam", {
//                 "type": "Identifier",
//               }),
//               "property": {
//                 "type": "Identifier",
//                 "name": capture("leftField")
//               }
//             },
//             operator: captureIf(i => [">", "<"].includes(i)),
//             right: {
//               "type": "MemberExpression",
//               "object": capture("rightParam", {
//                 "type": "Identifier",
//               }),
//               "property": {
//                 "type": "Identifier",
//                 "name": capture("rightField")
//               }
//             }
//           },
//           {
//             await: [parent => parent.params],
//             ensure: [[state => state.leftField !== state.rightField, "Sort expression should reference the same property."]],
//             result: state => ({
//               fields: [
//                 {
//                   field: state.leftField,
//                   ascending:
//                     (operator === ">" && checkBinding(state.leftParam, param1Bindings)) ||
//                     (operator === "<" && checkBinding(state.rightParam, param1Bindings)),
//                 }
//               ]
//             }
//           })
//         ),
//         {
//           ensure: [
//             [
//               state => {
//                 const bindings = state..map(p => path.scope.bindings[p.node.name]);
//                 bindins.some(t => true);
//               },
//               "Sort expression must uniquely reference all bindings"
//             ]
//           ]
//         }
//       )
//     }
//   },
//   {
//     result: state => {}
//   }
// );
