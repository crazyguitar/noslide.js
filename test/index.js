/*
 * test/index.js
 */

const chai    = require('chai')
    , expect  = chai.expect
    , fs      = require('fs')
    , sinon   = require('sinon')
    , noslide = require('../index').noslide
    , themes  = require('../index').themes;

(function(){
  'use strict';

function test(themeName) {
  const theme   = themes[themeName]
      , mdFile  = __dirname + "/tests/" + themeName + ".md"
      , outFile = __dirname + "/tests/" + themeName + ".md.out"
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

describe('Slide.parse', () => {

  var suites = [ 'Ptt'
               , 'ZZZZZZZZZ9'
               , 'Lavchi'
               , 'ChinLan'
               , 'XXXXGAY'
               , 'sumade'
               , 'segawar'
               , 'email5566'
               , 'hiimlive'
               , 'mayaman'
               , 'mayaman'
               , 'bill7437'
               , 'mini158'
               , 'F7'];

  /*
   * Testing heading format
   */
  suites.forEach( s => {
    describe('Test theme "' + s + '"', () => {
      it('should be figlet format result.', () => {
        test(s);
      });
    });
  });

});


describe('Slide.render', () => {

  var mdFile = __dirname + '/tests/Ptt.md';
  var theme = themes.Ptt;
  var slide = new noslide(mdFile, theme);

  slide.render();
  slide.screen.destroy();

});

})();
