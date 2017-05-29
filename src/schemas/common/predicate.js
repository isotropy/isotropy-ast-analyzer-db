import { Match, Skip } from "chimpanzee";

function memberOnFilterParam(path, filterParam) {
  return (
    path.type === "MemberExpression" &&
    path.get("object").type === "Identifier" &&
    path.get("object").node.name === filterParam.node.name
  );
}

function getOperator(op, reverse) {
  const map = [
    [["==", "==="], ["$eq"]],
    [[">"], ["$gt", "$lte"]],
    [[">="], ["$gte", "$lt"]],
    [["<="], ["$lte", "$gt"]],
    [["<"], ["$lt", "$gte"]],
    [["!=", "!=="], ["$ne"]]
  ];
  const match = map.find(([jsOperators, dbOperators]) => jsOperators.includes(op.node));
  return match ? (!reverse ? match[1][0] : match[1][1] || match[1][0]) : undefined;
}

const visitors = {
  /*
    todo => [1, 2, 3, 4, 5].includes(todo.priority)
  */
  CallExpression(path, filterParam) {

  },

  /*
    todo => todo.x == 1 && todo.y === 2
  */
  LogicalExpression(path, filterParam) {
    console.log("::::", path.get("right").type);
    const node = path.node;
    const left = path.get("left");
    const right = path.get("right");
    const key = node.operator === "&&"
      ? "$and"
      : node.operator === "||"
          ? "$or"
          : new Skip(`Unsupported operator ${node.operator} in LogicalExpression.`);
    return !(key instanceof Skip)
      ? {
          [key]: [
            visitors[left.type](left, filterParam),
            visitors[right.type](right, filterParam)
          ]
        }
      : key;
  },

  /*
    todo => todo.x === 10
  */
  BinaryExpression(path, filterParam) {
    const node = path.node;
    const left = path.get("left");
    const right = path.get("right");

    //See if left or right references the collection variable.
    const parts = [[left, right, false], [right, left, true]];
    const fieldOpAndVal = (function loop(_parts) {
      const [first, second, reverse] = _parts[0];
      const result = memberOnFilterParam(first, filterParam) &&
        !memberOnFilterParam(second, filterParam)
        ? { field: first, operator: getOperator(path.get("operator")), value: second }
        : undefined;
      return (
        result ||
        (_parths.length > 1
          ? loop(_parts.slice(1))
          : new Skip(
              `Cannot analyze predicate expression involving ${left.node} and ${right.node}.`
            ))
      );
    })(parts);

    return fieldOpAndVal;
  },

  /*
    todo => todo.incomplete
  */
  MemberExpression(path, filterParam) {
    return { field: path, operator: "$eq", value: true };
  },

  /*
    todo => !todo.incomplete
  */
  UnaryExpression(path, filterParam) {

  }
};

export default function(state, config) {
  return composite(
    {
      type: "ArrowFunctionExpression",
      generator: false,
      expression: true,
      async: false,
      params: capture({ selector: "path" }),
      body: capture({ selector: "path" })
    }
  )
}
