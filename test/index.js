const { SimpleCache } = require('../dist/');

console.log(SimpleCache);
const t = new SimpleCache({
  maxLength: 100,
});
console.log('start');

console.log(1);
t.set('tt', {a:1,b:2});

console.log(2);
t.set('b', 'qweqwe');

console.log(3);
t.set('b', 'asdasd');

console.log(4);
var tt = t.get('tt');
console.log('tt', tt.toString());
console.log(5);

var v = t.get('b');
console.log('v', v.toString());

console.log(6);
var c = t.get('c');

console.log(7);

t.showInfo();
console.log(8);

t.empty();
console.log(9);

t.get('tt');

console.log(10);
t.showInfo();
