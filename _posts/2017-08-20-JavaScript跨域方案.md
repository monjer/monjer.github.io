---
title: JavaScript跨域方案
date: 2017-08-20
---

### 同源策略

同源策略（Same Origin Policy）主要作用是保证浏览器中用户浏览信息的安全性，是一种用来隔离潜在的恶意文件的安全机制。同源指的是两个网页的地址如果协议，主机，端口号完全一致，那么它们就是同源的。同源的资源相互之间畅通的访问。

### 同源的限制

如果两个网页的源是不一致的，也就是如果构成同源的三个条件至少有一个不满足的话，那么这两页页面的通信就属于跨域访问，会受到同源策略的限制。以下几种行为会受到限制：

+ Cookie，LocalStorage，和IndexDB的读取；
+ DOM读取操作；
+ Ajax请求操作；

### 跨域加载资源

以下的标签可以加载跨域内容

+ script
+ link
+ img
+ video
+ audio
+ object
+ embed
+ applet
+ frame
+ iframe
+ @font-face

### 实现跨域访问

虽然同源策略在某种程度上很好的实现了资源访问的安全性，但也带来了一些资源的访问限制，因为某些情况下的跨域资源访问还是必要的。

#### document.domain

在遵守同源策略的前提下，`document.domain`用来设置当前网页的域名，但只能设置成当前域或者其主域，尝试设置成其它域名时，浏览器会抛出错误。比如`http://sub.site.com/a.html`可以在设置其domain为`http://site.com`，这样设置完成后此页面就可以和`http://site.com/b.html`进行通信了。再比如如果`http://sub.site.com/a.html`和`http://sub2.site.com/b.html`同时设置`document.domain="site.com"`，那么这两个页面也能实现相互通信。以上两种情况是因为两个页面在设置后都属于同一域下了。

以上的跨域**要求两个页面的主域是相同的**。比较典型的例子是一个页面通过iframe嵌套另一个页面,需要进行跨域互调。

主页面代码，`http://www.site.com/index.html`

```html
<h2>主页面</h2>
<p>使用document.domain实现跨域</p>
<button id="btn">调用</button>
<div>
  <iframe id="iframe" src="http://dev.site.com/content.html"></iframe>
</div>
<script type="text/javascript">
  // 需要在主界面设置document.domain
  document.domain= 'site.com';
  var btn = document.getElementById('btn');
  function invoke(){
    alert('主域名函数');
  }
  btn.addEventListener('click' , function(){
    var iframe = document.getElementById('iframe');
    iframe.contentWindow.invoke();

  });
</script>
```

iframe页面代码，`http://dev.site.com/content.html`

```html
<h2>iframe内容页面</h2>
<button id="btn">调用</button>
<script type="text/javascript">
  // 需要在子界面设置document.domain
  document.domain = 'server.com';
  function invoke() {
    alert('子域名函数');
  }
  var btn = document.getElementById('btn');
  btn.addEventListener('click', function() {
    window.parent.invoke();
  });
</script>
```
需要注意的是设置`document.domain`会覆盖端口号为`null`因此不同端口号的主域相同的页面页面也是无法通信的。

#### window.postMessage

`window.postMessage`是HTML5添加的一个新的用来安全地实现跨域通信的接口，接口语法为

```
/**
 * @param {Any} message 发送的消息，符合结构化克隆算法的数据类型。
 * @param {String} targetOrigin 目标的域，只有匹配的目标域可以接受到消息，也可以是通配符"*"，表示任意窗口都可接受此消息。
 */
otherWindow.postMessage(message , targetOrigin)
```
otherWindow可以是`window.open`调用返回的窗口，也可以是frame的窗口对象。接受消息的窗口的事件处理如下

```js
window.addEventListener('message' , function(event){
    var origin = event.origin;
    var data = event.data;
    var sourceWindow = event.source;
    sourceWindow.postMessage('messag response' , origin)
});
```
其中

+ `event.data`，是发送消息的数据
+ `event.origin`，是发送消息的窗口的域
+ `event.source`，是发送消息的窗口的对象，可以用来实现双工通信

IE8+浏览器也支持`window.postMessage`。

#### JSONP

