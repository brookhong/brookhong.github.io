---
layout: post
title: 自带字典的Chromium浏览器
category: cn
---

{{ page.title }}
================

在Chromium里加了一个很常用的功能————点击取词翻译，尽管有很多插件提供了类似的功能，但是体验并不好，主要因为以下原因：

* 插件基本上都依赖一个外部服务来查询单词，这就会有网络带来的问题————服务不可用/网络延迟等等。在5G已经到来的今天，这个问题好像已经不是问题，但却实实在在影响体验。
* 在有些网站不可用，尤其在Chrome/Chromium自带的PDF阅读器上无法使用。

这样，Chromium就是兼具词典功能的浏览器了。那么如何使用呢？

在[这里](https://pan.baidu.com/s/1KQ5B298a7XCEQEIIR5u39A#list/path=%2Fchromium_release)（提取码: 4d3u），

1. Windows系统用户请下载Chromium_installer.exe，MacOS系统用户请下载Chromium.dmg。
1. 然后你需要下载那个词典文件————dictorium.db，如果找不到合适的，你可以用[SqliteDictBuilder](https://github.com/brookhong/SqliteDictBuilder)生成自己的词典。

### 安装词典

只要把词典文件`dictorium.db`放到下载目录下就可以，比如Windows下的`C:\Users\Administrator\Downloads`。或者你也可以在`chrome://settings/dict`指定`dictorium.db`所在的目录。

### 取词翻译

你可以单击任意页面上的任意单词来获取`dictorium.db`所提供的关于它的解释。如果某个单词恰好在一个链接里，你则需要把鼠标悬停在它上面并且等一会，相应的解释也会弹出。

![image](https://user-images.githubusercontent.com/288207/85425837-4aabd900-b5ac-11ea-8695-5f0bbd0f9bbe.png)

对于PDF文件，你则需要双击某个单词选中它，以获取它的解释。

![image](https://user-images.githubusercontent.com/288207/85875697-344d8980-b807-11ea-9e59-97d28d91f467.png)

这个功能默认情况下是对所有网站都启用的，你可以在`chrome://settings/content/dict`来自定义在哪些网站是否打开。此外，你可以按住`Alt`来临时切换这个设置，比如，你在[https://www.quora.com](https://www.quora.com)禁用点击获取解释的功能，但如果你点击某个单词的同时按住了`Alt`，该单词的解释同样会被弹出。

### 在地址栏里查单词

你需要按`d `（d加空格）来激活它，这样做是避免破坏网址的自动匹配功能。比如，你在地址栏里输入`d smi`，地址栏的匹配会变成这样（注意除了d加空格你至少输入3个字符才会弹出匹配结果）。

![image](https://user-images.githubusercontent.com/288207/85426910-acb90e00-b5ad-11ea-943e-970240c0eead.png)

### 查询历史

在地址栏输入`chrome://dictorium/`，你会看到所有查阅过的单词。
![image](https://user-images.githubusercontent.com/288207/104154783-b8bcce00-5420-11eb-900a-cc28aed74e98.png)
