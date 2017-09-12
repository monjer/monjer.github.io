---
title: 'className && classList介绍'
date: 2014-03-15 00:28:08
tags:
---
### className

#### 简介

DOM操作中经常会处理元素的样式名，几乎所有的HTML标签中都包含了`class`属性(除了`base`, `head`, `html`, `meta`, `param`, `script`, `style` 以及 `title`标签)，用于规定当前元素的`类名`，这里的`类名`指的是我们在样式表中按照规则为元素指定的类(class)。如:

```html
<style>
.big{
	font-size:20px;
}
</style>
<p id="page" class="big">内容</p>
```
也可以为单个元素标签添加多个类，如：

```html
<style>
.big{
	font-size:20px;
}
.textColor{
	color:#EEEEEE;
}
</style>
<p id="page" class="big textColor">内容</p>
```
>注:类名不能以"!"开头。

在JavaScript中，在获取dom元素后可以通过`className`属性来为其获取或设置样式(在JavaScript中`class`为保留字，所以使用`className`代替。)，如：

```js
var p = document.getElementById("page");

// 获取元素样式
console.log(p.className);

// 设置元素样式(此处相当于一个清除样式的操作)
p.className = "";
```
之后，在控制台中会输出:

	big textColor

标签会变为:

```html
<p id="page" class="">内容</p>
```
如果要为标签设置多个样式，可以以`空格`为分隔符将类名拼接成字符串为`className`进行赋值，如

```js
var clsNames = "big textColor" ;
p.className = clsNames ;
```
之后标签会变为:

```html
<p id="page" class="big textColor">内容</p>
```
#### 实际处理

以上只是对DOM元素的`className`属性进行的简单说明和基本操作，在实际的的处理中，通常会用到的类名操作包括：

+ 添加单个类名
+ 同时添加多个类名
+ 判断是否包含某一类名
+ 删除单个类名
+ 同时删除多个类名
+ 某一类名的toggle转换

这中间可能同时会穿插DOM元素类型判断，字符串处理，正则表达式匹配。虽然实现起来并不算复杂，但也需要我们一点点的去堆代码。由于对于`className`的操作的通用性比较高，此部分的代码可以进行封装，而且多数类库中都结合自身的设计原则实现了对`className`的处理。比如，jQuery提供了:

+ [addClass( className )][1]
+ [addClass( function(index, currentClass) )][1]
+ [removeClass( [className ] )][2]
+ [removeClass( function(index, class) )][2]
+ [hasClass( className )][3]
+ [toggleClass( className )][4]

YUI3中提供了:

+ [addClass ( element  className )][5]
+ [hasClass ( element  className ) Boolean][6]
+ [removeClass ( element  className )][7]
+ [replaceClass ( element  oldClassName  newClassName )][8]
+ [toggleClass ( element  className  addClass )][9]

利用现有框架的API，省去了我们重复堆码的时间。


### classList

#### 简介

js框架提供的主要功能之一是封装那些在web开发中经常要使用到的功能，提供跨浏览器的解决方案。有时我们会抱怨：**对于那些常用而且必须的功能为什么不在w3c中进行标准化，之后浏览器厂商统一实现。这样做会减轻了开发者重复编码的负担，减少开发过程中对浏览器兼容性的考虑，使得类库更加轻量级。**正如我们现在经常会对DOM元素的`className`进行处理一样，如果标准有定义，浏览器本身已经实现了这部分功能，那么我们岂不是会很轻松，以后的开发也会降低对库的依赖。

其实标准也是在需求中一步步完善的，有共性的需求才会有标准的出现。HTML5的出现为的就是进一步完善标准。这其中也增加了新的DOM属性，`classList`属性便是其中之一。

`classList`的作用是用来简化DOM元素的`class`处理，返回一个DOM元素中`className`属性中包含的以`空格`分割的类名列表。通过

```js
var clsList = element.classList
```
可以获取DOM元素的样式列表并进行处理。

#### classList的对象类型

