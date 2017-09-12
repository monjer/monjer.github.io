---
title: 'input[type=checkbox]总结'
date: 2016-03-16 23:20:08
tags:
---


设置HTML表单input元素的`type='checkbox'`时，会在页面上创建一个多选框，如，
```html
<input type='checkbox' name='chb' />
```
同一个表单中创建多个同名(name属性相同)多选框，用户单击会选中多选框，再次单击同一个多选框会取消选择，这样用户可以根据需要来选择多选框，从而为单一名称的key提供多个value值，最终提交到服务器端。

### checked属性(attribute)

多选框的选中与否是通过`input`元素的`checked`**属性(attribute)**标识的，W3C文档中解释到：

> A switch is "on" when the control element's checked attribute is set.

即当`input`控件添加`checked`**属性(attribute)**时，控件会显示选中状态，如
```html
<input type='checkbox' name='chb' checked='checked' />
```
反之移除`checked`**属性(attribute)**会取消控件的选中状态，如
```html
<input type='checkbox' name='chb' />
```
只有处于选中状态的多选框才会被提交到服务器端。	

### 在input的HTML标签中初始化chechbox的选中状态

在需要根据加载数据的值来动态创建并渲染表单标签到web页面时，有时需要设置新创建的多选框的选择状态。以上已经提到为`input`元素添加`checked`**属性(attribute)**时该多选框会处于选中状态，所以不管在`input`标签的`checked`**属性(attribute)**添加什么样的值多选框都会处于选中状态，所以下面的标签所示的选择框都处于选择状态，如
```html
<input name="chb" type="checkbox" checked value="1">1
<input name="chb" type="checkbox" checked="true" value="2">2
<input name="chb" type="checkbox" checked="checked" value="3">3
<input name="chb" type="checkbox" checked="yes" value="4">4
<input name="chb" type="checkbox" checked="false" value="5">5
<input name="chb" type="checkbox" checked="no" value="6">6
<input name="chb" type="checkbox" checked="" value="7">7
<input name="chb" type="checkbox" checked="XXXX" value="8">8
<input name="chb" type="checkbox" checked=true value="9">9
<input name="chb" type="checkbox" checked=false value="10">10
<input name="chb" type="checkbox" checked=xxx value="11">11
```
反之，只要省略`checked`属性，多选框则处于未选中状态，如
```html
<input name="chb" type="checkbox" value="12">12
```
### 判断多选框是否选中

关于如何正确的判断一个多选框当前的选装状态，有时会让人产生困惑。因为在`input`的HTML标签中包含了`checked`**属性(attribute)**，此外`input`标签对应的DOM元素中也包含了一个名为`checked`的**属性(property)**。首先从概念上有人会搞不清这两个**属性**之间到底是什么关系以及有何区别。

我们知道一般情况下出现在Web页面中的每个HTML标签都对应着一个DOM对象，可以使用DOM对象提供的接口来操作对应的标签，而且DOM对象上的**属性(property)**有时会与对应的HTML标签的**属性(attribute)**共用同一个名称，如本例中`input`多选框标签的的`checked`**(attribute)属性**和DOM对象的`checked`**属性(property)**，也有例外，如标签的`class`**属性(attribute)**对应的是DOM对象的`className`**属性(property)**。对于同名的两种属性，通常情况下我们常会错误的任务这两个**属性**的值应该是一样的，然而事实上这两个**属性**的值相互之间是独立的。也就是说**attribute**是对于HTML标签的来说的，由于HTML的松散性，页面的制作者可以为**attribute**赋任何值或不赋值，而且赋的值最终都会被浏览器转换为字符串。**property**是对于DOM对象来说，属于程序范围内的对象属性，拥有固定的数据类型,如字符串类型，布尔类型，数字类型，因此只能根据数据类型来赋值。

以上是对于**attribute**与**property**概念的简单理解，可以参见[MSDN上的说明][ref-9]。明白了这些概念上的区别，我们可以继续下去。

对于一个`id='myChb'`的`input`标签，
```html
<input id="myChb" name="chb" type="checkbox" checked="checked" value="val">val
```
如果严格规定`checked`属性值只能为`'checked'`字符串，有人会使用以下代码来查看多选框是否选中
```js
var chb = document.getElementById('myChb');
var chbAttr = chb.getAttribute('checked');
if(chbAttr == 'checked'){
    console.log("选中");
}else{
    console.log("未选中");
}
```

