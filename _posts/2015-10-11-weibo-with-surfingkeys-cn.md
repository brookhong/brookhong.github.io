---
layout: post_cn
title: Surfingkeys可以这样帮你看微博上的图片视频
category: cn
---

{{ page.title }}
================

用键盘打开链接，这个功能是Surfingkeys/vimium这类插件最基本的功能，这个功能有个非常贴切的中文名称————`拨号`，我也是从v2ex的一个用户那学来的。但是微博上的图片和视频默认都是收起来的，需要点一下才能打开，看完了，需要点一下`收起`。这个对用键盘上网的人是很痛苦的。

Surfingkeys是这样解决这个问题的。

`se`打开Surfingkeys的设置，在最后插入下面这段设置代码，保存一下。

    mapkey('zz', '收起', "clickOn($('a').regex(/tosmall/i, $.fn.attr, ['action-type']))", 0, /weibo.com/i);
    mapkey('q', '点开微博上的图片/视频', 'Hints.create("div.media_box img", Hints.dispatchMouseClick)', 0, /weibo.com/i);

然后，打开微博，`q`就可以选择打开你想看的图片或者视频了，看完了`zz`一下收起。

上面的代码就调用了两次`mapkey`设置了两个按键————`zz`和`q`，最后一个参数说明了这两个按键只对`weibo.com`有效。


下面的两个设置我在百度随心听上用来切歌的，

    mapkey(']]', '下一首', 'clickOn("li.fm-next a")', 0, /fm.baidu.com/i);
    mapkey('[[', '上一首', 'clickOn("div.pre-img-wrapper p")', 0, /fm.baidu.com/i);
