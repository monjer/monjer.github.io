---
title: ES6笔记 - Iterator
date: 2016-05-22 23:06:24
tags:
    - ES6
    - JavaScript
---



### 简介

集合的遍历操作基本上存在于每种语言当中，在ES6之前遍历操作主要针对的时Array类型和对象类型，使用遍历的语句时for语句，while语句和for in语句。新的ES6又添加了Set和Map等新的集合类型，此外，一直以来在DOM对象上也存在一些ArrayLike对象，NodeList等等，所有定义一套机制来为这些集合类型的数据结构提供一直的访问方式，显得十分必要。ES6添加了Iterator正是为了更好的一致性的遍历集合。

Iterator是可以理解为是一种协议(protocol)或接口，它定义了`next()`方法返回一个结果对象，这个对象上拥有两个属性:
+ `value`属性，用来当前遍历对象的值，
+ `done`属性，返回一个布尔值表示是否遍历操作已完成，如果完成则返回true（此时的value为undefined），否则返回false。

实现了Iterator的对象都成为Iterator对象，而这些对象即拥有了以上的特性。

### 模拟Iterator

可以使用以下代码模拟Iterator的工作原理：

```js
function makeIterator(arrayLikeObj){
  var curIndex = -1;
  return {
    next: function(){
       var l = arrayLikeObj.length ;
       curIndex++;
       return curIndex < l ? {value: arrayLikeObj[curIndex],done: false}
                                            :{done:true,value:undefined};
    }
  };
}

var iterator = makeIterator([1,2,3]);
console.log(iterator.next()); // Object {value: 1, done: false}
console.log(iterator.next()); // Object {value: 2, done: false}
console.log(iterator.next()); // Object {value: 3, done: false}
console.log(iterator.next()); // Object {value: undefined, done: true}
```

### Iterable协议

Iterable协议允许JavaScript对象定义自己的遍历行为，为此对象必须实现以`Symbol.iterator`命名的属性，该属性必须返回一个iterator对象，当对象被遍历时，比如使用`for of`语句，都会直接操作这个iterator对象。所以说只要一个对象实现了`Symbol.iterator`属性，那么它就是可遍历的。所有的JavaScript内建的集合类型Array，Set，Map和String类型，以及DOM的集合类型HTMLCollection，NodeList都实现了该属性。

以上提到的`for of`语句结构如下：
```js
for (variable of iterable) {
  statement
}
```
它遍历iterator对象时，每次都会调用其`next()`方法，然后把返回对象的`value`属性保存到`variable`变量上，知道返回对象的`done`为true时则停止，比如访问数组：

```js
let arr = [1, 2, 3];
let str = "";
for(let item of arr){
 str += item;
}
console.log(str += item); // 123
````
### 访问默认的Iterator

使用`Symbol.iteraor`可以访问对象的iterator遍历器，比如

```js
let arr = [1,2,3];
let iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // Object {value: 1, done: false}
console.log(iterator.next()); // Object {value: 2, done: false}
console.log(iterator.next()); // Object {value: 3, done: false}
console.log(iterator.next()); // Object {value: undefined, done: true}
```
以上代码是获取了数组的iterator对象，并进行了遍历。可以定义以下方法判断一个对象是否时可遍历的

```js
function isIterable(obj){
    return typeof obj[Symbol.iterator] === "function";
}
console.log(isIterable([1, 2, 3]));     // true
console.log(isIterable("Hello World")); // true
console.log(isIterable(new Map()));     // true
console.log(isIterable(new Set()));     // true
console.log(isIterable(new WeakMap())); // false
console.log(isIterable(new WeakSet())); // false
```
`for of`语句在进行遍历之前的检测原理与以上代码类似，如果在一个没有实现`Symbol.iterator`属性的对象上使用`for of`语句会报语法错误，比如

```js
var obj = {};
for(let v of obj){ // Uncaught TypeError: obj[Symbol.iterator] is not a function(…)
  // do something
}
```

### 使用generator函数创建Iterable对象

对象默认创建后是不能遍历的，但以上也提到过，只要实现`Symbol.iterator`属性的对象都是可遍历的，因此我们可以通过此方式来是一个对象变成可遍历对象，ES6使用Generator对象来完成此操作。Generator对象是有generator函数创建的一种特殊对象，它同时遵循Iterator协议和Iterable协议，generator函数是以一个添加在function关键字后的`*`标记的函数，并且结合使用新的`yield`关键字，返回这里只要知道它是在对象上实现`Symbol.iteraor`最简单的方法就可以了。

```js
let myCollection = {
  items: [],
  *[Symbol.iterator]():{
    for(value of this.items){
      yield value;
    }
  }
};
myCollection.items.push(1);
myCollection.items.push(2);
myCollection.items.push(3);
for(let value of myCollection){
  console.log(value);
}
// 输出打印
// 1
// 2
// 3
```
以上代码中只要使用`yield`命令返回每一步的值即可。

### 内建的iterable类型

由于遍历操作的常见性，JavaScript内建对象类型已经实现了iterable协议，主要有集合类型Map,Array,Set,字符串类型String，以及DOM的NodeList类型。

1. **集合类型**
```js
let arr = [1,2,3];
let set = new Set(['red','black','blue']);
let map = new Map([['7',7],['8',8],['9',9]]);

for(let v of arr){
  console.log(v);
}
for(let v of set){
  console.log(v);
}
for(let entry of map){
  console.log(entry);
}
// print
1
2
3
red
black
blue
["7", 7]
["8", 8]
["9", 9]
```
此外，三个集合类型都实现了相同名称的方法`keys()`,`values()`,`entries()`，它们都会返回一个新的iterator对象用于遍历操作。
2. **String类型**
String类型一直依赖操作形式上都与Array类型相似，如可以使用括号记法来访问每个字符，也有length属性返回字符长度，也可以实现了`Symbol.iterator`属性，返回一个iterator对象遍历每个字符。

```js
var str = 'hello';

for (let c of str) {
    console.log(c);
}

```
输出
```js
h
e
l
l
o
```

3. **NodeList类型**
DOM对象的NodeList代表了在文档中一组DOM对象的集合，经常操作DOM对象的人对它并不陌生，以前在遍历NodeList对象时，我们通常使用for循环，ES6后NodeList也如Array一样实现了iterable协议，因此现在可以使用`for of`遍历NodeList对象，如：

```js
var divs = document.getElementsByTagName("div");

for (let div of divs) {
    // do something
}
```

### 使用iterable语法的场景

以下是几个在JavaScript中使用iterable的表达式或语法。

1. **for of语句**
2. **Spread运算符**
3. **yield语句**
4. **变量的解构赋值**
6. **Set，Map，Array，WeakMap，WeakSet构造器的参数**



### 参考

+ [Iteration protocols][1]
+ [Symbol.iterator][2]
+ [Iterators and generators][3]

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
