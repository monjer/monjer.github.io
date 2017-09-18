---
title: 使用method-override中间件
date: 2017-09-18
---

在RESTful软件架构中，对资源的操作包括获取，创建，修改和删除，这些操作在语义上正好对应于HTTP协议的GET，POST，PUT，DELET方法，现代浏览器中的XMLHttpRequest类[支持][1]GET，POST，PUT，DELETE方法，但是HTML中的Form表单的method属性只支持GET和POST方法。因此为了实现RESTful架构，我们需要通过其它方法来进行一些简单的处理。Expressjs的**[method-override][2]**中间件正式充当了这一角色。**method-override**让你可以在那些不支持PUT和DELTE方法的客户端中使用它们。

### 安装method-override中间件

首先需要安装method-override

```sh
npm install --save method-override
```

method-override中间件暴露出一个函数`methodOverride`，它的接口说明如下

**methodOverride(getter , options)**

+ `getter` ，请求消息头中标识真正请求方法的字段，默认为`X-HTTP-Method-Override`
+ `options.methods`，标识那些原始的HTTP方法会被此中间件检测，默认为`['POST']`

### 实例

**实例一： 重写HTTP请求消息头**

服务器端

```js
var express = require('express')
var methodOverride = require('method-override')
var app = express()

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))

```

客户端ajax设置

```js
var xhr = new XMLHttpRequest()
xhr.onreadystatechange = function(){
    // ...
}
xhr.open('post', '/resource/123', true)
// 发送DELETE方法
xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE')
xhr.send()

```


**实例二：使用查询参数指定重写方法**

服务器端

```js
var express = require('express')
var methodOverride = require('method-override')
var app = express()

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'))

```

客户端

```html
<form method="POST" action="/resource?_method=DELETE">

  <button type="submit">Delete resource</button>
</form>
```


**实例三：自定义逻辑**

`getter`参数也可以指定为一个函数，此函数在调用时会传入请求对象和响应对象

服务器端

```js
var bodyParser = require('body-parser')
var express = require('express')
var methodOverride = require('method-override')
var app = express()

// NOTE: 需要首先使用body-parser来解析请求体，否则req.body参数无法获取
app.use(bodyParser.urlencoded())
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
```

客户端

```html
<!-- enctype 需要与服务器端的解析设置相匹配，此处设置成application/x-www-form-urlencoded -->
<form method="POST" action="/resource/123" enctype="application/x-www-form-urlencoded">
  <input type="hidden" name="_method" value="DELETE">
  <button type="submit">Delete resource</button>
</form>
```


### 参考

+ [REST](https://zh.wikipedia.org/wiki/REST)
+ [The FORM element](https://www.w3.org/TR/html401/interact/forms.html#h-17.3)
+ [method-override](2)
+ [Are the PUT, DELETE, HEAD, etc methods available in most web browsers?][3]
+ [HTTP PUT or DELETE not allowed? Use X-HTTP-Method-Override for your REST Service with ASP.NET Web API][4]

[1]: https://xhr.spec.whatwg.org/#request-method
[2]: https://github.com/expressjs/method-override
[3]: https://stackoverflow.com/questions/165779/are-the-put-delete-head-etc-methods-available-in-most-web-browsers
[4]: https://www.hanselman.com/blog/HTTPPUTOrDELETENotAllowedUseXHTTPMethodOverrideForYourRESTServiceWithASPNETWebAPI.aspx