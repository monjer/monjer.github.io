---
title: mailto链接在HTML页面中的使用介绍
date: 2014-01-23
tags:
---

### 什么是mailto链接

mailto链接是HTML页面链接的一种，在HTML页面中通过点击一个mailto链接，可以打开用户计算机中默认的mail客户端程序，用网站中指定邮件地址发送邮件。网页中的mailto链接使用的是[mailto协议][1]，该协议注册于IANA，定义了[SMTP][2]邮件地址的协议格式。

HTML页面中的mailto链接依赖于用户计算机中提前安装的邮件客户端，比如Window系统下的Outlook，或Mac OS X下的邮件应用

### HTML中使用mailto链接

可以使用HTML的`<a>`标签的`href`属性创建mailto链接，如：

```html
<a href="mailto:hmj030986@gmail.com">联系我</a>
```

产生链接: <a href="mailto:hmj030986@gmail.com">联系我</a>

### 发送邮件并添加主题(subject)和文本消息(body)

```html
<a href="mailto:hmj030986@gmail.com?subject=主题名称&body=这是消息的内容">联系我</a>
```

产生链接: <a href="mailto:hmj030986@gmail.com?subject=主题名称&body=这是消息的文本内容">联系我</a>

由于mailto协议也属于URL协议范围内的一种，URL协议规定中有许多保留的特殊字符，如果这些特殊字符出现在内容体内时，需要使用`%`形式进行[转码][3]。如空格使用`%20`代替,换行符用`%0D%0A`代替。如下

```html
<a href="mailto:hmj030986@gmail.com?subject=主题%20名称&body=这是消息的内容%0D%0A另一行内容">联系我</a>
```

产生链接: <a href="mailto:hmj030986@gmail.com?subject=主题%20名称&body=这是消息的内容%0D%0A另一行内容">联系我</a>

同时需要注意的是`body`的值只能是普通文本(text/plain)，不能包含HTML格式(MIME)的内容,[RFC-2368](4)英文释义

>The special hname "body" indicates that the associated hvalue is the
   body of the message. The "body" hname should contain the content for
   the first text/plain body part of the message. The mailto URL is
   primarily intended for generation of short text messages that are
   actually the content of automatic processing (such as "subscribe"
   messages for mailing lists), not general MIME bodies.



### 忽略收件人地址

如

```html
<a href="mailto:?subject=主题&body=http://en.wikipedia.org/wiki/Mailto">发送消息</a>
```

产生链接: <a href="mailto:?subject=主题&body=http://en.wikipedia.org/wiki/Mailto">发送消息</a>

### 指定多个收件人地址,地址间用`","`分割

如

```html
<a href="mailto:hmj030986@gmail.com,someone@gmail.com">联系我们</a>
```

产生链接: <a href="mailto:hmj030986@gmail.com,someone@gmail.com">联系我们 </a>


### 添加抄送地址(Cc)和密送地址(Bcc)

```html
<a href="mailto:hmj030986@gmail.com?cc=cc1@gmail.com,cc2@gmail.com&bcc=bcc1@gmail.com,bcc2@gmail.com&subject=主题内容">联系我们</a>
```

产生链接: <a href="mailto:hmj030986@gmail.com?cc=cc1@gmail.com,cc2@gmail.com&bcc=bcc1@gmail.com,bcc2@gmail.com&subject=主题内容">联系我们</a>

以上也是可以使用`","`分割多个邮件地址。

### 参数整理

<table >
			<tbody><tr>
				<th width="215">参数</th>
				<th>说明</th>
			</tr>
			<tr>
				<td width="207">mailto:<i>address@email.com</i></td>
				<td>收件人邮箱地址</td>
			</tr>
			<tr>
				<td width="207">cc=<i>address@email.com</i></td>
				<td>抄送人邮箱地址</td>
			</tr>
			<tr>
				<td width="207">bcc=<i>address@email.com</i></td>
				<td>密送人邮箱地址</td>
			</tr>
			<tr>
				<td width="207">subject=<i>名称</i></td>
				<td>邮件主题名</td>
			</tr>
			<tr>
				<td width="207">body=<i>内容</i></td>
				<td>邮件文本消息</td>
			</tr>
			<tr>
				<td width="207">?</td>
				<td>第一个参数的分隔符</td>
			</tr>
			<tr>
				<td width="207">&amp;</td>
				<td>剩余参数分隔符</td>
			</tr>
		</tbody>
	</table>

### 参考

+ [RFC-6068](http://www.ietf.org/rfc/rfc6068.txt)
+ [Mailto Links](http://css-tricks.com/snippets/html/mailto-links/)
+ [Wiki mailto](http://en.wikipedia.org/wiki/Mailto)
+ [MailTo with HTML body](http://stackoverflow.com/questions/5620324/mailto-with-html-body)
+ [mailto: HTML e-mail link](http://www.rapidtables.com/web/html/mailto.htm)

[1]: http://www.ietf.org/rfc/rfc6068.txt
[2]: http://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[3]: http://en.wikipedia.org/wiki/Percent-encoding
[4]: http://tools.ietf.org/search/rfc2368
