### WebSocket笔记

### 什么是WebSocket

WebSocket是一种建立在TCP链接上的全双工通信的协议，用来在客户端与服务器端实现双向通信的技术，客户端可以推送数据到服务器端，服务器端也可以推送数据到客户端，这使得客户端和服务器端的数据交换变得简单，尤其是解决了因为HTTP的无连接，无状态造成的服务器向客户端发送消息十分困难的情况。基于WebSocket，浏览器和服务器只需要完成一次握手的功能就建立了持久的链接来进行双向数据交互。

### WebSocket优点

+ 标准化
+ 实时性全双工通信
+ 连接状态持久化
+ 支持多种数据格式，更好的二进制支持
+ 更好的压缩效果
+ 没有跨越同源限制，通信更自由

### WebSocket对象

浏览器中WebSocket对象用来提供创建和管理与服务器键WebSocket链接的任务，以及通过链接接收和发送数据的任务，比如

```js
var socket = new WebSocket('ws://www.server.com')
```

在链接服务器的过程中`socket`对象会经历四个状态

+ `CONNECTING`	 0	 链接尚未建立
+ `OPEN`	        1	 链接已建立，可以通信
+ `CLOSING`	     2	 链接关闭中
+ `CLOSED`	     3	 链接已关闭或无法打开

可以通过`readyState`属性来标记当前的状态

WebSocket对象支持原生四个事件类型

```js
socket.onopen = function(event){
    console.log('WebSocket 链接已建立')
}
socket.onmessage = function(event){
    console.log('收到新的WebSocket服务器发来的消息')
    console.log(event.data)
}
socket.onclose = function(event){
    console.log('WebSocket 链接已关闭')
}
socket.onerror = function(event){
    console.log('WebSocket通信错误，可能链接马上就要断掉了...')
}
```
在链接建立后，我们就可以发送数据到服务器端了，可以使用`send(data)`方法

```
socket.send("Hello world")
```

`send`接口中`data`参数可以是以下几种数据类型：

+ String
+ ArrayBuffer
+ Blob

当服务器推送消息到客户端时，可以使用`onmessage`事件监听，然后在事件对象中获取数据就像我们上边描述的，但可能需要判断下接受数据的数据类型。

```js
socket.onmessage = function(event){
    console.log('收到新的WebSocket服务器发来的消息')
    var data = event.data;
    if(data instanceOf String){
    
    }else if(data instanceOf ArrayBuffer){
    
    }else if(data instanceOf Blob){
    
    }
}
```


当交互完成后，可以调用`close()`方法，断开与服务器的链接。

```js
socket.close();
```

如果因网络或其它原因造成的链接关闭，我们都可以在`onclose`事件中获得消息。


### 建立链接的过程

以下是使用[Socket.io](https://socket.io/)实现的demo中链接建立的HTTP消息头

请求消息

```http
GET ws://localhost:3000/socket.io/?EIO=3&transport=websocket&sid=letX0WWLH0zOM2wmAAAL HTTP/1.1
Host: localhost:3000
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
Origin: http://localhost:3000
Sec-WebSocket-Version: 13
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,en-US;q=0.4,zh-TW;q=0.2
Cookie: Hm_lvt_2b4f08dbd457a5e207bff33f77b0eafc=1504695954; Hm_lpvt_2b4f08dbd457a5e207bff33f77b0eafc=1504697723; optimizelyEndUserId=oeu1504745295628r0.39852599337988925; _ga=GA1.1.854121770.1504745296; _gid=GA1.1.1802258919.1504745296; io=letX0WWLH0zOM2wmAAAL
Sec-WebSocket-Key: 0OjLblOFappyQmqlzKE/JA==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
```
里面关键的字段是

+ `Connection`，必须设置成`Upgrade`，表示客户端需要升级链接
+ `Upgrade`，必须设置为`WebSocket`，表示升级到的是WebSocket协议
+ `Sec-WebSocket-Key`，随机字符串用来做表示，避免客户端搞错协议类型
+ `Sec-WebSocket-Version`，表示客户端支持的WebSocket的版本

响应消息

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HgJ5tJBpg70/MXZdqf6yYZXX8xg=
Sec-WebSocket-Extensions: permessage-deflate; client_no_context_takeover
Sec-WebSocket-Version: 13
WebSocket-Server: uWebSockets
```

后面是服务器同意链接后的返回消息。

最后套用一张图来说明交互的过程

![websocket-lifecycel](/img/2017-09-06-websocket-lifecycel.png)

关于服务器端WebSocket的实现，可以参见[WIKI WebSocket][5]中列出来的那些。

### 参考

+ [CanIUse WebSocket][1]
+ [WebSocket and Socket.IO][2]
+ [The WebSocket API][3]
+ [Writing WebSocket client applications][4]
+ [WIKI WebSocket][5]

[1]: http://caniuse.com/#search=WebSocket
[2]: https://davidwalsh.name/websocket
[3]: https://www.w3.org/TR/2011/WD-websockets-20110929/
[4]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
[5]: https://zh.wikipedia.org/wiki/WebSocket