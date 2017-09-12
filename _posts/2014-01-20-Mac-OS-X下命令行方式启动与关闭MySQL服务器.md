---
title: Mac OS X下命令行方式启动与关闭MySQL服务器
date: 2014-01-20
tags:
    - mac
    - mysql
---

Mac OS X10.2及以上版本的系统使用二进制安装软件包pkg格式来发布MySQL，安装软件在包含于下载的磁盘镜像文件中(.dmg文件)，关于Mac OS X下MySQL的安装过程，参见。本篇记录在终端以命令行方式启动和关闭MySQL服务器的操作，不涉及复杂的启动参数设置和安全设置。MySQL服务器按照默认的方式安装在本机Mac下，当前用户需要拥有管理员权限。

MySQL的默认安装路径为`/usr/local/mysql`,以`shell`代替通用命令解释程序，即终端提示符，记录如下:

### 启动MySQL服务器

**1.** 使用**mysqld_safe服务器启动脚本**

```sh
shell> cd /usr/local/mysql/bin
shell> sudo ./mysqld_safe
```
启动成功提示，如下：

```sh
140112 15:26:33 mysqld_safe Logging to '/usr/local/mysql/data/192.168.2.111.err'.
140112 15:26:33 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/data
```
按`Ctrl-Z`快捷键，退出会话，提示如下

```sh
^Z
[5]+  Stopped                 sudo ./mysqld_safe
shell>
```
**2.** 直接启动**mysqld服务器**

```sh
shell> cd /usr/local/mysql/bin
shell> sudo ./mysqld -u root
```
成功启动后的log输出，如下

```sh
2014-01-12 16:18:55 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
2014-01-12 16:18:55 42936 [Warning] Setting lower_case_table_names=2 because file system for /usr/local/mysql-5.6.15-osx10.7-x86_64/data/ is case insensitive
2014-01-12 16:18:55 42936 [Note] Plugin 'FEDERATED' is disabled.
2014-01-12 16:18:55 42936 [Note] InnoDB: The InnoDB memory heap is disabled
2014-01-12 16:18:55 42936 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
2014-01-12 16:18:55 42936 [Note] InnoDB: Compressed tables use zlib 1.2.3
2014-01-12 16:18:55 42936 [Note] InnoDB: Using CPU crc32 instructions
2014-01-12 16:18:55 42936 [Note] InnoDB: Initializing buffer pool, size = 128.0M
2014-01-12 16:18:55 42936 [Note] InnoDB: Completed initialization of buffer pool
2014-01-12 16:18:55 42936 [Note] InnoDB: Highest supported file format is Barracuda.
2014-01-12 16:18:55 42936 [Note] InnoDB: 128 rollback segment(s) are active.
2014-01-12 16:18:55 42936 [Note] InnoDB: Waiting for purge to start
2014-01-12 16:18:56 42936 [Note] InnoDB: 5.6.15 started; log sequence number 1645361
2014-01-12 16:18:56 42936 [Note] Server hostname (bind-address): '*'; port: 3306
2014-01-12 16:18:56 42936 [Note] IPv6 is available.
2014-01-12 16:18:56 42936 [Note]   - '::' resolves to '::';
2014-01-12 16:18:56 42936 [Note] Server socket created on IP: '::'.
2014-01-12 16:18:56 42936 [Note] Event Scheduler: Loaded 0 events
2014-01-12 16:18:56 42936 [Note] ./mysqld: ready for connections.
Version: '5.6.15'  socket: '/tmp/mysql.sock'  port: 3306  MySQL Community Server (GPL)
```

按`Ctrl-Z`快捷键，退出会话，提示如下
```sh
^Z
[1]+  Stopped                 sudo ./mysqld -u root
shell>
```
>`-u`选项，指定启动**mysql服务器**的操作系统的登录账户名称或账户ID，而不是MySQL授权表中所列出的用户

**3.** 调用**mysql.server**脚本启动MySQL服务器

Unix中的MySQL的分发版中包含了**mysql.server**脚本，可用于使用`System V-style`运行目录来启动和停止系统服务器的系统，可以用于MySQL的Mac OS X Startup Item。
Unix下**mysql.server**位于MySQL安装目录的下的`support-files`目录中，命令如下

```sh
shell> cd /usr/local/mysql/support-files/
shell> sudo ./mysql.server start
Starting MySQL
. SUCCESS!
shell>
```
### 关闭MySQL服务器

**1.** 使用**mysqladmin管理工具**关闭mysql服务器

涉及以下几个选项
+  `--host=host_name`或`-h host_name` 连接指定主机上的MySQL服务器，unix下默认为localhost。
+  `--user=user_name`或`-u user_name` 使用指定账户连接MySQL服务器，unix默认为用户的登陆账户名。
+  `--password[=password]`或`-p[password]`,指定连接MySQL服务器使用账户的密码，短选项`-p`与密码之间**不能有**空格，默认为空。
+  `--port=port_num`或`-P port_num`，用于连接MySQL服务器的TCP/IP端口号，默认为3306。

以上在**mysqladmin**中为使用的选项，都使用其默认值。使用`shutdown`明亮关闭本机运行的MySQL服务器,如下

```sh
shell> cd /usr/local/bin/mysql
shell> sudo ./mysqladmin -u root -p shutdown
Password:******
Enter password:******
shell>
```
假设**mysqladmin**安装在你本机，而你需要关闭的MySQL服务器运行在IP地址为`118.224.203.236`的主机上，监听端口为`3001`，账户名为`root`,密码为`123456`命令如下
```sh
shell> mysqladmin -h 118.224.203.236 -u root -p123456 -P 3001 shutdown
```
**2.** 调用**mysql.server**脚本关闭MySQL服务器

```sh
shell> cd /usr/local/mysql/support-files/
shell> sudo ./mysql.server stop
Shutting down MySQL
. SUCCESS!
shell>
```
### 参考

+ [mysqld命令行选项,5.1版](http://dev.mysql.com/doc/refman/5.1/zh/database-administration.html#server-options)
+ [mysqld`--user`命令行选项,5.6版](http://dev.mysql.com/doc/refman/5.6/en/server-options.html#option_mysqld_user)
