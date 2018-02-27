# deepset

"A compact (150b) tool for safely writing depth object values ​​~!"

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/Source-Explain)

explanation

> "version": "1.0.0"

[github source](https://github.com/lukeed/deepset)

~~[english](./README.en.md)~~

* * *

This directory

-   [package project starting point](#package)

-   [Usage - example](#example)

-   [The main file-index](#index)

-   [Build-builder](#builder)

* * *

## package

This project has only one document[src / index.js](#index)But we also see[Build Tools 🔧](#builder)

```js
  "scripts": {
    "build": "node builder",
```

## Example

Before explaining, we should understand the use of the library

```js
let foo = { a:1, b:2 };
let bar = { foo:123, bar:[4, 5, 6], baz:{} };
let baz = { a:1, b:{ x:{ y:{ z:999 } } }, c:3 };

deepset(foo, 'd.e.f', 'hello');
// or ~> deepset(foo, ['d', 'e', 'f'], 'hello');
console.log(foo);
//=> { a:1, b:2, d:{ e:{ f:'hello' } } };

deepset(bar, 'bar.1', 999);
// or ~> deepset(bar, ['bar', 1], 999);
console.log(bar);
//=> { foo:123, bar:[4, 999, 6], baz:{} };

deepset(baz, 'b.x.j.k', 'mundo');
deepset(baz, 'b.x.y.z', 'hola');
console.log(baz);
```

Terminal operation -`node try.js`

* * *

## index

```js
export default function (obj, keys, val) {
    // obj Is the object of change

    // keys Variables and depths

    // val variable

    keys.split && (keys=keys.split('.'));// This paragraph has two roles

    // - make sure -split- func, Executed
    // -  Make sure the string becomes an array

	var i=0, j, o, x, len=keys.length;
	while (i < len) { // i depths
		o = obj;
        for (j=0; j < i; j++) o=o[keys[j]]; // Parents who reach the depth of i variable--> o
        
        x = (o[keys[i]] == null) ? {} : o[keys[i]]; // if val, default-val | {}
        // x  default-val
        o[keys[i]] = (++i === len) ? val : x; // This section has done two things
        // 1. Whether the test came - fixed - variable depth 
        // . true-> get val
        // . false-> default-val x
        // 2. Add i 1 
	}
}
```

See here, there is a doubt 🤔️

* * *

`while (i <len)`

// ... increment layer by layer, giving upper layer - default value · {} · or - original value

// The main thing to do is,`Give the default {}`

// when

```js
let foo = { a:1, b:2 };
deepset(foo, 'd.e.f', 'hello');
// No `d` no `e`, so you need to give the default layer by layer
```

`++ i`

* * *

## builder

```js
const fs = require('fs');
const mkdir = require('mk-dirs'); // Terminal Command - Build - Directory
const { resolve } = require('path');
const { minify } = require('uglify-js'); // min js
const imports = require('rewrite-imports'); // es6 -> es5
const pretty = require('pretty-bytes'); // good look
const sizer = require('gzip-size'); // gzip size
const pkg = require('./package');

let data = fs.readFileSync('src/index.js', 'utf8'); // source file

// 建目录 dist
mkdir('dist').then(_ => {
	// Copy as is for ESM
	fs.writeFileSync(pkg.module, data); // put es6

	// Mutate imports for CJS
	data = imports(data).replace(/export default/, 'module.exports ='); // change Keywords
	fs.writeFileSync(pkg.main, data); // put es5

	// Uglify & print gzip size
	const { code } = minify(data);//min js
	const int = sizer.sync(code); // show gzip size
	console.log(`> gzip size: ${pretty(int)}`); // cmd output
});
```