JSONP（JSON with Padding）是一种非正式的实现跨越访问数据的方法。在HTML的元素中`<script>`标签可以加载跨域的脚本，因此网页可以得到其它源动态生成的脚本并在浏览器中执行，这需要客户端和服务器协商一致才能工作。

1.在浏览器端，需要注册一个全局的函数`jsonpCb(data)`，这个函数接收期望服务器返回的数据，然后动态生成一个script标签，将它的src指向到服务器端用来返回数据的接口，同时携带必要的请求参数，此外还要并将全局函数的名字以参数形式传到服务器端，之后将元素插入到页面中。

```
<script src="http://othersite.com/api/request.do?parama=xxx&callback=jsonpCb></script>
```

2.服务器端在接受到请求后，解析必要的请求参数，同时获取回调的全局函数的名称，并将数据以以下方式写入并返回

```
jsonpCb({"success": true , "message": "This is the response data"})
```
这样浏览器在获取响应式会用JavaScript解析器来解析以上代码，从而调用我们之前注册的`jsonpCb`全局函数，并传入数据。

以下是简单的示例：

浏览器端：

```html
<h2>主页面</h2>
<p>使用JSONP</p>
<button id="btn">调用</button>
<script type="text/javascript">
    function jsonpRequest(src, callback) {
      if (!src) {
        return;
      }
      var name = 'jsonpCb' + new Date().getTime()
      window[name] = function(data) {
        callback(data)
        delete window[name];
      }
      var script = document.createElement('script');
      if (src.indexOf('?') > 1) {
        src += '&callback=' + name
      } else {
        src += '?callback=' + name
      }
      script.src = src;
      script.onload = function() {
        document.body.removeChild(script);
        script = null;
      }
      document.body.appendChild(script)
    }
    
    
    var btn = document.getElementById('btn');
    btn.addEventListener('click', function() {
    
      jsonpRequest('http://dev.server.com/api/request', function(data) {
        console.log(data)
      })
    });
</script>
```

服务器端，使用expressjs

```js
//
// jsonp response
//
app.get('/api/request' , function(req , res){
  var callbackName = req.query.callback;
  var data = {success: true , message:'response message'}
  var response = callbackName+'('+JSON.stringify(data)+')'
  res.send(response)
})

```
#### window.name

`window.name`属性用来当做窗口的标识，或者链接元素和表单元素的target，比如

+ `window.frames[windowName]`
+ `<form action="post.do" target="windowName"></form>`

除此之外`window.name`还有一个特性是该属性的值无论是否同源，它都是持久的，不会随着载入页面的内容而改变。加入页面`http://www.server.com/request.html `想获取另一个域`http://www.otherserver.com/data.html`下的数据时，只要在`http://www.otherserver.com/data.html`返回的页面里设置`window.name="The response data"`即可，结合一个中间人角色的iframe就可以实现。

比如以下是`http://www.server.com/request.html `的内容

```html
<h2>主页面</h2>
<p>使用window.name</p>
<button id="btn">调用</button>
<script type="text/javascript">
  function requestData(src , callback){
    var iframe = document.createElement('iframe');
    var first = true
    iframe.onload = function(){
      if(first){
        iframe.src  = location.href;
        first = false;
      }else{
        var data = iframe.contentWindow.name;
        callback(data);
        document.body.removeChild(iframe);
        iframe = null ;
      }
    }
    iframe.src=src;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  var btn = document.getElementById('btn');
  btn.addEventListener('click' , function(){
    requestData('http://dev.server.com/way2/content.html' , function(data){
      console.log(data)
      console.log(JSON.parse(data));
    })

  });
</script>
```

下面是`http://www.otherserver.com/data.html`页面的内容。

```html
<script type="text/javascript">
  window.name = '{"success": true , "data": "response data"}'
</script>
```

在`request.html `中的`requestData`方法中我们传入跨域传输数据的`src`地址，以及成功后的回调`callback(data)，`然后创建一个动态的隐藏的iframe元素，并监听它的`onload`事件，之后设置它的src并加入到页面中。在`data.html`中返回需要响应的数据到`window.name`中，可以是JSON格式的。这里的`data.html`可以是任意的动态接口，主要返回的数据时包含设置好的`window.name="responseData"`格式的HTML代码即可。之后`request.html`中在onload的事件处理中首先要把iframe的src设置到当前页面的同域下，这一步是关键，然后再读取数据后销毁iframe。

