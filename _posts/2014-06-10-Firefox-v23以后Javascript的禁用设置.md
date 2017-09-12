---
title: Firefox v23以后Javascript的禁用设置
date: 2014-06-10
tags:
  - firefox
  - javascript
---

早期版本的Firefox在首选项的**高级**选项面板中可以设置浏览器中javascript的启用状态，Firefox V23版本后将javascript的设置从首选项面板中移除。在[Firefox V23发布说明][ref-1]中，关于该移除"Enable JavaScript"设置的变更说明如下：

>"Enable JavaScript" preference checkbox has been removed and user-set values will be reset to the default

关于移除禁用javascript的功能，在Firefox的[Bug 873709][ref-6]中有关于为什么移除禁用javascript复选框的说明。大意是Firefox选项面板中提供的禁用javascript的功能会让用户感到困惑，对于没有编程经验的普通用户来说，他们不清楚在设置或更改javascript选项后会有什么后果，用户在禁用javascript后，会导致加载的新页面无法正常显示或工作，不但浪费了web开发者提供的页面功能，更严重的是这使得用户体验变得糟糕。而且，随着Web技术的发展，网页提供的功能和服务也越来越丰富，越来越多的用户依赖于浏览器来获得他们所需要的Web服务，所有这些的都极大的依赖Javascript来实现。基于这些考虑，所以V23及以后版本的Firefox将javascript禁用的功能从选项面板中移除出去。

###  Firefox v23之后的javascript禁用设置

虽然在v23以后的Firefox中，无法在选项面板中进行javascript的设置，但还有其它的方式来完成该功能。

#### **方式一：**使用Firefox的**about:config**

1. 在Firefox中打开新的空白页面，在地址栏中输入`about:config`,并回车确定,在显示的页面中点击**我保证小心**的按钮。

	![image](/img/2014-06-10-1.png)

2. 在新页面顶部的搜索框中，输入关键字**javascript**，并找到`javascript.enable`选项，该选项就是用来控制firefox是否禁用javascript，默认为`true`，启用javascript

	![image](/img/2014-06-10-2.png)

3. 在列表中双击`javascript.enable`选项，可以看到该选项值被设置为了`false`，同时状态变为了`用户设置`,这样就禁用了Firefox中的脚本。

	![image](/img/2014-06-10-3.png)

#### 方式二：使用NoScript插件

1. 在Firefox的菜单栏中，点击*工具*>*附加选项*
2. 在附加组件页面中搜索**NoScript**插件，并安装
	![image](/img/2014-06-10-4.png)
3. 安装成功后在Firefox的顶部工具条上会有NoScript的按钮，点击该按钮，会显示当前加载页面上所有来源的脚本，并允许我们根据来源选择性的禁用。
	![image](/img/2014-06-10-5.png)

###  参考

+ [Firefox V23发布说明][ref-1]
+ [Firefox各版本FTP下载地址][ref-2]
+ [首选项窗口 - 安全面板][ref-3]
+ [Firefox附加组件:**NoScript**][ref-4]
+ [How to disable javascript in Firefox 29.0 ?][ref-5]

[ref-1]: https://www.mozilla.org/en-US/firefox/23.0.1/releasenotes/
[ref-2]: ftp://ftp.mozilla.org/pub/firefox/releases/
[ref-3]: https://support.mozilla.org/zh-CN/kb/%E9%A6%96%E9%80%89%E9%A1%B9%E7%AA%97%E5%8F%A3%20-%20%E5%AE%89%E5%85%A8%E9%9D%A2%E6%9D%BF?redirectlocale=en-US&as=u&redirectslug=Options+window+-+Security+panel&utm_source=inproduct
[ref-4]: https://addons.mozilla.org/zh-CN/firefox/addon/noscript/
[ref-5]: https://support.mozilla.org/zh-CN/questions/994809?esab=a&s=javascript&r=3&as=s
[ref-6]: https://bugzilla.mozilla.org/show_bug.cgi?id=873709
