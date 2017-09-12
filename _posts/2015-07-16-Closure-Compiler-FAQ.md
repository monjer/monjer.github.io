---
title: Closure Compiler FAQ
date: 2015-07-16
tags:
  - google
  - closure compiler
---


### 什么是Closure Compiler？为何使用它？

Closure Compiler是一个工具，它使得JavaScript下载运行更快。可以使用Closure Compiler来压缩JavaScript文件的大小，使其更加高效。

### Closure Compiler与市面上其他的JavaScript压缩器的区别是？

总的来讲，Closure Compiler应该满足甚至超过其他代码压缩工具的压缩效率，并且能加快你的Web应用的下载速度。此外在开发阶段（而不是测试阶段），Closure Compiler能够帮助你发现语法错误，定位潜在的容易出现bug的代码模式。

在简单模式下，Closure Compiler就应该优于其他工具，因为它使用类编译分析(compiler-like analysis)方式，使用额外的方法来压缩代码大小。例如，Closure Compiler能够内联化那些使用在几个地方的函数(inline functions)，重用变量名称，提前计算常量表达式。

在高级模式下，Closure Compiler也能够使用你添加的类型注解来发现那些极难发现的bug。


### Closure Compiler是否能够编译嵌入到HTML中的JavaScript代码？

不可以。Closure Compiler只能作用于那些只包含JavaScript代码的文件。

### 使用Closure Compiler时，我能够同时使用其它JavaScript压缩器吗？

可以。Closure Compiler能读取任意合法的JavaScript代码，并生成合法的JavaScript代码，所以，在使用其它压缩器处理Javascript文件之前或之后，你都可以使用Closure Compiler处理该文件。

要记得，Closure Compiler和其它压缩器对输入的代码是有要求的。例如，一个能够清除注释的压缩器可能会删除注释或注解信息，但这些注释或注解有可能是其它压缩器所需要的。

### 如何调试Closure Compiler生成的JavaScript代码？

如果你的编译后的代码抛出了异常或发生了意外行为，你可以使用Source Maps来调试问题。一个source map能够提供编译代码和其原始代码的映射关系，浏览器的开发者工具向你展示原始代码，而不是编译后的代码。要让Closure Compiler生成一个source map，需要在命令行中传入`--create_source_map`选项。如：

	$ java -jar compiler.jar --js example.js --create_source_map ./example-app -- js_output_file example-compiled
	
那么，如果你使用支持Source Maps的浏览器(如，Chrome 或 Firefox)，你可以像是作用在未编译代码上那样来设置断点，浏览器的开发者工具将在原始文件上显示对应的代码行。更多关于Chrome开发者工具的信息，包括如何使用source map，请查看[Debugging JavaScript][1]。
### 编译器会权衡应用的运行速度和下载代码的大小吗？

是的。任何优化编译器都会做出权衡。一些尺寸的优化确实会牺牲些微小的运行速度。然而，Closure Compiler编译器的开发人员已经十分小心了，不会增加额外显著的运行时间。一些编译器的优化甚至会缩短运行时间(参考下段)。


### Closure Compiler能够优化速度么？

多数情况下，越小的代码量，运行速度越快，因为下载时间通常是web应用最重要的速度因素。消除冗余代码带来的优化也能提高代码的运行速度。

### 对于压缩文件的大小有限制吗？

Closure Compiler Web service的压缩服务有文件大小上限要求，但独立的Closure Compiler application没有限制。

### Closure Compiler能够应用于所有平台吗？

Closure Compiler使用Java编写，所以可以运行在任何可以运行java的平台上。

### Closure Compiler能处理任意合法的JavaScript代码吗？

多数情况是的。一些JavaScript结构，包括`eval()`和`with()`在内，能够推倒编译器转换所依据的假设。

### 使用Closure Compiler，我需要了解多少Web开发的知识？

Closure Compiler只是一个JavaScript的开发工具，所以使用这个编译器，你只需要知道如何使用JavaScript编写程序即可。但任何使用JavaScript的人员都能够在使用Closure Compiler的过程中受益匪浅。


### Closure Compiler如何与Closure Library一起工作？

对于使用Closure Library的代码，Closure Compiler能够提供特殊的检测和优化。此外，Closure Compiler能够自动包含Closure Library中的文件。[Finding You Way around Closure][2]一文中描述了你需要了解的Closure的部分语法声明。参见[API手册][3]来查看更多关于Closure Library API的帮助信息。要结合使用Closure Library 和Closure Compiler，你首先要[下载Closure Library][4]。Closure Compiler默认内置支持Closure Library，并已开启。

### 为什么在开启`ADVANCED_OPTIMIZATIONS`选项后，我的代码无法运行或者编译报错？

使用高级模式通常需要一些准备工作和代码变动。[Advanced Compliation and Externs][5]一文中解释了如何使你的代码能够在`ADVANCED_OPTIMIZATIONS`模式下工作。

### 为什么在编译后的脚本中有随机的换行分割？

Closure Compiler有意的在每大约500个字符后添加换行。一些防火墙或代理有时会搞坏或忽略那些带有很长字符行的JavaScript大文件。在500个字符后添加换行能够阻止这种情况的发生。移除这些换行不会对脚本语法带来任何影响。对于代码大小的影响是微乎其微的，编译器优化了换行符放置的位置，以便文件进行gzipped压缩，不会对代码尺寸的压缩造成更多的影响。

### 在我源代码中我添加了版权声明或开源协议文字。我怎样阻止Closure Compiler将这些文字删除掉？

Closure Compiler支持**JSDoc**的`@license`标签。在任意的JSDoc注释中添加`@license`标签，都能够保留这些注释。更多信息参见[Annotating JavaScript for the Closure Compiler][6]

### 原文
[Frequently Asked Questions][7]

[1]: https://developers.google.com/chrome-developer-tools/docs/javascript-debugging
[2]: https://developers.google.com/closure/library/docs/introduction#deps
[3]: https://developers.google.com/closure/compiler/docs/api-ref#closure
[4]: https://github.com/google/closure-library
[5]: https://developers.google.com/closure/compiler/docs/api-tutorial3
[6]: https://developers.google.com/closure/compiler/docs/js-for-compiler#tag-license
[7]: https://developers.google.com/closure/compiler/faq







	

