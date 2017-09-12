---
title: 修改Tomcat的Server标识
date: 2014-03-15
tags:
---


默认情况下访问Tomcat提供的Web应用中的文件或泛起HTTP请求，Tomcat会为每个HTTP响应添加`Server`消息头，默认该消息头设置如下：

	Server: Apache-Coyote/1.1

这是一个服务器的行为，之前好奇于该行为的是如何进行集中控制的，发现其实这个消息头是通过`conf/server.xml`中的`Connector`配置元素提供的名为`server`的属性进行配置的，如更改Server的标识为`Apache/Tomcat`,可以打开`conf/server.xml`文件并找到HTTP Connector配置元素，之后添加自定义的`server`标识即可，如：

```xml
<Connector connectionTimeout="20000"
            port="8080"
            protocol="HTTP/1.1"
            redirectPort="8443"
            server="Apache/Tomcat"/>
```
这样所有的来自于Tomcat的HTTP响应中的`server`字段都会变为：

	Server: Apache/Tomcat

其实这个表示的设置并没有太大的实际意义，只是一个简单的小技巧记录之！

### 参考
[Apache HTTP Connector](http://tomcat.apache.org/tomcat-7.0-doc/config/http.html#BIO_specific_configuration)
