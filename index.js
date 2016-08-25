var blessed = require('blessed')
  , Slides = require('./slide')
  , theme = require('./themes/Ptt');

let screen = blessed.screen();
const slides = [
  'slides/slide1.md',
  'slides/slide2.md',
  'slides/slide3.md',
  'slides/slide4.md'];

let noslide = new Slides(slides, theme);
noslide.render(screen);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
