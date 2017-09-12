---
title: Linux/Unit which命令
date: 2015-10-14
tags:
    - Linux
    - Unix
    - which
---


### 作用

定位某个命令对应的可执行文件在用户路径下的位置。

`which`会接受一个或一组命令的名称，并在**当前用户的$PATH变量**所指定的所有路径中，搜索命令对应的目录位置。因此可以试用`which`命令来查看当前系统中是否存在某个系统命令，以及该命令的位置。

### 格式

`which -[as] program`

### 常用选项

+ `-a` 列出所有找到的可执行文件的目录位置
+ `-s` 不输出任何值，未找到可执行文件的目录位置时return 1；找到时return 0

### 示例

1. 列出`ls`命令对应的可执行文件的目录位置

		$ which ls
		/bin/ls

### 参考

+ `man which`
+ [Linux Which Command, Whatis Command, Whereis Command Examples][1]

[1]: http://www.thegeekstuff.com/2013/04/linux-which-whatis-whereis/