---
title: AS3使用Capabilities类获取Flash Player的信息
date: 2014-01-21
tags:
---
AS3中`flash.system.Capabilities`类提供诸多静态的只读属性来描述应用程序当前所运行在的系统和运行时信息，如Flash Player,Adobe AIR,Flash Lite。通过`Capabilities`可以确定运行应用程序的客户端的诸多信息，并依此来为用户提供程序本身定制化的内容。本篇只就获取浏览器中嵌入的[Flash Player](http://www.adobe.com/cn/products/flashplayer.html)运行时，来列举一些获取其几个常见信息所涉及到的属性和释义。

### 运行时类型

`Capabilities.playerType`属性描述了当前应用程序的运行时类型。

可以是以下几种类型：

+ `"ActiveX"`

	用于 Microsoft Internet Explorer 使用的 Flash Player ActiveX 控件

+ `“Desktop”`

	代表 Adobe AIR 运行时（通过 HTML 页加载的 SWF 内容除外，该内容将 Capabilities.playerType 设置为“PlugIn”）

+ `“External”`

	用于外部 Flash Player 或处于测试模式下

+ `“PlugIn”`

	代表 Flash Player 浏览器插件（和通过 AIR 应用程序中的 HTML 页加载的 SWF 内容）

+ `"StandAlone"`

	用于独立的 Flash Player

在以插件形式嵌入到浏览器中的Flash Player运行时上，`Capablities.playerType`返回的`"PlugIn"`。如，

	var playerType:String = Capablities.playerType ;
	trace("playerType : "+playerType); // playerType : Plugin

### 运行时是否是调试版

`Capabilities.isDebugger`属性描述运行时是否为调试版本。`ture`说明当前运行时是否是调试版，`false`说明当前运行时为正式版。如

	var isDebuggerVersion:Boolean = Capabilities.isDebugger;
	trace("Debugger Version : "+isDebuggerVersion); // Debugger Version : true

Adobe的运行时包括两种类型，正式发布版(release version)和调试版(debug version)，对于开发人员来说，为了在开发过程便于程序调试，我们往往使用的是调试版的的运行时版本。对于普通的用户来说，他们使用的大多是正式发行版，对于Flash Player可以去Adobe Flash Support Center来查看最新版的FLash Player[下载](http://www.adobe.com/support/flashplayer/downloads.html)信息。

### 操作系统类型

`Capabilities.os`属性指定了当期操作系统的名称，常见的系统和对应值有
<table>
  <tbody>
    <tr>
      <th>操作系统</th>
      <th>值</th>
    </tr>
    <tr>
      <td>Windows 8</td>
      <td>
        <code>"Windows 8"</code>
      </td>
    </tr>
    <tr>
      <td>Windows 7</td>
      <td>
        <code>"Windows 7"</code>
      </td>
    </tr>
    <tr>
      <td>Windows Server 2003</td>
      <td>
        <code>"Windows Server 2003"</code>
      </td>
    </tr>
    <tr>
      <td>Windows XP 64</td>
      <td>
        <code>"Windows Server XP 64"</code>
      </td>
    </tr>
    <tr>
      <td>Windows XP</td>
      <td>
        <code>"Windows XP"</code>
      </td>
    </tr>
    <tr>
      <td>Windows Mobile</td>
      <td>
        <code>"Windows Mobile"</code>
      </td>
    </tr>
    <tr>
      <td>Mac OS</td>
      <td>
        <code>"Mac OS X.Y.Z"</code>（其中 X.Y.Z 为版本号，例如
        <code>"Mac OS 10.5.2"</code>）
      </td>
    </tr>
    <tr>
      <td>Linux</td>
      <td>
        <code>"Linux"</code>（Flash Player 连接 Linux 版本，如
        <code>"Linux 2.6.15-1.2054_FC5smp"</code>
      </td>
    </tr>
    <tr>
      <td>iPhone OS 4.1</td>
      <td>
        <code>"iPhone3,1"</code>
      </td>
    </tr>
  </tbody>
</table>

如，
```as
var os:String = Capabilities.os;
trace("Current OS : "+os); // Current OS : Mac OS 10.8.5
```
### 系统语言

`Capabilities.language`属性说明，当前运行时所在系统的[语言代码][1]。

[语言代码][1]是指由英文和数字组成的，用来描述语言类型的短字符串。**语言**指定为[ISO 639-1](http://zh.wikipedia.org/wiki/ISO_639-1%E4%BB%A3%E7%A0%81%E8%A1%A8)中小写双字母语言代码，如中文`zh`,对于中文，使用[ISO 3166](http://zh.wikipedia.org/wiki/ISO_3166-1)中的大写双字母国家/地区代码，以区分简体中文(zh-CN)和繁体中文(zh-TW) 。

英文系统上，此属性返回语言代码，而不返回国家/地区编码。如，
```as
var language:String = Capabilities.language;
trace("System language : "+language); // System language : zh_CN
```
### 版本信息

`Capabilities.version`属性描述当前运行时的版本信息。

版本号的格式为：平台(platform),主版本号(majorVersion),次版本号(minorVersion),生成版本号(buildNumber)，内部生成版本号(internalBuildNumber)。其中platform的可选值为`"WIN"`,`"MAC"`,`"LNX"`,`"AND"`，如

```as
var versionReg:RegExp = /^(\w*) (\d*),(\d*),(\d*),(\d*)$/;

var version:String = Capabilities.version ;
trace("version : "+version);		//version : MAC 11,9,900,170
var v:Object = versionReg.exec(version) ;

var	platform:String = v[1] ,
	majorVersion:String = v[2] ,
	minorVersion:String = v[3] ,
	buildNumber:String = v[4] ,
	internalBuildNumber:String = v[5];

trace("platform : "+platform);   			//platform: MAC
trace("majorVersion : "+platform);   		//majorVersion: 11
trace("minorVersion : "+platform);   		//minorVersion: 9
trace("buildNumber : "+platform);   		//buildNumber: 900
trace("internalBuildNumber : "+platform);   //internalBuildNumber: 170
```

 `Capabilities`类中还包含了许多其他的描述性静态属性，详情见其[文档](http://help.adobe.com/zh_CN/FlashPlatform/reference/actionscript/3/flash/system/Capabilities.html)。

### 参考

+ [使用 Capabilities 类](http://help.adobe.com/zh_CN/as3/dev/WS5b3ccc516d4fbf351e63e3d118a9b90204-7cd8.html)
+ [Get Flash player version with AS3](http://www.negush.net/blog/get-flash-player-version-with-as3/)
+ [Determining Flash Player version in Flex](http://help.adobe.com/en_US/flex/using/WS2db454920e96a9e51e63e3d11c0bf69084-7ebb.html)
+ [Flash Player 发行说明](http://www.adobe.com/support/documentation/cn/flashplayer/releasenotes.html)

[1]: http://zh.wikipedia.org/wiki/%E8%AA%9E%E8%A8%80%E4%BB%A3%E7%A2%BC
