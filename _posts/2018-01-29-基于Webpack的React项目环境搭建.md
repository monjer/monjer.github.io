---
title: 基于Webpack的React项目环境搭建
date: 2018-01-29
---

### 新建项目
新建项目*react-project*，
```
 mkdir react-project
```
使用npm初始化项目
```
cd react-project
npm init
```
新建src目录用来保存项目代码，新建index.html作为项目的入口文件

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>React start project</title>
</head>

<body>
    <!--react 挂载节点-->
    <div id="root"></div>
</body>

</html>
```

在src中新建index.js文件，作为项目的入口文件。

初始化项目完成后的目录结构如下：
```
react-project
  -- src
      -- index.js
  -- index.html
  -- package.json
```

### 安装并配置Webpack

安装webpack

```
npm install --save-dev webpack
```

新建webpack的配置文件webpack.dev.js，并添加初始化配置项

```
const path = require('path')
const ROOT = __dirname

module.exports = {
  // 入口文件
  entry: path.resolve(ROOT, 'src/index.js'),
  // 出口文件及目录
  output: {
    filename: 'bundle.js',
    path: path.resolve(root, 'dist')
  },
}

```
### 引入babel设置

添加babel-loader,babel-core

```
npm install --save-dev babel-loader babel-core
```

添加babel-preset-env用来转换ES2015+的JavaScript代码

```
npm install babel-preset-env --save-dev
```

添加react present用来转换JSX语法

```
npm install --save-dev babel-preset-react
```

配置babel，在根目录下新建_.babelrc_配置文件，写入以下JSON格式的配置

```
{
    "presets": [
        "env",
        "react"
    ]
}
```

在webpack配置文件中添加babel-loader的匹配规则

```
const path = require('path');
const ROOT = __dirname;

module.exports = {

  // 入口文件
  entry: path.resolve(ROOT, 'src/index.js'),
  
  // 出口文件及目录
  output: {
    filename: 'bundle.js',
    path: path.resolve(ROOT, 'dist')
  },
  module: {
    rules: [
      {  
        test: /\.js$/,
        exclude: /node_modules/, 
        loader: "babel-loader" 
      }
    ]
  }
}

```

### 添加React依赖

添加React框架

```
npm install react react-dom --save
```

编辑src/index.js，添加React测试代码

```
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return (
        <h1>Hello React Project</h1>
    );
}

```

修改index.html，添加对js文件的依赖

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>React start project</title>
</head>

<body>
    <div id="root"></div>
    <script src="dist/bundle.js"></script>
</body>

</html>
```
### 运行

修改_package.json_，添加以下运行脚本

```
"scripts": {
  "dev": "webpack --config webpack.dev.js"
}
```

打开控制台，运行`npm run dev`命令，之后打开index.html页面。

### 引入Webpack HtmlWebpackPlugin插件

Webpack下的HtmlWebpackPlugin用来帮我们自动创建入口html文件，能够根据Webpack的配置，每次重新编译后，都能在html页面中配置正确的文件路径和名称的引用，省去了手工修改文件路径应用的麻烦。

安装HtmlWebpackPlugin

```
npm install --save-dev html-webpack-plugin
```

添加插件配置，以我们之前的index.html作为插件的模版

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT = __dirname;

module.exports = {

    // 入口文件
    entry: path.resolve(ROOT, 'src/index.js'),

    // 出口文件及目录
    output: {
        filename: 'bundle.js',
        path: path.resolve(ROOT, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title:'React start project'
            template: 'index.html'
        })
    ]
}
```

去掉index.html的引用

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>React start project</title>
</head>

<body>
    <div id="root"></div>
</body>

</html>
```

运行`npm run dev`查看结果，可以看到在dist目录中新生成了一个index.html文件，并且文件内的js依赖路径，Webpack已经自动设置好了。

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>React start project</title>
</head>

<body>
    <div id="root"></div>
    <script type="text/javascript" src="bundle.js"></script>
</body>

</html>
```

### 引入webpack-dev-server

webpack-dev-server可以为我们提供一个简单的Web服务器，并且拥有实时重载的功能。

安装

```
npm install --save-dev webpack-dev-server

```

修改配置文件

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT = __dirname;

module.exports = {

    // 入口文件
    entry: path.resolve(ROOT, 'src/index.js'),

    // 出口文件及目录
    output: {
        filename: 'bundle.js',
        path: path.resolve(ROOT, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],

    devServer: {
        contentBase: path.resolve(ROOT, 'dist')
    },
}
```

devServer的配置配置告知 webpack-dev-server，在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问的文件根目录。

修改package.json中的运行命令

```
"script":{
  dev": "webpack-dev-server --config webpack.dev.js --open"
}
```

运行命令可以看到浏览器会自动帮我们打开_http://localhost:8080/_页面。

### 引入热替换HMR

HMR功能允许在不刷新界面的前提下局部替换新的修改，react的热替换需要使用_react-hot-loader_。

安装：

```
npm install --save-dev react-hot-loader
```

安装babel-polyfill，支持新的API

```
npm install --save-dev babel-polyfill
```

修改.babelrc

```
{
    "presets": [
        [
            "env",
            {
                "modules": false
            }
        ],
        "react"
    ],
    "plugins": [
        "react-hot-loader/babel"
    ]
}
```

配置Webpack，开启HMR：

1.引入webpack，并添加HMR插件
```
const webpack = require('webpack);

  module.exports = {
    plugins:[
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
  }
```
2.devServer中开启hot模式
```
  devServer{
    ...
    hot: true,
    ...
  }
```
3.在entry的开始出添加react-hot-loader/patch
```
module.exports = {
  entry: [
    'babel-polyfill', 
     'react-hot-loader/patch', 
     path.resolve(ROOT, 'src/index.js')
  ],
}
```

完整的配置：

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const ROOT = __dirname;

module.exports = {

    // 入口文件
    entry: [
      'babel-polyfill', 
      'react-hot-loader/patch', 
       path.resolve(ROOT, 'src/index.js')
    ],

    // 出口文件及目录
    output: {
        filename: 'bundle.js',
        path: path.resolve(ROOT, 'dist')
    },
    
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        hot: true,
        contentBase: path.resolve(ROOT, 'dist')
    },
}
```

修改源码

1.新建src/container/App.js，将src/index.js中的App代码移到此处
```
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return (
       <h1>Hello Project</h1>
    );
}
export default App;
```
2.在src/index.js中引入src/container/App.js，并添加HMR代码

```
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './container/App';

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>
        ,
        document.getElementById('root'))
}

render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./container/App', () => {
        render(App)
    })
}
```

重新运行命令`npm run dev`

在src/container/App.js中，修改App.js的代码，可以看到浏览器在无刷新状态下就替换了新的代码。

### 参考

+ [Setup a React Environment Using webpack and Babel
](https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel#toc-html-webpack-plugin)
+ [react-hot-loader](https://github.com/gaearon/react-hot-loader)
+ [http://babeljs.io/](http://babeljs.io/)




