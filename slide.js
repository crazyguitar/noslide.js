var marked = require('marked')
  , fs = require('fs')
  , TerminalRenderer = require('marked-terminal')
  , colors = require('colors')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')
  ,imageToAscii = require("image-to-ascii")
  , asciimo = require('asciimo').Figlet;

// load default theme
var defaultOpt = require('./themes/Ptt');

/**
 * Parsing *.flf file to get fonts.
 *
 * @param {string} font - font name
 * @param {callback} fn - callback function
 */
function parseFont(font, fn) {
  asciimo.parseFont(font, () => {
    fn();
  });
}

/**
 * Parsing markdown header text and do formating.
 *
 * @param {string} head - markdown header text
 * @returns {string} - format header text
 */
function parseHeading(head) {
  return asciimo.parseStr(head, font);
}

TerminalRenderer.prototype.image = function(href, title, text) {
  return new Promise((resolve, reject) => {
    imageToAscii(href,
      {
      }, (err, converted) => {
      if (err) reject(err);
      else resolve('{center}' + converted + "{/center}\n");
    });
  });

};

TerminalRenderer.prototype.heading = function(text, level, raw) {
  text = this.transform(text.join(''));

  var prefix = this.o.showSectionPrefix ?
    (new Array(level + 1)).join('#')+' ' : '';
  text = prefix + text;
  if (this.o.reflowText) {
    text = reflowText(text, this.o.width, this.options.gfm);
  }
  if (level === 1) {
    return '{center}' + this.o.firstHeading(text) + '{/center}\n';
  }
  return '{center}' + this.o.heading(text) + '{/center}\n';
};


TerminalRenderer.prototype.paragraph = function(texts) {
  return Promise.all(texts).then(data => {
    var res = '';
    data.forEach(i => {
      res += i;
    });
    return res;
  })
}


TerminalRenderer.prototype.link = function(href, title, text) {
  text = text.join('');
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }

  var hasText = text && text !== href;

  var out = '';
  if (hasText) out += this.emoji(text) + ' (';
  out +=  this.o.href(href);
  if (hasText) out += ')';

  return "{center}" + this.o.link(out) + '{/center}';
};


/**
 * Read slide content.
 *
 * @param {string} slide - slide path
 * @returns {Promise} a readFile promise
 */
function readSlide(slide) {
  const encoding = 'utf8';
  return new Promise((resolve, reject) => {
    fs.readFile(slide, encoding, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

/**
 * noslide.js module.
 *
 * @module noslide/slide
 */

/**
 * Create a Slide object
 */
function Slide(slides, options) {
  this.options = options || defaultOpt;
  this.slides = slides || [];
  this.numSlides = slides.length;

  this.options.firstHeading = parseHeading;
  this.screen = blessed.screen();

  this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });
}

/**
 * Render all slides
 */
Slide.prototype.render = function(screen) {
  var options = this.options
    , slides = this.slides
    , pages = []
    , numSlides = this.numSlides
    , screen = this.screen;

  font = this.options.font || "Serifcap";

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
    Promise.all(pages)
    .then(markdowns => {
      var p = [];
      markdowns.forEach((markdown, idx) => {
        p.push(marked(markdown, {
          renderer: new TerminalRenderer(options),
          promise: true
        }));
      });
      return Promise.all(p);
    })
    .then(contents => {
      var boxes =[];
      contents.forEach((content, idx) => {
        boxes.push(function(screen) {
          var box = blessed.box({ top: 'center'
                                , left: 'center'
                                , width: '95%'
                                , height: '95%'
                                , scrollable: true
                                , alwaysScroll: true
                                , keys: true
                                , vi: true
                                , tags: true
                                , border: { type: 'line'}
                                , content: content});
          screen.append(box);
        });
      });
      return Promise.all(boxes);
    })
    .then(boxes => {
       carousel.pages = boxes;
       carousel.start();
    })
    .catch(e => {
      console.log(e);
    })

  });
}

module.exports = Slide
