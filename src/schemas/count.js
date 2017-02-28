export default function() {
  return {
    "type": "MemberExpression",
    "object": any[root(), select(), sort(), slice()],
    "property": {
      "type": "Identifier",
      "name": "length"
    }
  }
}
