var marked = require('marked')
  , fs = require('fs')
  , TerminalRenderer = require('marked-terminal')
  , colors = require('colors')
  , asciimo = require('asciimo').Figlet;

let font = "Serifcap";
let path = 'README.md';

function parseFont(font) {
  return new Promise((resolve, reject) => {
    asciimo.parseFont(font, () => {
      resolve(font);
    });
  });
}

function parseHeading(head) {
  return asciimo.parseStr(head, font);
}


parseFont(font)
.then(font => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
})
.then(content => {
  // set terminal
  marked.setOptions({
    renderer: new TerminalRenderer({
      firstHeading: parseHeading
    })
  });
  // show markdown parsing result
  console.log(marked(content));
})
.catch(err => {
  console.log(err);
});


