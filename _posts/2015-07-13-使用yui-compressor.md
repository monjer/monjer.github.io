---
title: 使用yui_compressor
date: 2015-07-13
tags:
  - css compress
  - yui compressor
---


### 是什么

YUI Compressor，是出自Yahoo的js和css的代码压缩器。

### 干什么

YUI Compressor能够移除js代码中的注释，空白符，并且能够使用最短变量名，对js中的局部变量进行安全的混淆操作。与此同时，YUI Compressor也能够安全的压缩CSS文件，压缩的类型取决于传入的文件的扩展名类型。

### 为什么

依据Yahoo性能测试，超过40%-60%的用户在浏览Yahoo站点时，他们的浏览器cache都是用的，20%的用户的所有PV都是在无cache状态下进行的。基于这个事实，如何保证web页面足够轻量显得尤为重要。更好的web页面设计和web application的设计无论何时都是节省资源的首要选择的策略。除此之外，许多可用的能够提要性能的二级策略也是能够达到不错的效果的，因此YUI Compressor的作用就是通过压缩代码，来保证资源足够的轻量级，节省足够的代码，以达到更好的性能要求。

### 工作和使用方式

YUI Compressor是使用java语言编写的，因此具有良好的跨平台性，对于js文件来说，它首先分析源文件的代码结构，之后会移除空白符，注释，并使用诸如单个字符命名的变量来混淆所有局部变量,已达到压缩的目的。此外,对于CSS，其压缩算法会使用一系列的正则表达式来压缩CSS源文件。

YUI Compressor可以使用命令行方式运行，也可以结构一些诸如Ant的构建工具使用，首先需要先[下载YUI Compressor][1]的jar文件，当前版本为2.4.8，文件名为`yuicompressor-2.4.8.jar`，

可以以下面的文件结构为例来说明其使用方法：

```txt
app->
  js->
    jquery.js
    common.js
    main.js
  css->
    reset.css
    main.css
  yuicompressor-2.4.8.jar
```
打开客户端命令行工具，本机 MAC OS,切换到app的目录下,以下操作命令都在app目录下操作

#### 单文件压缩
```sh
$ java -jar yuicompressor-2.4.8.jar --type js ./js/jquery.js -o jquery.min.js
```
这会在_app/js_下生成_jquery.min.js_文件。`--type`选项，说明了带压缩文件的类型，`js`指明要压缩JavaScript文件，`css`指明要压缩css文件，省略`--type`的会根据输入文件的扩展名(.js或.css)来选择压缩方式；` ./js/jquery.js`指定了输入的js源文件；`-o`选项说明了输出压缩文件的名称。可以省略`--type`,等价于
```sh
$ java -jar yuicompressor-2.4.8.jar ./js/jquery.js -o jquery.min.js
```
基于以上命令行格式，压缩_reset.css_如下
```sh
$ java -jar yuicompressor-2.4.8.jar ./css/reset.css -o reset.mini.css
```
会在_app/css_生成_reset.mini.css_文件

#### 多文件压缩
单个文件一个个压缩比较繁琐，可以选择使用多文件压缩一次搞定，这需要`-o`选项指定一定格式。批量压缩js文件
```sh
$ java -jar yuicompressor-2.4.8.jar ./js/*.js -o '.js$:.min.js'
```
会将_app/js_目录下所有`name.js`文件生成`name.min.js`。批量压缩css文件
```sh
$ java -jar yuicompressor-2.4.8.jar ./css/*.css -o '.css$:-min.css'
```
会将_app/css_目录下所有`name.css`文件生成`name.min.css`。

其中`name`代替的是文件的名称，`'.js$:.mini.js'`,`'.css$:.mini.css'`均为输出压缩文件的文件名格式。

多文件压缩只给定了重命名的语法规则，但不支持目录级别的重写，实际使用的时候，我们需要将所有生成的`*.min.js`文件分别移到新的目录下面，也可以使用以下命令行来完成此操作，比如要将所有压缩后的js文件和css文件，分别移到_app/dist/js_,_app/dist/css_目录下

```sh
$ mkdir -p dist/js dist/css
$ mv js/*.min.js dist/js
$ mv js/*.min.css dist/css
```


#### 结合使用Ant压缩
在_app_目录下新建文件_build.xml_脚本,并写入

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project name="Compress" default="compress">

	<!--清空操作-->
	<target name="cleanup">
		<delete dir="dist"/>
		<mkdir dir="dist/js"/>
		<mkdir dir="dist/css"/>
	</target>
	<!--压缩所有css目录下的css文件，输出到dist/css目录下-->
	<target name="compress.css">
		<apply executable="java" parallel="false" failonerror="true" dest="dist/css" verbose="yes">
		    <fileset dir="css">
    			<include  name="**/*.css" />
			</fileset>
	        <arg line="-jar" />
    	    <arg path="yuicompressor-2.4.8.jar" />
	    	<srcfile />
    	    <arg line="-o" />
        	<mapper type="glob" from="*.css" to="*.min.css" />
    	    <targetfile />
	    </apply>
	</target>
	<!--压缩所有js目录下的js文件，输出到dist/js目录下-->
	<target name="compress.js">
		<apply executable="java" parallel="false" failonerror="true" dest="dist/js" verbose="yes">
		    <fileset dir="js">
    			<include  name="**/*.js" />
        	</fileset>
	        <arg line="-jar" />
    	    <arg path="yuicompressor-2.4.8.jar" />
	    	<srcfile />
    	    <arg line="-o" />
        	<mapper type="glob" from="*.js" to="*.min.js" />
    	    <targetfile />
	    </apply>
	</target>
	<!--main target 脚本运行主task-->
	<target name="compress">
		<antcall target="cleanup"/>
		<antcall target="compress.css"/>
		<antcall target="compress.js"/>
	</target>
</project>
```
执行
```sh
$ ant
```
脚本首先会在_app_目录下创建目录_dist/css_和_dist/js_目录，之后会将压缩后的js和css文件分别写入到两个目录下

```txt
app->
  dist->
    js->
      jquery.min.js
      common.min.js
      main.min.js
    css->
      reset.min.css
      main.min.css
```
### 其它选项说明

关于yuicompressor.jar的说明，可以使用
```sh
$ java -jar yuicompressor-2.4.8.jar --help
```
查看，通用选项

	--charset 以指定编码格式读入文件
	-v 显示压缩信息和警告

JavaScript特殊选项

	--nomunge 只压缩，不混淆
	--preserve-semi 保留所有分号
	--disable-optimizations 禁用所有优化
### 参考

+ [YUI Compressor document][3]
+ [Minification v Obfuscation][4]
+ [Apache ant][2]
+ [Command Line Options For YUI Compressor][5]



[1]: https://github.com/yui/yuicompressor/releases
[2]: http://ant.apache.org/manual/index.html
[3]: http://yui.github.io/yuicompressor/
[4]: http://yuiblog.com/blog/2006/03/06/minification-v-obfuscation/
[5]: http://stackoverflow.com/questions/9852814/command-line-options-for-yui-compressor/9853192#9853192
