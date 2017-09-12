---
title: ES6笔记 - Function扩展
date: 2016-05-13  23:04:44
tags:
    - ES6
    - JavaScript
---
### 简介

在任何的编程语言中，函数都是最基本的构建，用来将复杂的任务分解成一个个相互独立而又协同工作小的功能单元。在ES6之前，JavaScript的函数并没有很大的变化，
但ES6为JavaScript的函数带来了许多新特性，包括**默认参数**，**rest参数**，**箭头函数**,以下时这些特性的简单介绍。

### 默认参数

JavaScript的函数允许我们定义任意个数的参数，ES5之前函数的参数默认值为`undefined`，但是通常情况下，我们需要为函数的参数添加一个合理的默认值，而不是`undefined`，
这也是我们在使用函数时最常见的操作。

ES6之前我们使这样处理的

```js
function ajaxCall(url , success , fail , timeout){
  success = success || function(){} ;
  fail = fail || function(){} ;
  timeout = timeout || 1000 ;
  // ajax请求
}

ajaxCall('/get.do');
```
以上是使用逻辑或来为参数添加默认参数，因为在第一个条件为false时逻辑或总返回第二个操作数，但更加严谨的做法是严格判断参数类型

```js
function ajaxCall(url , success , fail , timeout){
  success = (typeof success == 'undefined') ?  function(){} : success;
  fail = (typeof fail == 'undefined') ?  function(){} : success;
  timeout = (typeof timeout == 'undefined') ? 1000 : timeout;
  // ajax请求
}

ajaxCall('/get.do');
```
ES6后可以使用

```js
function ajaxCall(url , success= function(){} , fail=function(){} , timeout=1000){
  // ajax请求
}

ajaxCall('/get.do');
```

可以对任意位置的参数给定默认值

```js
function ajaxCall(url , success= function(){} , fail=function(){} , timeout){
  // ajax请求
}

ajaxCall('/get.do');
ajaxCall('/get.do' , function success(){} , function fail(){});

```

还可以以表达式的形式为参数指定默认值

```js
function getValue(){
  return 1;
}
function add(a , b = getValue()){
return a+b;
}
console.log(add(1)); // 2
console.log(add(3)); // 4
```

ES5非严格模式下，参数的更改会影响`arguments`对象的值

```js
function testFn(a , b){
  console.log(a == arguments[0]);
  console.log(b == arguments[1]);
  a = 'e' ;
  b = 'f';
  console.log(a == arguments[0]);
  console.log(b == arguments[1]);
}
testFn('a' , 'b');
// true
// true
// true
// true

```

ES6后，参数的更改不会影响`arguments`对象的值

```js
function testFn(a , b){
  console.log(a == arguments[0]);
  console.log(b == arguments[1]);
  a = 'e' ;
  b = 'f';
  console.log(a == arguments[0]);
  console.log(b == arguments[1]);
}
testFn('a' , 'b');
// true
// true
// false
// false

```

### rest参数

JavaScript函数使用`arguments`对象来保存所有传入函数的参数，`arguments`是一个arraylike对象，可以向数组那样按索引来访问每个元素，例如
`arguments[0]`代表函数的第一个参数，依次类推，通过这种方式，JavaScript的函数可以支持任意个数的参数，如

```js
function plus(){
  var res = 0;
  var length = arguments.length ;
  for(var i = 0 ; i < length ; i++){
    res += arguments[i];
  }
  return res ;
}
```
以上函数`plus()`函数用来对传入的任意个数的数值进行累加计算，但可以看出`plus`函数本身至关上并没有很好的展示出可以传入任意多个参数，好在ES6添加了
剩余参数(rest parameters)以更加语义化的方式来表达这一行为，剩余参数是设计用来代替`arguments`对象的。

剩余参数以`...参数名`来标识，用来获取函数的剩余的参数，由这些参数组成一个数组，`...`在ES6中称为Spread运算符，如：

```js
function plus(...values){
  var res = 0;
  var length = values.length ;
  for(var i = 0 ; i < length ; i++){
    res += values[i];
  }
  return res ;
}
```
以上`...values`包含了所有传入`plus()`函数的数值，现在第一眼我们就能判断出`plus()`函数的参数可以时任意多个，语义上更加明确。
在使用剩余参数时，语法上也是有一些限制条件的：
+ 一个函数剩余参数有且仅有一个，而且必须放在函数所有参数的最后一个。
```js
// 错误，剩余参数后不能再有其它摊书
function testFn(paramA , ...restParam , paramLast){
  // to do
}
//错误，一个函数剩余参数有且仅有一个
function testFn(...restParamsA , ...restParamB){
  // to do
}
```
+ 剩余参数不能用在对象字面量的setter方法中
```js
let obj = {
  // 错误
  set values(...values){

  }
}
```

