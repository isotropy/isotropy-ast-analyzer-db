import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";

describe("isotropy-parser-db", () => {
  it("count", () => {
    const fixturePath = path.resolve(__dirname, 'fixtures', 'count', 'fixture.js');
    const expected = require("./fixtures/count/expected");
    const pluginInfo = makePlugin();

    babel.transformFileSync(fixturePath, {
      plugins: [[pluginInfo.plugin], "transform-object-rest-spread"],
      babelrc: false,
    });

    const actual = pluginInfo.getResult();
    console.log(actual);
    actual.should.deepEqual(expected);

    /*
    export default {
      type: "value",
      method: "length",
      source: {
        type: "query",
        method: "filter",
        predicate: {
          type: "BinaryExpression",
          left: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: "todo"
            },
            property: {
              type: "Identifier",
              name: "assignee"
            }
          },
          operator: "===",
          right: {
            type: "Identifier",
            name: "who"
          }
        },
        source: {
          type: "query",
          collection: "todos"
        }
      }
    }
    */
  });
});
