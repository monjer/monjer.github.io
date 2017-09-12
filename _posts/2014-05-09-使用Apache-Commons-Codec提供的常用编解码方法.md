---
title: 使用Apache Commons Codec提供的常用编解码方法
date: 2014-05-09
tags:
---


Apache Commons codec提供了开发中常用的编码解码的工具类，包括Base64，Hex，MD5，URL等，以解决项目中重复的各种编解码操作。项目最早是用来实现Base64编码，但随着项目的发展，后面陆续加入了越来越多的编码工具类。以下是几种使用Codec中提供的编解码代码示例。

### Base64编码解码
[Base64][ref-1](线程安全类),提供[Base64][ref-2]的编码和解码方法。

> JDK中的`sun`包中提供了sun.misc.BASE64Encoder类来进行Base64编解码，但官方不推荐使用`sun`包中的方法，参见[Why Developers Should Not Write Programs That Call 'sun' Packages][ref-5]。
>

**Base64编解码字符串**
```java
String str = "Source String";

// 编码
String encodeStr = Base64.encodeBase64String(str.getBytes("utf-8"));
System.out.println(encodeStr); // U291cmNlIFN0cmluZw==

// 解码
String decodeStr = new String(Base64.decodeBase64(encodeStr));
System.out.println(decodeStr); // Source String
```
**URL-safe模式下Base64编解码**
```java
String url = "http://www.baidu.com?t=123&c=asd" ;

// 编码
String encodeStr = Base64.encodeBase64URLSafeString(url.getBytes("utf-8"));
System.out.println(encodeStr); // aHR0cDovL3d3dy5iYWlkdS5jb20_dD0xMjMmYz1hc2Q

// 解码
String decodeStr = new String( Base64.decodeBase64(encodeStr));
System.out.println(decodeStr); // http://www.baidu.com?t=123&c=asd
```

>URL-safe模式下Base64编码是标准Base64编码的变体，URL编码器会把标准Base64中的「/」和「+」字符变为形如「%XX」的形式，而这些「%」号在存入数据库时还需要再进行转换，所以变体的Base64编码表中的`+`和`-`会替换为`-`,`_`，并且不在末尾填充'='号。

### 摘要编码

[DigestUtils][ref-3]类，简化原生JDK [MessageDigest][ref-4]类的常用操作。

**MD5编码字符串**
```java
String password = "password string";
String encodeStr = DigestUtils.md5Hex(password);
System.out.println(encodeStr); // 03d105778ae0b4d8205a05a5dbdfcfe9
```
**SHA编码字符串**
```java
String password = "password string";
encodeStr = DigestUtils.sha1Hex(password);
System.out.println(encodeStr); // 5251fda188a58dac70c1a8e531b690a5ac2d3527
```
### 参考

+ [Apache Commons Codec](http://commons.apache.org/proper/commons-codec/)
+ [Wiki Base64][ref-2]
+ [Wiki ASCII](http://zh.wikipedia.org/wiki/ASCII)
+ [Why Developers Should Not Write Programs That Call 'sun' Packages][ref-5]

[ref-1]: http://commons.apache.org/proper/commons-codec/apidocs/org/apache/commons/codec/binary/Base64.html
[ref-2]: http://zh.wikipedia.org/wiki/Base64
[ref-3]: http://commons.apache.org/proper/commons-codec/apidocs/org/apache/commons/codec/digest/DigestUtils.html
[ref-4]: http://download.oracle.com/javase/6/docs/api/java/security/MessageDigest.html
[ref-5]: http://www.oracle.com/technetwork/java/faq-sun-packages-142232.html