#### URL fragment

URL片段标识符，包含了URL中`#`后面的部分，改变URL的片段标识符不会引起页面刷新，不同域下的页面可以相互设置对方的URL片段标识符，而不会存在跨域问题，结合`hashchange`事件便可以实现跨域通信，通常我们也是会使用一个隐藏的iframe标签来实现跨域数据请求。

比如`http://www.server.com/index.html`页面代码如下：

```html
<h2>主页面</h2>
<p>使用window.name</p>
<button id="btn">调用</button>
<script type="text/javascript">

  function crosRequest(proxySrc , data){
    var iframe = document.getElementById('transport');
    iframe = iframe ? iframe : document.createElement('iframe');
    iframe.id = 'transport';
    iframe.src = proxySrc+"#"+JSON.stringify(data);
    iframe.style.display = 'none'
    document.body.appendChild(iframe);
  }
  var btn = document.getElementById('btn');
  btn.addEventListener('click' , function(){
    var data = {
      requestURL:'http://othersite.com/api/request',
      source: location.protocol+"//"+location.hostname+""+location.pathname,
      method:'get',
      t:new Date().getTime(), // 强制hashchange
      params:{
        data:'this is the request param'
      }
    };
    crosRequest("http://othersite.com/proxy.html" , data)
  });

  window.addEventListener('hashchange', function(){
    var dataString = location.hash.substring(1);
    try{
      console.log(JSON.parse(dataString))
    }catch(e){}
  })
</script>
```

`http://othersite.com/proxy.html`代码如下

```html
<script type="text/javascript">
function requestData(meta , callback) {
  var responseData = { message: 'response data' }
  var targetAPI = meta.requestURL;
  var params = meta.params;
  console.log('post request ' + targetAPI)

  //
  // async ajax request here
  //
  setTimeout(function(){
    // 强制hashchange
    responseData.t = new Date().getTime()
    callback(responseData)
  },1000)
}
function handHashChange() {
  var meta = location.hash;
  meta = meta.substring(1) || "{}";
  meta = JSON.parse(meta)
  requestData(meta, function(responseData) {
    parent.location.href = meta.source + '#'+ JSON.stringify(responseData);
  })
}
window.onload = function() {
  handHashChange();
}
window.addEventListener('hashchange', function() {
  handHashChange();
})
</script>
```


#### CORS

CORS英文全称Cross Origin Resource Sharing，中文为跨站资源共享，它是HTTP协议的一个扩展，通过一组新的HTTP的消息头定义了在进行跨源访问资源时，浏览器和服务器之间改如何沟通，因此需要浏览器和服务器端同时协调配合才能实现。浏览器在发起跨站请求时（通常是ajax请求）会声明它的`Origin`，服务器可以在后台声明自己的哪些资源是可以被第三方站访问的以及到底允许来自哪些站点的请求，这需要服务器正确的设置`Access-Control-Allow-Origin`消息头来做出响应，如果浏览器发现没有这个消息头或此消息头返回的域名与自己的域名不一致，则会忽略掉本次请求。请求和响应都不包含cookie。

CORS请求包含两种类型的请求：简单请求和非简单请求。

**简单请求**

只要满足一下条件的请求都是简单请求

```
1.使用下列方法之一：
GET
HEAD
POST
    //当POST方法的Content-Type值等于下列之一才算作简单请求
    Content-Type ：
        text/plain
        multipart/form-data
        application/x-www-form-urlencoded

2.请求首部不能超出以下范围
Accept
Accept-Language
Content-Language
Content-Type 的MIME类型只能是 application/x-www-form-urlencoded，multipart/form-data， text/plain其中之一
```

比如`http://www.server.com/index.html`页面中发起一个跨域的ajax请求