rest参数变量是一个数组类型，因此它可以使用所有数组的方法。

### name属性

ES6中函数`Function.name`属性用来返回一个函数的名称，`name`属性可以用来作为函数的一种标识，可以用来在debug时使用。

```js
function doSomething() {}
console.log(doSomething.name); // "doSomething"

```
匿名函数覆盖一个变量后，该函数的name属性在ES5下为空值，ES6后为变量名称

```js
var testFn = function(){}
console.log(testFn.name); // es5为 ""
console.log(testFn.name); // es6为 "testFn"
```
函数表达式的`name`属性为表达式的名称，即使是将它赋值给另一个函数，或添加到对象的方法上

```js
let f = function fnExpress(){};
console.log(f.name);// "fnExpress"

let person = {
  sayHi: function fnExpress(){

  }
}
console.log(person.sayHi);// "fnExpress"
```

使用`Function`创建的函数的名称为"anonymous"

```js
console.log(new Function().name); // "anonymous"
```
使用`bind()`方法创建的函数，名称前会添加一个"bound"前缀

```js
function testFn(){}
console.log(testFn.bind().name); // "bound testFn"
```
### `new.target`元属性

JavaScript中function既能定义函数，也能定义创建对象的构造器，因此函数可以有多种调用方式，如

```js
// 定义Dog类
function Dog(name){
  this.name = name ;
}
var dog = new Dog('拉布拉多');
var errCall = Dog('拉布拉多'); // 错误的用法,错误的为全局对象添加了一个name属性
```
以上我们以大写的D开头意在定义`Dog`类型，并使用`new`操作符来创建对象，但我们依然可以直接以普通函数的形式调用`Dog`,这时`this`指向的时全局对象，
在浏览器中指的是`window`对象，这显然是与我们的初衷背离的。ES5之前，我们可以使用`instanceof`关键字对`this`做检测，检查`this`兑现是否时类的实例，

```js
function DOg(name){
  if(this instanceof Dog){
    this.name = name ;
  }else{
    throw new Error('请使用new关键字调用Dog');
  }
}

var dog = new Dog('拉布拉多');
var errCall = Dog('拉布拉多'); // error
```
以上可以初步解决类构造器当做函数调用，但也不是完美的，

```js
var dog = new Dog('拉布拉多-1');
Dog.call(dog , '拉布拉多-2'); // 这也是可以的
```

使用`call()`和`apply()`，我们可以改变函数调用时上下文this对象。

ES6添加`new.target`属性来判断函数是否使用的是`new`调用的。当函数直接调用时，`new.target`值为`undefined`，函数使用`new`调用时，`new.target`
指向的该函数的构造器。

```js
function Dog(name){
  if(!new.target){
    this.name = name ;
  }else{
    throw new Error('请使用new关键字调用Dog');
  }
}
var dog = new Dog('拉布拉多');
var errCall = Dog('拉布拉多'); // error
```
虽然`new.target`乍看起来有点奇怪，因为`new`在JavaScript中属于操作符，但在函数内，`new`却变成了一种“特殊”的对象(其实不是真正的对象)

### 箭头函数 - Arrow function
arrow函数表达式是ES6中函数最特殊的变化，它引入了一种新的语法，`=>`，来使用函数。arrow函数相比较其它普通函数来，有一些特点

+ 语法更精简。
+ 没有this, super, arguments, 和new.target的绑定问题，所有这些值都取离arrow函数的最近的上下文所指的值或引用。
+ 不能在arrow函数上使用new调用。
+ 没有原型属性prototype。
+ this不能改变，尽管是使用`call()`和`apply()`调用，this不受影响。

在JavaScript的function中，this绑定是最常见的操作，也是最容易让人困惑和容易出错的地儿，arrow函数的特性避免this绑定的问题，与此同时arrow函数
也会带来进一步的代码优化。

arrow函数的语法比较灵活，可以有多种写法

