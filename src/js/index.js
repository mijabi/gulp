// var $ = require('jquery');

// $(function(){
//   console.log('hoge');
//   console.log('fuga');
// });

const add1 = (a) => a + 1;
const times2 = (a) => a * 2;
const compose = (a, b) => (c) => a(b(c));
const add1OfTimes2 = compose(add1, times2);
console.log(add1OfTimes2(5)); // => 11

console.log('fg--1');
