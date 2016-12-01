import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";

describe("babel-plugin-isotropy-mongodb", () => {
  function test(fixtureName) {
    it(fixtureName, () => {
      const fixturePath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture.js');
      const expectedPath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected.js');

      const actual = babel.transformFileSync(fixturePath, {
        plugins: [['../../plugin']],
        babelrc: false,
      }).code;

      //console.log(actual);
      const expected = fs.readFileSync(expectedPath, { encoding: 'utf8' });
      actual.should.equal(expected);
    });
  }

  [
    'query',
    //'count'
  ].map(test);
});
