---
title: JavaScript继承模式
date: 2017-09-01
---

### 构造函数继承

```js
function Person(name){
    this.name = name
}
Person.prototype.hello = function(){
    console.log('Hello , i am '+this.name)
}

function Chinese(name){
    Person.call(this , name);
}
```

+ 优点

    简洁明了。

+ 缺点：

    父类的方法需要定义在构造器中才能被子类继承，这造成一个问题是构造器中的方法无法复用。还有父类原型中定义的方法子类无法访问到。


### 原型链继承

```js
function Person(name){
    this.name = name
}
Person.prototype.hello = function(){
    console.log('Hello , i am '+this.name)
}

function Chinese(name){
    
}
Chinese.prototype = new Person()
```

+ 优点
    + 子类有效继承了父类原型的方法
    + 有效的节省了内存
+ 缺点
    + 所有子类的示例都会共享相同的属性，某个子类改变了属性会影响别的子类

### 组合继承

```js
function Person(name){
    this.name = name
}
Person.prototype.hello = function(){
    console.log('Hello , i am '+this.name)
}

function Chinese(name){
    Person.call(this , name);
}
Chinese.prototype = new Person()
Chinese.prototype.constructor = Chinese;
```

+ 优点
    + 保证子类继承继承父类的属性，也能继承父类的方法，而且子类实例之间的属性不会冲突
    + `instanceof`能很好的判断对象的类型
+ 缺点
    + 父类的构造器调用了两次

### 原型式继承

```js
function object(prototype){
    function F(){}
    F.prototype = prototype;
    return new F();
}
var Person = {
    name: '',
    sayHello: function(){
        console.log('Hello , i am '+this.name)
    }
}
var chinaPerson = object(Person)
```

+ 优点
    + 不用每次都定义新的类型
    + 能够实现一个对象与另一个对象保持一致
+ 缺点
    + 不太符合传统的实现继承的方式
    + 比较难于以OOP的角度去考虑问题

### 寄生组合继承

```js
function object(prototype){
    function F(){}
    F.prototype = prototype;
    return new F();
}
function inherit(childCtor , parentCtor){
    childCtor.prototype = object(parentCtor.prototype)
    childCtor.prototype.constructor = childCtor;
}
function Person(name){
    this.name = name
}
Person.prototype.hello = function(){
    console.log('Hello , i am '+this.name)
}

function Chinese(name){
    Person.call(this , name);
}
inherit(Chinese , Person)
```

+ 优点
    + 只调用了一次父类的构造器，避免在子类的prototype上添加多余的不必要的属性
    + 原型链保持不变，仍能继续使用

### 寄生组合继承变体

```js
function inherit(childCtor , parentCtor){
    childCtor.prototype = Object.create(parentCtor.prototype)
    childCtor.prototype.constructor = childCtor;
}
function Person(name){
    this.name = name
}
Person.prototype.hello = function(){
    console.log('Hello , i am '+this.name)
}

function Chinese(name){
    Person.call(this , name);
}
inherit(Chinese , Person)
```
