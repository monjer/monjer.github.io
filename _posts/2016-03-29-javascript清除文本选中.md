---
title: JavaScript清除文本选中
date: 2016-03-29 21:03:53
tags:
  - DOM Selection
---
在浏览器中，我们可以使用拉选方式来选中页面某个的某个区域，包括文本，链接或图片等，在DOM编程模型中，可以使用[Selection API][6]来对选中的区域进行操作。每个文档document对象都有一个唯一的[Selection][7]对象用以代表选中，当前主流浏览器都已经实现了[Selection API][6]，包括IE9及以后版本的IE浏览器。
### 清除选中
[Selection][7]对象中的`empty()`和`removeAllRanges()`方法用来取消当前选中的区域，所以如果要取消选中，可以使用以下代码。
```js
var selection = window.getSelection();
selection.removeAllRanges();
```
或者
```js
var selection = window.getSelection();
selection.empty();
```
但在IE10，IE11中测试发现，IE并未实现`empty`方法，所以为了保证一致性，使用`removeAllRange()`方法即可。

对于IE8及早起版本的浏览器，也可以使用IE提供的`document.selection`对象来完成取消操作，`document.selection`也会返回一个selection对象，当此对象只包含简单的三个方法，其中一个`empty()`方法用来取消选中，所以兼容老版本的IE，可以使用
```js
if(window.getSelection)(){
	var selection = window.getSelection();
    if(selection.removeAllRanges){
    	selection.removeAllRanges();
    }else if(selection.empty){
    	selection.empty();
    }
}else if(document.selection){
	document.selection.empty();
}
```
从IE11开始老旧的`document.selection`对象已经不再被支持，取而代之的是`window.getSelection()`。


### 参考
+ [Compatibility changes in IE11][1]
+ [IE HTMLSelection object][2]
+ [JavaScript Selections: The Selection Object - Doc JavaScript][3]
+ [window.getSelection and document.selection legacy support][4]
+ [Clear Text Selection with JavaScript][5]
+ [DOM Range and HTML5 Selection](https://blogs.msdn.microsoft.com/ie/2010/05/11/dom-range-and-html5-selection/)
+ [Document Object Model Range](https://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html)
+ [MDN Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
+ [IE selection object][8]

[1]: https://msdn.microsoft.com/en-us/library/bg182625(v=vs.85).aspx#legacyAPIs
[2]: https://msdn.microsoft.com/en-us/library/ff974359(v=vs.85).aspx
[3]: http://www.webreference.com/js/column12/selectionobject.html
[4]: https://connect.microsoft.com/IE/feedback/details/795325/window-getselection-and-document-selection-legacy-support
[5]: http://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
[6]: https://www.w3.org/TR/selection-api/#selectionchange-event
[7]: https://www.w3.org/TR/selection-api/#idl-def-Selection
[8]: https://msdn.microsoft.com/en-us/library/ms535869(v=vs.85).aspx