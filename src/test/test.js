import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";

describe("isotropy-parser-db", () => {
  function test(fixtureName) {
    it(fixtureName, () => {
      const fixturePath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture.js');
      const expectedPath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected.js');

      const actual = babel.transformFileSync(fixturePath, {
        plugins: [['../../plugin'], "transform-object-rest-spread"],
        babelrc: false,
      }).code;

      //console.log(actual);
      const expected = fs.readFileSync(expectedPath, { encoding: 'utf8' });
      actual.should.equal(expected);
    });
  }

  [
    'count',
    'delete',
    'insert',
    'select-all',
    'select-fields',
    'select-slice',
    'select-sort',
    'select',
    'update',
  ].map(test);
});
