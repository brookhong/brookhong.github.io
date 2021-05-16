---
layout: post
title: Brook的Chromium浏览器
category: cn
---

{{ page.title }}
================
几年前我就开始使用自己编译的Chromium，最近我发现自己已经离不开它了，也值得自己花时间去维护一个自己编译的版本，相信有些朋友也在用我编译的Chromium。目前我在我的发行版里实现了三个功能，不幸的是，这些改动是不会有机会进入Chromium的官方发行版的，因为有人会有些安全方面的担忧或者觉得浏览器不应该提供这些功能。如果您恰好需要这些功能，请把这个页面加入您的收藏夹并不时回来看看是否有最新版发布。我也可能会加入更多的独家特性，也欢迎您提建议，只是您提的功能需求必须是官方不太可能接受的但又的确能帮助很多人。同时也请注意在Chromium这样一个巨大的项目里实现一个新功能是很花时间和精力的，所以您的建议需要经过认真考虑并耐心等待。

## 下载
点[这里](https://pan.baidu.com/s/1KQ5B298a7XCEQEIIR5u39A#list/path=%2Fchromium_release)（提取码: 4d3u），根据你的操作系统选择相应的文件，Windows选择Chromium_installer.exe，Mac选择Chromium.dmg，Linux选择Chromium.deb。

## 在Chrome禁用的页面使用Surfingkeys

这个功能允许在禁用Chrome插件的页面上使用Surfingkeys，比如

* Chrome自带的页面，如`chrome://extensions/`
* 谷歌扩展商店，https://chrome.google.com/webstore/category/extensions
* 其它扩展提供的页面，如`chrome-extension://youmaygetannoyingwhenyoucometobe/options.html`

这样你就可以在浏览器中的所有标签页上无障碍的使用键盘操作了。这个改动默认只允许Surfingkeys，如果您不用Surfingkeys，这个改动对你来说相当于没用，它也不会给权限给其他任何插件。

另外关于这个功能提供了一个命令行参数`--whitelisted-extension`，这样你就可以放行其它插件，比如`--whitelisted-extension=dbepggeogbaibhgnhhndojpepiihcmeb` 就可以允许`vimium` 在这些被禁用的页面上使用了。

![Surfingkeys_on_webstore](https://user-images.githubusercontent.com/288207/31577261-c7ca6e1c-b0d0-11e7-9da1-c4c0732214de.png)
![Surfingkeys_on_extensions](https://user-images.githubusercontent.com/288207/31435705-282aaf70-ae46-11e7-8487-1792bdd5fd2c.png)

## 按Ctrl-L (Command -L on Mac) 两次把焦点定位到页面上

使用各类像Surfingkeys/Vimium这样的键盘浏览插件，你必须先把焦点定位到页面上，否则大多数按键是不会生效的。[这个页面](https://brookhong.github.io/2018/11/18/bring-focus-back-to-page-content-from-address-bar.html)为Google Chrome提供了一些解决方法，有些不够直接。

而现在的这个功能就是让你无需特别设置直接通过`Ctrl-L`把焦点定位到页面上，第一次按`Ctrl-L`定位到地址栏，再按一次`Ctrl-L`就定位到页面，基本上`Ctrl-L`就变成了一个可以在地址栏和页面来回切换焦点的快捷键。

## 把`Ctrl-N`当`↓`，把`Ctrl-P`当`↑`

这是个小特性，但很容易让人上瘾。Mac下如果你在Chrome的地址栏里输点东西，就会列出些自动匹配的网址提示，你可以按上下箭头来选择其中一个，也可以按`Ctrl-N`或`Ctrl-P`按来切换。如果你习惯了，你会发现这两组合键其实更方便。但当你换到Windows或者Linux系统之后，再按`Ctrl-N` ，它却不是选择下一个，而是打开一个新窗口，`Ctrl-P`也不是你想要的选择前一个。

浏览器中这种情况其实很挺多的，比如，你在搜索引擎的输入框里输点啥也会有提示，如果你启用表单的自动填充那些普通的输入框也会有提示。但即便是在Mac下，这些情况下也只能用上下箭头来选择，当然在Windows和Linux下`Ctrl-N`或`Ctrl-P`也是不能用的。你可以通过[Surfingkeys的一段配置](https://brookhong.github.io/2019/04/15/ctrl-p-and-ctrl-n-for-google.html)部分达到用`Ctrl-N`或`Ctrl-P`来切换前后一个的效果，但这个方法不是通用的，那段脚本只能在Mac下能用，因为在Windows和Linux下`Ctrl-N`/`Ctrl-P`这两组合键都是Chrome默认的组合键。即使是Mac下，这段脚本也适用于Google的输入框，对于其他搜索引擎还得做些改动。而对于那些普通输入框的自动填充提示，光靠JS是无法做到通过`Ctrl-N`/`Ctrl-P`来选择前后一个的，因为这些提示项就不是在JS的环境下生成的。

这个特性就是在以上场景下把`Ctrl-N`当`↓`、把`Ctrl-P`当`↑`，不需要任何JS脚本，当然也不需要安装Surfingkeys。浏览器里默认就支持，你也可以设置成仅当焦点在输入框时才启用这个特性。
![ctlr_n_settings](https://user-images.githubusercontent.com/288207/114701622-a1f68200-9d55-11eb-929b-894148e19bfb.png)

## 内嵌词典Dictorium

这个功能默认是关闭的，只有当你在指定目录（默认就是你的下载目录，也可以通过`chrome://settings/dict`指定你的词典路径）放一个名为`dictorium.db`的词典文件，才会开启。[这里](https://pan.baidu.com/s/1KQ5B298a7XCEQEIIR5u39A#list/path=%2Fchromium_release)有个制作好的供您下载，不过它就是一个英汉词典。如果找不到合适的，你可以用[SqliteDictBuilder](https://github.com/brookhong/SqliteDictBuilder)制作自己的词典。
之后按住`Alt`然后点击任意页面上的某个单词，就可以看到下面这样的小窗口，对于链接中的单词，你需要把鼠标在某个单词上面停一会，因为点击会直接打开对于的链接。

![translation_in_popup](https://user-images.githubusercontent.com/288207/112706205-a4e01e80-8edd-11eb-90e0-9bd79b750308.png)

小窗口的右上角有三个图标，第一个是在新的标签页中打开当前翻译，第二个是一个开关——是否在小窗口弹出时播放单词发音，第三个是打开查询历史。

你可以到`chrome://settings/content/dict`把其中的开关切到`允许`，这样你在点击单词获取翻译时就不需要按住`Alt`键了。或者按站点自定义，你只在那些禁用的站点上需要按住`Alt`键，在那些允许的站点上直接单击就可以（实际上按住`Alt`键能起一个相反的效果，也就是说在那些允许的站点按住`Alt`键单击能阻止翻译小窗口弹出）。比如，下面的设置，你在`quora.com`和`github.com`只需要单击就可以获取翻译，而在`github.com`需要按住`Alt`键单击才行。

![settings_by_site](https://user-images.githubusercontent.com/288207/114702714-ff3f0300-9d56-11eb-96cd-e73129a9f13f.png)

你点击过的单词会被存在查询历史里，你可以通过`chrome://dictorium-history/`查看。在这个页面上你可以复习这些单词，还可以让Dictorium通过TTS引擎帮你朗读。

![dictorium_history](https://user-images.githubusercontent.com/288207/114702080-2f39d680-9d56-11eb-9c38-37c06d16b9f0.png)

Dictorium内嵌词典支持PDF。
![dictorium_on_pdf](https://user-images.githubusercontent.com/288207/113555557-b20fb280-962d-11eb-8dab-dd0a72ce1a4e.png)

Dictorium支持直接在地址栏里查单词。你需要按`d `（d加空格）来激活它，这样做是避免破坏网址的自动匹配功能。比如，你在地址栏里输入`d smi`，地址栏的匹配会变成这样（注意除了d加空格你至少输入3个字符才会弹出匹配结果）。
![query_in_address_bar](https://user-images.githubusercontent.com/288207/85426910-acb90e00-b5ad-11ea-943e-970240c0eead.png)

Dictorium也已和Surfingkeys集成，Surfingkeys的`Q`能直接调用Dictorium内嵌词典。
