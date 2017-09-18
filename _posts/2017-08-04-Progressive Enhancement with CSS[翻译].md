---
title: Progressive Enhancement with CSS[翻译]
date: 2017-08-04
---

在本系列的上篇文章里，我们阐述了渐进增强的基本概念；现在我们开始讨论如何使用它。使用级联样式表(CSS)，有许多方法将渐进增强整合到你的工作中，这边文章会介绍几个重要的，并启发你开始思考可以用来渐进强化你站点的其它方法。

### 样式表组织

许多web设计师和开发者没有好好考虑如何将样式表合并到文档中农工，但是这个过程也是一种真正的艺术。使用正确的方法，你能马上收获渐进增强的好处。

#### 使用多个样式表

将你的样式分割有许多好处。很明显超过1500行的样式表有点难于维护，将他们分割到多个样式表中可以改善你的工作流程（以及理顺你的思路）。另一个通常被忽视的好处是，这种分离可以帮助你在所针对的媒体类型中获取更大的一致性。

比如以你的`main.css`文件为例，它包含了站点的所有样式规则，将它分割成单独的包含字体，布局和颜色信息的样式表。将文件命名为`type.css`，`layout.css`，`color.css`。

![break](/img/)

一旦你这样做了，你就可以通过一点小技巧，自动为老的浏览器（比如IE5/Mac）以及其它CSS布局欠缺的浏览器提供一个“降级”的体验。怎么做呢？嗯，关键点在于你如何链接你的文件。让我们假设我们一一个通过`link`元素引入的`main.css`文件开始。

```html
<link rel="stylesheet" type="text/css" href="main.css" />
```

首先，我们将它分割成单独调用的样式表：

```html
<link rel="stylesheet" type="text/css" href="type.css" />
<link rel="stylesheet" type="text/css" href="layout.css" />
<link rel="stylesheet" type="text/css" href="color.css" />
```

在以前，我们其中的多数使用值为“screen,projection”的`media`放在Netscape 4.x的结尾处获得布局样式，但是其实有更好的方法。在我们查看这个解决方案之前，我们先来思考下其它媒体类型。

#### 与其它媒体类型工作

自动内容分发成为渐进增强的主要关注点，我们想要发送一个“强化的”体验给任何支持它的设备，我们应该真正的开始考虑除了浏览器之外，最重要的，我们应该考虑打印机和移动设备。

不行的是，移动市场仍然是零散的不成熟的（不要让我看所有的手持浏览器上，认为他们应该针对“screen”`media`类型渲染样式）。因此，一场关于如果以渐进的方式处理那样的媒体类型的讨论可能会花上几篇文章，甚至是写一本书。但是不要失望：事情在移动世界已经开始有点专辑，一些聪明的人么开始整理一些资料帮助你。但考虑到时间，以及我们所有人，这里我们只关注打印类型。

现在，我们通常添加另一个携带打印类型的`link`元素：

```html
<link rel="stylesheet" type="text/css" media="print" 
href="print.css" />
```

传统情况下，这个样式将包含所有我们打印相关的规则，包括了字体和样色规则。尤其是字体，我们打印样式表的规则有可能反映在主样式表中。换句话说，我们有许多重复样式。

从这里将字体和颜色样式从布局样式中分离出来变的很有价值：在打印样式中不在需要这些规则。除此之外，我们还可以使用另一种组织技术来提高站点的可伸缩性，从问题浏览器中隐藏某些布局。

让我们重新审视我们的样式表。考虑以下：

```html
<link rel="stylesheet" type="text/css" href="type.css" />
<link rel="stylesheet" type="text/css" href="layout.css" />
<link rel="stylesheet" type="text/css" href="color.css" />
```

现在，因为偶尔们没有媒体类型声明，Netscape 4.x会读取这些文件的任意样式，但是我们可以使用它对CSS的基本解析，进一步组织我们的样式规则，移除`layout.css`包含的样式到一个新的样式表中，命名为screen.css。最后我们更新`layout.css`的内容，引入`screen.css`，那么NS4.x以及同类的浏览器就傻了（因为它们无法解析`@import`指令）。