```html
<h3>简单请求</h3>
<button id="btn">调用</button>
<script>
function crosRequest(url, method, data, callback) {
  function noop(){};
  method = typeof method == 'function' ? 'get' : method;
  data = typeof data == 'function' ? null : data;
  callback = typeof callback =='function' ? callback : noop;
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = function(response) {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 400) {
        callback(true , xhr.responseText);
      } else {
        callback(false , new Error('Response returned with non-OK status'));
      }
    }

  }
  xhr.onerror = function(e) {
    console.log(e)
  }
  xhr.send(data);
}
var btn = document.getElementById('btn');
btn.addEventListener('click', function() {
  crosRequest("http://dev.server.com/api/cors", function(err , res) {})
});
</script>
```

会产生如下消息头

```http
GET /api/cors HTTP/1.1
Host: dev.server.com
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Origin: http://www.server.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36
Accept: */*
Referer: http://www.server.com/way6/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,en-US;q=0.4,zh-TW;q=0.2
```
服务器在接到请求后根据`Origin`设置进行判断

```js
//
// cros response set
//
function cors(req , res ,checkMethod){
  var origin = req.get('Origin');
  var allowOrigin = '';
  var allowMethod = true ;
  switch(origin){
    case "http://www.server.com":
    allowOrigin = origin
    break;
  }
  if(checkMethod){
    var method = req.get('Access-Control-Request-Method')
    allowMethod = 'put,get,post'.indexOf(method.toLowerCase()) > -1 ? true : false ;
    console.log(method+"-"+allowMethod)
  }
  if(allowOrigin && allowMethod){
    res.set('Access-Control-Allow-Origin' , allowOrigin);
    res.set('Access-Control-Allow-Methods' , 'PUT, POST')
    return true;
  }else{
    return false ;
  }
}
//
// simple cors request
//
app.get('/api/cors' , function(req , res){
  var allow = cors(req , res);
  if(allow){
    var data = {success: true , message:'response message'}
    res.json(data)
  }else{
    res.end()
  }
});
```

返回的HTTP消息头为

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://www.server.com
Access-Control-Allow-Methods: PUT, POST
Content-Type: application/json; charset=utf-8
Content-Length: 45
ETag: W/"2d-ifNug8I1gxcK+djXrthoQYA4Wrs"
Date: Sun, 27 Aug 2017 14:57:55 GMT
Connection: keep-alive
```
因为请求的`Origin`字段与响应的`Access-Control-Allow-Origin`字段是匹配的，所以浏览器能正确的处理返回的跨域响应。

**非简单请求**

非简单请求是违反了简单请求规则之外的请求，也称预检请求，发送此类请求前，浏览器首先会发送一个`OPTIONS`请求到请求服务器，进行一次询问，查看该服务器是否允许实际请求的域，方法，消息头。当满足了一下条件的任意一项时会发送预检请求

```
1.使用了一下任一的HTTP方法
    PUT
    DELETE
    CONNECT
    OPTIONS
    TRACE
    PATCH
2.人为设置了CORS安全首部字段集合之外的其它首部

3.Content-Type不属于以下任一类型
    application/x-www-form-urlencoded
    multipart/form-data
    text/plain
```

比如`http://www.server.com/index.html`页面中发起一个跨域的ajax的put请求

```html
<h3>非简单请求</h3>
<button id="btn2">调用</button>
<script type="text/javascript">
var btn2 = document.getElementById('btn2');
btn2.addEventListener('click', function() {
  crosRequest("http://dev.server.com/api/cors", 'put' ,function(err) {

  })
});
</script>
```

浏览器首先会发送一个options请求

```http
OPTIONS /api/cors HTTP/1.1
Host: dev.server.com
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Access-Control-Request-Method: PUT
Origin: http://www.server.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36
Accept: */*
Referer: http://www.server.com/way6/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,en-US;q=0.4,zh-TW;q=0.2
```

服务器在接到请求处理后根据请求头的`Origin`，消息头，以及HTTP方法进行判断

