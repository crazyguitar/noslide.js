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

describe('Slide.parse', function() {

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
        return test(s);
      });
    });
  });

});

describe('Slide.render', function() {

  it('should render a screen.', () => {
    const theme   = themes.Ptt
        , mdFile  = __dirname + "/tests/Ptt.md"
        , slide   = new noslide(mdFile, theme);
    return slide.render().then(() => {
      slide.screen.destroy();
    });
  });

  it('should be throwing exception when file not exist', () => {
    chai.use(require('chai-as-promised'));
    const theme   = themes.Ptt
        , mdFile  = __dirname + "/tests/$@?#~!"
        , slide   = new noslide(mdFile, theme)
        , should = chai.should();

    return slide.render().should.be.rejected;
  });

});

})();
