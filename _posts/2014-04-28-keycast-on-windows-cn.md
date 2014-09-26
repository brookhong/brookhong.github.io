---
layout: post
title: KeyCastOW -- Windows下的按键显示
category: cn
---

{{ page.title }}
================

Windows按键显示软件，显示你的按键操作，可用于录制教学视频时。

* 足够小巧（只有一个100kb的可执行文件）
* 绿色环保，只依赖系统DLL文件
* 设置方便，可按自己需要定制
* 有可设置的开关热键


[下载](/assets/downloads/keycastow.zip) | [有问题](https://github.com/brookhong/brookhong.github.io/issues)

## 更新历史

### 2014-09-23 2.0.0.3
* 修改缺陷 [Y(offset to left bottom corner) 不好使](https://github.com/brookhong/brookhong.github.io/issues/8)
* 实现新功能 [只显示命令键](https://github.com/brookhong/brookhong.github.io/issues/7)

### 2014-08-27 2.0.0.2
* 修改缺陷 [增加设置把Shift作为独立的组合键](https://github.com/brookhong/brookhong.github.io/issues/5)

![Screencast of keycastow](/assets/images/keycastow_shift.gif)

### 2014-05-26 2.0.0.1
* 无抖动动画
* 无锯齿的圆角
* 文字、背景、边框的透明设置
* 设置预览
* 可在桌面上放置定制文本
* 修改其他一些缺陷

![Screencast of keycastow](/assets/images/keycastow2.gif)
![settings of keycastow](/assets/images/keycastow.png)

### 2014-04-28 1.0.0.1

作为Mac用户，经常使用[keycastr](https://github.com/sdeken/keycastr)，一个开源的按键显示软件，来录制各种技术演示视频。
同时身为一名Windows用户，在网上搜过Windows下的同类软件，是有一些，但没有一个像keycastr一样让我满意。

2014年三月的某天，我最终决定自己整一个 —— KeyCastOW，最后的`OW`表示On Windows.

基于某些原因（我还是希望有人能购买的），这个不开源，但是免费。

下面用Windows下gVim[我的vim配置](https://github.com/brookhong/vimfiles)做些演示。
注：我的`<leader>`是`s`，所以当你在normal mode下看到一些s开头的命令时，也不用奇怪。我还有一些命令是以空格开头的。

![Screencast of keycastow](/assets/images/keycastow.gif)

还有k.vim的演示。

![Screencast of KeyCastOW](http://drp.io/files/536124ae9a4f9.gif)
![Screencast of K.vim](http://drp.io/files/5357c687a659a.gif)

以上演示使用[LICEcap](http://www.cockos.com/licecap/) 和 [KeyCastOW](/assets/downloads/keycastow.zip)制作。
