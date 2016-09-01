# Install

```bash
git clone https://github.com/crazyguitar/noslide.js
cd noslide.js
npm install
```
### Install binary tool

```bash
npm install -g
```


# Demo

![](images/demo.gif)

# Binary tool

```bash
./noslide -t <theme> <your markdown>

# or exec npm install -g

noslide <your markdown>
```

# How to use ``noslide``

```js
var noslide = require('./lib/slide')
  , theme = require('./lib/themes/Ptt');


const markdown = 'slides/example.md'

let slide = new noslide(markdown, theme);
slide.render();
```
