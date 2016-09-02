var marked = require('marked')
  , fs = require('fs')
  , TerminalRenderer = require('marked-terminal')
  , colors = require('colors')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , imageToAscii = require("image-to-ascii")
  , chalk = require('chalk')
  , cardinal = require('cardinal')
  , asciimo = require('asciimo').Figlet;


var HARD_RETURN = '\r';


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

function tab(size) {
  size = size || 4;
  return (new Array(size)).join(' ');
}

function indentify(text) {
  if (!text) return text;
  return tab() + text.split('\n').join('\n' + tab());
}

function setLineSameWidth(str) {
  var lines  = str.split('\n');
  var maxLen = Math.max(...lines.map((str) => { return str.length }));
  var out    = "";
  lines.forEach((line) => {
    out += (line.replace(/\s+$/g, '') + ' '.repeat(maxLen - line.length) + '\n');
  });
  return out;
}


function fixHardReturn(text, reflow) {
  return reflow ? text.replace(HARD_RETURN, /\n/g) : text;
}

function highlight(code, lang, opts, hightlightOpts) {
  if (!chalk.enabled) return code;

  var style = opts.code;

  code = fixHardReturn(code, opts.reflowText);
  if (lang !== 'javascript' && lang !== 'js') {
    return style(code);
  }

  try {
    return cardinal.highlight(code, hightlightOpts);
  } catch (e) {
    return style(code);
  }
}


function indentLines (text) {
  return text.replace(/\n/g, '\n' + tab()) + '\n\n';
}

function changeToOrdered(text) {
  var out = "";
  var lines = text.split('\n');
  lines.forEach((line, idx) => {
    out += (line.replace(/\s*\*/g, idx + '.') + '\n');
  });
  return out;
}

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


TerminalRenderer.prototype.code = function(code, lang, escaped) {
  code = setLineSameWidth(code);
  return '\n' + indentify(highlight(code, lang, this.o, this.highlightOptions)) + '\n';
};

TerminalRenderer.prototype.list = function(body, ordered) {
  body = setLineSameWidth(body);
  body = indentLines(this.o.listitem(body));
  body = body + '\n';
  if (!ordered) return body;
  return changeToOrdered(body);
};

TerminalRenderer.prototype.image = function(href, title, text) {
  return new Promise((resolve, reject) => {
    imageToAscii(href,
      { size: { height: "60%" }
      }, (err, converted) => {
      if (err) reject(err);
      else resolve(converted + "\n");
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
    return this.o.firstHeading(text) + '\n';
  }
  return '\n' + this.o.heading(text) + '\n';
};

TerminalRenderer.prototype.paragraph = function(texts) {
  return Promise.all(texts).then(data => {
    var res = '';
    data.forEach(i => {
      res += i;
    });
    return '\n' + res + '\n';
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

  return this.o.link(out);
};

TerminalRenderer.prototype.hr = function() {
  return '\n\n' + '-'.repeat(this.o.width) + '\n';
};

TerminalRenderer.prototype.blockquote = function(quoteBlocks) {
  return Promise.all(quoteBlocks).then(quotes => {
    var body = "";
    quotes.forEach(quote => {
      body += quote;
    });
    body = setLineSameWidth(body.trim());

    var quote = "";
    body.split('\n').forEach(line => {
      if (line.trim() === "") {
        quote += '\n';
        return;
      }
      quote += ('> ' + line + '\n');
    });
    return '\n' + this.o.blockquote(indentify(quote)) + '\n\n';
  });
};


/**
 * Read slide content.
 *
 * @param {string} slide - slide path
 * @returns {Promise} a readFile promise
 */
function readSlide(slide, encoding) {
  var encoding = encoding || 'utf8';
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
function Slide(slide, options) {
  this.options = options || defaultOpt;
  this.slide = slide || [];

  this.options.firstHeading = parseHeading;
  this.screen = blessed.screen();

  this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });
}

/**
 * Render slide
 */
Slide.prototype.render = function(screen) {
  var options = this.options
    , slide = this.slide
    , markdown = null
    , markedopt = {}
    , renderer = new TerminalRenderer(options)
    , screen = this.screen;

  font = this.options.font || "Serifcap";

  // create a carousel object
  var carousel = new contrib.carousel( []
                                     , { screen: screen
                                       , interval: 0
                                       , controlKeys: true })

  parseFont(font, function() {
    // read slide from file (using Promise)
    markdown = readSlide(slide);
    markedopt = merge({} , marked.defaults , { renderer: renderer
                                             , promise: true});

    // render all slide page
    markdown
    .then(content => {
      /* parsing tokens and put tokens into each page */

      var tokens = marked.Lexer.lex(content, markedopt);
      var pageTokens = [];
      tokens.forEach(token => {
        if (pageTokens.length === 0) {
          pageTokens.push([token]);
        } else if (token.type === 'heading' && token.depth === 1) {
          pageTokens.push([token]);
        } else {
          pageTokens[pageTokens.length-1].push(token);
        }
      });
      pageTokens.forEach(toks => {
        toks.links = tokens.links;
      })
      
      return Promise.all(pageTokens);
    })
    .then(pageTokens => {
      /* parse each page via given tokens */
      var slides = [];
      pageTokens.forEach(token => {
        slides.push(marked.Parser.parse(token, markedopt));
      });
      return Promise.all(slides);
    })
    .then(results => {
      var outs = [];
      results.forEach(blocks => {
        var out = "";
        blocks.forEach(block => {
          out += block;
        })
        outs.push(out);
      });
      return outs;
    })
    .then(contents => {
      /* put parse result into blessed box */
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
                                , align: 'center'
                                , tags: true
                                , border: { type: 'line'}
                                , style: {invisible: true}
                                , content: content});
          screen.append(box);
          /* set fade in animate */
          /* FIXME: current solution is bad */
          setTimeout(() => {
            box.style.invisible = false;
            box.style.transparent = true;
            screen.render();
            setTimeout(() => {
              box.style.transparent = false;
              screen.render();
            }, 80);
          }, 100);

        });
      });
      return Promise.all(boxes);
    })
    .then(boxes => {
      /* put boxes into carousel */
      carousel.pages = boxes;
      carousel.start();
    })
    .catch(e => {
      console.log(e);
    })

  });
}

module.exports = Slide
