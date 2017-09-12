---
title: CSS background-clip
date: 2016-03-19 13:44:26
tags:
---

CSS的`background-clip`属性用来限定元素的背景色或背景图片的绘制区域，根据CSS的盒式模型，从外到内依次可以指定以下几个值

```

            DOM 元素
border
= = = = = = = = = = = = = = = = = = = = = = =
=  padding                                  =
=  = = = = = = = = = = = = = = = = = = ==   =
=  =                                    =   =
=  =                                    =   =
=  =       content                      =   =
=  =                                    =   =
=  =                                    =   =
=  = = = = = = = = = = = = = = == = = = =   =
=                                           =
= = = = = = = = = = = = = = = = = = = = = = =

```

+ `border-box`，背景会延展到元素的边框(border)下面
+ `padding-box`，背景延展到元素的内边距(padding)下面
+ `content-box`，背景延展到元素的内容下面

`background-clip`初始值为`border-box`

### 示例
```html
<!-- html -->
<div class="box bg-content">
  background-clip:content-box;
</div>
<div class="box bg-border">
	background-clip:border-box;
</div>
<div class="box bg-padding">
	background-clip:padding-box;
</div>

/* style */

.box{
  background-color:#3271C3;
  width:250px;
  height:100px;
  line-height:100px;
  padding:10px;
  border:10px solid rgba(0,0,0,0.2);
  margin-top:10px;
  color:white;
  text-align:center;
}

.bg-content{
  background-clip:content-box;
}

.bg-padding{
  background-clip:padding-box;
}

.bg-border{
  background-clip:border-box;
}
```
效果

![image](/img/2016-03-19-effect.png)

### 参考

+ [MDN background-clip][3]
+ [jsfiddle demo][1]

[1]: https://jsfiddle.net/p6h2qxbb/
[2]: https://jsfiddle.net/DaJun/ajphx95p/1/
[3]: https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
