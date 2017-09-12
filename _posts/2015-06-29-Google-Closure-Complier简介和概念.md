---
title: Google Closure Complier简介和概念
date: 2015-06-29
tags:
  - google
  - closure compiler
---


### 简介

Closure complier是一个使得javascript下载运行更加迅速
的工具。它是一个真正的javascript的编译器。与将源语言编译为机器码不同的是，它将javascript编译为更好的javascript。它会解析并分析你的javascript代码，删除僵尸代码，之后会重写并压缩剩余代码部分。它也会检测代码语法，变量引用，类型，并针对javascript常见的陷阱给出提示。

### 使用方式

可以以以下三种方式使用Closure compiler

1. 以命令行方式运行的java应用程序，参见[Getting Started with the Closure Compiler Application][4]
2. 以线上Web服务方式使用,参见[Getting Started with the UI][5]
3. 以RESTful API方式使用,参见[Closure Compiler Service API][6]

### 优势

使用Closure compiler获益如下

+ **高效**。Closure complier会压缩javascript文件的大小，使其更加高效，会提升你的应用程序加载速度，节省带宽。
+ **代码检测**。对于非法的javascript代码或存在潜在危险的操作，Closure compiler会给出警告，帮助你生成bug更少的javascript，使其更易维护。


### 3个压缩级别说明

closure complier提供三个级别的编译压缩,由低到高分别是：

1. **WHITESPACE_ONLY**
	依次删除代码注释，换行，非必要空格，不相干的标点符号，以及其它空白符。输出后的js与源js基本相等，属于最低级别压缩。

2. **SIMPLE_OPTIMIZATIONS**
	除了执行**WHITESPACE_ONLY**压缩级别的内容外，还会针对表达式和函数进行优化，包括缩短局部变量和函数参数的名称。由于只针对函数局部变量进行重命名，该级别压缩不考虑与其它编译的js模块或其它js代码的交互部分。属于中级压缩，同时也是colsure complier的默认编译级别。

3. **ADVANCED_OPTIMIZATIONS**
    除了执行**SIMPLE_OPTIMIZATIONS**级别的编译压缩外，会增加更多侵入式的全局变换，以达到最高级别的压缩。该级别对js的压缩极大的超越了其它的压缩工具。该级别的压缩基于对js代码的一些假设(规则)，只有这些假设(规则)成立时，输出的js代码才能正常运行，否则的话，输出的代码将无法正常工作。因此在使用该级别压缩时，我们必须熟知所有这些假设或者说是规则。
    具体说来，该级别的压缩所完成的转换包括：

    1. **更加侵入式的重命名**，除了包含**SIMPLE_OPTIMIZATIONS**级别的压缩只重命名函数参数和变量名，**ADVANCED_OPTIMIZATIONS**同时会对全局变量，函数名以及属性进行重命名。

    2. **删除僵尸代码**，**ADVANCED_OPTIMIZATIONS**会删除所有程序运行时使用不到的代码。对于使用大型库时，这是非常有用的，如果你的代码仅使用了大型库文件的几个函数，编译器会删除所有其他未使用的代码。

    3. **全局内联化(global inlining)**,**ADVANCED_OPTIMIZATIONS**选项会将函数调用替换为执行函数体代码。这种转换称为内联化(inlining).编译器只会在安全并节省空间的前提下才会进行函数内联化。同时对于常量和一些变量，编译器也会在判断安全之后进行内联化。


### 限制说明

使用Closure compiler需要你的javascript代码遵循一些限制条件。压缩级别越高，对代码的限制会更严格。三个压缩级别的限制的说明：

#### 1.所有压缩级别的通用限制

+ **编译器只识别Ecmascript262**

	Ecmascript版本3是javascript1.5的基础。当人们在使用用术	语"Javascript"时，通常指的是这个版本。然而编译器也支持Ecmascript	版本5，对于Ecmascript6的支持正在开发中。编译器只支持官方语言特性。

	遵循合适Ecmascript语言手册的浏览器特性，能很好的使用编译器。如	ActiveX对象是使用合法的javascript语法创建的，所以创建ActiveX对象	的代码会正确的通过编译。编译器的维护者在积极的工作来支持新语言版本和特	性。使用Closure comliper的项目可以通过`--language_in`选项，指定	编译器使用的Ecmascript语言版本。

+ **编译器不会保留注释**

	所有编译级别都会删除注释，那些依赖特定注释格式来工作的代码编译后会无法	工作。

	例如，使用JScript的__条件注释__指令的代码编译后将无法运行。

#### 2. **SIMPLE_OPTIMIZATIONS**的限制

避免使用以下结构或编码实践

+ `with`

	编译器无法区分使用`with`命名的局部变量或属性名称。

+ `eval()`

	编译器对`eval()`函数的字符串参数不做任何处理，所以不会重命名参数中任	何符号。

+ **使用字符串代表函数或参数名**

	编译器会重命名函数名称和函数参数名，但对代码中通过名称指向函数或属性的	字符串均不做处理。所以在代码中不要使用字符串来代表函数或参数。如
		function myFunction(){} // 定义
		window['myFunction']() // 调用
		var myPro ; // 定义
		window['myPro']	= "proVlaue"; // 调用
	编译后都会无法正常运行。

#### 3.**ADVANCED_OPTIMIZATIONS**的限制

**ADVANCED_OPTIMIZATIONS**级别的限制除了包含**SIMPLE_OPTIMIZATIONS**级别中的限制外，还包括

