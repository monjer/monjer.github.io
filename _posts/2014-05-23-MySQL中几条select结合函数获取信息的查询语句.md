---
title: MySQL中几条select结合函数获取信息的查询语句
date: 2014-05-23
tags:
    - mysql
    - select()
---


### 获取数据库版本信息

使用`version()`函数，如
```sh
mysql> select version();
```
返回值是以`-log`结尾的表示版本的字符串，如`5.1.73-log`	。

### 获取当前会话关联的数据库名称

使用`database()`函数，如
```sh
mysql> use test;
mysql> select database();
```
返回值是当前数据库的名称，本例中为`test`。

### 获取当前连接到mysql的账户名称

使用`user()`函数，如
```sh
# mysql -h localhost -u root
mysql> select user();
```
返回值为`root@localhost`,其中`root`为账户名称，`localhost`为账户的连接地址。

可以使用字符串的截取函数，只获取用户名称，如
```sh
mysql> select substring_index(user(),'@',1);
```
只返回用户的名称`root`。	

### 获取SQl的update，insert，delete语句执行完毕后所影响的表的行数

使用`row_count()`函数，如
```sh
mysql> insert into user values('bob','peter');
```
插入两行新数据，之后执行
```sh
mysql> select row_count();
```
则返回之前**insert**语句所插入的行数`2`。

