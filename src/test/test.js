
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
      return obj.concat();
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

describe("isotropy-parser-db", () => {
  function run([description, dir]) {
    ['simple', 'import'].forEach((subType) => {
      it(`${description}-${subType}`, () => {
        const fixturePath = path.resolve(__dirname, 'fixtures', dir, `${subType}.js`);
        const expected = require(`./fixtures/${dir}/expected`);
        const pluginInfo = makePlugin(subType);

        babel.transformFileSync(fixturePath, {
          plugins: [[pluginInfo.plugin], "transform-object-rest-spread"],
          babelrc: false,
        });

        const result = pluginInfo.getResult();
        const actual = clean(result);
        actual.should.deepEqual(expected);
      });
    })
  }

  const tests = [
    ['count', 'count'],
    //['delete', 'delete'],
    // ['insert', 'insert'],
    // ['select', 'select'],
    // ['select-all', 'select-all'],
    // ['select-fields', 'select-fields'],
    // ['select-slice', 'select-slice'],
    // ['select-sort', 'select-sort'],
    //['update', 'update'],
  ];

  for (const test of tests) {
    run(test);
  }

});
