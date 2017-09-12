---
title: Linux & Unix 查看Linux系统信息
date: 2016-03-06
tags:
  - linux
  - unix
---

Linux系统信息包括了Linux内核的信息，Linux的发行版本信息。在我们使用一个新的设备或新的操作系统时，首先读取这些信息，可以帮助我们更好的认识我们当前使用的系统的情况。以Ubuntu桌面版为例，可以通过以下方式来或缺这些内容。

### 通过系统菜单

可以通过系统顶部工具条的设置按钮弹出的菜单（app menus）来获取系统的一些信息：

1.	点击系统窗口右上侧的管理按钮
2.	在弹出的菜单中选择"关于本机(About this computer)"
3.	在弹出窗口的概览选项中可以看到本机当前的一些系统和硬件信息 ![image](/img/2016-03-06-a1.png)

![image](/img/2016-03-06-a2.png)

### 读取系统信息文件

系统下的/etc/*-relase文件中保存了当前系统的相关信息，可以通过`find`命令查看有哪些文件，如图

![image](/img/2016-03-06-a3.png)

其中_lsb-release_描述了系统的发型版本信息,_os-release_则描述了当前系统的信息。 可以使用`cat`命令在终端输出它们的内容，如图。

![image](/img/2016-03-06-a5.png)

### 使用系统命令

除了以上方法，Linux系统还提供了两个命令来帮助我们查看系统信息，

-	`uname`，用来输出系统信息(print system information)
-	`lsb_release`，用来输出系统发型版本的信息( print distribution-specific information)

使用`uname -a`可以输出系统的信息，包括系统内核名称、版本，网络节点名，系统硬件名称，处理器名称，操作系统名称等等，如图

![image](/img/2016-03-06-a7.png)

使用`lsb_release -a`可以输出当前系统发型版本的所有信息，包括发行ID，发行号，描述等，如图

![image](/img/2016-03-06-a6.png)

### 参考

-	[HowTo: Find Out My Linux Distribution Name and Version](http://www.cyberciti.biz/faq/find-linux-distribution-name-version-number/)
-	[How can I find the version of Ubuntu that is installed?](http://askubuntu.com/questions/12493/how-can-i-find-the-version-of-ubuntu-that-is-installed)
-	[The Linux Kernel Archives](https://kernel.org/linux.html)
-	[Linux distribution](https://en.wikipedia.org/wiki/Linux_distribution)
-	[Linux kernel](https://en.wikipedia.org/wiki/Linux_kernel)
-	[List of Linux distributions](https://en.wikipedia.org/wiki/List_of_Linux_distributions#Ubuntu-based)
