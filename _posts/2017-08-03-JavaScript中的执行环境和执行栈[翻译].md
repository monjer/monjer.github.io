---
title: JavaScript中的执行环境和执行栈[翻译]
date: 2017-08-03
---

本片中我会深入探讨一下JavaScript中最基础之一的部分，执行环境（Execution Context）。在本篇结束后，你应该更加清楚的理解解析器的运作，为什么函数/变量可以在声明之前使用以及它们的值真正是由什么决定的。

### 什么是执行环境

在JavaScript代码执行时，它所处的执行环境是十分重要的，取决于下面几个环境中的一个

+ 全局代码（Global code） - 这是代码初次运行所处的默认环境
+ 函数代码（Function code）- 当执行流程进入到函数体内
+ Eval code - 在eval函数内部执行的文本代码

你可能已经读了许多网上关于讲解作用域`scope`的资源，但为了本篇目标这里让我们将`execution context`作为当前执行代码所处环境/作用域的术语。现在，废话不多说，让我们看看下面的例子，它同时包含了`global`和`function/local`环境下执行的代码。

![context](/img/2017-08-03-img1.png)

这里没有什么特殊的，紫色边框代表的是全局环境（`global context`）,另外三个函数环境（`function contexts`）分别以绿色，蓝色，橙色边框代表。在你程序中任何的执行环境下只能访问唯一的全局环境`global context`。

你可以有任意数量的函数环境`function contexts`，每个函数调用都会创建一个新的环境，这是创建了一个私有的作用域，任何在函数声明的东西，在外部环境中都不能直接访问。在上面的例子中，函数可以访问外部环境声明的变量，但是外部环境不能范文内部环境定义的变量或函数。为什么会这样呢？代码到底是如何执行的？

### 环境栈

浏览器中的JavaScript解析器是单线程的。这意味着浏览器中的某个时刻只能有一件事件发生，别的动作或事件都被保存到一个叫做环境栈（`Execution Stack`）的队列中。下面的图片是单线程栈的一个抽象说明。

![context stack](/img/2017-08-03-ecstack.jpg)

正如我们所见，浏览器初次加载你的脚本时，它首先默认进入的是全局执行环境（`globale execution context`），它会被push到当前栈的顶端。浏览器总是执行栈顶的单钱执行环境（`current execution stack`），一旦在当前执行环境中执行完毕，它就会从栈顶弹出，并将控制权返回到当前栈的下一个环境。下面的例子展示了一个递归函数以及程序的执行栈（`execute stack`）。

```js
(function foo(i) {
    if (i === 3) {
        return;
    }
    else {
        foo(++i);
    }
}(0));
```

代码只是简单的调用了自己3次。将变量i的值每次加1.每次`foo`函数调用时，一个新的执行环境就会创建。一根一个环境执行完毕，它就从栈中pop除去，将控制权返回给下面的环境，直到到达全局环境（`global context`）。

![context stack](/img/2017-08-03-es1.gif)

关于执行栈有5个关键点要记住：

+ 单线程
+ 同步执行
+ 一个全局环境
+ 无限的函数上下文
+ 每个函数调用创建一个新的执行环境（`execution context`），即使是递归调用

### 执行环境的细节

那么我们现在知道每次函数调用时，都会创建一个新的执行环境（`execution context`）。然而，JavaScript解析器的内部，在每次调用一个执行环境时都分为2个阶段：

1.**创建阶段（Creation Stage）**[发生在函数调用之后，内部代码执行之前]

+ 创建作用域链([Scope chain](1))。
+ 创建变量，函数和参数。
+ 决定[`this`](2)值。

2.**活动/代码执行阶段**

+ 为函数中的变量赋值或添加引用，解释/执行代码。

概念上可以用一个带有3个属性的对象来描述每个执行环境`execution context`:

```js
executionContextObj = {
    'scopeChain': { /* 当前变量对象(variableObject)+所有上层执行环境的变量对象(variableObject) */ },
    'variableObject': { /* 函数arguments对象，参数，内部变量和函数声明*/ },
    'this': {}
}
```

### 活动对象和变量对象[AO/VO]

当函数调用时会创建`executionContextObj `对象，但这是真正的函数还没有被执行。这称作第一阶段，创建阶段`Creation Stage`。这里，解析器通过扫描函数，获取传入参数和arguments对象，本地函数声明和本地变量声明，以此创建`executionContextObj`对象。扫描后的结果就是创建了`executionContextObj`的`variableObject`。

