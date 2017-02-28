export default function() {
  return mutation(
    method: "concat",
    arguments: {
      "0": {
        "type": "ObjectExpression",
        "properties": {
          "0": {
            "type": "ObjectProperty",
            "method": false,
            "key": {
              "type": "Identifier",
              "name": "title"
            },
            "value": {
              "type": "Identifier",
              "name": "title"
            }
          },
          "1": {
            "type": "ObjectProperty",
            "method": false,
            "key": {
              "type": "Identifier",
              "name": "assignee"
            },
            "value": {
              "type": "Identifier",
              "name": "assignee"
            }
          }
        }
      }
    }
  )
}
