---
title: MAC OS X中安装MySQL
date: 2014-04-20
tags:
  - mysql
  - mac
---
### 下载并安装MySQL
MAC OS X 10.2.x(Jaguar)以及以上版本的Mac OS X使用二进制安装包pkg格式来代替二进制分发版来安装MySQL，首先下载MySQL的[安装文件][1](.dmg),本机Mac OS X版本为64位的10.8.5，选择的Mac OS X 10.7 (x86, 64-bit), DMG Archive的MySQL。

![image](/img/2014-04-20-2.png)

下载完成后双击打开.dmg镜像文件可以看到MySQL的pkg安装包

![image](/img/2014-04-20-3.png)

双击安装包，选择安装文件的默认设置，一步步进行安装

![image](/img/2014-04-20-4.png)

![image](/img/2014-04-20-5.png)

### 查看MySQL的安装目录

默认情况下MySQL的 Mac OS X 的pkg会安装到`/usr/local/mysql-VAERSION`的目录下,并且还会添加一个路径为`/usr/local/mysql`的链接来指向以上的原始安装目录。安装完毕后，安装包会执行`mysql_install_db`在MySQL数据库中创建授权表。

![image](/img/2014-04-20-6.png)

Mac OS X下MySQL的安装目录布局与tar文件二进制分发版本类似；所有MySQL的二进制代码位于`/usr/local/bin`中，MySQL的套接字文件位于`/tmp/mysql.sock`。

Unix中，在选定安装位置(通常是`/usr/local/mysql`)解压并安装tar文件二进制分发并在该目录下创建以下目录:

<table border="0" cellpadding="0" id="table4">
		<tbody><tr>
			<td width="128">
			<p><strong><span>目录</span></strong></p></td>
			<td width="285">
			<p><strong><span>目录内容</span></strong></p></td>
		</tr>
		<tr>
			<td width="128">
			<p>
			<span>bin</span></p></td>
			<td width="285">
			<p>客户端程序和<strong><span>mysqld</span></strong>服务器</p></td>
		</tr>
		<tr>
			<td width="128">
			<p>
			<span>data</span></p></td>
			<td width="285">
			<p>日志文件，数据库</p></td>
		</tr>
		<tr>
			<td width="128">
			<p>
			<span>docs</span></p></td>
			<td width="285">
			<p>文档，<span>ChangeLog</span></p></td>
		</tr>
		<tr>
			<td width="128">
			<p>
			<span>include</span></p></td>
			<td width="285">
			<p>包含<span>(</span>头<span>)</span>文件</p></td>
		</tr>
		<tr>
			<td width="128">
			<p>
			<span>lib</span></p></td>
			<td width="285">
			<p>库</p></td>
		</tr>
		<tr>
			<td width="128">
			<p>
			<span>scripts</span></p></td>
			<td width="285">
			<p><strong>
			<span>mysql_install_db</span></strong></p></td>
		</tr>
		<tr>
			<td width="128">
			<p>
			<span>share/mysql</span></p></td>
			<td width="285">
			<p>错误消息文件</p></td>
		</tr>
		<tr>
			<td width="128">
			<p>
			<span>sql-bench</span></p></td>
			<td width="285">
			<p>基准程序</p></td>
		</tr>
	</tbody></table>

对比下，Ma OS X下MySQL的安装目录下的文件结构

![image](/img/2014-04-20-7.png)

目录说明如下:
<table summary="MySQL Installation Layout on Mac OS X" border="0">
 	<caption>MySQL Installation Layout on Mac OS X</caption>
    <colgroup>
    <col />
    <col />
   </colgroup>
   <thead>
    <tr>
     <th scope="col">目录</th>
     <th scope="col">目录内容</th>
    </tr>
   </thead>
   <tbody>
    <tr>
     <td scope="row"><code class="filename">bin</code></td>
     <td>客户端程序和 <a class="link" href="mysqld.html" title="4.3.1.&nbsp;mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a> 服务器</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">data</code></td>
     <td>日志文件和数据库</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">docs</code></td>
     <td>文档手册</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">include</code></td>
     <td>包含（头）文件</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">lib</code></td>
     <td>库</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">man</code></td>
     <td>Unix手册手册</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">mysql-test</code></td>
     <td>MySQL测试包</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">scripts</code></td>
     <td><a class="link" href="mysql-install-db.html" title="4.4.3.&nbsp;mysql_install_db — Initialize MySQL Data Directory"><span class="command"><strong>mysql_install_db</strong></span></a></td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">share</code></td>
     <td>各种支持文件，包括错误信息，配置文件样例，数据库的安装脚本</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">sql-bench</code></td>
     <td>Benchmarks(指标)</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">support-files</code></td>
     <td>脚本和配置文件样例</td>
    </tr>
    <tr>
     <td scope="row"><code class="filename">/tmp/mysql.sock</code></td>
     <td>MySQL Unix套接字</td>
    </tr>
   </tbody>
  </table>

