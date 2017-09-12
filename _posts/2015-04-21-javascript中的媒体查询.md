---
title: JavaScript中的媒体查询
date: 2015-04-21
tags:
    - JavaScript
    - media query
---

在CSS中通过使用媒体查询，就可以动态切换不同模式下的不同样式，从而实现响应式设计。所有这些完全不依赖于任何脚本。其实在JavaScript中，提供了一些对象和事件，让我们可以监测媒体查询的变化，这样可以在脚本层面上来进一步完善响应式的效果。以下是涉及到的一些接口和对象的说明。

### window.matchMedia方法和MediaQueryList类型对象

在`window`对象上存在`matchMedia(mediaQueryString)`方法,该方法接受一个媒体查询的字符串`mediaQueryString`，创建并返回一个`MediaQueryList`,如下
```js
var mediaQueryList = window.matchMedia("(orientation: landscape)");
```
`MediaQueryList`类型的对象上存在一个名为`matches`的布尔类型的属性，以检测当前的文档状态是否与传入的媒体查询(`mediaQueryString`)结果相匹配,`true`代表匹配，`false`则反之，如
```js
var mediaQueryList = window.matchMedia("(orientation: landscape)");
// 设备是横屏状态
if(mediaQueryList.matches){

// 设备是竖屏状态
}else{

}
```
### 响应媒体查询的变化

我们不但可以知道当前媒体查询的结果，而且可以知道媒体查询何时发生变化，这是通过`MediaQueryList`类型的`addListener()`方法实现的，该方法会为媒体查询的变化添加监听函数，媒体查询的变化时会调用注册的函数,同时会传入`MediaQueryList`类型的对象来表示变化的结果，如：
```js
var mediaQueryList = window.matchMedia("(orientation: landscape)");

function mediaQueryListListener(mediaQList){
    // 设备是横屏状态
    if(mediaQList.matches){
        console.log("设备转至横屏");
    // 设备是竖屏状态
    }else{
        console.log("设备转至竖屏");
    }
}
mediaQueryList.addListener(mediaQueryListListener);
```
为了完成初始化操作，在注册监听函数时需要添加一次调用：
```js
var mediaQueryList = window.matchMedia("(orientation: landscape)");

function mediaQueryListListener(mediaQList){
    // 设备是横屏状态
    if(mediaQList.matches){
        console.log("设备转至横屏");
    // 设备是竖屏状态
    }else{
        console.log("设备转至竖屏");
    }
}
mediaQueryList.addListener(mediaQueryListListener);
mediaQueryListListener(mediaQueryList);// 完成初始化调用
```
如果需要取消监听函数时，我们只需要调用`MediaQueryList`类型对象的`removeListener()`方法，并传入曾经注册过的监听函数即可：
```js
mediaQueryList.removeListener(mediaQueryListListener); // 移除监听
```
### enquire.js

关于比较便捷的监听媒体查询的结果，已有第三方库来予以支持，如[enquire.js][1]，[enquire.js][1]是一个轻量级的JavaScript库，用以完成对CSS媒体查询做出响应，特点如下：

+ 为媒体查询提供匹配与不匹配的回调函数;
+ 简介并直观的API接口;
+ 绝对够小，压缩后0.8kb;

关于enquire.js的使用和说明参见其[Github](https://github.com/WickyNilliams/enquire.js)


### 参考

+ [CanIUse matchMedia](http://caniuse.com/#feat=matchmedia)
+ [MDN window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
+ [MDN MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList)
+ [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries)
+ [enquire.js][1]
+ [Adapt.js - Adaptive CSS](http://adapt.960.gs/)
+ [Extensions to the Window Interface](http://dev.w3.org/csswg/cssom-view/#extensions-to-the-window-interface)
+ [matchMedia.js](https://github.com/paulirish/matchMedia.js/)

[1]: http://wicky.nillia.ms/enquire.js/