+ 重命名全局变量，函数和属性的含义

	以下是在**ADVANCED_OPTIMIZATIONS**中的危险操作

	+ **未定义的外部引用**
		要正确的重命名全局变量，函数和属性，编译器需要在全局中知道所有这些引用。如果某些是指向外部资源的引用，需要对其进行声明，如
		程序使用到文件`jQuery.js`和`application.js`,并且`application.js`中使用jQuery来添加事件处理

			jQuery("panel").click(function(){
				...
			})

		如果只对`application.js`进行压缩，之后的结果可能变为

			a("panel").c(function(){
				...
			})

		这显示是不对的

	+ **外部代码使用未导出的内部名称**

		编译后的代码需要导出所有需要在外部代码使用的符号。如`application.js`中定义了`boot`方法用于程序入口

			app.boot = function(){
				..
			}

		经编译压缩，可能会变为

			a.c = funtion(){

			}

		页面`app.html`页面是程序主页，会加载编译`application.js`，并调用`boot`方法来执行

			<script src="application.js">
			<script>
				app.boot();
			</script>

		程序将无法运行。

	+ **使用字符串引用对象属性**

		在高级压缩模式下，编译器会重命名属性名称，但不会处理任何字符串，所以，假如定义以下对象及调用示例

			var	person = {name:"张三",age:10}; //定义

			var name = person.name ; // 正确

			if('name' in person){} // 错误

			var name = person['name'] ; // 错误

		如果需要使用字符串来引用属性，那么就一直使用字符串，始终保持一致

			var	person = {'name':"张三",age:10}; //定义

			var name = person.name ; // 正确

			if('name' in person){} // 正确

	> 详情参见:[Advanced Compilation and Externs][3]

	+ **通过全局对象的属性引用变量**

		编译器会将属性的重命名与变量名区分开来。所以以不同的方式处理以下两个引用

			var person = {};
			window.person ; //错误

		代码有可能编译为

			var a = {};
			window.b ;

		正确的做法是

			window.person = {};
			window.person ;

	+ **删除僵尸代码的含义**
		僵尸代码的删除会让以下实践变得危险
		+ **在编译代码之后调用函数**
			当你在编译函数时，如果你得函数调用代码未一起进行编译，编译器会认为这部分函数永远不会执行，并删除它们，如`application.js`定义			了

				app.boot = function(){
					...
				}
			并在页面`app.html`页面中调用

				<script src="application.js">
				<script>
					app.boot();
				</script>

			但，由于定义和调用`app.boot()`方法的地方不在一个地方，并且`index.html`中的js代码不会与`application.js`一起压缩所以			`app.boot`在压缩时被当做僵尸代码被删除。

			为了避免这种情况发生，需要

			1. 将所有Web应用使用到的代码一起编译
			2. 或者导出编译后的函数
		+ **通过遍历构造器或原型对象来获得函数**

			要判断函数是否是僵尸代码，编译器要找到所有调用函数的地儿。通			过遍历构造器属性或原型对象属性来获取函数，并结合`call`方法			可以调用获取的函数，但编译器在这种方式下，无法判断函数是否是			僵尸代码，如

				function Person(){

				}

				Person.prototype.init = function(){...}
				Person.prototype.sayHi = function(){...}

				function invoke(person , name){
					Person.prototype[name].call(p) ;// 错误
				};

				invoke(new Person() , 'sayHi') ;

			编译器不会知道`sayHi`会被调用，所以代码运行会出错。作为函数			参数传入的函数，编译器会自动识别，如

				function invoke(fn){
					fn();
				}
				function sayHi(){
					alert('hi');
				}

				invoke(sayHi);// 正确

	+ **对象属性扁平化(flattening)的含义**

		高级压缩模式下，编译器会折叠对象属性以支持简写命名，如

			var person = {};

			person.sayHi = function(name){alert('Hi'+name);}

			person.sayHi("张三")

		会编译为

			var person$sayHi = function(a){alert('Hi'+a);}
			person$sayHi('张三');

		对象属性的扁平化使接下来的重命名更高效，比如编译器会将`person$sayHi`简写为一个字母`b`。

		但属性的扁平化也会是以下操作变得危险

		+ **在构造器或原型方法之外使用`this`**

			属性扁平化可能会改变函数内`this`的含义，如

				var person = {};

				person.name = '王五';

				person.sayHi = function(name){alert(this.name + 'say hi to'+name);}// 错误

				person.sayHi("张三");

			会编译为

				var person$sayHi = function(a){alert(this.name + 'say hi to'+name);}
				person$sayHi('张三');

			这样`this`有原来引用`person`，变成了编译后的引用全局对象。编译器遇到这种情况会给出警告

			> "WARNING - dangerous use of this in static method person.sayHi"

			以上`sayHi`可以修正为

					person.sayHi = function(name){alert(person.name + 'say hi to'+name);}// 错误

			但，为了避免这种情况的发生，只有在构造器或原型方法内才能使用`this`，如

				function Person(name){
					this.name = name;
				}

				Person.prototype.sayHi = function(name){
					alert(this.name + 'say hi to'+name);
				}// 正确

				var person = new Person("张三") ;
				person.sayHi("张三");

### 参考

+ [Closure Compiler Compilation Levels][1]
+ [Understanding the Restrictions Imposed by the Closure Compiler][2]


[1]: https://developers.google.com/closure/compiler/docs/compilation_levels
[2]: https://developers.google.com/closure/compiler/docs/limitations
[3]: https://developers.google.com/closure/compiler/docs/api-tutorial3
[4]: https://developers.google.com/closure/compiler/docs/gettingstarted_app
[5]: https://developers.google.com/closure/compiler/docs/gettingstarted_ui
[6]: https://developers.google.com/closure/compiler/docs/gettingstarted_api