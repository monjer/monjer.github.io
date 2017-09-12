---
title: MySQL中auto_increment关键字的基本使用
date: 2014-01-25
tags:
---
### auto_increment的作用

在MySQL中`auto_increment关键字可以为表中新插入的行自动生成一个唯一标识。在开发过程中经常会设置表中主键为自増长，这是通过为主键字段添加auto_increment属性实现的，如新建一个Person表：

```sh
mysql> create table Person(id int  auto_increment, name varchar(50),primary key(id));
Query OK, 0 rows affected (0.91 sec)
```
之后连续插入4条记录

```sh
mysql> insert into Person(name) value('PA');
Query OK, 1 row affected (0.23 sec)

mysql> insert into Person(name) value('PB');
Query OK, 1 row affected (0.05 sec)

mysql> insert into Person(name) value('PC');
Query OK, 1 row affected (0.04 sec)

mysql> insert into Person(name) value('PD');
Query OK, 1 row affected (0.00 sec)
```
 再将全部结果查出

 ```sh
mysql> select * from Person;
+----+------+
| id | name |
+----+------+
|  1 | PA   |
|  2 | PB   |
|  3 | PC   |
|  4 | PD   |
+----+------+
4 rows in set (0.04 sec)

mysql>
```
虽然在insert语句只能未指定id的值，但MySQL已经自动为id字段自动赋值。

### 表中设置auto_increment的起始值

我们可以指定表中使用`alter table`语句设置`auto_increment`的起始值，如

```sh
mysql> alter table Person auto_increment=100;
Query OK, 0 rows affected (0.41 sec)
Records: 0  Duplicates: 0  Warnings: 0
mysql> insert into Person(name) values('PE');
Query OK, 1 row affected (0.05 sec)

mysql> select * from Person;
+-----+------+
| id  | name |
+-----+------+
|   1 | PA   |
|   2 | PB   |
|   3 | PC   |
|   4 | PD   |
| 100 | PE   |
+-----+------+
5 rows in set (0.00 sec)

mysql>
```

以上语句设置`Person`表的auto_increment的起始值为100，查询新行后可以查看新行的id已设置为100。

### 与auto_increment相关的MySQL系统变量

在MySQL服务器的系统变量中，`auto_increment_increment`和`auto_increment_offset`可以用来控制`auto_increment`列的设置。可以使用`show variables`语句查看这两个变量的赋值情况，如：

```sh
mysql> show variables like 'auto_inc%';
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| auto_increment_increment | 1     |
| auto_increment_offset    | 1     |
+--------------------------+-------+
2 rows in set (0.86 sec)

mysql>
```
`auto_increment_increment`控制`auto_increment`列的值增量，`auto_increment_offset`用于确定`auto_increment`列的值的起点值。以上查询说明`auto_increment`列的起始值为1，增量值为1.


通过`set`语句来为系统变量赋值，如设置`auto_increment`增量值为10，如

```sh
mysql> set auto_increment_increment=10;
Query OK, 0 rows affected (0.15 sec)

mysql> insert into Person(name) values('PF');
Query OK, 1 row affected (0.96 sec)

mysql> insert into Person(name) values('PG');
Query OK, 1 row affected (0.96 sec)

mysql> select * from Person;
+-----+------+
| id  | name |
+-----+------+
|   1 | PA   |
|   2 | PB   |
|   3 | PC   |
|   4 | PD   |
| 100 | PE   |
| 101 | PF   |
| 111 | PG   |
+-----+------+
7 rows in set (0.00 sec)

mysql>
```
设置`auto_increment`列的起始值为5,创建新表`TestAutoInc`,并插入两条字段，如

```sh
mysql> set auto_increment_offset=5;
Query OK, 0 rows affected (0.00 sec)

mysql> show variables like 'auto_inc%';
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| auto_increment_increment | 10    |
| auto_increment_offset    | 5     |
+--------------------------+-------+
2 rows in set (0.02 sec)

mysql> create table TestAutoInc(id int auto_increment primary key,val varchar(20));
Query OK, 0 rows affected (0.18 sec)

mysql> insert into TestAutoInc(val) values('V1');
Query OK, 1 row affected (0.06 sec)

mysql> insert into TestAutoInc(val) values('V2');
Query OK, 1 row affected (0.00 sec)

mysql> select * from TestAutoInc;
+----+------+
| id | val  |
+----+------+
|  5 | V1   |
| 15 | V2   |
+----+------+
2 rows in set (0.00 sec)

mysql>
```
可以看到相邻两调记录的id相差为`auto_increment_offset`的值。

以下几点注意事项：

+ 两个变量均可以设置为全局和局部变量，默认为局部变量，修改影响的范围紧限于当前session。可在`set`关键字后添加`global`和`session`关键字来区分是全局变量更改还是局部变量更改，如
```sh
#全局设置
mysql> set global auto_increment_offset=5;
#局部设置
mysql> set session auto_increment_offset=5;
```
	全局修改会影响所有数据库的表。

+ 两个变量的取值范围为1到65535之间的整数，为其中某个变量赋值为0会导致该变量值为1，赋小于0或大于65535的值会导致该变量为65535.如果赋值为非整数值，则会报错。
+ 如果`auto_increment_offset`的值大于`auto_increment_increment`的值，则`auto_increment_offset`的值被忽略。

### 参考
+ [MySQL5.6 auto_increment_increment](http://dev.mysql.com/doc/refman/5.6/en/replication-options-master.html#sysvar_auto_increment_increment)
+ [MySQL 5.1 系统变量](http://dev.mysql.com/doc/refman/5.1/zh/language-structure.html#system-variables)
+ [MySQL 5.1 使用AUTO_INCREMENT](http://dev.mysql.com/doc/refman/5.1/zh/tutorial.html#example-auto-increment)
