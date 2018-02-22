# deepset

「 一个小巧的（150B）工具，用于安全地写入深度对象值〜！ 」

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/Source-Explain)
    
Explanation

> "version": "1.0.0"

[github source](https://github.com/lukeed/deepset)

~~[english](./README.en.md)~~

---

本目录

- [package 项目起点](#package)

- [用法-示例](#示例)

- [主文件-index](#index)

- [构建-builder](#builder)

---

## package

本项目只有一个文件[src/index.js](#index), 不过我们也看看[构建工具🔧](#builder)

``` js
  "scripts": {
    "build": "node builder",
```

## 示例

在解释前, 我们应该了解库的使用

``` js
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

终端运行- `node try.js`

---

## index

``` js
export default function (obj, keys, val) {
    // obj 是 需要变化的 对象

    // keys 落实变量与深度

    // val 变量值

    keys.split && (keys=keys.split('.'));// 这一段有两个作用

    // - 确保 具有 split 函数, 才执行
    // -  确保 字符串变成数组

	var i=0, j, o, x, len=keys.length;
	while (i < len) { // i 变量深度
		o = obj;
        for (j=0; j < i; j++) o=o[keys[j]]; // 到达 i 变量深度的父辈 --> o
        
        x = (o[keys[i]] == null) ? {} : o[keys[i]]; // 是否 具有 值, 不然 「 默认值 | {} 」
        // x  默认值
        o[keys[i]] = (++i === len) ? val : x; // 这一段做了二件事
        // 1. 测试是否来到-固定-变量深度 
        // . 是-> 赋值 val
        // . 否-> 默认值 x
        // 2. 增加 i 
	}
}
```

看到这里, 还有个疑问🤔️

---

`while (i < len)`

// ... 逐层递增, 赋予上层-默认值·{}·或-原来值

// 这样做最主要是为了, `赋予默认值{}`

// 当
``` js
let foo = { a:1, b:2 };
deepset(foo, 'd.e.f', 'hello');
// 没有 d 没有 e , 所以需要逐层赋予默认值
```
`++i`

---

## builder

``` js
const fs = require('fs');
const mkdir = require('mk-dirs'); // 终端命令-建-目录
const { resolve } = require('path');
const { minify } = require('uglify-js'); // 缩小js
const imports = require('rewrite-imports'); // 将 es6的导入导出 关键字 换成 纯js
const pretty = require('pretty-bytes'); // 变漂亮
const sizer = require('gzip-size'); // gzip 大小
const pkg = require('./package');

let data = fs.readFileSync('src/index.js', 'utf8'); // 源文件

// 建目录 dist
mkdir('dist').then(_ => {
	// Copy as is for ESM
	fs.writeFileSync(pkg.module, data); // 写入 es6

	// Mutate imports for CJS
	data = imports(data).replace(/export default/, 'module.exports ='); // 换关键字
	fs.writeFileSync(pkg.main, data); // 写入 es5

	// Uglify & print gzip size
	const { code } = minify(data);//min js
	const int = sizer.sync(code); // 变成 gzip 的大小
	console.log(`> gzip size: ${pretty(int)}`); // 终端输出
});

```