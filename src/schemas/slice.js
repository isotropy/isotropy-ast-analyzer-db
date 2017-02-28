export default function() {
  return traverse(
    {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": any[root(), select(), slice()],
        "property": {
          "type": "Identifier",
          "name": "sort"
        }
      },
      "arguments": {
        "0": {
          "type": "NumericLiteral",
          "value": capture("to")
        },
        "1": optional({
          "type": "NumericLiteral",
          "value": 20
        })
      }
    },
    {
      builders: [{
        get: x => x
      }]
    }
  )
}
