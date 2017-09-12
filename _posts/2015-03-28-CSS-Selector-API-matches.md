---
title: CSS Selector API - matches
date: 2015-03-28
tags:
    - css selector
---

### 语法及功能

`element.matches(selector)`方法用来检测`element`元素是否与指定的`selector`选择器相匹配，如果匹配，则方法返回`true`值,反之，返回`false`值，如
```html
<div id="head" class="header">
    <ul class="menu">
        <li><a>Home</a></li>
        <li><a>Blog</a></li>
        <li><a>News</a></li>
    </ul>
</div>

<script>

    var head = document.getElementById(head);
    if(head.matches(".header")){
        console.log("mactch");
    }else{
        console.log("not mactch");
    }
</script>
```
以上代码执行的输出结果是`match`	。

>`element.match(selector)`的前身是`element.matchSelector(selector)`

### 兼容性

不是所有浏览器都很好的支持该接口，但基本上所有浏览器都以添加前缀方式实现自己的matchesSelector方法。可以参见当前该接口的[实现情况](http://caniuse.com/#search=matches)。考虑各个浏览器的实现差异，可以实现以下方法：
```js
function matchesSelector(element , selector){
    var docEl = document.documentElement;
    var matchSelector = docEl.matches || // w3c
            docEL.webkitMatchesSelector || // chrome  safari webkit
            docEl.mozMatchesSelector || // firefox
            docEl.msMatchesSelector || // ie
            docEl.oMatchesSelector ; // opera

    return matchSelector.call(element , selector);
}
```
对于不支持`element.matches(selector)`但支持`querySelector/querySelectorAll`的浏览器可以有以下替代方法：
```js
function matchSelector(element , selector){
    var results = document.querySelectorAll(selector);
    for(var i = 0 , length = results.length ; i < length ; i++){
        if(results[i] === element){\
            return true ;
        }
    }
    return false ;
}
```
综合两种方式
```js
function matchesSelector(element , selector){
    var docEl = document.documentElement;
    var matchSelector = docEl.matches || // w3c
            docEL.webkitMatchesSelector || // chrome  safari webkit
            docEl.mozMatchesSelector || // firefox
            docEl.msMatchesSelector || // ie
            docEl.oMatchesSelector || // opera
            function(selector){
                var results = document.querySelectorAll(selector);
                for(var i = 0 , length = results.length ; i < length ; i++){
                    if(results[i] === this){\
                        return true ;
                    }
                }
                return false ;
            }

    return matchSelector.call(element , selector);
}
```
### 参考

+ [MDN element.matches](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches)
+ [CanIUse querySelector](http://caniuse.com/#search=querySelector)
+ [CanIUse matches](http://caniuse.com/#search=matches)