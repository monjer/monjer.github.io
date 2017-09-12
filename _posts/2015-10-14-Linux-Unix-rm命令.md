---
title: Linux/Unix rm命令
date: 2015-10-14
tags:
    - Linux
    - Unix
    - rm
---


### 作用

删除系统文件或者目录。`rm`命令会尝试删除命令行指定路径下的非目录类型(no-directory)文件。如果删除文件需要授权，并且执行命令的输入为终端(terminal)，会要求用户验证确认。

### 格式
```sh
$ rm [-dfiPRrvW] file
```
### 常用选项说明

+ `-d`，删除包括目录在内的其他类型文件
+ `-i`，删除每个文件前都需要确认，不管文件授权，也不管输入为终端(terminal)
+ `-f`，忽略文件授权，不提示确认，直接删除文件。此选项会覆盖`-i`选项
+ `-v`，打印并显示删除文件的信息
+ `-R`，等同于`-r`，递归删除所列目录的文件层次，此选项隐含实现了`-d`选项的功能。指定`-i`后，需要用户确认删除的文件，否则则跳过

### 用例

#### 1.直接删除文件a.png
```sh
$ rm a.png
```
#### 2.删除a.png前，提示用户确认
```sh
$ rm -i a.png
```
#### 3.删除空目录
```sh
$ rm -d a
```
#### 4.递归删除目录，包括内部的子目录和文件,目录结构为

    a-->
        a.png
        b

命令
```sh
$ rm -r a
```
#### 5.递归删除目录，并打印删除文件的信息,目录结构同例4
```sh
$ rm -rv a
```
#### 6.删除文件a.png，忽略文件的授权，不管文件是否存在
```sh
$ rm -f a.png
```
#### 7.递归删除目录a及其子目录或文件，忽略文件授权，不管目录是否存在
```sh
$ rm -fr a
```

### 参考

1. [5 Practical Examples To Delete / Remove Directory in Linux][1]
2. [文件与目录管理][2]
3. [“cannot remove 'some_directory': Directory not empty”][3]
4. `man rm`
5. [How to remove all the files in a directory?][4]

[1]: http://www.thegeekstuff.com/2009/06/how-to-linux-delete-directory-using-rmdir-rm-command/
[2]: http://vbird.dic.ksu.edu.tw/linux_basic/0220filemanager_2.php#cp
[3]: http://unix.stackexchange.com/questions/48227/cannot-remove-some-directory-directory-not-empty
[4]: http://unix.stackexchange.com/questions/12593/how-to-remove-all-the-files-in-a-directory?rq=1