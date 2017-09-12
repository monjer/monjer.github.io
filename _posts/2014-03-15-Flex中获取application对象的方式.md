---
title: Flex中获取application对象的方式
date: 2014-03-15 00:23:14
tags:
---


Flex应用程序中的根标签是`<s:Application>`(Spark application容器),或`<mx:Application>`(MX Application容器)。application容器是所有Flex组件的根，就像HTML文档中的<html>标签一样,所有的组件和脚本都将包含在application标签内。通常所有的全局对象或函数，也都会分别作为属性或方法添加至application中。通常代码中要通过首先获取application对象才能获得全局对象或方法。下面是两种在代码中获取application对象的方式,假设当前的应用程序名为MyApplication。

1. 通过FlexGlobals类:

    FlexGlobals类包含了通用于同一Application Domain内的所有应用程序的变量的类，其包含	的公共属性只有两个，一个是constructor属性，两一个是topLevelApplication属性
        ```as3
		var application:MyApplication = FlexGlobals.topLevelApplication as MyApplication ;
		```

2. 通过SystemManager的application属性

	SystemManager用来管理Flex应用程序窗口。每个Flex应用只包含一个SystemManager。SystemManager类中的application属性用来获得application对象。UIComponent对象作为FlexUI组件的上层类，通过UIComponent的systemManager属性，就可以获得全局仅有的SystemManager对象。这样在继承自UIComponent的所有UI组件内部都可以很方便的获取application对象，假如，有继承自UIComponent类的名为MyComponent的自定义组件，在其内部可以通过以下代码获得application：
        ```as3
		var sysManager:SystemManager = this.systemManager as SystemManager ;
		var application:MyApplication = sysManager.application as MyApplication ;
		```

**注意:**上述两种获取application对象的方式，都需要根据具体应用程序的名称和类型进行合适的类型转换。
