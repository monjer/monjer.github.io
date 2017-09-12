---
title: Mac OS X下初始化MySQL账户安全
date: 2014-01-20
tags:
  - mysql
  - mac
---

在Mac OS X这样的Unix系统中，MySQL安装完成后，应该运行**mysql_install_db**脚本程序，设置和初始化授权表，。授权表中定义了MySQL用户账户和访问权限，以便用户连接MySQL服务器。该脚本会创建数据目录、拥有所有数据库权限的`mysql`数据库，以及用来测试MySQL的`test`数据库。MySQL为Mac OS X提供了pkg分发版来进行安装，安装器会自动运行**mysql_install_db**脚本。本篇基于MySQL5.6版本进行描述。

>MySQL 5.1版本与MySQL5.5之后创建的默认账户有差别

`mysql`数据库中创建了`user`、`db`、`host`、 `tables_priv`、`columns_priv`和`func`表以及其它的表，其中`uesr`表中包含了MySQL的默认账户信息和权限信息。创建默认账户的过程和设置如下：

+ 以用户名`root`创建**四个**账户，设置如下：
	+ 账户为超级账户，可执行任何操作；
	+ `root`账户的初始密码为空,任何人可以在无密码的情况下使用`root`账户链接MySQL服务器，并且获得所有权限。
	+ 在Unix中`root`账户只能从本机进行连接，四个账户的Host主机名分别为,`localhost`,`127.0.0.1`,`本机实际主机名或IP地址`,和名为`::1`的IPV6地址
    > 使用`127.0.0.1`的host值的连接MySQL服务器，会首先转换为`localhost`对应的账户，使用`127.0.0.1`的host值,对于连接设置`--skip-name-resolve`选项的MySQL服务器会有用。

+ 创建两个`匿名账户`,设置如下:
    + 每个账户的用户名都为空
    + 匿名账户未设置密码，任何人可以使用`匿名账户`连接MySQL服务器
    + 在Unix中，两个匿名账户均只能从本机连接MySQL服务器
    + 两个匿名账户具有对`test`数据库或其它以`test_`命名开头的数据库所有权限

以上创建的账户初始时均为设置密码，匿名用户可以直接使用mysql连接MySQL，如下操作：

```sh
shell> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 38
Server version: 5.6.15 MySQL Community Server (GPL)

Copyright (c) 2000, 2013, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql>
```

使用`root`账户连接MySQL服务器，如下：

```sh
shell> mysql -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 148
Server version: 5.6.15 MySQL Community Server (GPL)

Copyright (c) 2000, 2013, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

使用`root`账户连接MySQL服务器之后，可以查看创建的默认账户，如

```
mysql> select host,user,password from mysql.user;
+---------------+------+----------+
| host          | user | password |
+---------------+------+----------+
| localhost     | root |          |
| 192.168.2.111 | root |          |
| 127.0.0.1     | root |          |
| ::1           | root |          |
| localhost     |      |          |
| 192.168.2.111 |      |          |
+---------------+------+----------+
6 rows in set (0.00 sec)

mysql>
```
`user`表中的`host`字段决定了可以连接MySQL服务器的主机，`user`和`password`字段决定了连接MySQL使用的用户名和密码。只有在同时满足条件时，用户才可以连接到MySQL。从上述查询我们可以看出，
默认使用了本机IP`192.168.2.111`分别创建了一个`root`(表的第2列)和一个匿名账户（表的最后一列），所有的账户都的密码都为空，意味着任何人都可以任意连接MySQL。

查询`db`表，执行以下语句

```sh
mysql> select host,db,user from mysql.db;
+------+---------+------+
| host | db      | user |
+------+---------+------+
| %    | test    |      |
| %    | test\_% |      |
+------+---------+------+
2 rows in set (0.00 sec)

