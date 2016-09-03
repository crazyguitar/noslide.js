# noslide.js

[![NPM](https://nodei.co/npm/noslide-js.png?compact=true)](https://nodei.co/npm/noslide-js/)

### Install

```bash
git clone https://github.com/crazyguitar/noslide.js
cd noslide.js
npm install
```
##### Install binary tool

```bash
npm install -g
```


### Demo

![](images/demo.gif)

### Binary tool

```bash
$ noslide -h

  Usage: noslide [options] <markdown>

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -t, --theme [theme]  Add the specified theme [Ptt]
```

### How to use ``noslide``

```js
var noslide = require('noslide-js').noslide
  , theme = require('noslide-js').themes.Ptt;


const markdown = 'slides/example.md'

let slide = new noslide(markdown, theme);
slide.render();
```

### Other related projects

[vimdeck](https://github.com/tybenz/vimdeck)
[mdp](https://github.com/visit1985/mdp)
[vtmc](https://github.com/jclulow/vtmc)
[tkn](https://github.com/fxn/tkn)