```js
//
// preflight cors request
//
app.options('/api/cors' , function(req , res){
  cors(req , res , true);
  res.end();
})

```
生成如下响应消息

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://www.server.com
Access-Control-Allow-Methods: PUT, POST
Date: Sun, 27 Aug 2017 14:56:19 GMT
Connection: keep-alive
Content-Length: 0
```

之后浏览器发送正式的put请求,产生如下的消息头

```http
PUT /api/cors HTTP/1.1
Host: dev.server.com
Connection: keep-alive
Content-Length: 0
Pragma: no-cache
Cache-Control: no-cache
Origin: http://www.server.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36
Accept: */*
Referer: http://www.server.com/way6/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,en-US;q=0.4,zh-TW;q=0.2
```

此时服务器才会正式的处理请求，获取响应数据

```js
app.put('/api/cors' , function(req , res){
  var allow = cors(req , res , true);
  if(allow){
    var data = {success: true , message:'response message'}
    res.json(data)  
  }else{
    res.end();
  }
})
```

生成如下的响应消息和JSON数据

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://www.server.com
Access-Control-Allow-Methods: PUT, POST
Content-Type: application/json; charset=utf-8
Content-Length: 45
ETag: W/"2d-ifNug8I1gxcK+djXrthoQYA4Wrs"
Date: Sun, 27 Aug 2017 14:56:19 GMT
Connection: keep-alive
```

`Access-Control-Request-Method`指明了正式请求的HTTP方法，本例是`PUT`，`Access-Control-Allow-Methods`返回服务器允许的请求方法。两个消息头匹配时才能进行正式的数据交互。

**withCredentials**

CORS请求默认不会携带Cookie信息和HTTP认证信息，如果要把发送认证信息到服务器，需要设置`XMLHttpRequest.withCredentials=true`，同时服务器还要通过设置`Access-Control-Allow-Credentials`来表明自己是否同意接受认证信息。

浏览器端需要设置

```js
var xhr = new XMLHttpRequest();
xhr.withCredentials= true;
...
xhr.send();
```

服务器端需要设置

```http
Access-Control-Allow-Credentials: true
```

对于附带身份认证的请求，服务器不能再设置`Access-Control-Allow-Origin`的值为`*`，必须设置为与请求一致的域，否则请求将失败。

**其它一些字段**

包括

+ `Access-Control-Max-Age`，标识预检请求的结果能被缓存多久
+ `Access-Control-Allow-Headers`，标识请求中可以携带的首部字段
+ `Access-Control-Expose-Headers`，标识XMLHttpReuqest.getResponseHeader()除了获取基本响应头之前还可以获取那些服务器返回的消息头


**XDomainRequest**

微软在IE8引入了XDomainRequest类型，这个对象与XHR类似，但能实现安全可靠的跨域访问，它部分的实现了CORS的功能，以下是相比XHR的一些不同之初：

+ cookie不会随请求发送，响应也不允许返回cookie
+ 只支持get和post请求
+ 只能设置头部信息的Content-Type字段
+ 不能访问响应头
+ 只能发送异步请求，不能发送同步请求




#### WebSocket



### 参考

+ [Same Origin Policy](https://www.w3.org/Security/wiki/Same_Origin_Policy)
+ [Document.domain](https://developer.mozilla.org/en-US/docs/Web/API/Document/domain)
+ [MDN Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
+ [MDN HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests)
+ [MDN Server-Side Access Control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Server-Side_Access_Control)
+ [Window.name](https://developer.mozilla.org/en-US/docs/Web/API/Window/name)
+ [HTMLFormElement.target](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/target)
+ [Improve cross-domain communication with client-side solutions](https://www.ibm.com/developerworks/library/wa-crossdomaincomm/)
+ [window.name Transport](https://www.sitepen.com/blog/2008/07/22/windowname-transport/)
+ [The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
+ [HTML5 Web Messaging](https://www.w3.org/TR/webmessaging/#dom-window-postmessage)
+ [HTML5 Web Messaging](https://msdn.microsoft.com/en-us/library/hh781494(v=vs.85).aspx)
+ [JSONP](https://zh.wikipedia.org/wiki/JSONP)
+ [Cross-Origin Resource Sharing](https://www.w3.org/TR/access-control/)
+ [MDN Location](https://developer.mozilla.org/en-US/docs/Web/API/Location)
+ [Wiki Cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
+ [MDN XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
+ [浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
+ [XDomainRequest object](https://msdn.microsoft.com/en-us/library/cc288060%28VS.85%29.aspx)
+ [CORS for XHR in IE10](https://blogs.msdn.microsoft.com/ie/2012/02/09/cors-for-xhr-in-ie10/)
+ [Enable CORS](https://enable-cors.org/index.html)