>Mac OS X默认会向用户隐藏一些系统的目录和文件，需要在终端运行以下两条命令将系统所有被隐藏掉的目录或文件显示
>```sh
>shell> defaults write com.apple.finder AppleShowAllFiles -bool true
>shell> KillAll Finder
>```

### 启动MySQL

1. 使用`MySQL Startup Item`设置系统启动时自动开启MySQL

	在MySQL5.1中`MySQL Startup Item`是Mac OS X下安装镜像的一部分，是一个独立的安装包。

    ![image](/img/2014-04-20-8.png)

   	双击`MySQL Startup Item`的图标进行安装,按步骤选择默认安装设置，直至安装成功

    ![image](/img/2014-04-20-13.png)

    MySQL5.1及以后的`MySQL Startup Item`安装在`/Library/StartupItems/MySQLCOM`.(4.1.2z之前版本的MySQL安装在`/Library/StartupItems/MySQL`)。

	![image](/img/2014-04-20-9.png)

	`MySQLStartupItem`安装时在系统配置文件`/etc/hostconfig`中添加了变量`MySQLCOM=-YES-`,想要禁用MySQL的自动启动，只需要将变量改为`MySQLCOM=-NO-`。

	![image](/img/2014-04-20-10.png)

	安装完毕后可以在终端运行以下命令来启动MySQL(当前用户需要有管理员权限，必要时还要输入当前用户密码)
	```sh
	shell> sudo /Library/StartupItems/MySQLCOM/MySQLCOM start
	```
    命令执行完毕后，终端显示提示:
	```sh
    Starting MySQL database server
	```

>MySQLStartupItem只需安装一次！不需要在以后每次升级MySQL软件包时都重新安装。
>
>使用以下命令可以停止MySQL的运行
>```sh
>shell> sudo /Library/StartupItems/MySQLCOM/MySQLCOM stop
>```

2. 使用命令

	输入以下命令序列(必要时要输入当前用户密码)
	```sh
	shell> cd /usr/local/mysql
	shell> sudo ./bin/mysqld_safe
	shell> bg
	```

	MySQL成功启动后，可以通过Mac OS X的活动监视器查看MySQL的后台进程

	![image](/img/2014-04-20-14.png)

4. 连接MySQL

	在命令行中输入以下命令，连接MySQL
	```sh
	shell> /usr/local/mysql/bin/mysql
	```
	![image](/img/2014-04-20-11.png)

5. 更加快捷的使用MySQL

   以上在连接MySQL中，我们必须输入mysql壳程序的全路径，即跑到MySQL的安装目录的`bin`目录下，才能最终执行，为了更加便捷的访问和使用mysql的常用程序，需要为MySQL的壳文件添加别名，或直接将MySQL的`bin`目录导出到`$PATH`环境变量中去,之后在命令终端中可以直接以别名的方式来快速访问MySQL的程序

   1. 建立别名
	```sh
	shell> alias mysql=/usr/local/mysql/bin/mysql
	shell> alias mysqladmin=/usr/local/mysql/bin/mysqladmin
	```
   2. 导出到PATH环境变量中
	```sh
	shell> export PATH=/usr/local/mysql/bin:$PATH
	```
   	之后在终端中直接输入以下命令便可快速连接MySQL
	```sh
	shell> mysql
	```
  	![image](/img/2014-04-20-12.png)




[1]: http://dev.mysql.com/downloads/mysql/
[2]: 1.png
[3]: 2.png
[4]: 3.png
[5]: 4.png
[6]: 5.png
[7]: 6.png
[8]: 7.png
[9]: 9.png
[10]: 10.png
[11]: 11.png
[12]: 12.png
[13]: 8.png
[14]: 13.png