mysql>
```

以上显示，任何账户都可以访问`test`数据库和其它名称以`test_`开始的数据库，及时是默认创建的匿名账户。对于测试来说，直接使用`test`数据库还是很方便的，但在实际的生产环境中最好为`test`或`test_`开头的数据库设置密码，或直接将其删除。

所以为了保证安全，可以选择进行如下操作：

**1.**为MySQL的每个`root`账户设置密码，可选三种操作方式设置密码，以下以**newpwd**指代自定义的新的密码，注意密码需要使用`PASSWORD()`函数进行加密操作。

**1.1.**使用`SET PASSWORD`语句，格式为`SET PASSWORD FOR user=PASSWORD('new pass')`,其中`user`的格式为`user_name@host_name`,`user_name`和`host_name`分别匹配对应`mysql.user`表中的`User字段值`和`Host字段值`，如：

```sh
mysql> SET PASSWORD FOR 'root'@'localhost' = PASSWORD('newpwd');
Query OK, 0 rows affected (0.09 sec)

mysql> SET PASSWORD FOR 'root'@'192.168.2.111' = PASSWORD('newpwd');
Query OK, 0 rows affected (0.00 sec)

mysql>
```
**1.2.**使用`UPDATE`语句，以下使用`UPDATE`语句同时为`root`账户指定相同的密码

```sh
mysql>  UPDATE mysql.user SET password=PASSWORD('newpass') WHERE user='root';
Query OK, 4 rows affected (0.01 sec)
Rows matched: 4  Changed: 4  Warnings: 0

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.05 sec)

mysql>
```
`FLUSH`语句会令MYSQL服务器重新读加载取授权表，否则，密码修改只有在MySQL下次重启后才能生效。

**1.3.**使用**mysqladmin**命令行客户端程序

更改`'localhost'@'root'`的账户

```sh
shell> cd /usr/local/mysql/bin
shell> sudo ./mysqladmin -u root password newpass
```
更改`'host_name'@'=root'`的账户

```sh
shell> cd /usr/local/mysql/bin
shell> sudo ./mysqladmin -h host_name -u root password newpass
```
对于`host_name`为ip地址的形式，以及`'root'@'127.0.0.1'`和`'root'@'::1'`的账户，**mysqladmin**命令则无法使用，需要使用以上两种方式之一。

**2.**为匿名账户设置密码，首先用root账户连接MySQL服务器

**2.1.**使用`update`语句
```sh
shell> mysql -u root -pnewpass
mysql> update mysql.user SET password=PASSWORD('newpass') where user='';
Query OK, 2 rows affected (0.07 sec)
Rows matched: 2  Changed: 2  Warnings: 0

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.05 sec)

mysql>
```
**2.2** 使用`SET PASSWORD`语句
```sh
shell> mysql -u root -pnewpass
mysql> SET PASSWORD FOR ''@'localhost' = PASSWORD('newpwd');
mysql> SET PASSWORD FOR ''@'host_name' = PASSWORD('newpwd');
```
**3.** 删除匿名账户

使用`DROP USER`语句
```sh
shell> mysql -u root -pnewpass
Warning: Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1674
Server version: 5.6.15 MySQL Community Server (GPL)

Copyright (c) 2000, 2013, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql> DROP USER ''@'localhost';
Query OK, 0 rows affected (0.07 sec)

mysql> DROP USER ''@'192.168.2.111';
Query OK, 0 rows affected (0.00 sec)

mysql>
```
或使用`DELETE`语句
```sh
mysql> delete from mysql.user where user='';
mysql> flush privileges;
```
**4.** `test`数据库处理

方式一.禁用非全局权限账户访问`test`数据库或`test_`起始命名的数据库的权限
```sh
mysql> delete from mysql.db where db like 'test%';
```
方式二.直接删除
```sh
mysql> drop database test;
```


参考

+ [Securing the Initial MySQL Accounts][1]
+ [SET PASSWORD语法][2]
+ [权限更改何时生效][3]

[1]: http://dev.mysql.com/doc/refman/5.7/en/default-privileges.html
[2]: http://dev.mysql.com/doc/refman/5.1/zh/sql-syntax.html#set-password
[3]: http://dev.mysql.com/doc/refman/5.1/zh/database-administration.html#privilege-changes
