---
title: JavaScript对象类型判断
date: 2013-12-20
layout: page
tags:
---
### 使用typeof操作符

typeof操作符号的作用是返回一个用于只是其操作对象类型的字符串。语法如下：

```js
typeof val
```


`val`参数作为一个表达式，代表了JavaScript中的对象类型或基本数据类型，`typeof`运算会返回该对象或基本数据类型的字符串描述。

`typeof`根据操作对象和对应的类型描述字符串，包括以下几种：


 <table class="standard-table">
 		<thead>
  <tr>
   <th scope="col">操作对象或基本数据类型</th>
   <th scope="col">类型描述字符串</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>Undefined</td>
   <td><code>"undefined"</code></td>
  </tr>
  <tr>
   <td>Null</td>
   <td><code>"object"</code></td>
  </tr>
  <tr>
   <td>Boolean</td>
   <td><code>"boolean"</code></td>
  </tr>
  <tr>
   <td>Number</td>
   <td><code>"number"</code></td>
  </tr>
  <tr>
   <td>String</td>
   <td><code>"string"</code></td>
  </tr>
  <tr>
   <td>Function</td>
   <td><code>"function"</code></td>
  </tr>
  <tr>
   <td>Object(任何其它js对象)</td>
   <td><code>"object"</code></td>
  </tr>
 </tbody>
</table>


例如:
```js
// string
typeof "" === "string";
typeof "abc" === "string" ;
typeof String("abc") === "string" ;
typeof (typeof 1) === "string" ;

// number
typeof 1 === "number" ;
typeof NaN === "number" ;
typeof Math.PI === "number" ;
typeof Infinity === "number" ;
typeof Number(1) === "number";

// boolean
typeof true === "boolean" ;
typeof false === "boolean" ;
typeof Boolean(false) === "boolean";

// undefined
typeof Undefined === "undefined" ;
typeof val === "undefined"; // 在js中通过var定义但未初始化的变量值为undefined,任何未通过var定义且未初始化的变量的初值为undefined

// function
typeof function(){} === "function" ;
typeof String === "function" ;
typeof Object === "function" ;
typeof new Function() === "function" ;

// object
typeof {} === "object" ;
typeof [] === "object" ;
typeof new Date() === "object" ;
typeof new String("abc") === "object" ; // ---1
typeof new Number("abc") === "object" ; // ---2
typeof new Boolean("abc") === "object" ;// ---3
typeof null === "object" ;				// ---4
```

以上示例中，在判断对象类型时1,2,3,4四种情况比较特殊，其中1,2,3属于一类，JavaScript中通过`new`操作符来创建对象，`new`后面跟的是构造器(constructor)，JavaScript中没有类似于java中的`自动装箱/拆箱(Auto-Boxing/Unboxing)`机制来完成基本数据类型与其对应对象类型的自动转换，语言的灵活性与语法的规范性不能兼得，所以在实际编程中只能靠约定尽量避免这种会产生歧义的使用方式。

null值在逻辑上表示空对象指针，这也可以理解`typeof`返回的返回值为什么是`"object"`了。所以非空对象类型的正确的判断方式是

```js
typeof val === "object" && val !== null
```
此外以上判断对象类型的示例中忽略了JavaScript中的正则表达式。由于浏览器之间的差异，对于正则表达式的判断没有一致性的实现，对于正则表达式而言，`typeof`可能会返回`"object"`或`"function"`

```js
typeof /w/ === 'function' ;
typeof /w/ === 'object'
```
### 使用toString方法

JavaScript语言环境中提供了一些标准的内建对象类型，其中`Object`类型是所有对象类型的基类，JavaScript中没有纯粹化的`类型`的概念，而是基于JavaScript中特有的继承模式:`原型链继承`，所有内建类型对象或自定义类型对象在创建后都会继承`Object.prototype`中的属性和方法，在Object的原型对象中的`toString()`方法会返回一个代表对象类型的字符串，该字符串的格式为`"[object type]"`,其中`type`则代表对象的类型。如:

