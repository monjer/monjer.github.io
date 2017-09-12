---
title: Closure Compiler application初级使用
date: 2015-07-16
tags:
  - javascript
  - google
  - closure compiler
---


### 是什么

Closure Compiler application是一个java的命令行工具，可以用来压缩，优化js代码，查找其中的错误并给出提示和警告。这是使用Closure Compiler来处理js代码的三种方式之一。

### 初级使用示例

以一个最简单的Demo为例，说明Closure Compiler application的初级使用方式，首先需要[下载][1]Closure Compiler的compiler.jar文件,当前该版本文件的运行依赖于jre7。

创建Demo示例的目录及文件，并将compiler.jar添加到其中，如下

	js->
		app->
			app.js
		index.html
		compiler.jar

其中_app.js_内容如下
```js
/**
 * application 主文件
 * Create by manjun.han
 * 2015.7.14
 */

var app = {

    /**
     * application启动入口
     */
    boot:function(){
        var compiler = "Closure Compiler application ";
        app.sayHello(compiler);
    },

    /**
     * Hello world输出
     */
    sayHello:function(who){
        var message = "hello world";
        alert( who + " say :" + message);
    }
}

// 启动程序
app.boot();	 
```

_index.html_的内容为

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
	    <title>Google Compiler application初级使用示例</title>
	</head>
	<body>
	   <script src="app/app.js"></script>
	</body>
</html>
```
现在可以打开_index.html_,可以查看运行结果。不出意外，浏览器会弹出显示信息的alert框。现在使用compiler.jar对_app.js_进行压缩。
打开命令行工具，切换到_js_目录下，输入并运行以下命令
```sh
$ cd js
$ java -jar compiler.jar   --js ./app/app.js --js_output_file ./app/app.min.js
```
其中，`--js`选项后面指定的带压缩的文件名称，`--js_output_file`选项指定了压缩后输出文件的路径和名称。

正确的执行完命令后，那么会在_app_目录下生成压缩文件_app.min.js_

	js->
		app->
			app.js
			app.min.js
		index.html
		compiler.jar

其文件内容为

```js
var app={boot:function(){app.sayHello("Closure Compiler application ")},sayHello:function(a){alert(a+" say :hello world")}};app.boot();
```
可见源文件的空白行，以及所有注释都被移除，此外，`boot`方法中的`compiler`变量也被删除而直接将其值传入到`app.boot`方法的参数中，同时，`sayHello`方法的名为`who`的参数被替换为了更短的`a`。但对象名称(`app`)和方法名称(`boot`,`sayHello`)并没有变化。

修改 _index.html_
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
	    <title>Google Compiler application初级使用示例</title>
	</head>
	<body>
	   <script src="app/app.min.js"></script>
	</body>
</html>
```

重新刷新页面，可见运行结果保持不变，与先前未压缩的文件的输出一致。

以上是使用Closure Compiler application的一个比较完整的简单的示例，并且也看到了compiler.jar在压缩的过程中所做的基本处理。

### 多文件压缩

上面是单文件压缩，如果在_app_目录下又添加了几个js文件

	app->
		app.js
		common.js
		color.js

现在如果想要一次将所有js文件打包压缩，可以
```sh
$ java -jar compiler.jar   --js ./app/app.js --js ./app/common.js --js ./app/color.js --js_output_file ./app/app.min.js
```
这种方式在几个文件时，可以考虑使用，但当站点应用规模变大，形成项目级别时，js文件会超过十数个或几十个，这样在一个个指定会比较麻烦，可以使用类似通配模式来指定输入的js文件，如下
```sh
$ java -jar compiler.jar   --js ./app/**.js --js_output_file ./app/app.min.js
```
如果文件数量过多的话，我们通常会采取划分模块的方式将文件按照功能分类到不同目录，如

	app-->
		view-->
			*.js
		modle-->
			*.js
		common-->
			*.js
使用上述的命令的优势就更明显了，而且我们也可以选择压缩指定多个目录下js文件，如
```sh
$ java -jar compiler.jar   --js ./app/view/**.js --js ./app/modle/**.js --js_output_file ./app/app.min.js
```
### 补充

以上是Closure Compiler application最基本的使用结构和方式，其实Closure Compiler application所完成的功能还有好多，可以在命令行下使用`--help`选项来查看其更多帮助选项
```sh
$ java -jar compiler.jar --help
```
以下是几个最基本选项的说明


	--charset VAL			所有输入和输出文件的编码格式，默认接受UTF-8编码输入文件，输出US_ASCII文件
	--create_source_map		创建source map文件
	--compilation_level (-O) VAL 	指定压缩级别，可选值包括:WHITESPACE_ONLY,SIMPLE(默认), ADVANCED
	--debug					启用debug模式(可以查看一些变量是重命名的原始模式)
	--formatting VAL		指定输出文件的格式化模式，可选值包括PRETTY_PRINT, PRINT_INPUT_DELIMITER, SINGLE_QUOTES
	--help					显示帮助信息
	--js VAL				输入的js文件名，可以指定多个。支持golb patterns，如使用 --js='**.js' --js='!**_test.js' 来包含所有未以_test为结尾的文件作为输入
	--js_output_file VAL
	--language_in VAL			指定输入的js文件所遵循的语言标准，可选值包括 ECMASCRIPT3(默认), ECMASCRIPT5, ECMASCRIPT5_STRICT, ECMASCRIPT6(实验阶段)
	--language_out VAL			输出文件锁遵循的语言标准，未指定的话与--language_in相同
	--source_map_format VAL 	source map格式，可选值为V3或DEFAULT
    --version					显示当前compiler.jar的版本号
    --warning_level(-W) VAL		指定警告级别，可选值包括QUIET, DEFAULT, VERBOSE
     --warnings_whitelist_file VAL 警告的输出文件，输出文件每行的格式为 <file-name>:<line-number>?  <warning-description>



### 参考

+ [Getting Started with the Closure Compiler Application][2]



[1]: http://dl.google.com/closure-compiler/compiler-latest.zip
[2]: https://developers.google.com/closure/compiler/docs/gettingstarted_app
