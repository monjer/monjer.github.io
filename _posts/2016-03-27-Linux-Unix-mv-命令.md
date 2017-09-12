---
title: 'Linux & Unix mv 命令'
date: 2016-03-27 21:39:46
tags:
  - Linux
  - Unix
---

### 作用
移动或重命名文件。

### 格式
```sh
$ mv [OPTION] source destination
```
或
```sh
$ mv [-fiu] source destination
```
### 常用选项说明

+ `-f`或`--force` 不显示提示直接覆盖同名文件
+ `-i`或`--interactive` 在覆盖文件前给出提示
+ `-n`或`--no-clobber`   不覆盖已经存在的同名文件
+ `-u`或`--update` 只有当source文件比destination文件新或时不存在的时候覆盖文件

> 同时指定`-f`,`-i`，`-n`三个选项时，只有最后一个起作用

### 用例

示例目录

    --> demo
        --> src
            --> index.js
            --> log.js
        --> des
切换至_demo_目录
```sh
$ cd demo
```
1. 将_src_目录下的_index.js_拷贝到_dest_目录下
    ```sh
    $ mv ./src/index.js ./dest
    ```
2. 将_src_目录下的所有文件(目录)移动到_dest_目录下
    ```sh    
    $ mv ./src/* ./dest
    ```
3. 将_src_目录下的所有文件(目录)移动到_dest_,如果文件已存在，要进行提示
    ```sh
    $ mv -i ./src/*  ./dest
    ```
4. 将_src_目录下所有文件(目录) 移动到_dest_下，直接覆盖已存在文件
    ```sh
    $ mv -f ./src/* ./dest
    ```
5. 将_src_目录下所有文件(目录) 移动到_dest_下，如果文件最新则覆盖
    ```sh
    $ mv -u ./src/* ./dest
    ```
6. 将_src_目录下的_index.js_重命名为_myIndex.js_
    ```sh
    $ mv ./src/index.js ./src/myIndex.js
    ```
### 参考

+ `$ man mv`
+ [鸟哥的Linux私房菜 - Linux 文件与目录管理][1]
+ [Ubuntu manuals][2]
+ [How to rename and move thousands of files at once?][3]

[1]: http://vbird.dic.ksu.edu.tw/linux_basic/0220filemanager_2.php#mv
[2]: http://manpages.ubuntu.com/manpages/lucid/man1/mv.1.html
[3]: http://askubuntu.com/questions/169640/how-to-rename-and-move-thousands-of-files-at-once?rq=1