```js
var obj = new Object();
obj.toString(); // return [object Object]
```
Ecmascript5.1版本的规范中对于Object.prototype.toString的描述如下
>15.2.4.2 Object.prototype.toString ( )
>
>	When the toString method is called, the following steps are taken:
>
>	1. If the this value is undefined, return "[object Undefined]".
>
>	2. If the this value is null, return "[object Null]".
>
>	3. Let O be the result of calling ToObject passing the this value as the argument.
>
> 4. Let class be the value of the [[Class]] internal property of O.
>
> 5. Return the String value that is the result of concatenating the three Strings "[object ", >class, and "]".

因此只要自定义类型没有重写其原型对象中的`toString()`方法，或着派生自`Object`的对象没有重写`toString()`方法，那么调用对象本身的`toString()`方法可以正确获得其类型描述。如对于内建类型:

```js
// date
new Date().toString(); // return [object Date]

// number
var val = 1 ;
new Number(1).toString();	// return [object Number]
val.toString(); // return [object Number]

// boolean
new Boolean(true).toString(); // return [object Boolean]
var val = true ;
val.toString(); // return [object Boolean]

// string
new String("").toString();// return [object String]
var val = “” ;
val.toString(); // return [object String]

// object
new Object().toString();// return [object Object]

// regexp
new Regexp().toString();// return [object Regexp]
var val = /w/ ;
val.toString();// return [object Regexp]

// array
new Array().toString();// return [object Array]
var val = [];
val.toString();// return [object Array]

// function
new Function().toString();// return [object Function]
var val = function(){};
val.toString();// return [object Function]

// error
new Error().toString();// return [object Error]
```
对于自定义类型:

```js
function Person(name){
	this.name = name ;
}
new Person().toString();// return [object Object]
```
如果自定义类型覆盖`toString`方法，如:

```js
Person.prototype.toString = function(){
	return "Person Class";
}
```
那么，之后

```js
new Person().toString() // return Person Class
```
因此要在所有对象上都能使用原始的`Object.ptototype.toString`方法，需要结合`Function.prototype.call`方法，并将对象作为`this`参数传递进`call`方法，如:

```js
var _toString = Object.prototype.toString;

_toString.call(new Person());// return [object Object]
```
这样相对于`typeof`来说，使用`toString`方法来判断不但能区分变量是否是对象类型，甚至可以判断对象的是数组，日期，正则表达式,还是函数。

### jQuery.type()的实现

jQuery中提供了一个用来判断对象`内建`类型的方法[`jQuery.type`][1],其内部实现则是结合`typeof`和`toString`方法实现的。实现流程其源码如下:

1. 定义保存类型的全称与简写映射的对象

	```js
	// [[Class]] -> type pairs
	class2type = {},
	```
2. 定义保存`Object.prototype.toString`方法的变量,此处使用的是原型继承来实现

	```js
	core_toString = class2type.toString,		
	```
3. 建立实际的映射关系,`[object type] -- > type`

	```js
	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object 		Error".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	```
4. 实现[`jQuery.type`][1]方法，并扩展到jQuery中，以下是简化版

	```js
	jQuery.extend({
		type: function( obj ) {
			if ( obj == null ) {
				return String( obj );
			}
			return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
		}
	});
	```
[`jQuery.type`][1]方法调用返回的是字符串类型，所有返回值包括`'object'`,`'null'`,`'undefined'`,`'date'`,`'number'`,`'function'`,`'array'`,`'string'`,`'regexp'`,`'boolean'`

>JavaScript中 null == undefined会返回true

具体实例，参见[`jQuery.type`][1]官网API

### 参考

+ [MDN toString()][2]
+ [MDN typeof][3]
+ [jQuery.type()][1]

[1]: http://api.jquery.com/jQuery.type/
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
