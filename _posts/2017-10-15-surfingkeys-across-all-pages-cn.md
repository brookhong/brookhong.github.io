---
layout: post
title: 在Chrome禁用的页面使用Surfingkeys
category: cn
---

{{ page.title }}
================

当你碰到下面这些页面时，可能会有点恼火，因为在这些页面所有快捷都不能用。

* Chrome自带的页面，如`chrome://extensions/`
* 谷歌扩展商店，https://chrome.google.com/webstore/category/extensions
* 其它扩展提供的页面，如`chrome-extension://youmaygetannoyingwhenyoucometobe/options.html`

出现这种情况是因为Chrome浏览器禁止在这些页面加载任何普通扩展程序。
我下载了Chromium源码，给程序打了个补丁，单独放开了对Surfingkeys的限制，这样你就可以随处使用它了。

另外，给Chromium增加了内嵌字典功能，请看[自带字典的Chromium浏览器](https://brookhong.github.io/2020/06/26/chromium-build-with-a-built-in-dictionary-cn.html)

在[这里](https://pan.baidu.com/s/1KQ5B298a7XCEQEIIR5u39A#list/path=%2Fchromium_release)（提取码: 4d3u）下载（Windows系统用户请下载Chromium_installer.exe，MacOS系统用户请下载Chromium.dmg）。

## 截屏

![image](https://user-images.githubusercontent.com/288207/31577261-c7ca6e1c-b0d0-11e7-9da1-c4c0732214de.png)
![image](https://user-images.githubusercontent.com/288207/31435705-282aaf70-ae46-11e7-8487-1792bdd5fd2c.png)