下面是关于解析器执行代码的伪描述（pseudo-overview）：

1. 找到要执行函数的代码。
2. 在执行函数代码前，创建执行环境（`execution context`）。
3. 进入创建阶段（Creation Stage）:

    + 初始化作用域链（[Scope Chain](1)）
    + 创建变量对象`variable object`:
        + 创建`arguments object`，检查环境获取参数，初始化名字和值，创建一个引用的拷贝
        + 扫描环境获取函数声明：
            + 每发现一个函数，就在`variable object`中创建一个属性，属性名就是函数的名字，在内存中保留指向函数的指针引用。
            + 如果函数的名字已存在，这个指针的值会被覆盖掉
        + 扫描环境获取变量声明：
            + 每发现一个变量声明，就在`variable object`中创建一个属性，初始化值为[`undefined`](http://davidshariff.com/blog/javascripts-undefined-explored/)
            + 如果变量名已存在，啥也不做继续扫描
        + 决定环境内部里[`this`](2)的值
4. 活动/代码执行阶段：
    + 在当前环境运行/解析函数的代码，代码逐行运行时自动为变量赋值。

让我们看下下面的例子：

```js
function foo(i) {
    var a = 'hello';
    var b = function privateB() {

    };
    function c() {

    }
}

foo(22);
```

在调用`foo(22)`时，创建阶段`creation stage`看起来是下面样子：

```js
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: undefined,
        b: undefined
    },
    this: { ... }
}
```

如你所见，创建阶段（`creation stage`）处理的是属性名称的定义，而不是为它们赋值，除了arguments/parameters。一旦创建阶段`creation stage`结束，执行流程就进入到了函数和活动阶段（`execution stage`）,函数结束后会如下：

```js
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: 'hello',
        b: pointer to function privateB()
    },
    this: { ... }
}
```

### 提升的一句话解析

在网上的资源里你可能发现JavaScript中的术语`hoisting`，并解释到：变量声明和函数声明会提升到函数作用域的顶端。但是没有人详细的说明为什么会这样，带着你刚学到的关于JavaScript解析器如何创建活动对象的`activation object`的新知识，这就很容易理解为什么了。以下面的代码为例：

```js
​(function() {

    console.log(typeof foo); // function pointer
    console.log(typeof bar); // undefined

    var foo = 'hello',
        bar = function() {
            return 'world';
        };

    function foo() {
        return 'hello';
    }

}());​

```

我们可能会问到：

+ **为什么我们可以在声明foof之前就能访问它？**
    + 如果我们顺着`creation stage`往下看，我们就知道在活动阶段(`activation / code execution stage`)之前，变量就已经创建了。所以当函数流程开始执行时，`foo`已经定义在了活动对象(`activation object`)上了。

+ **foo声明了两次，为什么foo显示是`function`而不是`undefined`或`string`呢？**
    + 虽然`foo`声明了两次，我们从创建阶段（`creation stage`）知道函数是在变量之前就在活动对象(`activation object`)上创建了，如果活动对象(`activation object`)上的一个属性名已存在，我们只是简单的跳过了声明
    + 因此，首先创建了在活动对象(`activation object`)上创建了`function foo()`的引用，当解析器获取`var foo`时，发现`foo`属性已存在，代码会什么也不做继续往下处理。
+ **bar为什么是undefined?**
    + `bar`实际上就是一个变量，只不过赋值的是一个函数，我们都知道变量是在创建阶段（`creation stage`）创建的，但它们的初始化值都是`undefined`。

### 总结

希望到现在你已经深刻理解了JavaScript解析器是如何执行你的代码的了。理解执行环境和执行环境栈，你就知道了为什么你的代码与你预期的初始化有不一样的值了。

你觉得了解解析器内部工作的原理是超出工作范围之外的内，还是你JavaScript知识的必需呢？了解执行环境是否有助于你编写更好的JavaScript代码呢？

**注意**：一些人询问关于闭包，回调，timeout等等的问题，我会在下面文章里，讲解更多作用域链（`Scope chain`）与执行环境（`execution context`）的关系。

    





[原文](http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/)

[1]: http://davidshariff.com/blog/javascript-scope-chain-and-closures/
[2]: http://davidshariff.com/blog/javascript-this-keyword/
