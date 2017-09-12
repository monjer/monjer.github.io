---
title: 使用HTML5 Data Arrtibutes
date: 2015-03-10
tags:
    - html5
    - data-*
---

退回到XHTML/HTML4的日子，当存储任意关联DOM的数据时，开发者选择甚少。你可以创建自定义属性，但这有一定的风险；你的代码可能是无效的，浏览器可能会忽略数据，并且如果属性名称之前已成为标准的HTML属性，那么也会引起问题。

因此，大多开发者依赖于`class`或者`rel`属性来存放数据，因为它们是唯一的允许设置任意合理的字符串的属性。例如，假设我们创建了一个显示诸如Twitter时间线的插件。理想状态下，在不改变代码的基础上，该插件的JavaScript代码应该是可配置的——所以我们在`class`属性上定义了用户的ID，如：
```html
<div id="msglist" class="user_bob"></div>
```
我们的JavaScript代码能够查找到ID值为**msglist**的元素。通过简单的字符串解析，便可以找到一个以**user_**开头的class名称，假设"bob"是这个ID，之后就可以显示所有来自该用户的消息。

然后，比如说我们想定义一个消息的最大显示数量，忽略六个月(180天)之前的消息：
```html
<div id="msglist" class="user_bob list-size_5 maxage_180"></div>
```
可见，我们的`class`属性已经变得越来越笨重不堪；这更易引发错误，JavaScript的解析代码也会愈加复杂。

### HTML5 data Attributes

幸运的是，HTML5引入了一个自定义的数据属性。你可以使用以`data-`为前缀的任意小写字母组合的名称，来存放数据：
```html
<div id="msglist" data-user="bob" data-list-size="5" data-maxage="180"></div>
```

自定义数据属性是：

* 字符串 —— 你可以存放任何可以转换为字符串的数据，如JSON。类型转换需要在JavaScript代码中完成。
* 应该在没有合适的HTML5元素或属性的情况下使用它。
* 对于页面来说是私有的。Unlike microformats, they should be ignored by external systems such as search engine indexing bots.

### JavaScript解析#1:**getAttribute**和**setAttribute**

所有浏览器都允许你使用**getAttribute**和**setAttribute**方法来获取或者修改`data-`属性，如：
```js
var msglist = document.getElementById("msglist");

var show = msglist.getAttribute("data-list-size");
msglist.setAttribute("data-list-size", +show+3);
```
这也能正常执行，但仅用来兼容旧的浏览器。

### JavaScript解析#2 jQuery的`data()`方法

从**1.4.3**版本开始，jQuery的`data()`方法可以解析HTML5的data属性。你<strong style="color:red">无需指明</strong>`data-`前缀，所以等价代码可以如下书写：
```js
var msglist = $("#msglist");

var show = msglist.data("list-size");
msglist.data("list-size", show+3);
```
然而，要注意的是jQuery会巧妙的将取得的数据转换为合适的类型(booelans,numbers,objects,arrays或null)，并避免操作DOM。不像`setAttribute`，`data()`方法不会改变`data-list-size`属性，如果你在jQuery之外检查它的值，得到的仍是`5`。

### JavaScript解析#3 dataset API

最后，我们使用HTML5的dataset API来解析数据，它会返回一个`DOMStringMap`对象。你可能已发现data-attribute的名字会做一个映射，丢掉`data-`前缀，丢掉连字符并转换为驼峰样式，如：

<table summary="dataset API name conversion" style="width:auto;margin:1em auto">
<tbody><tr>
<th>attribute name</th>
<th>dataset API name</th>
</tr>
<tr>
<td>data-user</td>
<td>user</td>
</tr>
<tr>
<td>data-maxage</td>
<td>maxage</td>
</tr>
<tr>
<td>data-list-size</td>
<td>listSize</td>
</tr>
</tbody></table>

我们的新代码如下：
```js
var msglist = document.getElementById("msglist");

var show = msglist.dataset.listSize;
msglist.dataset.listSize = +show+3;
```
除了IE10及其低版本外，所有现代浏览器都支持datalist API。此外也有一个兼容性的[工具](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills#dataset-property-for-use-with-custom-data--attributes)来解决该问题，但在实践中，如果你要兼容旧的浏览器，使用jQuery会加实用。

### 参考

+ [jQuery.data()](http://api.jquery.com/data/)
+ [MDN Element dataset](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset)
+ [jsFiddle code](http://jsfiddle.net/DaJun/xm3uhq7t/1/)

### 原文

+ [How to Use HTML5 Data Attributes](http://www.sitepoint.com/use-html5-data-attributes/)




















