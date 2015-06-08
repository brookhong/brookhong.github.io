---
layout: post_cn
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

### 2015-05-03 2.0.2.3
* [支持不括号功能键，去掉Combination Chars的第三个字符即可](https://github.com/brookhong/brookhong.github.io/issues/21)
* [检测鼠标滚轮方向：上或下](https://github.com/brookhong/brookhong.github.io/issues/24)

### 2015-05-03 2.0.2.0
* 按住功能辅助键时，保持在屏幕上，而不是重复显示
* 支持左/右对齐设置，默认是右对齐，这样当需要在一行显示时，向左移动。
* 更直观的可视化定位方式，来设置起始位置
* [设置不再保存在注册表里，而保存在当前目录下的ini文件里](https://github.com/brookhong/brookhong.github.io/issues/16)

### 2015-04-12 2.0.1.0
* [长按时重复设置: Keyboard Auto Repeat](https://github.com/brookhong/brookhong.github.io/issues/9)，默认行为是打开的，比如按住a键不放，会不断触发a键事件，如果关上的话，按住a不放，只会触发一个a，只有当放开之后再按下a，才会出现下一个a。
* [行间距为负数时程序会崩溃](https://github.com/brookhong/brookhong.github.io/issues/15)
* [增加合并鼠标键按下放开的设置: Quick Mouse Button Up/Down as Click](https://github.com/brookhong/brookhong.github.io/issues/15)，默认时按下鼠标键会有一个ButtonDown，再放开时会有一个ButtonUp。打开该设置时，如果鼠标按下放开间隙短的话，会直接显示为Click。

### 2015-04-04 2.0.0.9
* [改善鼠标动作显示](https://github.com/brookhong/brookhong.github.io/issues/14)
![keycastow 2.0.0.9](/assets/images/keycastow2.0.0.9.png)

### 2014-12-19 2.0.0.8
* [组合键的括号和连接符可自定义](https://github.com/brookhong/brookhong.github.io/issues/12), 默认是`<->`, 设置成`[+]` 就会把 `<Alt - Tab>` 显示成 `[Alt + Tab]`。
* [linger time有时会出错](https://github.com/brookhong/brookhong.github.io/issues/13)。
* [可设置在屏幕上显示的最大行数](https://github.com/brookhong/brookhong.github.io/issues/13)，默认是10。

### 2014-12-04 2.0.0.7
* [支持鼠标动作捕捉](https://github.com/brookhong/brookhong.github.io/issues/12)，默认是打开的，从设置里可以关闭。

### 2014-10-24 2.0.0.6
* [支持多显示器](https://github.com/brookhong/brookhong.github.io/issues/11)
* 移动设置对话框可设置按键显示位置

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

以上演示使用[LICEcap](http://www.cockos.com/licecap/) 和 [KeyCastOW](/assets/downloads/keycastow.zip)制作。
