const deepset = function (obj, keys, val) {
	keys.split && (keys=keys.split('.'));
	var i=0, j, o, x, len=keys.length;
	while (i < len) {
		o = obj;
		for (j=0; j < i; j++) o=o[keys[j]];
		x = (o[keys[i]] == null) ? {} : o[keys[i]];
		o[keys[i]] = (++i === len) ? val : x;
	}
}
;

let foo = { a:1, b:2 };
let bar = { foo:123, bar:[4, 5, 6], baz:{} };
let baz = { a:1, b:{ x:{ y:{ z:999 } } }, c:3 };

deepset(foo, 'd.e.f', 'hello');
// or ~> deepset(foo, ['d', 'e', 'f'], 'hello');
console.log(foo);
//=> { a:1, b:2, d:{ e:{ f:'hello' } } };

deepset(bar, 'bar.1', 999);n
// or ~> deepset(bar, ['bar', 1], 999);
console.log(bar);
//=> { foo:123, bar:[4, 999, 6], baz:{} };

deepset(baz, 'b.x.j.k', 'mundo');
deepset(baz, 'b.x.y.z', 'hola');
console.log(baz);