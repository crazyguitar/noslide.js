# noslide.js

[![NPM](https://nodei.co/npm/noslide-js.png?compact=true)](https://nodei.co/npm/noslide-js/)

[![Build Status](https://travis-ci.org/crazyguitar/noslide.js.svg?branch=master)](https://travis-ci.org/crazyguitar/noslide.js)
[![Coverage Status](https://coveralls.io/repos/github/crazyguitar/noslide.js/badge.svg?branch=master)](https://coveralls.io/github/crazyguitar/noslide.js?branch=master)
[![Dependencies](https://david-dm.org/crazyguitar/noslide.js.svg)](https://david-dm.org/crazyguitar/noslide.js.svg)

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

### Control Keys

```
    Arrow right      next slide
    Arrow left       previous slide
    Arrow up         scroll up slide
    Arrow down       scroll down slide
    r                reload slide
    esc, q, Ctrl+c   quit
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
