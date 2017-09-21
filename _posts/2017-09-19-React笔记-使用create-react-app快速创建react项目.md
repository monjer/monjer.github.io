---
title: React笔记-使用create-react-app快速创建React项目
date: 2017-09-19 17:23
---

除了在页面手工创建文件目录和文件外，React提供了一个用来创建单页应用程序的开工create-react-app，使用它可以快速的帮我们安装好我们开发所以来的库和环境，这提供了更加简单的开发体检，同时还对生产环境进行了优化。

### 安装

使用npm全局安全create-react-app

```sh
npm install -g create-react-app
```

### 创建应用

在安装完成后，我们就可以使用`create-react-app`命令来创建我们项目：

```sh
create-react-app myapp
```

以上命令创建了名为`myapp`的项目，同时为我们的项目初始化安装所有必须的文件和工具。

> Node的版本需要>=6
 

以下是创建完成后`myapp`的结构
```
myapp
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   └── favicon.ico
│   └── index.html
│   └── manifest.json
└── src
    └── App.css
    └── App.js
    └── App.test.js
    └── index.css
    └── index.js
    └── logo.svg
    └── registerServiceWorker.js
```

在package.json文件中默认添加了几个脚本

**npm start**或**yarn start**

以开发模式启动项目，运行后会打开本机的默认浏览器，同时切换到`http://localhost:3000`页面，这个页面就是我们`public/index.html`页面。

**npm test**或**yarn test**

运行项目的测试脚本，create-react-app使用的测试工具是[Jest](http://facebook.github.io/jest)

**npm run build**或**yarn build**

为生成环境构建，生成一个`build`目录，里面包含了可以直接发布的页面，脚本，样式或其它资源。构建的过程是讲过了压缩和文件hash的。

以上就是create-react-app提供的基本的功能。

除此之外create-react-app创建的项目还内置了webpack，Babel，ES6，ESLint等等其它的丰富的功能。这需要我们根据[官方文档][1]继续挖掘其用法。

[1]: https://github.com/facebookincubator/create-react-app

