var Slides = require('./slide')
  , theme = require('./themes/Ptt');

const slides = [
  'slides/slide1.md',
  'slides/slide2.md',
  'slides/slide3.md',
  'slides/slide4.md'];

let noslide = new Slides(slides, theme);
noslide.render();
