# noslide.js

A command-line based markdown presentation tool which writen by **nodejs**.

All pull requests are welcome!

---


### Noder JS

### Email: NoderJS@example.com


# Ordered list

Markdown

```
1. List examples
2. code block
3. Remote Image
4. Local Image
5. Table
6. Q & A
```

become

1. List examples
2. code block
3. Remote Image
4. Local Image
5. Table
6. Q & A

# Unordered list

Markdown

```
* item 1
* item 2
.. Unordered sub-list
* item 3
.. Unordered sub-list
* final item
```

become

* item 1
* item 2
.. Unordered sub-list
* item 3
.. Unordered sub-list
* final item


# Code Block

Markdown

```
var str = "Hello noslide.js!!! (>////<)"

/* Example code block (from request README) */
request('http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
})
```

become

```js
var str = "Hello noslide.js!!! (>////<)"

/* Example code block (from request README) */
request('http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
})
```

# Inline Code

Markdown

```
Inline `code` has `back-ticks around` it.
```

become

Inline `code` has `back-ticks around` it.

# Local Image

Markdown

```
![](images/ptt.jpg)
```

become

![](images/ptt.jpg)

# Remote Image!

Markdown

```
![](https://octodex.github.com/images/baracktocat.jpg)
```

become

![](https://octodex.github.com/images/baracktocat.jpg)


# Table

Markdown

```
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

become

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


# Link

Markdown

```
* [GitHub](https://github.com/crazyguitar/noslide.js)
* [blessed](https://github.com/chjj/blessed)
* [blessed-contrib](https://github.com/crazyguitar/blessed-contrib)
* [marked](https://github.com/crazyguitar/marked)
* [marked-terminal](https://github.com/mikaelbr/marked-terminal)
* [image-to-ascii](https://github.com/IonicaBizau/image-to-ascii)
```

become

* [GitHub](https://github.com/crazyguitar/noslide.js)
* [blessed](https://github.com/chjj/blessed)
* [blessed-contrib](https://github.com/crazyguitar/blessed-contrib)
* [marked](https://github.com/crazyguitar/marked)
* [marked-terminal](https://github.com/mikaelbr/marked-terminal)
* [image-to-ascii](https://github.com/IonicaBizau/image-to-ascii)

# Thank You!

[GitHub](https://github.com/crazyguitar/noslide.js)

