---
title: 使用mod_info模块Apache查看服务器的配置信息
date: 2016-03-16 21:39:37
tags:
---


Apache服务器使用[mod_info](1)模块来生成关于服务器各种配置信息的Web页面。本篇以Mac OS系统自带的Apache服务器为例，介绍关于[mod_info](1)模块的简单配置及使用。

### 加载模块

Apache服务器默认已近加载了[mod_info](1)模块，使用文本编辑器打开httpd.conf配置文件，搜索<i>mod_info</i>关键字，可以看到加载模块的语句。

	LoadModule info_module libexec/apache2/mod_info.so

禁止该模块的加载只要用`#`在行首添加注释即可

	# LoadModule info_module libexec/apache2/mod_info.so

### 配置以访问页面

在httpd.conf配置文件中添加如下配置

	<Location /server-info>
		SetHandler server-info
		Order deny,allow
		Deny from all
		Allow from yourcompany.com
	</Location>
启动Apache服务器

	shell> sudo apachectl start

地址栏中输入`http://localhost/server-info`,查看页面详情，截屏如下：

![Image](1.png)


页面信息，包含了服务器配置信息；初始化模块钩子，以及配置信息；处理的请求模块钩子，以及配置信息。

也可以通过在地址中添加查询参数来细粒度的展示某项信息，包括：

+ **?<module-name>** ，仅显示与该模块相关的信息，如`http://localhost/server-info?mod_info.c`
+ **?config**， 仅显示所有配置指令，不按模块分类，如`http://localhost/server-info?config`
+ **?hooks** ， 仅显示每个模块所属钩子(Hook)列表，如`http://localhost/server-info?hooks`
+ **?list**，仅显示所有启用的模块列表，如`http://localhost/server-info?list`
+ **?server**，仅显示基本的服务器信息，如`http://localhost/server-info?server`

其实就是截图中展示页面中`Subpages`,`Sections`,`LoadedModules`下的连接页面。

### 涉及到的安全配置

从截图中以及官网介绍来说，通过该页面可以看到关于服务器的大量详细的设置信息，可能泄露一些敏感的配置信息，如系统路径，用户名/密码，数据库名称，等等。因此建议对此页面增加访问控制，最好只允许在服务器本机访问，可以通过`Allow`指令来设置如，

	<Location /server-info>
		SetHandler server-info
		Order deny,allow
		Deny from all
		Allow from localhost
	</Location>

### 参考

+ [Apache Module mod_info](http://httpd.apache.org/docs/2.2/mod/mod_info.html)

[1]: http://httpd.apache.org/docs/2.2/mod/mod_info.html