```css
@import 'screen.css';
```

虽然如此，但仍有一个改善的空间 -  我们真应该样声明式表针对的媒体类型，可以在`@import`声明中添加一个媒体类型：

```css
@import 'screen.css' screen;
```

问题是IE7以及之前的浏览器没办法解析这个语法，就会忽略这个样式表，但是如果你希望也在为这些浏览器提供这些样式（基本上你会），你可以使用条件注释就可以简单的达到目的，我们稍后会受到。眼尖的你们可能已经注意到我们在样式名称上使用的是单引号`'`而不是双引号`"`。这是一个小技巧为的是是IE5/Mac忽略这个样式表。并且因为IE5/Mac的CSS布局十分粗糙（尤其是涉及到浮动和定位时），隐藏布局规则是一个适用它的完美的可接受的方法。毕竟，它仍能获得颜色和字体信息，这也很重要。

使用同样的技术，我们可以引入我们的`print.css`（正如你猜的一样，它包含了特定打印布局的规则）。

```css
@import 'screen.css' screen;
@import 'print.css' print;
```

#### 现在是常见的问题：我们如何处理IE6?

对于大多数人来说，IE6就是新的Netscape4 - 每个人都希望它撤掉。

我们将跳过IE6中冗繁的问题；它的问题有很好的文档说明，并且老实说绕过它也没那么难。此外，IE7的适配已经尤其迅速（尤其是在消费市场上），并且IE8已经处在beta版本，这意味着有一天，我们可能要向IE6挥手告别了。

不管是否提到过，微软在IE5中发布了一些启用渐进增强的很好的工具：条件注释。这些巧妙的小逻辑片段（在别的浏览器中都会解析为HTML注释）允许我们不仅在IE纵直接执行特定的标签，而且还允许我们指向特定版本的IE。

作为有web标准意识的开发者，我们应该总是在最符合标准的浏览器中测试我们的设计，之后为那些只要稍许推动就能正常允许的浏览器，提供修正。每个人的工作流都是不同的，但是我发现每个项目最好都以一个标准的文件集开始。我的基本集合包括以下：

+ type.css
+ layout.css
+ screen.css
+ print.css
+ color.css

之后，取决于项目的需求，我会添加特定浏览器的CSS文件，包含了修正。在最近的项目中这些文件是`ie7.css`和`ie6.css`，因此如果项目要求兼容IE6之前的浏览器，我也会创建与浏览器对应的文件（比如`ie5.5.css`）。有了这些文件，我开始向我的基本集合中合适的样式表中添加我的样式规则。

