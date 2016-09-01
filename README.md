# Install

```bash
git clone https://github.com/crazyguitar/noslide.js
cd noslide.js
npm install
```

# Demo

![](images/demo.gif)

# Binary tool

```bash

./noslide <your markdown>

```

# How to use ``noslide``

```js
var noslide = require('./lib/slide')
  , theme = require('./lib/themes/Ptt');


const markdown = 'slides/example.md'

let slide = new noslide(markdown, theme);
slide.render();
```
