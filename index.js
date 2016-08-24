var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  , Slides = require('./slide');

let screen = blessed.screen();
const slides = [
  'slides/slide1.md',
  'slides/slide2.md'];

let noslide = new Slides(slides);
noslide.render(screen);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