我在Mozilla Firefox启动了我所有CSS的测试，因为我使用它的编辑CSS侧栏编写了大多数CSS。只要我再Firefox完成了一个页面的设计，我会在其它浏览器中查看它。多数情况下会运行良好，因为它们接近标准。之后是测试IE7，多数情况下，我没发现太多问题，但偶尔需要触发[hasLayout](http://www.satzansatz.de/cssd/onhavinglayout.html)或修复另一个小的布局错误。我会将这些修复放到`ie7.css`文件中，而不是直接放到我的基本样式文件中，之后在文档的`head`中，插入一个条件注释：

```html
<!--[if lte IE 7]>
<link rel="stylesheet" type="text/css" href="ie7.css" />
<![endif]-->
```

这个条件注释告诉任何低于或等于（lte）7版本的IE浏览器加载此样式表。所以如果一些人恰好在IE7下浏览器界面，它们会得到我提供的修复，但是如果他们正在一个新版本的浏览器里 —— 这些浏览器可能已经修复了这些渲染问题，比如IE8已经废除了hasLayout —— 这样样式会被忽略掉。另一方面，如果有些人在IE6里浏览这个页面，它们会从这个样式表中得到修复，这十分完美，因为任何在IE7中出现的渲染错误在IE6中出现的概率也比较大。一个这样的修复会覆盖IE的缺陷（在IE7和以下版本的浏览器），解析特定媒体类型的`@import`（正如上面提到的），在ie7.css之前加载`screen.css`而不用声明媒体类型，因此会引入第一次丢失的样式。

一旦我完成了向IE7添加修复的工作，我打开IE6并且查看是否也需要一些处理。如果需要，我会加入另一个条件注释，指向`ie6.css`。

```html
<!--[if lte IE 7]>
<link rel="stylesheet" type="text/css" href="ie7.css" />

<link rel="stylesheet" type="text/css" href="ie6.css" />
<![endif]-->
```

之后，我简单的添加IE6的修复，IE7会忽略，但IE5.5.5等会使用。

#### 其它考虑

CSS中的渐进增强不仅限于我们在文档中关联样式表：我们也可以将此概念应用到我们编写CSS的方式。

比如，考虑生成内容。不是所有浏览器都能处理它，但是可以添加一些额外的小设计或文字介绍，这对于页面的可用性没有必要，但却提供了一些视觉信息或其它的强化。

比如，以联系表单为例：

![form](/img/2017-08-04-form.png)


在编写这些时，你可能会将冒号（:）加到`label`元素里。为什么？难道它们向`label`中添加了别的什么东西吗？不是的。它们确实是有目的的，向用户提供了额外的视觉提示，它们对于`label`元素来说是多余的，应该排除在外。

```html
form id="contact-form" method="post">
  <fieldset>
    <legend>Contact Us
    <p>Send us a message. All fields are required.</p>
<ol>
    <li>
        <label for="contact-name">Name</label>
        <input type="text" id="contact-name" name="name" />
      </li>    <li>
        <label for="contact-email">Email</label>
        <input type="text" id="contact-email" name="email" />
      </li>
    <li><label for="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows="4" »
        cols="30"></textarea>
      </li>
    </ol>
    <button type="submit">Send It</button>  </fieldset>
</form>
```

通过为元素生成的内容是一种将它们添加到文档中的比较好的方法：

```css
label:after {
  content: ":";
}
```

这样编写表单让我们灵活的通过简单的编辑CSS就能将这些声明从我们整站的表单中移除，而不是不得不找到触碰每个表单中的每个冒号。这种技术也达到了很好的降级，因为没有冒号表单也能渲染 - 一个很好的渐进增强的例子。

你可能也发现了，使用高级选择器编写规则，将特定的样式锁定到更高级的浏览器上，有助于你逐步的增强你的网站。一个很好的例子是属性选择器，IE6以及其早期版本的浏览器都无法解析。在CSS禅意花园中的[Gemination](http://www.csszengarden.com/062/)里，Egor Kloos很好的发挥了此概念。

![form](/img/2017-08-04-gemination.jpg)

它是怎么做的呢？下面就是从他的代码里摘取的例子：

```css
/* <= IE 6 */
body {
  margin: 0;
  text-align: center;
  background: #600 none;
}/* IE 7, Mozilla, Safari, Opera */
body[id=css-zen-garden] {
  margin: 100px 0 0;
  padding: 0;
  text-align: center;
  background: transparent url(squidback.gif);
}
```

差异是惊人的，很好的展现了怎样在CSS中实现渐进增强。


![form](/img/2017-08-04-stuff-and-nonsense.jpg)


图片的灰度处理技术是通过在针对IE6(或以前版本)的浏览器中添加条件指令达到的：

```css
/* =img for Internet Explorer < 6 */
img {
  filter: gray;
}
```

虽然这两个例子可能包含了比你每天工作中所能用到的更多的技巧，但它们确实是对如何你如何使用CSS渐进增强方法的很好的证明。

### 总结

正如我们讨论过的，有许多不同的方法在你的网站上通过使用CSS来实现渐进增强的效果。最容易，最好的方法是通过开始组织你的样式表，之后对如何将样式表链接到文档中再做出明智的选择。一旦你了解了条件注释的为例，你可以处理IE的特性，如果你对选择器和如何使用它们有所了解，就能在CSS本身实现更细粒度的调整。

有了这些知识，你应该已经准备好成为一个渐进增强方面的专家了。下次我们会讨论JavaScript中的渐进增强。

[原文](https://alistapart.com/article/progressiveenhancementwithcss)
