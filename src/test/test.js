import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();

function clean(obj) {
  if (typeof obj !== "object") {
    return obj;
  } else {
    if (Array.isArray(obj)) {
      return obj.map(o => clean(o))
    } else {
      const newObj = {};
      for (const key in obj) {
        if (!(["start", "end", "loc", "computed", "shorthand", "extra", "__clone"].includes(key))) {
          newObj[key] = clean(obj[key]);
        }
      }
      return newObj;
    }
  }
}

describe("isotropy-ast-analyzer-db", () => {
  function run([description, dir, opts]) {
    it(`${description}`, () => {
      const fixturePath = path.resolve(__dirname, 'fixtures', dir, `fixture.js`);
      const expected = require(`./fixtures/${dir}/expected`);
      const pluginInfo = makePlugin(opts || { simple: true });

      babel.transformFileSync(fixturePath, {
        plugins: [[pluginInfo.plugin], "transform-object-rest-spread"],
        babelrc: false,
      });

      const result = pluginInfo.getResult();
      const actual = clean(result.analysis);
      actual.should.deepEqual(expected);
    });
  }

  const tests = [
    ['count', 'count'],
    ['delete', 'delete'],
    ['insert', 'insert'],
    ['select', 'select'],
    ['select-all', 'select-all'],
    ['select-fields', 'select-fields'],
    ['select-slice', 'select-slice'],
    ['select-sort', 'select-sort'],
    ['update', 'update'],
    ['import-select', 'import-select', { simple: false }],
    ['import-update', 'import-update', { simple: false }],
  ];

  for (const test of tests) {
    run(test);
  }


});
