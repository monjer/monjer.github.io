---
title: JavaScript严格模式
date: 2016-05-03 16:09:09
tags:
---

### 简介

ES5作为ES3的补充，在语法层面上并没有进一步的更新，所有ES5的新特性基本上是在ES3上下文上进行的补充和完善。但历来ES的特性和其松散性的语法在为开发者提供
灵活便捷的同时，也同样带来了诸多瑕疵，这些特性和语法中许多会容易引发错误，带来安全问题，并且没有较强的错误检测机制。此外，随着ES本身版本的更新和发展，
一些特性会过时，甚至在将来的版本中直接移除掉。因此在这样的背景下ES5中引入可一种特殊的模式：**严格模式**（Strict Mode）来解决这些问题。

严格模式下的JavaScript代码会得到以下几方面的好处：

+ 消除无声错误（slient errors），转化为错误或异常抛出。
+ 修正一些妨碍JavaScript引擎进行代码优化的错误。
+ 带来更快的代码执行速度。
+ 更加安全，语法更加严谨。

基本上所有现代的主流浏览器都支持严格模式的语法，包括[IE10][1]及其以上版本的浏览器。

### 声明方式

开启JavaScript代码的严格模式，只需要使用`"use strict"`在JavaScript文件的起始位置，程序段的起始位置，或函数的起始位置进行声明即可。这种声明方式称作
_指令序言_(directive prologue)。严格模式的范围依赖于其声明的上下文：

可以是全局范围

```js
"use strict";
function testFunction(){
    var testvar = 4;
    return testvar;
}

// 语法错误，syntax error.
testvar = 5;
```

也可以是某个函数范围。

```js
function testFunction(){
    "use strict";
    // 语法错误，syntax error.
    testvar = 4;
    return testvar;
}
testvar = 5; // 正确
```

也可以为某个脚本范围

```js
<!-- 严格模式 -->
<script>
  "use strict";
   testVar = 4 ;// 语法错误
</script>
<!-- 非严格模式 -->
<script>
   testVar2 = 4 ;// 正确
</script>
```

>在脚本中直接声明严格模式，在多个脚本文件合并时会出现问题，这种情况发生在一部分脚本声明了严格模式，而另一些是非严格模式。
>所以一种变通的做法是将脚本文件的代码包含在一个立即执行函数内，如
>
```js
;(function(){
  "use strict";
  // code below
})();
```


### 限制说明

#### 保留关键字的限制

这些关键字：`implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`, `yield`为保留字，不能被当做变量名
或函数名
```js
"use strict";
var implements = 'implements' ; // 错误
```
#### 变量限制

不能使用未声明的变量
```js
"use strict";
testVar = 4 ; // 错误
var testVar = 4; // 正确
```

#### 只读属性的限制

不能为一个只读属性赋值

```js
"use strict";
var testObj = Object.defineProperties({}, {
    prop1: {
        value: 10,
        writable: false
    },
    prop2: {
        get: function () {
        }
    }
});
testObj.prop1 = 20; // 错误
testObj.prop2 = 30; // 错误
```

#### 不可扩展对象的限制
不能向一个不可扩展的对象(extensible值为false的对象)添加新的属性

```js
"use strict";
var testObj = new Object();

Object.preventExtensions(testObj);

testObj.name = "name"; // 错误

```

#### `delete`操作符的限制
不能删除一个对象，或函数，或参数argument，或一个不可配置(non-configurable)属性

```js
var testObj = {};
var testFn = function(){};

var testObj2 = Object.defineProperty({}, "testProp", {
    value: 10,
    configurable: false
});

delete testObj ; // 错误
delete testFn ; // 错误
delete testObj2.testProp ; // 错误

function testFn2(x){
  delete x ;// 错误
}
testFn2();
````

#### 属性复制限制
不能在同一个对象上定义多个同名属性
```js
"use strict";
var obj = {
  x: 10,
  x: 100
}; // 语法错误

// 语法错误
var foo = {
  get x() {},
  get x() {}
};
// 语法错误
var bar = {
  set y(value) {},
  set y(value) {}
};
```

#### 函数参数复制限制

不能在同一个函数内使用多个同名参数

```js
"use strict";
function testFn(x , x){ // 错误
  return ;
}
testFn(10 , 10);
```

#### 八进制表示法限制

禁止将一个八进制数值赋值给数值变量，禁止在八进制数字上使用转义符

```js
"use strict";
var testOctal = 010; // 错误
var testOctal2 = \010; //错误
```

#### this值的限制
this值不再自动强制转换为对象。当this值为null或undefined时不再强制转换为全局对象。
```js
"use strict";
function testFn(){
  console.log(this); // undefined,而不是全局对象
}
testFn();
testFn.call(null); // null
testFn.apply(undefined); // undefined
```
构造函数忘记使用`new`关键字，this不再指向全局对象，而是直接报错，可以用来避免错误的将类用作函数使用。
```js
"use strict";
function Person(name){
  this.name = name; // undefined,而不是全局对象
}
var p = Person('nameA'); // 错误
var p2 = new Person('name2'); // 正确
```

#### eval限制

严格模式下,`eval`类似于关键字，不能被用来作为标识符，如变量名，函数名，参数名
```js
"use strict";
var eval = "test"; // 错误
function eval(){ // 错误
  // do something
}
function testFn(eval){ // 错误
  return ;
}
var testObj = {
  eval:'prop' // 错误
}
```

#### 声明在eval内变量的限制

在`eval`内声明的变量和函数只能在`eval`内部使用，如同创建了一个作用域一样。

```js
(function() {
    "use strict";
    eval("var x = 10;");
    // 错误， x未定义
    alert(x);
}());
```

#### 函数定义限制

函数不能在语句或块中定义，也就是说函数只能在全局作用域或者函数作用域内
```js
"use strict";
if(true){
  function testFun(){ // 错误
    // do something
  }
}
var funs = [];
for(var i = 0 ; i < 10 ; i++){
  funs.push(function(){ // 错误
    console.log(i);
  });
}
function globalScopeFun() // 正确
{
  function funcScopeFun() { } // 正确
}
```

#### 禁止使用with语句
```js
"use strict";
var obj = {x:10};
var x = 17;
with (obj) // 语法错误
{
  x;
}
```

#### arguments的限制

1.与eval一样，禁止使用arguments作为标识符，如变量名，函数名，函数参数名
```js
"use strict";
var arguments = "test"; // 错误
function arguments(){ // 错误
  // do something
}
function testFn(arguments){ // 错误
  return ;
}
var testObj = {
  arguments:'prop' // 错误
}
```
2.禁止更改函数内arguments任意成员的值

```js
"use strict";
function testFn(){
  arguments[0] = 20 ; // 错误
}
testFn(100);

```

3.禁止使用`arguments.callee`

```js
"use strict";
function recurse(num){
  if(num == -1){
    return 1;
  }
  return arguments.callee(num - 1); // 错误
}
```


### 参考

+ [MSDN JavaScript Strict Mode][1]
+ [MDN JavaScript Strict mode][2]
+ [ECMA-262-5 in detail. Chapter 2. Strict Mode.][3]
+ [It’s time to start using JavaScript strict mode][4]

[1]: https://msdn.microsoft.com/zh-cn/library/br230269(v=vs.94).aspx
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
[3]: http://dmitrysoshnikov.com/ecmascript/es5-chapter-2-strict-mode/
[4]: https://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/