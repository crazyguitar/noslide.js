/*
 * test/index.js
 */

const chai    = require('chai')
    , expect  = chai.expect
    , fs      = require('fs')
    , noslide = require('../index').noslide
    , themes  = require('../index').themes;

(function(){
  'use strict';

function test(mdPath, outPath) {
  const theme   = themes.Ptt
      , mdFile  = __dirname + "/" + mdPath
      , outFile = __dirname + "/" + outPath
      , slide   = new noslide(mdFile, theme);

  var out = fs.readFileSync(outFile, 'utf8');

  return slide.parse()
    .then(slides => {
      var res = "";
      slides.forEach(slide => {
        res += slide;
      });
      expect(res).to.equal(out);
    });
}

describe('Slide.parse', function() {

  /*
   * Testing heading format
   */
  describe('# heading', () => {
    it('should be figlet format result.', () => {
      test('tests/heading.md', 'tests/heading.out');
    });
  });

  /*
   * Testing blockquote
   */
  describe('# blockquote', () => {
    it ('should be like `> msg` ', () => {
      test('tests/blockquote.md', 'tests/blockquote.out');
    });
  });

});


})();