```js

// 空函数,返回undefined，没有参数传入时，必须使用括号
let empty = () => {} ;
// 等价于ES5的
var empty = function(){}

// 接受单个参数并返回,
let identity = (value) => { return value ;}
// 单个参数可以省略括号
let identity = value => vlaue ;
// 等价于ES5的
var identity = function(value){
  return value ;
}
// add函数，返回两个参数的和
let add = (valA , valB) => valA + valB ;
// 或
let add = (valA , valB) => {
  return valA + valB ;
}
// 等价于ES5的
var add = function(valA , valB){
  return valA + valB ;
}

// 用括号包裹的形式直接返回对象字面量
let randomObj = id => ({id:id}) ;
//等价于ES5的
var randomObj = function(id){
  return {
    id: id
  };
}

// 立即执行的函数调用IIFES
var obj = ((id)=>{
  return {
    id: id
  };
})(1);
等价于ES5的
var obj = (function(id){
  return {
    id: id
  };
})(1);

// 使用rest参数
let multip = (...vals)=>{
  var res = 1 ;
  vals.forEach((val) => {
    res *= val;
  });
  return res ;
}
// 等价于ES5的
var multip = function(){
  var args = arguments;
  var res = 1 ;
  for(var i = 0 , l = args.lengh ; i < l ; i++){
    res *= args[i];
  }
  return res ;
}

// 默认参数
var ajax = (url , data={} , onSuccess=function(){})=>{
  // ajax call
}

// 没有this绑定问题,arrow函数的this指向的其所在上下文环境
// 即使是通过call()和apply()也无法改变其this指向。
var person = {
  name:'Jim',
  delaySayHi:function(){
    setTimeout(()=>{
      console.log(this.name + 'sayHi');
    }, 1000);
  }
}

person.delaySayHi();
// 等价于ES5的
var person = {
  name:'Jim',
  delaySayHi:function(){
    var self = this ;
    setTimeout(function(){
      // 通过创建闭包来完成对this的指向转换
      console.log(self.name + 'sayHi');
    }, 1000);
  }
}

// 没有arguments对象
function fn(){
  let arrFn = () => arguments[0];
  console.log(arrFn());
}
fn(100); // 100， 此处的arrFn中引用的是其作用域链也就是fn所暴露的argumens对象

// arrow函数的类型判断
let arrFn = ()=>{}
console.log(typeof arrFn); // function
console.log(arrFn instanceof Function)); // true

// arrow函数与数组方法,数组中有多个遍历元素的方法使用arrow函数会很方便

var res = [1,2,3].map( (val)=> val * 2);
console.log(res); // [2, 4, 6]

```
### 严格模式下的尾调优化

ES6在严格模式下会进行一项称为尾调优化的行为，尾调是指一个函数在另一个函数的最后调用，如以下形式

```js
function outerFn(){
  // to do
  return innerFn(); // 在尾部调用函数并返回
}
```

需要满足四个条件

+ 严格模式。
+ 尾部调用函数不会引用当前调用栈的变量（即，没有创建闭包）。
+ 尾部调用必须是最后一个处理，之后没有其它调用语句。
+ 必须返回尾部调用的调用值。

所以以下几种都不属于尾部调用

```js
// 1
"use strict";
function outerFn() {
  // 没有返回值
  innerFn();
}

// 2
"use strict";
function outerFn() {
  // 不能有进一步操作
  return 1 + innerFn();
}

// 3
"use strict";
function outerFn() {
  // 调用不在尾部
  var res = innerFn();
  return res ;
}
// 4
"use strict";
function outerFn() {
  let num = 2 ;
  // 此处创建了闭包
  let innerFn = ()=>{
    return num ;
  }
  return innerFn();
}
```
在计算机中调用栈是用来存储当前子程序信息的栈型数据结构，主要用来记录函数调用时的位置，局部变量等信息，又称作调用帧（Call frame），调用栈就是由一个个调用帧组成的，每次函数的调用都会创建一个调用帧，然后push到调用栈顶，如A调用B,B调用C，那么调用栈上从顶向下记录的是callFrameC->callFrameB->callFrameA。当出现多级嵌套调用时就有可能发生栈溢出（Stack overflow）的错误，由于尾掉函数处于最后，不再需要保留外层调用帧，直接使用当前帧去掉外层帧即可，以达到优化的目的。


### 参考

+ [MDN new.target][1]
+ [MDN Rest parameters][2]
+ [MDN Arrow Function][3]
+ [Wiki Call stack][4]
+ [Stack overflow][5]

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[4]: https://en.wikipedia.org/wiki/Call_stack#CALL-FRAME
[5]: https://en.wikipedia.org/wiki/Stack_overflow