首先对于实际编码中我们有时会不小心忘记或忽略规定，例如在创建标签时为`checked`赋了其它的值，如
```html
<input id="myChb" name="chb" type="checkbox" checked="anyValue" value="val">val
```
那么以上的代码判断其实是不严谨或错误的，其实根据[W3C表单说明](http://www.w3.org/TR/REC-html40/interact/forms.html)，`checked`**属性(attribute)**是一个[boolean attribute][ref-5]，这意味着只要标签中包含了`checked`**属性(attribute)**，不管为其赋任何值(即使是不赋值)，对应的DOM元素的`checked`**属性(property)**恒为`true`值，如果标签本身未包含`checked`**属性(attribute)**，那么DOM元素的`checked`**属性(property)**恒为`false`值，因此规范的正确的判断一个多选框是否选中的方式是使用其DOM元素的`checked`**属性(property)**，如
```js
var chb = document.getElementById('myChb');
if(chb.checked){
    console.log("选中");
}else{
    console.log("未选中");
}
```
>关于**attribute vs property**的说明也可以参见[jQuery.prop()][ref-11]接口说明


### 以编程方式设置多选框的选中与否

+ 方式一：使用`click()`方法

	`click()`方法可以模拟一次鼠标点击事件，一次方法调用会选中多选框，二次方法调用会取消多选框的选中，如
	```js
    var chb = document.getElementById('myChb');
    chb.click();
    ```
+ 方式二：使用DOM对象的`getAttribute()`和`setAttribute()`方法

	在`input`多选框标签上添加`checked`属性会选中该多选框，反之移除`checked`属性会取消选中，如：
    ```js
    var chb = document.getElementById('myChb');

    // 设置选中
    chb.setAttribute("checked",""); // 此处可以添加任何值

    // 取消选中
    chb.removeAttribute("checked");
    ```
+ 方式三：使用DOM对象的`checked`对象属性(property)
	```js
    var chb = document.getElementById('myChb');

    // 设置选中
    chb.checked = true ;

    // 取消选中
    chb.checked = false ;
    ```
>由于HTML语言的松散型和JavaScript语言的弱类型特性，在为标签属性赋值或为DOM对象属性赋值时，当出现非法值时浏览器往往会自动做兼容性转换，因此以下几句代码赋值有等效的结果，如
>
> 		input.checked = "true" ;
> 	 	
>		input.checked = "false" ;
>
>		input.checked = "yes" ;
>
>		input.checked = "no" ;
>
>		input.checked = "checked" ;
>	
>		input.checked = true ;
> 		

### checkbox的焦点设置和事件

在多选框DOM对象上调用`focus()`方法会使多选框获得焦点，调用`blur()`方法会使其失去焦点，如
```js
var chb = document.getElementById('myChb');
// 设置焦点
chb.focus();
// 失去焦点
chb.blur();
```
### 监听焦点变换的事件
如：
```js
var chb = document.getElementById('myChb');

chb.onfocus = function (){
    console.log("checkbox focus");
}

chb.onblur = function(){
    console.log("checkbox blur");
}

```
### 监听选择状态的变化事件
```
var chb = document.getElementById('myChb');

chb.onchange = function (){
    console.log("checkbox checked : "+this.checked);
}
```
### 参考

+ [Check if checkbox is checked with jQuery][ref-1]
+ [What's the proper value for a checked attribute of an HTML checkbox?][ref-2]
+ [Check checkbox checked property using jQuery][ref-3]
+ [W3C checkboxes reference][ref-4]
+ [checked (HTML attribute)][ref-5]
+ [HTML &lt;input/&gt; checked Attribute][ref-6]
+ [HTMLInputElement][ref-7]
+ [&lt;input/&gt;][ref-8]
+ [Attribute Differences in Windows Internet Explorer 8][ref-9]
+ [Checkbox defaultChecked Property][ref-10]
+ [jQuery.prop()][ref-11]
+ [jQuery.change()][ref-12]

[ref-1]: http://stackoverflow.com/questions/2204250/check-if-checkbox-is-checked-with-jquery?rq=1
[ref-2]: http://stackoverflow.com/questions/7851868/whats-the-proper-value-for-a-checked-attribute-of-an-html-checkbox
[ref-3]: http://stackoverflow.com/questions/901712/check-checkbox-checked-property-using-jquery?page=1&tab=active#tab-top
[ref-4]: http://www.w3.org/TR/REC-html40/interact/forms.html#checkbox
[ref-5]: http://reference.sitepoint.com/html/input/checked
[ref-6]: http://www.w3schools.com/TAGs/att_input_checked.asp
[ref-7]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
[ref-8]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
[ref-9]: http://msdn.microsoft.com/en-us/library/dd347148(v=vs.85).aspx
[ref-10]: http://www.w3schools.com/jsref/prop_checkbox_defaultchecked.asp
[ref-11]: http://api.jquery.com/prop/
[ref-12]: http://api.jquery.com/change/
