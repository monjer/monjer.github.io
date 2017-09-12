---
title: HTML5的placeholder属性
date: 2015-03-22
tags:
    - html5
    - placeholder
---

### 目的

HTML5中为input元素添加了placeholder属性，用来作为一个简短的提示，描述当前输入框期望用户的输入值。如下：
```html
<input name="username" type="text" placeholder="请输入用户名">
```
在用户未输入任何值的时候，输入框会显示placeholder属性设置的提示信息，而且会以有别于正式的输入值的样式来设置placeholder字符串的样子。


### 适用于

不是所有类型的input都可以添加placeholder属性，以下几个类型的input支持该属性

+ text
+ search
+ url
+ telephone
+ email
+ password

除了可以为input设置placeholder属性外，textarea元素同样支持placeholder属性。

### 设置样式

以改变背景色为例,设置所有input和textarea的placeholder样式
```css
*::-webkit-input-placeholder {/* Webkit , Chrome , Safari */
    background-color: white;
}
*:-moz-placeholder {/* FF 4-18 */
    background-color: white;
}
*::-moz-placeholder {/* FF 19+ */
    background-color: white;
}
*:-ms-input-placeholder {/* IE 10+ */
    background-color: white;
}
```
也可以结合其它选择器来设置特定元素的placeholder的样式
```css
#loginForm input::-webkit-input-placeholder {/* Webkit , Chrome , Safari */
    background-color: white;
}
#loginForm input:-moz-placeholder {/* FF 4-18 */
    background-color: white;
}
#loginForm input::-moz-placeholder {/* FF 19+ */ 	    background-color: white;
}
#loginForm input:-ms-input-placeholder {/* IE 10+ */
    background-color: white;
}
```
### 兼容性


<table>
  <tbody><tr>
    <th style="width:20%;font-size:16px;text-align:left;">属性</th>
    <th style="width:16%;" class="bsChrome" title="Chrome">Chrome</th>
    <th style="width:16%;" class="bsIE" title="Internet Explorer">IE</th>
    <th style="width:16%;" class="bsFirefox" title="Firefox">Firefox</th>
    <th style="width:16%;" class="bsSafari" title="Safari">Safari</th>
    <th style="width:16%;" class="bsOpera" title="Opera">Opera</th>
  </tr>
  <tr>
    <td style="text-align:left;">placeholder</td>
    <td>10.0</td>
    <td>10.0</td>
    <td>4.0</td>
    <td>5.0</td>
    <td>11.0</td>
  </tr>
</tbody></table>

### 特性检测和jQuery插件

由于不是所有浏览器都支持该新属性，可以用以下代码来进行特性检测，判断当前浏览器是否支持placeholder属性
```js
function supportPlaceholderAttr() {
    var input = document.createElement('input');
    return ('placeholder' in input);
}
```
此外也有关于placeholder的jQuery插件来使得不支持该属性的浏览器也能实现该效果，参见[jquery-placeholder][7]的说明及使用

### 参考

+ [MDN `::-moz-placeholder`][1]
+ [MDN `:-moz-placeholder`][2]
+ [HTML5 textarea placeholder][3]
+ [HTML5 input placeholder][4]
+ [Change an input's HTML5 placeholder color with CSS][5]
+ [IE `:-ms-input-placeholder`][6]

[1]: https://developer.mozilla.org/zh-CN/docs/Web/CSS/::-moz-placeholder
[2]: https://developer.mozilla.org/zh-CN/docs/Web/CSS/:-moz-placeholder
[3]: https://html.spec.whatwg.org/multipage/forms.html#attr-textarea-placeholder
[4]: https://html.spec.whatwg.org/multipage/forms.html#attr-input-placeholder
[5]: http://stackoverflow.com/questions/2610497/change-an-inputs-html5-placeholder-color-with-css
[6]: https://msdn.microsoft.com/en-us/library/ie/hh772745(v=vs.85).aspx"
[7]: https://github.com/mathiasbynens/jquery-placeholder

