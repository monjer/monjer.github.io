---
title: Ubuntu下查看mysql服务器是否启动
date: 2016-02-28
tags:
    - mysql
    - ubuntu
---
### Ubuntu下查看mysql服务器是否启动

问题：如何知道Ubuntu下或一台Linux下是否已经有mysql服务器在运行中？

#### 检查方式1,使用系统命令。

打开终端使用以下命令
```sh
$ ps aux | grep mysql
```
如果当前系统下有运行的mysql服务器，应该可以在终端看到类似的输出

> mysql     8930  0.0  9.2 1118944 363688 ?      Sl   21:43   0:01 /usr/sbin/mysqld --basedir=/usr --datadir=/var/lib/mysql --plugin-dir=/usr/lib/mysql/plugin --user=mysql --log-error=/var/log/mysql/error.log --pid-file=/var/run/mysqld/mysqld.pid --socket=/var/run/mysqld/mysqld.sock --port=3306

`ps aux`命令会显示当前系统下所有进程的信息，并交由`grep`命令来进行`mysql`关键字搜索。

#### 检测方式2，使用mysql自带的mysqladmin管理工具。
如果系统中安装了mysql服务器，可能会自带一些管理工具，如mysqladmin，那么只要使用mysqladmin的任意命令能够链接上mysql服务器即可。

第一步首先可以简单的确定是否安装了mysqladmin，通常mysqladmin会在PATH下。运行一下命令：
```sh
$ which mysqladmin
```
如果mysqladmin安装并加入了PATH下，那么以上命令会显示它的安装路径，如

>/usr/bin/mysqladmin
>
之后可以使用`ping`命令来看看判断mysql服务器是否是运行状态(Check if mysqld is alive)

    $ mysqladmin ping
运行以上命令可能失败，并提示类似以下的错误信息：

> error: 'Access denied for user 'manjunhan'@'localhost' (using password: NO)'

这是因为链接mysql服务器需要指定链接账户，
```sh
$ mysqladmin -u root ping
```
如果mysql服务器运行中会提示：

    mysqld is alive

进一步也可以查看其整体状态
```sh
$ mysqladmin -u root version
```
会输出类似于

>mysqladmin  Ver 8.42 Distrib 5.6.29, for Linux on x86_64
>Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights >reserved.
>
>Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

>Server version     5.6.29
Protocol version    10
Connection      Localhost via UNIX socket
UNIX socket     /var/run/mysqld/mysqld.sock
Uptime:         1 hour 1 min 47 sec

>Threads: 1  Questions: 14  Slow queries: 0  Opens: 32  Flush tables: 2  Open tables: 0  Queries per second avg: 0.003


### 参考

+ [How to check if MySQL server is running on Linux?][1]
+ [MySQL - 2.10.3 Testing the Server][2]
+ [MySQL Error - B.5.2.13 Can't create/write to file][3]


[1]: http://www.ewhathow.com/2013/09/how-to-check-if-mysql-server-is-running-on-linux/
[2]: http://dev.mysql.com/doc/refman/5.6/en/testing-server.html
[3]: http://dev.mysql.com/doc/refman/5.0/en/cannot-create.html
    
    
    