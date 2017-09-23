---
title: 标识符解析和JavaScript中的闭包[翻译]
date: 2017-08-03
---

在上篇文章中，我们了解到每个函数都有一个与之关联的执行环境（`execution context`），它包含了一个变量对象（`variable object [VO]`）,这个变量对象包含了给定本地函数内部的所有定义的变量，函数和参数。

每个执行环境（`execution context`）的作用域链（`scope chain`）属性都是一个由当前执行环境的变量对象（`[VO]`）和所有上层环境变量对象（`[VO]`）组成的集合。

```
Scope = VO + All Parent VOs
Eg: scopeChain = [ [VO] + [VO1] + [VO2] + [VO n+1] ];
```

### 决定作用域链的变量对象[VO]s

我们都知道作用域链（`scope chain`）的第一个`[VO]`是属于当前执行环境（`execution context`）的，这样我们通过查找上层环境的作用域（`scope chain`）就能知道所有剩下的上层[VO]s。

```
function one() {

    two();

    function two() {

        three();

        function three() {
            alert('I am at function three');
        }

    }

}

one();
```

![scope chain](/img/2017-08-03-stack14.jpg)

例子很直接，从全局环境开始我们调用`one()`，`one()`调用`two()`，之后调用`three()`，因此在函数three中弹出弹窗。上面的图展示了函数`three`在触发`alert('I am at function three')`时的调用栈。我们可以看出来此时的作用域链`scope chain`看起来是这样的：

```
three() Scope Chain = [ [three() VO] + [two() VO] + [one() VO] + [Global VO] ];
```

一个重要的需要注意的JavaScript特性是，解析器使用的是词法作用域（`Lexical Scoping`），与动态作用域（`Dynamic Scoping`）相反。这是一种复杂的方式，它表示所有的内部函数都是静态的（statically (lexically)）绑定到了父级作用域，物理上来看内部函数是定义在父级别程序代码的内部。

在上面的例子中，调用内部函数的顺序是无关紧要的。` three() `始终静态的绑定到`two()`上，这样会之中绑定到`one()`上，以此类推。这就产生了一个链式效应，所有的内部函数都可以通过静态绑定的作用域链（Scope Chain）放问到外部函数的变量对象VO。

词法作用域（ lexical scope）是许多开发人员困惑值所在。我们知道每次调用一个函数都将创建一个新的执行环境并关联一个变量对象VO，它包含了当前环境中的所有变量值。

正式这个动态的，运行时执行的`VO`对象与词法作用域（ lexical scope）一起定义了每个环境的作用域，从而导致了一些出现异常结果的程序行为。看下下面这个经典的例子：

```
var myAlerts = [];

for (var i = 0; i < 5; i++) {
    myAlerts.push(
        function inner() {
            alert(i);
        }
    );
}

myAlerts[0](); // 5
myAlerts[1](); // 5
myAlerts[2](); // 5
myAlerts[3](); // 5
myAlerts[4](); // 5
```

乍一看，JavaScript新手会认为`alert(i);`会弹出每次累加的`i`值，定义在源码内部的函数会依次弹出1,2,3,4和5。

只是通常的疑惑点。函数`inner`是在全局环境下创建的，因此它的作用域链静态绑定到了全局环境上。

11 ~ 15行代码调用的`inner()`，会从`inner.ScopeChina`触发来解析`i`，`i`是定义到了全局环境下。每次函数调用时，`i`早已累加到了`5`，每次调用`inner()`时拿到的都是同样的结果。静态绑定的作用域链，它包含了每个环境的`[VOs]`，每个`[VO]`都包含了所有的活跃变量，因此常常让开发人员感到意外。

### 解析变量值

下面的例子输出变量`a`，`b`和`c`的值，结果是6

```
​function one() {

    var a = 1;
    two();

    function two() {

        var b = 2;
        three();

        function three() {

            var c = 3;
            alert(a + b + c); // 6

        }

    }

}

one()​;​
```

14行代码很有趣，乍一看似乎`a`和`b`并没有在函数three的内部，所以这段代码如何仍能工作？为了搞清楚解析器是如何执行代码的，我们需要看下函数three在14行代码执行时的作用域链：

