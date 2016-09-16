#!/usr/bin/env node

(function() {
  'use strict';


const noslide = require('../index').noslide
    , themes  = require('../index').themes
    , commander = require('commander')
    , fs      = require('fs');


function genSuite(mdFile, outFile, themeName) {
  const theme   = themes[themeName]
      , slide   = new noslide(mdFile, theme);

  return slide.parse()
    .then(slides => {
      var res = "";
      slides.forEach(slide => {
        res += slide;
      });
      console.log(res);
      fs.writeFileSync(outFile, res, 'ascii');
    })
    .catch(e => {
      console.log(e);
    });
}

commander
  .option('-t, --theme [name]', 'theme name')
  .option('-o, --out [file]', 'output file')
  .parse(process.argv);

var args    = commander.args
  , theme   = commander.theme
  , mdFile  = commander.args[args.length-1]
  , outFile = commander.out || mdFile + '.out';

genSuite(mdFile, outFile, theme);

})();
