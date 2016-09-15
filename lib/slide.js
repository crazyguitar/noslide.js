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
function parseFont(font) {
  return new Promise((resolve, reject) => {
    asciimo.parseFont(font, () => {
      resolve();
    });
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
  var maxLen = Math.max(...lines.map((str) => { return str.length; }));
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
  });
};

TerminalRenderer.prototype.link = function(href, title, text) {
  text = text.join('');
  var prot = "";
  if (this.options.sanitize) {
    try {
      prot = decodeURIComponent(unescape(href))
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

TerminalRenderer.prototype.html = function(html) {
  var out = "";
  if (html instanceof Array) {
    html.forEach(block => {
      out += block;
    });
  } else {
    out = html;
  }
  out = out.replace(/<[^>\)\(]+>/g,'');
  return this.o.html(setLineSameWidth(out));
};



/**
 * Read slide content.
 *
 * @param {string} slide - slide path
 * @returns {Promise} a readFile promise
 */
function readSlide(slide, encoding) {
  var enc = encoding || 'utf8';
  return new Promise((resolve, reject) => {
    fs.readFile(slide, enc, (err, data) => {
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
  this.screen = null;

  this.options.firstHeading = parseHeading;
}

Slide.prototype.reload = function() {
  if (!this.screen) return;

  var i = this.screen.children.length;
  while (i--) this.screen.children[i].detach();
  this.screen.render();

  /* reload markdown */
  this.screen.destroy();
  this.screen = null;
  this.render();
};

/**
 * Parse markdown
 */

Slide.prototype.parse = function() {
  var options = this.options
    , slide = this.slide
    , markdown = null
    , markedopt = {}
    , renderer = new TerminalRenderer(options);

    font = this.options.font || "Serifcap";

    return  parseFont(font)
      .then(() => {
        markdown = readSlide(slide);
        return markdown;
      })
      .then(content => {
        /* parsing tokens and put tokens into each page */
        markedopt = merge({} , marked.defaults , { renderer: renderer
                                                 , promise: true});

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
      });
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
        });
        outs.push(out);
      });
      return outs;
    });
};

/**
 * Render slide
 */
Slide.prototype.render = function() {
  var options = this.options;

  if (this.screen === null) {
    this.screen = blessed.screen({
      smartCSR: true
    });

    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });

    this.screen.key(['r'], (ch, key) => {
      this.reload();
    });
  }


  this.parse()
  .then(contents => {
    /* put parse result into blessed box */
    var screen = this.screen;
    var boxes =[];
    var numPages = contents.length;
    contents.forEach((content, idx) => {
      boxes.push(function(screen, currPage) {
        /* slide content page box */
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
        /* slide page index box */
        var idxBox = blessed.box({ right: 6
                                 , bottom: 2
                                 , width: "6%"
                                 , height: "5%"
                                 , style: {invisible: true}
                                 , content: currPage + 1 + '/' + numPages});
        screen.append(idxBox);

        /* set fade in animate */
        /* FIXME: current solution is bad */
        setTimeout(() => {
          box.style.invisible = false;
          box.style.transparent = true;
          idxBox.style.invisible = false;
          idxBox.style.transparent = true;
          screen.render();
          setTimeout(() => {
            box.style.transparent = false;
            idxBox.style.transparent = false;
            screen.render();
          }, 80);
        }, 100);
      });
    });
    return Promise.all(boxes);
  })
  .then(boxes => {
    /* put boxes into carousel */
    var carousel = new contrib.carousel(boxes
                                     , { screen: this.screen
                                       , interval: 0
                                       , rotate: false
                                       , controlKeys: true });
    carousel.start();
  })
  .catch(e => {
    console.log(e);
  });
};

module.exports = Slide;