![scope chain](/img/2017-08-03-scopechain1.png)


在解析器执行14行代码：`alert(a + b + c)`时，它首先查找作用域链和检测第一个变量对象也就是 `three's [VO]`来解析`a`变量。它检测查看是否`a`存在于`three's [VO]`的内部但发现没有这个名字的属性，所以继续检测下一个`[VO]`。

解析器按顺序依次检测每个`[VO]`，查看是否存在此变量名称，直到找到并返回变量的值，否则如果么有找到，程序将抛出一个`ReferenceError`。因此考虑上面的例子，你能发现`a`，`b`和`c`都可以在给定的three函数的作用域链中解析到。

### 这与闭包有什么关系

在JavaScript中，闭包通常被认为是某种神奇的独角兽，只有高级开发人员才能真正理解它，但说实话只要搞清了作用域链就搞清了闭包了。闭包，如[Crockford](http://javascript.crockford.com/private.html)所说，可以简单的描述为：

>
>一个内部函数，总能访问它外部函数的变量和参数，即使是外部函数已经返回...（
>An inner function always has access to the vars and parameters of its outer function, even after the outer function has returned…）
>
>

下面是一个闭包的例子：

```
function foo() {
    var a = 'private variable';
    return function bar() {
        alert(a);
    }
}

var callAlert = foo();

callAlert(); // private variable
```

全局环境（Global contex）有一个名为`foo`的函数和一个名为`callAlert`的变量，此变量保存了`foo()`函数的返回值。另开发者惊讶和困惑的是这个私有变量`a`，它在`foo()`执行返回后仍能获取到。

然而，如果我们仔细的看下每个环境的细节，我们会发现：

```
/ Global Context when evaluated
global.VO = {
    foo: pointer to foo(),
    callAlert: returned value of global.VO.foo
    scopeChain: [global.VO]
}

// Foo Context when evaluated
foo.VO = {
    bar: pointer to bar(),
    a: 'private variable',
    scopeChain: [foo.VO, global.VO]
}

// Bar Context when evaluated
bar.VO = {
    scopeChain: [bar.VO, foo.VO, global.VO]
}
```

现在我们看到在调用`callAlert()`时，我们拿到的是函数`foo()`，它返回了一个指向`bar()`函数的指针。在进入`bar()`时，`bar.VO.scopeChain`是`[bar.VO, foo.VO, global.VO]`。

通过提示`a`，解析器检查bar.VO.scopeChain中第一个VO的`a`属性，但没找到一个匹配的，所以迅速的移动到下一个VO`foo.VO`。

它检查属性是否存在，这次发现了一个匹配的，并键值返回到`bar`的执行环境里，这就解释了为什么`alert`给我们了`private variable`，即使是`foo()`已经在之前刚执行完了。

到本篇文章的这里，我们已经详述了`scope chain`的细节和它的词法`lexical`作用域，也讲述了闭包和变量解析的原理。文章剩下的部分会描述一些与这些有关的有趣的情况。

### 等下，原型链是怎么影响变量解析的呢？

JavaScript天然的是原型继承，并且语言中所有的一切，除了`null`和`undefined`，都是对象。当尝试访问一个对象的属性时，解析器会查找对象自身是否存在这个属性。如果没找到，它会继续查找对象的原型链，它是一个继承的对象链，直到找到该属性，或者遍历到了链的末端。

这导致一个有趣的问题，就是解析器是先使用`scope chain`还是先使用`prototype chain`？答案是它两者使用。在访问一个属性或标识符时，首先会使用`scope chain`来定位对象。一旦发现了对象，这个对象的`prototype chain`也会被遍历查找属性的名称。让我们看下下面的例子：

```
var bar = {};

function foo() {

    bar.a = 'Set from foo()';

    return function inner() {
        alert(bar.a);
    }

}

foo()(); // 'Set from foo()'
```

第5在全局对象上`bar`上创建了一个`a`属性，设置它的值为`'Set from foo()'`。解析器查找`scope chain`，就像预期的那样在全局环境下找到了`bar.a`。现在让我们考虑以下代码：

```
var bar = {};

function foo() {

    Object.prototype.a = 'Set from prototype';

    return function inner() {
        alert(bar.a);
    }

}

foo()(); // 'Set from prototype()'
```

在运行时，我们调用`inner()`，尝试解析`bar.a`，会首先在scope chain上查找`bar`的存在。它在全局环境下发现了`bar`，然后继续在`bar`上寻找一个`a`属性。但是`a`并没有在`bar`上设置过，因此解析器会即系遍历对象的原型链，发现在`Object.prototype`上有`a`。

这个行为就解释了标识符解析的原理：现在`scope chain`上定位`object`，之后继续遍历对象的`prototype chain`知道属性找到，否则返回`undefined`。

### 什么时候使用闭包？

闭包是JavaScript中十分重要的概念，一些使用闭包的场景有：

**封装**

允许我们在外部隐藏内部环境的实现细节，同时公开一个受控制的公共接口。这通常被称作是[模块模式( module pattern)](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript)或[显示模块模式（revealing module pattern）](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript)。

**回调**

可能闭包最强大的用法之一便是回调。在浏览器中，JavaScript是运行在单线程的event loop中，一个事件执行完之前别的事件一直是阻塞状态。回调允许我们延迟执行某个函数，通常是为了以非阻塞方式，响应某个事件的完成。这样的一个例子是发到服务器的Ajax请求，使用回调来处理响应，通常仍然维护它创建时绑定的环境。

**闭包作为参数**

我们也可以将闭包当做一个函数的参数传入，这是一种强大的函数式范式，为复杂代码创建了一种更优雅的解决方案。以最小排序函数为例。通过价格闭包作为参数传入，我们可以定义不同类型数据排序的实现方式，同时仍然重用单个函数体作为排序主框架。

### 什么时候不该使用闭包

虽然闭包很强大，但由于一些性能问题，应该谨慎使用它们：

**作用域链过长**

多层的嵌套函数是一个标志，在此你可能会遇到一些性能问题。请记住，每次解析一个变量时，都要遍历作用域链Scope Chain来查找标识符，所以不用说，定义变量的作用域链月神，查找的时间就越长。

### 垃圾回收

JavaScript是一种垃圾回收语言，这意味着开发者通常不用像在低级语言里那样，担心内存管理。然而，这种自动垃圾回收经常导致开发人员的应用程序性能低劣，存在内存泄露。

不同的JavaScript引擎实现垃圾回收的机制略有不同，因为ECMAScript没有定义如何实现，但是同样的原理都可以用来在不懂的引擎上创建高性能应用，保证JavaScript代码不泄露。一般来说，垃圾回收器会将程序执行时将那些没有被其它活动对象所引用的对象的内存给释放掉。

### 循环引用

会导致闭包，以及程序中可能存在的循环引用，用术语来描述就是一个对象应用另一个对象，而这个对象也引用了第一个对象的这种情况。闭包尤其容易引起内存泄露，要记住，内部函数可以引用定义在更深层次作用域链上变量，尽管它的父函数已经执行并返回。大多数JavaScript工程师都能很好的处理这种情况（该死的IE），但是这仍值得提一下在你开发时需要引起注意。


对于更老版本的IE，引用一个DOM元素通常会引起内存卸扣。为什么？在IE中，JavaScript（JScript?）引擎和DOM都单独有自己的垃圾回收器。所以当在JavaScript中引用DOM元素时，JavaScript的垃圾回收器引用了DOM，DOM的回收器也回指了回去，导致了两个回收器都不知道有循环引用。

### 总结

从多年来与许多开发者一起工作的经验来看，我发现大家都知道作用域链`scope chain`和闭包`closures`的存在，但都没有真正了解它们的细节。我希望本篇能帮助你除了知道基本概念外，能更详细更深刻的理解它们。

展望未来，您应该掌握所有的知识，以确定在编写JavaScript时如何解决变量的解析问题。祝你编码快乐!

### 参考

+ [Scope wiki](https://en.wikipedia.org/wiki/Scope_(computer_science))
+ [作用域 wiki](https://zh.wikipedia.org/wiki/%E4%BD%9C%E7%94%A8%E5%9F%9F)

[原文](http://davidshariff.com/blog/javascript-scope-chain-and-closures/)

