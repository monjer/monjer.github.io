---
title: 表单元素的disabled属性与readonly属性说明
date: 2014-04-05
tags:
---



在Web页面的表单操作中，某些情况下我们需要有条件的来控制某些表单元素禁止提交或禁止编辑，HTML标签中`disabled`属性和`readonly`属性则分别用来实现这样的功能。两个属性都是[boolean attribute][ref-4]

### disabled属性

`disabled`**属性(attribute)**用来禁用用户编辑表单控件并阻止该控件提交到服务器端。添加了`disabled`**属性(attribute)**的表单控件被称为*disabled控件*，*disabled控件*具有以下特征：

+ 不会接受焦点
+ 忽略键盘的tab导航
+ 不能被提交到服务器端

支持`disabled`**属性(attribute)**的表单元素包括:`button`,`input`,`textarea`,`option`,`optgroup`,`select`，示例如下:
```html
<input id="myTxt" type="text" value="input text value" disabled/>
```
使用JavaScript动态设置`disabled`**属性(property)**的值代码示例如下:
```js
var txt = document.getElementById("myTxt");
// 设置disabled
txt.disabled = true ;
// 取消disabled
txt.disabled = false ;
```
### readonly属性

`readonly`**属性(attribute)**用来禁止用户编辑表单元素的值，添加了`readonly`**属性(attribute)**的表单空间被称为*readonly控件*，*readonly控件*具有以下特性：

+ 可以接收焦点，但不能被用户编辑
+ 可以使用键盘的tab导航
+ 可以被提交到服务器端

支持`readonly`**属性(attribute)**的表单元素包括:`input`,`textarea`，示例如下：
```html
<input id="myTxt" type="text" value="input text value" readonly/>
```
使用JavaScript动态设置`readonly`**属性(property)**的值代码示例如下:
```js
var txt = document.getElementById("myTxt");
// 设置readOnly
txt.readOnly = true ;
// 取消readOnly
txt.readOnly = false ;
```
> HTML标签的`readonly`属性(attribute)对应于DOM元素的`readOnly`属性(property)


### 参考

+ [why disabled=“disabled” and not disabled=“!”?][ref-1]
+ [W3C Disabled controls][ref-2]
+ [disabled (HTML attribute)][ref-3]
+ [Boolean attributes][ref-4]
+ [jQuery.prop()][ref-5]

[ref-1]: http://stackoverflow.com/questions/6531738/why-disabled-disabled-and-not-disabled/6531804#6531804
[ref-2]: http://www.w3.org/TR/REC-html40/interact/forms.html#h-17.12.1
[ref-3]: http://reference.sitepoint.com/html/input/disabled
[ref-4]: http://www.whatwg.org/specs/web-apps/current-work/#boolean-attributes
[ref-5]: http://api.jquery.com/prop/