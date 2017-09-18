---
title: JavaScript中对象的拷贝
date: 2017-09-02
---

在面向程序的程序中，对象的拷贝是在处理数据中经常碰到的操作，可以用来做数据部分和下一步的数据变更处理而不影响源数据。所谓对象拷贝（Object clone）也叫对象复制（Object copy）指的是根据当前已有的一个对象创建一个这个对象副本的过程。根据对象拷贝程度的不同又可以分为深拷贝（Deep clone）和浅拷贝（Shallow Copy）。

### 需要区分下数据类型

JavaScript的数据类型分为基本数据类型和引用数据类型，其中：

+ 基本数据类型：Number，String，Boolean，Null，Undefined
+ 引用类型：大多数的对象都是引用类型，比如Date，Array，Function，Regexp等等

引用类型或者称对象类型是一种复杂的数据类型，可以有其它的任意字段组合而成，引用类型的值保存的是内存中的对象，JavaScript语言不允许直接访问内存中的对象，在操作对象时其实是操作的对象的引用而不是对象本身。因此根据数据类型的不同，复制变量时也分为两个情况。

**复制基本数据类型的变量**

比如复制数字类型

```js
// 将num变量的值复制到num1上
var num = 1 ;
var num1 = num ;
```
由于不存在对象指向问题，会在新的变量上创建一个新的值。

<image src="/img/2017-09-02-basic-type.png" width="400"/>

复制对象类型


```js
// 将obj变量的值复制到obj1上
var obj = {name:'hello'} ;
var obj1 = obj;
```

对象的复制相反，是创建了源对象引用或者指针的一个副本，并没有在内存中创建一些新的对象。

![basic type copy](/img/2017-09-02-object-type.png)

### 浅拷贝

所谓浅拷贝它的过程是，如果拷贝对象A生成对象B，那么A对象的所有属性都会复制到B对象上，如果拷贝的属性是基本数据类型，那么在B对象上新建新的值，但如果拷贝的是引用类型属性，那么在B对象上生成的是这个属性对象的引用，也就是A和B的这个属性指向的是同一个对象，那么A对象修改了此属性指向的对象，那么B的也会受到影响。

实现对象浅拷贝的方法有：

**1.自定义方法**

```js
function copy(src){
    var key ;
    var toString = Object.prototype.toString;
    if(toString.call(src) !== "[object Object]"){
        return {}
    }else if(toString.call(src) === "[object Array]"){
        return [].slice.call(src , 0);
    }else{
        for(key in src){
            if(src.hasOwnProperty(key)){
                target[key] = src[key]
            }
        }
        return target;
    }
}
```

**2.Object.assign**

```js
var src = {
    name: 'tom',
    likes:{
        food: true
    }
}
var target = {};
Object.assign(target , src)
```

**3.使用ES6的spread运算符**

```js
var src = {
    name: 'tom',
    likes:{
        food: true
    }
}
var target = {} = {...src}

```

### 对象深拷贝

区别于对象的浅拷贝，对象的深拷贝会逐层拷贝源对象的所有属性，层次上来说浅拷贝，只在对象的的第一个属性层上进行了复制操作，对于对象属性只是简单的拷贝引用，但对于深拷贝来说，在拷贝引用类型属性时，会深入对象内部更进一步的拷贝它的所有属性，之后以此类推。这个拷贝过程中存在一个循环引用问题，即如果`a.b = b ; `同时`b.a = a`，那么对象`a`和对象`b`之间就形成了一个相互引用的关系，那这样在进行深拷贝时会陷入一个死循环。因此对象深拷贝在进一步细分的话，又可以分为按照有没有循环引用做出判断。

加入拷贝的对象没有循环引用的情况，可以使用

**1.JSON.parse和JSON.stringify**

```js
function deepCopy(src){
    if(src !== null && src !== undefined){
        return JSON.parse(JSON.strinify(src));
    }
}
var src = {
    name: 'tom',
    likes:{
        food: true
    }
}
var target = deepCopy(src)
```

**2.使用jQuery.exend方法**

```js
var src = {
    name: 'tom',
    likes:{
        food: true
    }
}
var target = $.extend(src)
```

考虑循环引用的，可以使用

**1.自定义实现**

```js
function copy(src , opt_deep){
    
    copy.cache = copy.cache ? copy.cache : [];
    var toString = Object.prototype.toString;
    function isArray(obj){
        return toString.call(obj) === "[object Array]"
    }
    function isObject(obj){
        return toString.call(obj) === "[object Object]";    
    }
    var key ;    
    var value ;
    var target = isArray(src) ? [] : {};
    copy.cache.push(src)
    for(name in src){
        if(src.hasOwnProperty(name)){
            value = src[name];
            if(opt_deep && (isObject(value) || isArray(value))){
               if(copy.cache.indexOf(value) === -1){
                    target[name] = copy(value , opt_deep);        
                }else{
                    target[name] = value
                }
                      
            }else {
                target[name] = value
            }
            copy.cache.push(value)
        }
        
    }
    return target;
}
copy.free = function(){
    copy.cache = null ;
}

var b = {}
var src = {
    name: 'tom',
    likes:{
        food: true
    },
    cate:[1,2,"adsasd" , {
        name: "xxxx"
    }]
}
b.src = src ;
src.b = b
var target = copy( src,true)
copy.free();
console.log(target)
src.likes.food = false;
console.log(target.likes.food)
```
**2.集合JSON.parse和JSON.stringify自定义实现**

```js
function copy(src , opt_deep){
    var _t = Object.prototype.toString;
    if(!opt_deep){
        return JSON.parse(JSON.stringify(src));
    } else{
        var cache = copy.cache = [];
        var target = JSON.stringify(src, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                // 发现循环引用
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                // 存储遍历的每个值
                cache.push(value);
            }
            return value;
        });
        return JSON.parse(target)
    }   
}
copy.free = function(){
    copy.cache = null ;
}
var b = {}
var src = {
    name: 'tom',
    likes:{
        food: true
    },
    cate:[1,2,"adsasd" , {
        name: "xxxx"
    }]
}
b.src = src ;
src.b = b
var target = copy( src,true)
copy.free();
console.log(target)
src.likes.food = false;
console.log(target.likes.food)
```



### 参考

+ [Object copying](https://en.wikipedia.org/wiki/Object_copying)
+ [MDN Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
+ [MDN JSON.stringify()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
+ [Chrome sendrequest error: TypeError: Converting circular structure to JSON](https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json#)
+ [Clone an object in vanilla JS – multiple ways](http://voidcanvas.com/clone-an-object-in-vanilla-js-in-depth/)