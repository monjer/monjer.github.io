---
title: YUICompressor压缩CSS的bug一则
date: 2015-10-05
tags:
    - css
    - yui compressor
---


CSS代码优化时，yuicompressor是经常用到的压缩工具，它的侵入式的压缩，会去掉css文件中多余的注释，空白符，以及进行必要的简写，或者去除一些css属性值的单位(unit)。这里描述的`2.4.8`版本下，针对去除属性值单位的问题以及引发的bug。

众所周知，css中的众多属性值都是数字类型，并且会辅以必要的单位来对数值代表的具体测量值进行说明，常见的属性比如,`width`,`height`,`margin`,`padding`,`border`,`font-size`,单位有`em`,`px`等等。数值+单位一起说明了属性值测量的长度。这其中比较特殊的一个CSS属性值为`0`,通常来说对于一个值为0的属性，不论是否加单位，最终的展示效果是一样的，也就是说，`0`,`0px`,`0%`代表的最终结果是一样的，以示例来说，以下代码是等价的
```css
.box{
    width:0;
}
.box{
    width:0px;
}
.box{
    width:0%;
}
```
或者
```css
.box{
    margin:10px 0px;
}
.box{
    margin:10px 0;
}
```

基于此结论，CSS压缩工具会检测值为`0`的属性，并将后面的单位去掉，来达到经由压缩字符数量达到CSS压缩优化的效果。

但，CSS3的出现，带来了一些新的样式，最基本的就是用来添加动画的`transition`属性和`animation`属性,其中

+ `transition-duration`,
+ `transition-delay`,
+ `animation-duration`,
+ `animation-duration`

四个属性值的单位为时间单位，`秒(s)`,`毫秒(ms)`。特殊的是，对于这些属性来说，以实际的运行效果来看得出的结论是`0 != 0s`，比如以下代码在浏览器下无法按预期效果执行，因为`transition-delay:0`，浏览器无法识别
```css
.box {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    transition: all .3s 0 linear;
}

.box:hover {
    background-color: red
}
```
在Chrome下运行后查看效果，如

![image](/img/2015-10-05-failed.png)

正确的做法是设置`transition`属性为`transition: all .3s 0s linear;`,如

![image](/img/2015-10-05-success.png)

因此使用yuicompress在压缩包含有`transition`属性或者`animation`属性的样式文件时，会出现这个问题，`0s`被压缩为`0`,导致样式效果失败。参见[issue #99][8]

### 解决方式

根据[issue #99][8]的讨论，如果一定要是使用yuicompressor，可以将`0s`的写法改为`0.000s`，前后压缩效果对比
```css
/* 压缩前 */
transition: all .3s 0.000s linear ;

/* 压缩后 */
transition: all .3s .000s linear ;
```
这样可以保证在保证其它CSS代码块被压缩的情况下，保证动画样式的正确性。

### 参考

+ [Safari CSS Visual Effects Guide][1]
+ [CSS Distance Units : the \<length\>][2]
+ [Google HTML/CSS Style Guid:0 and Units][3]
+ [Size of zero pixels in CSS with or without 'px' suffix][4]
+ [CSS difference between 0 and 0em][5]
+ [MDN \<length\>][6]
+ [CSSLint : Disallow units for zero values][7]
+ [Units on “0s” Transition in Firefox][9]
+ [How to Avoid CSS3 Animation Minification Muddles][10]


[1]: [https://developer.apple.com/library/safari/documentation/InternetWeb/Conceptual/SafariVisualEffectsProgGuide/AnimatingCSSTransitions/AnimatingCSSTransitions.html#//apple_ref/doc/uid/TP40008032-CH13-SW8]
[2]: http://www.w3.org/TR/2013/CR-css3-values-20130730/#lengths
[3]: http://google-styleguide.googlecode.com/svn/trunk/htmlcssguide.xml#0_and_Units
[4]: http://stackoverflow.com/questions/5359222/size-of-zero-pixels-in-css-with-or-without-px-suffix
[5]: http://stackoverflow.com/questions/935107/css-difference-between-0-and-0em
[6]: https://developer.mozilla.org/en-US/docs/Web/CSS/length
[7]: https://github.com/CSSLint/csslint/wiki/Disallow-units-for-zero-values
[8]: https://github.com/yui/yuicompressor/issues/99
[9]: http://stackoverflow.com/questions/13145352/units-on-0s-transition-in-firefox
[10]: http://www.sitepoint.com/avoid-css3-animation-minification-muddles/
