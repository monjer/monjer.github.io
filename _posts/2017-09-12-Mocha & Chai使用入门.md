---
title: Mocha & Chai使用入门
date: 2017-09-12
tags:
  - 测试
---

Mocha是一个功能齐全的JavaScript测试框架，既可以运行在node端，也可以运行在浏览器端。Mocha对异步测试支持良好，使用简单，灵活。

Chai是一个同时支持BDD/TDD风格的断言库，与Mocha一样既可以运行在node端，也可以运行在浏览器端。相比较node原生的assert断言库来说，Chai添加了更多简洁的语法糖。

以下是Mocha结合Chai使用的快速示例。

### 安装

首先创建一个我们的应用目录`app`

```sh
mkdir app
```

运行`npm init`，按照默认提示初始化我们的目录

```sh
npm init
```

本地方式安装Mocha和Chai

```sh
npm install --save-dev mocha chai
```

### 新建源文件

新建我们的源代码文件`app/app.js`代表我们的服务器端脚本，`app/client/src/client-app.js`代表我们的客户端脚本。以下是当前的目录结构。

```
app
  -> node_modules
  -> client
     ->src
       -> client-app.js
  -> app.js
  -> package.json
```

### 服务器端测试示例

在`app/app.js`添加我们的源码

```js
function sayHello(){
  return "Hello world"
}
// 用来模拟简单的异步操作
function saveUser(user , fun){
  setTimeout(function(){
    if(user){
      fun();
    }else{
      fun(new Error('should pass user info'))
    }
  },1000)
}
exports.sayHello = sayHello;
exports.saveUser = saveUser;
```

修改`package.json`的脚本中的`test`

```json
"scripts": {
  "test": "./node_modules/.bin/mocha"
}
```
新建测试目录`app/test`，默认情况下mocha会使用glob模式查找`./test/*.js`或`./test/*.coffee`文件，所以一般我们的测试文件都放在此处。之后建立测试文件`app/test/test.app.js`

```js
var assert = require('chai').assert
var app = require('../app.js')

describe("App", function() {


  describe('sayHello function', function() {
    var sayHello = app.sayHello;

    it('should return string type', function() {
      var result = sayHello();
      assert.typeOf(result, 'string')
    })

    it("should return hello world string", function() {
      var result = sayHello();
      assert.equal(result, 'Hello world')
    })
  });


  describe('saveUser function', function() {
    var saveUser = app.saveUser;

    it("should save without error", function(done) {
      saveUser({
        name: 'user'
      }, function() {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
    });
  });

})

```

以上我们引入chai作为我们的断言库，并引入我们要测试的模块，这里是`app.js`。`describe`函数定义了一组测试规范(group specs)或称测试套件，并为它起一个名称，`describe`函数允许嵌套。`it`函数定义单个测试规范（a single spec），一个测试规范里可以包含多个期望测试的功能单元，它也接受一个描述性的名称，在回调中是我们要具体测试的模块中的代码，assert断言用来判断我们测试的功能的各个方面是否满足期望。如果是测试异步函数，这里用`setTimeout`模拟的，需要在回调中调用`it`函数传入的`done`函数，以表示测试结束。

运行我们的测试:

```sh
npm run test
```
测试运行结果如下：

<img src="/img/2017-09-12-test-node.png" width="600">

### 浏览器端测试示例

在`app/client/src/client-app.js`中加入我们的测试源码

```js
var app = {
  sayHello: function(){
    return "Hello world"
  },

  postUser: function(user , fun){
    setTimeout(function(){
      if(!user){
        fun(new Error('should pass user'))  
      }else{
        fun()
      }

    },1000)
  }
}

```

之后，在我们的`app/client`下新建我们的测试目录`app/client/test`，并填入我们用来测试的文件
`app/client/test/test.client-app.js`

```js

describe('client-app' , function(){
  var assert = chai.assert;
  describe('app' , function() {
    var app = window.app;
    it("should has a app var in window" , function(){
      assert.isObject(app)
    })

    describe('sayHello' , function(){
      it("should return a string type" , function(){
        var res = app.sayHello()
        assert.typeOf(res , "string")
      })
    })

    describe('postUser' , function(){
      it('should post user info success' , function(done){
        app.postUser({user:name}, function(err){
          if(err){
            done(err)
          }else{
            done()
          }
        })
      })
    })
  })


});

```

和用来显示测试结果的主页，`app/client/test/index.html`

```html
<!doctype html5>
<html>
<head>
  <meta charset="utf-8">
  <title>Mocha Tests</title>
  <link href="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css" rel="stylesheet" />
</head>
<body>
  <div id="mocha"></div>

  <script src="../src/client-app.js" charset="utf-8"></script>
  <script src="https://cdn.rawgit.com/jquery/jquery/2.1.4/dist/jquery.min.js"></script>
  <script src="../../node_modules/mocha//mocha.js"></script>
  <script src="../../node_modules/chai/chai.js" type="text/javascript"></script>
  <script>mocha.setup('bdd')</script>
  <script src="test.clientapp.js"></script>
  <script>
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    mocha.run();
  </script>
</body>
</html>

```
在此处我们引入了我们希望测试的源文件`client-app.js`，在浏览器打开此页面，查看测试结果。

<img src="/img/2017-09-12-test-client.png" width="600">


以上的示例都是按照测试通过的场景进行模拟的，可以自行修改参数，查看错误后的处理。

测试的主要前提是还是要清除的知道我们每个测试的函数或模块的功能，流程，参数，以这个触发点去总结测试用例，才能保证我们的代码的健壮性。

<img src="/img/2017-09-12-test-cycle.png" width="500">

### 参考

+ [What’s the difference between Unit Testing, TDD and BDD?](https://codeutopia.net/blog/2015/03/01/unit-testing-tdd-and-bdd/)
+ [Mocha](https://mochajs.org)
+ [Chai](http://chaijs.com/)