element.classList对象的类型为[DOMTokenList][token]。[DOMTokenList][token]类型表示了一个用`空格`分割的符号(token)集合。它是一种类数组(ArrayLike)对象(就像JavaScript中的String对象一样)，可以像数组那样按照数字下标索引元素，当然索引是从0开始。常见的使用该类型的DOM属性包括：

+ HTMLElement.classList
+ HTMLLinkElement.relList
+ HTMLAnchorElement.relList
+ HTMLAreaElement.relList

[DOMTokenList][token]包含了以下属性和方法
```js
// Property
length

// Method
item ( idx )//返回集合idx索引指向的token
contains ( token ) //判断集合中是否包含token
add ( token ) // 向集合中添加token
remove ( token ) // 从集合中删除token
toggle ( token ) // 如果集合中存在token，则将其删除，并返回false；如果集合中不存在token，则将token加入其中，并返回true
```
#### classList对象的操作

明白了`element.classList`对象的类型后，可以清楚的看到可对`className`进行的操作。只要把**token**替换成**代表样式的类名**即可。如：

```js
var length = p.classList.length ; // 获取p元素中类名数量
p.classList.item(1); // 获取p元素中索引为1的类名
p.classList.add("big"); // 向p元素中添加big类
p.classList.remove("big"); // 将big类从p元素中移除
p.classList.contains("big"); // 判断p元素中是否包含名为big的类
p.classList.toggle("big"); // 如果p元素中存在big类，则将其删除；如果p元素中不存在big类，则向p中添加big类
```
通过以下代码可以对`classList`进行特性检测,来判断浏览器是否支持classList属性

```js
var support = document.body.classList==undefined ? false : true ;
```
#### classList的缺点

+ 浏览器兼容下欠佳，由于是新的标准，各浏览器对`classList`的支持以及实现方式存在差异，尤其是IE10后才支持`classList`。参见其[兼容性列表](http://caniuse.com/classlist)

+ 只能对单个类名进行操作，如果`add`,`remove`,`contains`,`toggle`方法中的类名参数包含`空格`，方法调用会报错，如在Chrome的console下调用
    ```html
		document.body.classList.add("cls1 cls2");//cls1,cls2中间包含了一个空格
		```
	会报以下错误提示
>InvalidCharacterError: The string contains invalid characters.


#### classList的一些跨浏览器实现

对于`classList`的跨浏览器实现一些个人或框架本身已经提供了比较好的解决方案和代码,如：

+ [classList.js](https://github.com/eligrey/classList.js)
+ [Google closure classList.js](http://docs.closure-library.googlecode.com/git/closure_goog_dom_classlist.js.source.html#line102)

完，以上！

### 参考

+ [HTML Class][class]
+ [element.className][classname]
+ [element.classList][classlist]
+ [DOMTokenList][token]
+ [The classList API][clsAPI]
+ [YUI3 dom-class.js][dom-class]

[1]: http://api.jquery.com/addClass/
[2]: http://api.jquery.com/addClass/
[3]: http://api.jquery.com/hasClass/
[4]: http://api.jquery.com/toggleClass/
[5]: http://yuilibrary.com/yui/docs/api/classes/DOM.html#method_addClass
[6]: http://yuilibrary.com/yui/docs/api/classes/DOM.html#method_hasClass
[7]: http://yuilibrary.com/yui/docs/api/classes/DOM.html#method_removeClass
[8]: http://yuilibrary.com/yui/docs/api/classes/DOM.html#method_replaceClass
[9]: http://yuilibrary.com/yui/docs/api/classes/DOM.html#method_toggleClass

[class]: http://www.w3school.com.cn/tags/att_standard_class.asp
[classname]: https://developer.mozilla.org/zh-cn/DOM/element.className
[classlist]: https://developer.mozilla.org/zh-CN/docs/DOM/element.classList
[token]: https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList
[clsAPI]: http://html5doctor.com/the-classlist-api/
[dom-class]: https://github.com/yui/yui3/blob/master/src/dom/js/dom-class.js
