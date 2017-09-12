---
title: JavaScript JSON对象
date: 2016-06-14 22:13:17
tags:
    - JavaScript
---

在jQuery中，`jQuery.parseJSON()`用来完成将字符串解析为JSON对象的操作，最近jQuery3.0版本的升级说明中该方法被标记为过时的接口，以后对JSON的解析和序列化，推荐使用原生的JSON对象，这是各大浏览器不断升级逐渐向标准靠拢的结果。在JavaScript中，JSON是一个用来对JSON进行解析或序列化的对象。它主要包含两个方法`JSON.parse()`和`JSON.stringify()`。

### JSON.parse

`JSON.parse()`，用来解析字符串生成JavaScript对象，它接收一个json格式的字符串，并返回一个对应的JavaScript对象。

```js
var str = '{ "name": "json string"}';
var obj = JSON.parse(str);
console.log(obj); // Object {name: "json string"}
```
如果传入json字符串的格式错误，这个方法会抛出异常，所以最好添加`try/catch`块。

```js
var str = "{ 'name': 'json string'}";
var obj ;
try{
  obj = JSON.parse(str);
}catch(err){
  console.log(err); // SyntaxError: Unexpected token '
}

console.log(obj); // undefined
```

### JSON.stringify

与`JSON.parse()`方法的功能相反，`JSON.stringify()`方法接收一个JavaScript对象，并返回一个对应的json格式的字符串。

```js
var obj = { name: "json string"};
var str = JSON.stringify(obj);
console.log(typeof str); // string
console.log(str); // {"name":"json string"}
```

### 兼容性

不管是桌面端还是移动端浏览器，所有主流浏览器都已经实现了原生的JSON对象，IE8以上版本的IE浏览器也实现了该对象。兼容性的说明参见[JSON parsing][2]


### 参考

+ [Introducing JSON][1]
+ [Deprecate jQuery.parseJSON][3]
+ [jQuery.parseJSON source code][4]


[1]: http://json.org/
[2]: http://caniuse.com/json
[3]: https://github.com/jquery/jquery/issues/2800
[4]: https://github.com/jquery/jquery/blob/1.12-stable/src/ajax/parseJSON.js