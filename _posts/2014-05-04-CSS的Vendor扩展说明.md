---
title: CSS的Vendor扩展说明
date: 2014-05-04
tags:
    - css
---


CSS中的标识符可以以`'-'`或`'_'`开始，以`'-'`或`'_'`为开始的关键字或属性名称属于CSS的保留字，为的是支持特定浏览器的扩展实现(vendor-specific)。如以下扩展样式示例：
```css
-moz-box-sizing
-moz-border-radius
```
常见的扩展关键字如下：

<table border="1">
<thead><tr><th>prefix</th><th>organization</th></tr></thead>
<tbody>
<tr><td><code>-ms-</code>, <code>mso-</code></td><td>Microsoft</td></tr>
<tr><td><code>-moz-</code></td><td>Mozilla</td></tr>
<tr><td><code>-o-</code>, <code>-xv-</code></td><td>Opera Software</td></tr>
<tr><td><code>-atsc-</code></td><td>Advanced Television Standards Committee</td></tr>
<tr><td><code>-wap-</code></td><td>The WAP Forum</td></tr>
<tr><td><code>-khtml-</code></td><td>KDE</td></tr>
<tr><td><code>-webkit-</code></td><td>Chrome,Safari (and other WebKit-based browsers)</td></tr>
<tr><td><code>prince-</code></td><td>YesLogic</td></tr>
<tr><td><code>-ah-</code></td><td>Antenna House</td></tr>
<tr><td><code>-hp-</code></td><td>Hewlett Packard</td></tr>
<tr><td><code>-ro-</code></td><td>Real Objects</td></tr>
<tr><td><code>-rim-</code></td><td>Research In Motion</td></tr>
<tr><td><code>-tc-</code></td><td>TallComponents</td></tr>
</tbody>
</table>

因为W3C首先是定义并放出CSS的草拟版本，并由各个浏览器厂商来实现，最终根据实现情况制定并发布标准版。因此支持扩展的目的是为了方便特定浏览器实现一些定制化的样式或先期测试一些处于开发阶段的样式属性，因此扩展的样式多数存在浏览器的兼容性问题。所以在使用CSS的扩展时，我们尽量使用那些较接近CSS属性的，以便标准属性制定并由浏览器正确实现后，将这些扩展移除。如是指边框圆角的`border-radius`属性为标准的CSS属性，但目前并不是所有浏览器都完全实现了该属性，所以在使用该样式时需要结合扩展，如：
```css
-webkit-border-radius: 2px;/* wekkit */
-moz-border-radius: 2px; /* firefox */
border-radius: 2px; /* 标准 */
```
### 参考

+ [Vendor-specific extensions][ref-1]
+ [css3pie][ref-2]
+ [Vendor-specific Properties][ref-3]
+ [border-radius][ref-4]
+ [MDN border-radius][ref-5]
+ [Microsoft CSS Vendor Extensions][ref-6]

[ref-1]: http://www.w3.org/TR/CSS21/syndata.html#vendor-keywords
[ref-2]: http://css3pie.com/
[ref-3]: http://reference.sitepoint.com/css/vendorspecific
[ref-4]: http://www.w3.org/TR/css3-background/#the-border-radius
[ref-5]: https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius
[ref-6]: blogs.msdn.com/b/ie/archive/2008/09/08/microsoft-css-vendor-extensions.aspx
