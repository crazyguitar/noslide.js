# Async Await

---

```
 -------------------
|   async function  | <-----------
 -------------------              |
           |   await              |
     -------------------          |
    |   async function  |         |
     -------------------          |
                |  event loop     |
                 -----------------
```


# Outline

1. Callback hell 
2. Promise
3. Async Await in Javascript
4. asyncio
5. Q & A


# Callback hell

```js
task1(in, out => {
  // do something...
  task2(in, out => {
    // do something...
    task3(in, out => {
      // do something...
      task4(in, out => {
        // do something...
        task5(in, out => {
          // do something...
        });
      })
    });
  });
});
```


# Promise

### What is `Promise`

```js
$ cat file.txt | grep Hello | cut -d' ' -f 1
```

# Promise

```js
const fs = require('fs');

let readFile = (file, enc) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, enc, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

var p = readFile('example', 'utf8');
```

```
              readFile <----Main process
                 |                 |
                 V                 |
     --------------------          |
    /                    \         |
   |        Event         |        |
   |        loop          |        |
    \                    /         |
     ----------------------------> | then
                    await readFile V
```

```js
var p = readFile('example', 'utf8');

p
.then(data => { // await readFile
  // grep Hello
})
.then(data => { // await grep
  // cut -d' ' -f 1
})
.catch(e => {
  // error handling
});
```

# Future

```python
import concurrent.futures

from concurrent.futures import ThreadPoolExecutor

def task(n):
    import time
    time.sleep(n)
    return n

e = ThreadPoolExecutor(max_workers=3)

f1 = e.submit(task, 1)
f2 = e.submit(task, 2)
f3 = e.submit(task, 3)

for f in concurent.futures.as_completed([f1,f2,f3]):
    print(f.result())

ff1 = e.submit(task, 1)
ff2 = e.submit(task, 2)

for f in concurrent.futures.as_completed([ff1, ff2]):
    print("sleep: {}".format(f.result()))
```


# Async Await

### Glossary

1. Async: `async` task in `event loop`
2. Await: `await` result from `async` task

### Previous Example

```js
var p = readFile('example', 'utf8');

p
.then(data => { // await readFile
  // grep Hello
})
.then(data => { // await grep
  // cut -d' ' -f 1
})
.catch(e => {
  // error handling
});
```

### Async Await

Test via babel

[gulp-babel](https://github.com/babel/gulp-babel)

```js
const fs = require('fs')

let readFile = (file, enc) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, enc ,(err, data) => {
      if (err) reject(err); 
      resolve(data);
    }); 
  });
};

async function task(file, enc) {
  var data = await readFile(file, enc);
  console.log(data);
};

task('package.json', 'utf8');
```

# asyncio

### Python3

1. Generator function
2. Generator
3. Generator delegate
4. Coroutine

# asyncio

1. Generator function
2. Generator

### Example

```python
>>> def gen_func(n):
...     for _ in range(n):
...         yield _
... 
>>> g = gen_func(10)
>>> next(g)
0
>>> next(g)
1
>>> next(g)
2
>>> next(g)
3
```

# Closure

### A Lightweight process (thread)

1. PID or thread ID
2. State

### Python closure

1. Implement call function
2. Using nolocal statement
3. Using generator


### Fibonacci sequence

```python
>>> def fib(n):
...     prev = 0
...     curr = 1
...     idx = 0
...     while idx < n:
...         idx += 1
...         if idx < 2:
...             yield idx -1
...             continue
...         _ = curr
...         curr = curr + prev
...         yield curr
...         prev = _
... 
>>> g = fib(3)
>>> next(g)
0
>>> next(g)
1
>>> next(g)
2
```

# Round-Robin

```
 q = [t1, t2]
      |
      | <----------------------
      |                        |
      |   event loop    q.append(t)
      |   (schedular)          |
       ----- exec q.popleft()--
```

# Round-Robin

```python
>>> def task(n):
...     for _ in range(n): yield _
... 
>>> t1 = task(5)
>>> t2 = task(3)
>>> from collections import deque
>>> q = deque([t1,t2])
>>> while q:
...     try:
...         t = q.popleft()
...         print(next(t))
...         q.append(t)
...     except StopIteration:
...         pass
... 
0
0
1
1
2
2
3
4
```

# Gen delegate

```python
>>> def gen_func(n):
...     for _ in range(n): yield _
... 
>>> def task(n):
...     yield from gen_func(n)
... 
>>> t = task(10)
>>> next(t)
0
>>> next(t)
1
>>> next(t)
2
```

#### what is `res = yield gen`?

```python
>>> def gen():
...    _ = 0
...    while True:
...        _ = yield _
... 
>>> g = gen()
>>> g.send(None) # == next(g)
0
>>> next(g)
>>> next(g)
>>> g.send(3)
3
>>> g.send(4)
4
>>> g.send(5)
5
```

```
    main thread
        |
        |------------> next(g) 
                         |
         <------------  yield _
        |
        |--g.send(3)---> g
                         |
         <------------ next(g)
        |
        V
```


# Coroutine

### Q? Coroutine == generator


```
      ------------  -----------
    /             /\            \
    |  coroutine |||| generator  |
    \             \/            /
      ------------  -----------
```

# Coroutine 

```python
>>> import asyncio
>>> @asyncio.coroutine
... def task(n):
...     yield from asyncio.sleep(n)
...     print("sleep: {}".format(n))
... 
>>> loop = asyncio.get_event_loop()
>>> tasks = [loop.create_task(task(3)),
...          loop.create_task(task(2))]
>>> loop.run_until_complete(asyncio.wait(tasks))
sleep: 2
sleep: 3
```

### `@asyncio.coroutine` ?

```python
>>> from functools import wraps
>>> def coroutine(func):
...     @wraps(func)
...     def decor(*args, **kwargs):
...         ret = func(*args, **kwargs)
...         import inspect
...         if inspect.isgenerator(ret):
...             ret = yield from ret
...         return ret
...     return decor
... 
>>> @coroutine
... def task(n):
...     yield from asyncio.sleep(n)
...     print('sleep: {}'.format(n))
... 
>>> loop = asyncio.get_event_loop()
>>> tasks = [ loop.create_task(task(3)),
...           loop.create_task(task(2))]
>>> loop.run_until_complete(asyncio.wait(tasks))
sleep: 2
sleep: 3
```

# Async Await

```python
>>> import asyncio
>>> loop = asyncio.get_event_loop()
>>> async def task(n):
...     await asyncio.sleep(n)
...     print('sleep: {} sec'.format(n))
... 
>>> tasks = [ loop.create_task(task(1)),
...           loop.create_task(task(2))]
>>> try:
...    loop.run_until_complete(asyncio.wait(tasks))
... finally:
...    loop.close()
... 
sleep: 1 sec
sleep: 2 sec
```

# Async Await

```
loop.run_until_complete()
            |
            |
        t = task(n) <----------------  
            |                        |
            |                        |
            V                        |
            | --- loop.append(t) ----
            |
            V
         loop.close()
```

# Finally

### Check `asyncio.base_events.py`

# Q & A
