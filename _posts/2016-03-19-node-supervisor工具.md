---
title: node-supervisor工具
date: 2016-03-19 12:10:19
tags:
---

运行一个node程序时，在修改代码后，一般我们首先要杀掉之前的程序，然后运行node命令重新启动程序来查看结果。之后每次
代码的修改都要重复同样的行为，这显得很啰嗦，通过使用**node-supervisor**工具，可以实时检测代码变更，重新运行我们的node程序，这种代码
热启动的方式，避免了之前重复的行为。

### 安装node-supervisor

打开终端，在命令行下输入
```sh
$ sudo npm install supervisor -g
```
输入root用户密码，完成安装。

>在Mac或Linux系统下需要管理员权限

### 使用node-supervisor

新建目录*app*，在该目录下新建*app.js*，添加如下简单代码
```js
/**
 * 简单的node下的http服务器demo
 */

var http = require("http");

var server = http.createServer(function(req , res){

    res.setHeader("content-type" , "text/plain");
    res.write("Hello wolrd");

    res.end();

});

server.listen(3000 , function(){
    console.log("server start");
});
```
在终端切换到*app*目录下，运行以下命令启动*app.js*
```sh
$ supervisor app.js
```
终端会输出类似log
```sh
Running node-supervisor with
  program 'app.js'
  --watch '.'
  --extensions 'node,js'
  --exec 'node'

Starting child process with 'node app.js'
Watching directory '/home/manjunhan/Desktop/app' for changes.
Press rs for restarting the process.
server start
```

在浏览器中输入`http://localhost:3000/app.js`,查看结果clea

修改*app.js*
```js
res.setHeader("content-type" , "text/html");
res.write("<h1>Hello wolrd</h1>");
```
保存文件，可以看到控制台输出新的log
```
crashing child
Starting child process with 'node app.js'
server start
```
显示我们的程序已经重新启动了，可以刷新之前的页面，查看结果。

更多帮助，可以运行
```sh
$ supervisor --help
```
### 参考

+ [supervisor](https://www.npmjs.com/package/supervisor)
