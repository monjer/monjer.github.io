---
title: 使用node-inspector调试nodejs
date: 2016-03-19 13:33:36
tags:
---


node-inspector是一个基于Chrome Dev Tools的debugger界面调试工具，可以用来调试nodejs程序。使用node-inspector，
可以向在浏览器中调试前台js代码一样来调试nodejs代码。node-inspector特点如下：

+ 支持文件导航
+ 支持设置断点
+ 支持单步调试，单步跳入，跳出，
+ 支持查看作用于，变量值，对象属性
+ 支持鼠标移到源文件中表达式上时，弹出tooltip显示值
+ 支持变量或对象属性的编辑
+ 可在exceptions出设置断点
+ 开启/关闭所有断点
+ CPU和栈空间分析
+ 可查看网络客户端请求
+ 可查看控制台输出

### 安装node-inspector

打开终端输入
```sh
$ sudo npm install -g node-inspector
```
输入root密码，安装node-inspector。
> npm 全局模式安装模块需要root权限

### 使用node-inspector

新建*app*目录，并新建*app.js*,输入以下代码
```js
/**
 * Simple node server demo
 */
var http = require("http");

var server = http.createServer(function(req , res){

    res.setHeader("content-type" , "text/html");
    res.write("<h1>Hello wolrd</h1>");

    res.end();

});

server.listen(3000 , function(){
    console.log("server start");
});

```
打开终端并切换至*app*目录下，运行
```sh
$ node-debug app.js
```
可以看见控制台输出类似的log信息
```sh
Node Inspector v0.12.6
Visit http://127.0.0.1:8080/?port=5858 to start debugging.
Debugging `app.js`

Debugger listening on port 5858
server start
```
根据log指引，打开浏览器，在地址栏中输入

    http://127.0.0.1:8080/?port=5858

可以看到当前打开的debug工具面板

![image](/img/2016-03-19-node-debug.png)

添加如下断点，另打开一个新的浏览器窗口并输入`http://localhost:3000/app.js`按Enter回车
![image](/img/2016-03-19-node-debug-1.png)

可以看到断点停下来了：

![image](/img/2016-03-19-node-debug-2.png)

之后可以按照我们在前台调试普通js代码一样来调试node端的js代码了。
更多选项和高级功能的使用，请移步到node-inspector的[文档](https://www.npmjs.com/package/node-inspector)

### 参考

+ [node-inspector](https://www.npmjs.com/package/node-inspector)
+ [Using Node Inspector](https://docs.strongloop.com/display/SLC/Using+Node+Inspector)
