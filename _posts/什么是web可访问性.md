web可访问性总结

### 什么是web可访问性

Web可访问性意味着残疾人也可以使用Web。更具体的来说，Web可访问性意味着残疾人可以感知，理解，浏览和与Web交互，并能对Web做出空闲。Web可访问性也有利于其它人，包括老年人。保证所有人都有平等的访问和使用Web的权利。

### Web可访问性指南

#### 语义化HTML

优点：

+ 开发更容易，语义化明确，更易理解
+ 更好的移动体验，语义化标签的体积更轻，代码更简洁
+ SEO友好，搜索引擎对关键的标签会增加权重，语义化文档更加容易被用户搜索到


实现方式：

#### 文页面添加好的title

#### 文本内容

**1.** 定义内容结构良好的标题，段落，列表。屏幕阅读器会更容易理解内容结构。

+ 使用`h1`-`h6`，`p`，`ul`，`ol`，`li`标签来定义文章结构。
+ 避免使用`br`换行，`font`标签来标识字体

**2.**  使用清晰的语言

+ 避免使用不该用的符号，比如应该使用`5到10`，而不是`5-10`
+ 避免缩写，比如，应该使用`January`，而是不`Jan`


#### 页面结构

好的页面结构，屏幕阅读器会更易理解。

+ 避免使用table来承载页面布局
+ 使用语义化的布局标签，比如`header`，`article`，`main`，`nav`，`footer`，`aside`
+ 一致的页面结构，将信息框架进行统一
+ 避免不同的内容区在浏览器尺寸变化后出现遮挡或错位问题

#### UI控件

UI控件指的是用户操作的页面元素，比如按钮，链接，表单空间。

+ 确保用户交互的部分都是原生空间，比如要用`<button>提交</button>`，而不是`<div class="btn">提交</div>`
+ 保证空间可以使用键盘切换，正确的添加`tabindex`属性，同时避免`tabindex`的滥用
+ 文本标签表意要清除，比如，应该使用`<a href="whales.html">Find out more about whales</a>.`，而不是`To find more out about whales, <a href="whales.html">click here</a>`
+ 为表单空间添加`lable`描述


#### 表格

+ 使用`thead`，`tbody`，`tfoot`来区分表格的块
+ 为table添加标题`caption`
+ 表头单元格要用`th`
+ 为table添加`summary`描述

#### 图片

+ 为与内容相关的重要的`img`标签添加`alt`属性


### CSS

+ 根据标签原本的语义进行与之相配的样式
+ 保证颜色的跨浏览器的一致性

### JavaScript

+ 保证JavaScript代码的非侵入式，即让脚本代码与HTML结构尽量分离
+ 避免使用其它标签代替`a`标签来打开新页面
+ 为不支持脚本的页面添加`noscript`描述


### WAI-ARIA

WAI-ARIA是W3C定义的额外的HTML属性，为元素提供额外的语义化，改善可访问性。主要包含以下三个方面：

+ Roles，角色，定义元素是什么以及用来干什么，比如`role="navigation"`
+ Properties，属性，定义元素的属性，提供额外的意思或语义，比如`aria-required="true"`
+ States,状态，特殊的一类属性，定义了元素在当前添加下的状态，比如`aria-disabled="true"`

### 移动设备

+ 禁止页面缩放，`<meta name="viewport" content="user-scalable=no">`
+ 正确的表单类型，`number`, `tel` ,`email`,`time `,`date `

### 参考

+ [Accessible Rich Internet Applications (WAI-ARIA) 1.1](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
+ [Code Library of Accessibility Examples](https://dequeuniversity.com/library/)
+ [How to Meet WCAG 2.0](https://www.w3.org/WAI/WCAG20/quickref/)
+ [Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/forms/)
+ [增强网站可访问性的25种方法](http://www.topcss.org/%E5%A2%9E%E5%BC%BA%E7%BD%91%E7%AB%99%E5%8F%AF%E8%AE%BF%E9%97%AE%E6%80%A7%E7%9A%8425%E7%A7%8D%E6%96%B9%E6%B3%95/)
