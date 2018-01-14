---
layout: post
title: Chrome与Firefox的简单比较
category: cn
---

{{ page.title }}
================

这段时间我把[Surfingkeys](https://github.com/brookhong/Surfingkeys)移植到Firefox，了解到一些东西，这里对这两个浏览器做些简单的比较。这里不涉及到Firefox 57之前的版本，因为我在此之前已经很长时间没用Firefox了。

| | Chrome(63) | Firefox(57) |
|:|
| 扩展／插件 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 开发者工具 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| PDF查看 | ⭐⭐ | ⭐⭐⭐⭐ |
| 健壮性／性能 | ⭐⭐⭐⭐ | ⭐⭐⭐ |


# 扩展

在这一点，Chrome无论从数量还是质量上都明显胜出。Chrome提供一套API的事实标准，它的实现也明显比Firefox更加完善／稳定。

在AMO上发布一个Firefox插件，需要经过一批认证过的人员审核，这引起过一些利益相关（或是实现偏好）的[争议](https://discourse.mozilla.org/t/how-does-review-of-addons-works-and-why-you-dont-need-to-write-add-ons-for-firefox/11980)。在Chrome网上商店相对简单，每个用户都可以评论／举报。

# 开发者工具

Chrome的开发者工具强得不是一星半点。

用Chrome，你可以在top window / frame / 扩展的上下文环境里设置断点、声明／查看变量。而在Firefox里，为扩展设置的断点有时根本不管用，有时需要把开发者工具先打开再刷新下页面才行，有时一刷新页面，断点会跳到其它行。

同时用Firefox，你无法在扩展上下文环境里的声明／查看变量，请参考[How to access add-on content script in Firefox console?](https://stackoverflow.com/questions/42571706/how-to-access-add-on-content-script-in-firefox-console)。你甚至无法从UI上区分哪个是top window，哪个是frame。

## Chrome的开发者工具
![image](https://user-images.githubusercontent.com/288207/34869456-e93d7f48-f7c1-11e7-944d-07b62e5e07ba.png)

## Firefox的开发者工具
![image](https://user-images.githubusercontent.com/288207/34869496-0efcb64a-f7c2-11e7-8995-951723b40aa4.png)

并且当开发者工具打开时，Firefox的页面加载变得很慢／很耗CPU。Firefox 57所谓的快也只是在某些场合下快。

# PDF查看

这一点，Firefox却明显胜过Chrome。为什么呢？因为Chrome的所有插件碰到PDF文档时会失效或部分失效，而Firefox的插件在面对PDF文档时基本都能正常工作。

# 健壮性／性能

不在完整的用户场景下比较性能，其实没啥意义，就是跑个分而已。如今，大多数桌面电脑的硬件性能并不差，稳定／耐操比速度更能影响用户心情，所以我的评价是基于个人体验，而不是任何一种测试工具。
