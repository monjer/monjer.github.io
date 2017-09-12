---
title: Mac OS X下卸载MySQL
date: 2014-01-20
tags:
  - mysql
  - mac
---

Mac OS X下可以使用MySQL pkg安装文件安装MySQL，但该安装包并没有提供卸载MySQL的功能，如果要卸载已经安装的MySQL，需要使用命令或者直接查看目录的形式来手工删除MySQL的安装目录和文件。**在卸载MySQL之前确保系统已经停止MySQL服务的运行。**以下以MySQL的默认安装目录来说明其卸载过程。

### 查看MySQL的安装目录，手工删除MySQL的目录文件

+ 删除MySQL的安装主目录

	在Finder中进入MySQL的默认安装路径`/usr/local/mysql`,删除MySQL的主目录(mysql-VERSION)和链接(mysql)

	![image](/img/2014-01-20-a1.png)

+ 删除MySQL Startup Item以及相关配置文件（可选，如果已经[安装][1]）

	在Finder中进入`/Library/StartupItems/MySQLCOM`,删除`MySQLCOM`目录。
	![image](/img/2014-01-20-a2.png)
	在Finder中进入`/etc`目录，查找`hostconfig`文件，用`vim`或其它文本编辑器打开，删除配置项中的`MYSQLCOM=-YES-`一项。
	![image](/img/2014-01-20-a3.png)

+ 删除MySQL prefPane(可选，如果已经[安装][2])

	在Finder中进入`/Library/PreferencePanes`,查找`MySQL.prefPane`文件，并删除
	![image](/img/2014-01-20-a4.png)

+ 删除Receipts相关文件

	在Finder中进入`/Library/Receipts`,将对应的mysql-VERSION对应的`Package Recepit`目录删除
	![image](/img/2014-01-20-a5.png)

	在Finder中进入`/var/db/receipts`,将以`com.mysql`开头的文件删除
	![image](/img/2014-01-20-a6.png)


### 以命令方式，卸载MySQL


+ 删除主目录
```sh
shell>sudo rm /usr/local/mysql
shell>sudo rm -rf /usr/local/mysql*
```
+ 删除MySQL Startup Item及`hostconfig`配置项` MYSQLCOM=-YES-`
```sh
shell>sudo rm -rf /Library/StartupItems/MySQLCOM
shell>sudo rm -rf /Library/PreferencePanes/My
shell>vim /etc/hostconfig
```
+ 删除MySQL prefPane
```sh
shell>rm -rf ~/Library/PreferencePanes/My*
```
+ 删除Receipts
```sh
shell>sudo rm -rf /Library/Receipts/mysql*
shell>sudo rm -rf /Library/Receipts/MySQL*
shell>sudo rm -rf /var/db/receipts/com.mysql.*
```
>对已有的MySQL进行升级，新的MySQL pkg安装包不会卸载旧的安装目录，Mac OS X的安装包未提供合适的功能来正确升级之前旧的已经安装的软件包。
>
>在新安装的MySQL中使用已有的数据库，需要将旧数据目录(`/usr/local/mysql/data`)中的内容复制到新的数据目录中。执行
>该操作时确保关闭新、旧服务器。将以前安装的MySQL数据库文件复制过来并成功重启服务器后，应当卸载旧的文件以节省磁盘空
>间。并且还要卸载掉在/Library/Receipts/mysql-VERSION.pkg的旧版本的Package Receipt

### 参考

+ [在Mac OS X中安装MySQL](http://dev.mysql.com/doc/refman/5.1/zh/installing.html#mac-os-x-installation)
+ [Installing MySQL on Mac OS X Using Native Packages](http://dev.mysql.com/doc/refman/5.6/en/macosx-installation-pkg.html)
+ [How do you uninstall MySQL from Mac OS X?](http://stackoverflow.com/questions/1436425/how-do-you-uninstall-mysql-from-mac-os-x)

[1]: http://dev.mysql.com/doc/refman/5.6/en/macosx-installation-startupitem.html
[2]: http://dev.mysql.com/doc/refman/5.6/en/macosx-installation-prefpane.html
[m-1]: 1.png
[m-2]: 2.png
[m-3]: 3.png
[m-4]: 4.png
[m-6]: 5.png
[m-5]: 6.png
