---
layout: post
title: 如何使用键盘把输入焦点从地址栏移到页面上
category: cn
---

{{ page.title }}
================

使用Surfingkeys（或者Vimium）时，输入焦点必须在页面上，插件提供的快捷键才能生效，有时输入焦点跑到地址栏去了，怎样通过按键把输入焦点弄回页面是个问题。

其实网上已经有些解决办法了，
1. 在[chrome://settings/searchEngines](chrome://settings/searchEngines)添加一个假的搜索引擎，如下，这样输入定义的关键字（如`;`）再回车，输入焦点就回到页面了。
![image](https://user-images.githubusercontent.com/288207/48667866-2c9e0d00-eb1b-11e8-9b06-afdef1993320.png)

    下面这些地方都提到了这个方法：

    * https://superuser.com/questions/324266/google-chrome-mac-set-keyboard-focus-from-address-bar-back-to-page
    * https://github.com/philc/vimium/issues/840

1. 还有一个方法就是直接使用`Tab`键，但它会把地址栏后面的各种插件图标逐个走个遍，也就是说你可能需要按好几次`Tab`键才能聚焦到页面上。幸运的是在chromium-dev google group [tapted 提到了一个好办法可以在Mac下避免走遍地址栏后面的各类图标](https://groups.google.com/a/chromium.org/forum/#!msg/chromium-dev/-15pKoT9HMM/RKdxVD7-BwAJ)。

    > If macOS `System Preferences` -> `Keyboard` -> `Shortcuts` -> `Full Keyboard Access` is set to "Text boxes and lists only", then Tab from the omnibox should go to the web page.

个人喜欢第二个方法，毕竟更快捷。
