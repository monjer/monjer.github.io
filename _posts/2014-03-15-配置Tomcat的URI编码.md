---
title: 配置Tomcat的URI编码
date: 2014-03-15
tags:
    - tomcat
    - uri encode
---


Tomcat默认以`iso-8859-1`编码格式对所有web application请求的URI进行编码，即使用`iso-8859-1`对URI中除`%xx`之外的字符进行编码，这是开发过程中产生乱码的原因之一。`conf/server.xml`配置文件中`Connector`元素中的`URIEncoding`属性值用来设置URI的编码格式。

比如，设置URI编码为utf-8，需做如下配置

1.使用HTTP Connector

```xml
<Connector connectionTimeout="20000"
            port="8080"
            protocol="HTTP/1.1"
            redirectPort="8443"
            URIEncoding="utf-8"/>
```
2.使用AJP connector
```xml
<Connector port="8009" protocol="AJP/1.3" URIEncoding="utf-8"/>
```
### 参考

+ [The HTTP Connector](1)

[1]: http://tomcat.apache.org/tomcat-7.0-doc/config/http.html
