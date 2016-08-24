# Install

```bash
git clone https://github.com/crazyguitar/noslide.js
cd noslide.js
npm install
```

# Demo

![](images/demo.gif)


# How to create a slide

```js
var blessed = require('blessed')
  , Slides = require('./slide');

let screen = blessed.screen();

// Assing your markdown file path here
const slides = [
  'slides/slide1.md',
  'slides/slide2.md',
  'slides/slide3.md'];

let noslide = new Slides(slides);
noslide.render(screen);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
```
