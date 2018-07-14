---
title: JavaScript中的装饰器
date:  2018-02-21
---
### JavaScript中的装饰器

装饰器是设计模式中的一个名称。装饰器用来动态的改变一个函数的，方法或类的功能，而且不用使用类的继承结构，或修改被装饰函数的源码。

JavaScript中的装饰器（Decorators）是一个语法糖，用来用一个代码片段包装另一个代码片段，类似的概念还有高阶函数（Higher-Order function）和函数组合（Function composition）。在最新版的ES中，Decorator语法目前处在[Stage 2 Draft][7]阶段

### ES6之前的做法

在ES6之前，我们可以简单的用函数包括函数的形式来装饰另一个函数，比如

```js
function Logger(wrap , ctx){
  return function(){
    console.log('Function called')
    return wrap.apply(cxt||this , arguments);
  }
}

function sayHi(){
  console.log('sayHi inner');
}

syaHi = Logger(sayHi);
syaHi();

```
上面的操作产生了一个新的函数，在新函数的内部调用被传入的函数。类似于这样的操作，可以通过层层的包装来修改被装饰函数的行为。

### 新的Decorator语法

新的Decorator语法中，使用声明的方式来实现，装饰器以一个_@_符号为前缀，声明在所要装饰的类或属性的前面，比如

```js
@classDecoratorName
class Person {
  @methodDecoratorName
  sayHi() {
   
  }
}
```

decorators可以是一个表达式，比如

```js
@classDecoratorName()
class Person {

}
```
### ES6的类

ES6中class定义的类其实也是一种语法糖，比如

```js
class Person(){
  sayHi(){
    console.log('hello');
  }
}
```
等价于

```js
function Person(){}
Object.defineProperty(Person.prototype , 'sayHi' , {
    value: function() { 
      console.log('hello'); 
    },
    enumerable: false,
    configurable: true,
    writable: true
})
```

了解到上面的结构之后可以继续看下在类和方法中使用decorator的形式了。

### 声明在类上的decorator

声明在类上的decorator声明大概如下：

```js

function isHuman(target){
  target.isHuman = true;
  return target;
}

@isHuman
class Person {

}

console.log(Person.isHuman) // true
```
以上我们定义一个`isHuman`的decorator并在`Person`类上进行声明，之后可以看到`Person`中添加了`isHuman`的属性。`@isHuman`的声明等同于以下代码：

```js
Person = isHuman(Person) || Person ;
```
### 声明在属性上的decorator

```js
function readonly(target , name , descriptor){
  descriptor.writable = false;
  return descriptor;
}

class Person {
  @readonly
  sayHi(){
  }
}
let person = new Person();
person.sayHi = function(){};// throw Error
```
上面的代码定义了一个`readonly`的装饰器，他会收到三个参数，依次是类，属性名称，和属性描述符（会被传入Object.defineProperty中）。

[core-decorators](https://github.com/jayphelps/core-decorators)是一个第三方库，包含了许多常见的decorator，

以上代码等价于

```js
let descriptor =  {
    value: function() { 
      console.log('hello'); 
    },
    enumerable: false,
    configurable: true,
    writable: true
};
descriptor = readonly(Person.prototype, 'sayHi', descriptor) || descriptor;
Object.defineProperty(Person.prototype, 'name', descriptor);

```
### decoator表达式

因为decorator是一个表达式，所以通常也可以这样用：

```js
class Person {
  @ enumerable(false)
  sayHi() { }
}

function enumerable(value) {
  return function (target, key, descriptor) {
     descriptor.enumerable = value;
     return descriptor;
  }
}
```
这里`enumerable`定义为一个函数类型，并且它的返回值，符合属性decorator所接受的参数的个数。


### decorator的优点

使用decorator，有以下的优势：

+ 语法清晰
+ 解决代码片段复用和共享的问题
+ 面向未来的标准

### 实际中的使用

在实际当中decorator的使用也已经是很常见的，最新的Angular大量的使用decorator来进行组件的编写。JavaScript状态管理库Mobx也提供decorator语法声明时的进行对象状态的追踪。[core-decorators](https://www.npmjs.com/package/core-decorators)是一个第三方库，定义了许多常见的decorator。

### 参考

+ [tc39/proposal-decorators][1]
+ [Decorator pattern][2]
+ [Typescript Decorators][3]
+ [What is a Python Decorator][4]
+ [What is Function Composition?][5]
+ [Higher-order function][6]
+ [javascript-decorators][8]
+ [JavaScript Decorators: What They Are and When to Use Them][9]

[1]: https://github.com/tc39/proposal-decorators
[2]: https://en.wikipedia.org/wiki/Decorator_pattern
[3]: https://www.typescriptlang.org/docs/handbook/decorators.html
[4]: https://wiki.python.org/moin/PythonDecorators#What_is_a_Python_Decorator
[5]: https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0
[6]: https://en.wikipedia.org/wiki/Higher-order_function
[7]: https://github.com/tc39/proposalsn
[8]: https://github.com/wycats/javascript-decorators
[9]: https://www.sitepoint.com/javascript-decorators-what-they-are/