---
layout: post
title: Chrome里支持VIM的地址栏
category: cn
---

{{ page.title }}
================


[Surfingkeys](https://github.com/brookhong/Surfingkeys) 提供了一个模拟的地址栏，可支持VIM编辑。

Surfingkeys 内嵌里一个VIM编辑器。其中的所有输入行会被当作URL，这样当你按回车或者输入`:wq`关闭编辑器时，这些URL会在标签页中依次打开。

有两种方法启动这个模拟地址栏。

1. 按`su`打开，这时里面的默认值是当前页面的地址
![su](https://cloud.githubusercontent.com/assets/288207/25035930/47fe1b4e-2123-11e7-8607-1a35815c3676.gif)

1. 从搜索栏按`Ctrl-i`打开，这时里面的默认值是当前选中的URL
![ctrl_i](https://cloud.githubusercontent.com/assets/288207/25035938/545b1ab8-2123-11e7-821c-8b049cfb2cc0.gif)
