---
title: Windows下MySQL选项文件的读取顺序
date: 2013-03-15
layout: page
tags:
    - mysql
    - windows
---


Windows中，MySQL按下表中罗列的的顺序依次读取选项文件：

<table border="1">
	<thead><tr><th scope="col">文件名</th><th scope="col">作用</th></tr></thead><tbody><tr><td scope="row"><code class="filename"><code class="literal">%PROGRAMDATA%</code>\MySQL\MySQL Server
                5.6\my.ini</code>,
                <code class="filename">
                	<code class="literal">%PROGRAMDATA%</code>\MySQL\MySQL
                Server 5.6\my.cnf</code></td><td>全局选项</td></tr><tr><td scope="row"><code class="filename"><code class="literal">%WINDIR%</code>\my.ini</code>,
                <code class="filename"><code class="literal">%WINDIR%</code>\my.cnf</code></td><td>全局选项</td></tr><tr><td scope="row"><code class="filename">C:\my.ini</code>, <code class="filename">C:\my.cnf</code></td><td>全局选项</td></tr><tr><td scope="row"><code class="filename"><em class="replaceable"><code>INSTALLDIR</code></em>\my.ini</code>,
                <code class="filename"><em class="replaceable"><code>INSTALLDIR</code></em>\my.cnf</code></td><td>全局选项</td></tr><tr><td scope="row"><code class="literal">defaults-extra-file</code>
            </td><td>
                <a class="link" href="option-file-options.html#option_general_defaults-extra-file"><code class="option">--defaults-extra-file=<em class="replaceable"><code>path</code></em></code></a>,
选项指定的文件</td></tr><tr><td scope="row"><code class="filename"><code class="literal">%APPDATA%</code>\MySQL\.mylogin.cnf</code></td><td>登陆路径选项</td></tr></tbody></table>


+ `%PROGRAMDATA%`代表的是主机上存储所有用户应用程序数据的系统目录，在Window Vista或更高版本的系统中，此路径默认为`C:\ProgramData `,在老版本的Windows系统中，该变量指向的是`C:\Documents and Settings\All Users\Application Data `。

+ `INSTALLDIR`代表MySQL的安装目录，通常指的是` C:\PROGRAMDIR\MySQL\MySQL 5.6 Server`,此处`PROGRAMDIR`代表的是windows的程序目录，通常指的是`Program Files`目录。

+ `%APPDATA%`代表的是Windows应用程序的数据目录，

+ `%WINDIR%`代表Windows系统目录,通常指的是`C:\WINDOWS`。

以上的系统变量都可以`echo`命令，并通过命令行查看，如

	C:\> echo %WINDIR%
或
	C:\> echo %APPDATA%

### 参考

+ [Using Option Files](http://dev.mysql.com/doc/refman/5.6/en/option-files.html)

>来自于MySQL 5.6 version的记录
