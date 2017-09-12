---
title: Linux & Unix 统计文件个数
date: 2016-03-06
tags:
  - Linux
  - Unix
---

### 递归统计当前目录下所有文件的个数
```sh
$ find ./ -type f | wc -l
```
其中`find`命令的选项`-type`选项指定要搜索文件的类型，`f`代表普通文件，而非目录搜索后的结果作为`wc`命令的输入，进行处理。
`wc`代表单词，行，字符，和字节的个数，可以用来显示文件（或标准输入）中的单词数，行数，字母数，字节数，`-l`选项表明统计文件行数。

> wc -- word, line, character, and byte count

以上`find`命令的查找结果被重定向到`wc`命令中进行进一步处理，最终得到我们要的结果。
在`find`命令中`-type`的可选值包括以下几个：

```sh
-type t
    b  块儿(block special)
    c  字符(character special)
    d  目录(directory)
    f  常规文件(regular file)
    l  链接文件(symbolic link)
    p  命名管道(FIFO)
    s  套接字(socket)
```

此外，`wc`命令的可选项为

```sh
-c 文件的字节数
-l 文件的行数
-m 文件的字符数
-w 文件的单词数
```
### 扩展

+ 统计`index.js`文件的行数
	```sh
	$ wc -l index.js
	```
+ 递归统计当前目录下所有目录数
	```sh
	$ find ./ -type d | xargs wc -l
	```
### 参考

+ `$ man find`
+ `$ man wc`
+ [Recursively count all the files in a directory [duplicate]][1]
+ [Linux Find 命令精通指南][2]
+ [Newline Wiki][3]
+ [How to get total file count in a directory in Linux][4]
+ [How to Count Number of Lines in a File in Linux (wc and nl Command Examples)][5]

[1]: http://superuser.com/questions/198817/recursively-count-all-the-files-in-a-directory
[2]: http://www.oracle.com/technetwork/cn/topics/calish-find-096463-zhs.html
[3]: https://en.wikipedia.org/wiki/Newline
[4]: http://thesystemadministrator.net/cpanel/how-to-get-total-file-count-in-a-directory-in-linux
[5]: http://www.thegeekstuff.com/2013/02/wc-nl-examples/
