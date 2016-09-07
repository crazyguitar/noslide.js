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

  describe('Slide.parse', function() {

    /*
     * Testing heading format
     */
    describe('# heading', function() {
      it('should be figlet format result.', () => {
        const theme   = themes.Ptt
            , mdFile  = __dirname + '/tests/heading.md'
            , outFile = __dirname + '/tests/heading.out'
            , slide   = new noslide(mdFile, theme);

        var out = fs.readFileSync(outFile, 'utf8');

        return slide.parse()
          .then(slides => {
            var res = "";
            slides.forEach(slide => {
              res += slide;
            });
            console.log(res);
            expect(res).to.equal(out);
          });
      });
    });

  });

})();
