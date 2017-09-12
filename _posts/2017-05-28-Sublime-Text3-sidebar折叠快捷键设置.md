---
title: Sublime Text3 sidebar折叠快捷键设置
date: 2017-05-28 15:51:18
layout: page
tags:
  sublime text
---

打开Sublime Text，在左上角的菜单选线中，依次打开`Sublime Text`->`Preferences`->`Key Bindings`。

在用户设置的keymap中添加

```
{ "keys": ["super+\\"], "command": "toggle_side_bar" },
{ "keys": ["super+shift+r"], "command": "reveal_in_side_bar" }
```

其中`toggle_side_bar`用来设置折叠打开的快捷键;`reveal_in_side_bar`是用来定位当前文件在sidebar中的所在位置的快捷键。

以上设置是基于Mac下，Windows下可以将`super`键改为`Ctrl`或`Alt`键。
