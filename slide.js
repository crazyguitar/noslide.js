var marked = require('marked')
  , fs = require('fs')
  , TerminalRenderer = require('marked-terminal')
  , colors = require('colors')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , asciimo = require('asciimo').Figlet;

defaultOpt = {
  style: { font: 'Serifcap'}
}

function parseFont(font, fn) {
  asciimo.parseFont(font, () => {
    fn();
  });
}

function parseHeading(head) {
  return asciimo.parseStr(head, font);
}

function readSlide(slide) {
  const encoding = 'utf8';
  return new Promise((resolve, reject) => {
    fs.readFile(slide, encoding, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function Slide(slides, options) {
  this.options = options || defaultOpt;
  this.slides = slides || [];
  this.numSlides = slides.length;
}


Slide.prototype.render = function(screen) {
  font = this.options.style.font || "Serifcap";
  var slides = this.slides;
  var pages = [];
  var numSlides = this.numSlides;

  // setup markdown parser
  marked.setOptions({
    renderer: new TerminalRenderer({
      firstHeading: parseHeading
    })
  });

  // create a carousel object
  var carousel = new contrib.carousel( []
                                     , { screen: screen
                                     , interval: 0
                                     , controlKeys: true })

  parseFont(font, function() {
    // read slides from files (using Promise)
    slides.forEach(slide => {
      pages.push(readSlide(slide));
    });

    // render all slide page
    pages.forEach((page, idx) => {

      page.then(content => {

        // append all render page to carousel
        carousel.pages.push(function(screen) {
          var box = blessed.box({ top: 'center'
                                , left: 'center'
                                , width: '80%'
                                , height: '80%'
                                , border: { type: 'line'}
                                , content: marked(content) });
          screen.append(box);
        });

        // after render all page, we start carousel
        if (numSlides === (idx + 1)) carousel.start();

      }).catch(err => {
        console.log(err);
      });

    });
  });
}

module.exports = Slide
