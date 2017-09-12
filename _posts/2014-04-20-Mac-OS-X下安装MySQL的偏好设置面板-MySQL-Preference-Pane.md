---
title: Mac OS X下安装MySQL的偏好设置面板(MySQL Preference Pane)
date: 2014-04-20
tags:
  - mysql
  - mac
---


Mac OS X的MySQL的镜像文件中包括了一个MySQL偏好设置面板(MySQL Preference Pane)，可以用来启动，停止MySQL，以及控制在系统启动时MySQL是否自启动。以下是安装步骤：

**1.** 下载MySQL的镜像文件(.dmg文件)，双击打开镜像文件，查看MySQL.prefPane文件，

![image](/img/2014-04-20-d1.png)

**2.** 双击安装MySQL.prefPanel,

**3.** 首次安装MySQL的偏好设置面板，系统会询问你是否确认安装，以及提供安装面向的用户类型，

1. 只为此用户安装；
2. 为这台电脑上的所有用户安装。

选择2个选项的话，需要当前用户拥有管理员权限，可能需要输入相应的当前用户用户名和密码

![image](/img/2014-04-20-d2.png)

**4.** MySQL的偏好设置面板安装完成后，就可以通过它来控制MySQL服务器了。打开的方式如下，在Mac OS X下的苹果菜单中(Apple Menu)，选择**系统偏好设置(System Preferences... )**,在打开的系统偏好设置面板中的**其它(Other)**选区中，可以看到MySQL的logo，点击logo 进入MySQL的偏好设置面板中

![image](/img/2014-04-20-d3.png)

![image](/img/2014-04-20-d4.png)

MySQL的偏好设置面板中，显示了当前MySQL服务器的状态，以**绿色**的**running**表示**正在运行**，以**红色**的**stopped**表示**已经停止**

![image](/img/2014-04-20-d5.png)
![image](/img/2014-04-20-d6.png)

**5.** MySQL偏好设置面板用法

+ **启动MySQL**,点击`Start MySQL Server`,当前用户需要有管理员权限，输入用户名和密码，启动MySQL服务。
+ **关闭MySQL**,点击`Stop MySQL Server`,当前用户需要有管理员权限，输入用户名和密码，关闭MySQL服务。
+ **设置或关闭系统开机启动时，MySQL服务自动开启功能**,选择或取消`Automatically Start MySQL Server on Startup`复选框

### 参考
[Installing and Using the MySQL Preference Pane](http://dev.mysql.com/doc/refman/5.6/en/macosx-installation-prefpane.html)
