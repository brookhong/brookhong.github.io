---
layout: post
title: Chrome扩展Surfingkeys的VIM会话
category: cn
---

{{ page.title }}
================

这篇文章是关于[Surfingkeys -- Chrome VIM扩展](https://chrome.google.com/webstore/detail/surfingkeys/gfbliohnnapiefjpjlpjnehglfpaknnc)的VIM会话

在详细说明之前，让我们先感受一下。

* 在任何一个页面按`ZZ`，会关掉所有标签页并退出。
* 别紧张，重新打开Chrome，点击一下新标签页的空白处让页面获得焦点，然后按下`ZR`，你会看到所有刚才关掉的标签页又都打开了。

这就是Surfingkeys为Chrome带来的vim会话。

现在让我们看看更多细节，按`se`打开设置，然后按`ff`打开Default mappings，你会看到以下设置：

    mapkey('ZZ', 'Save session and quit', function() {
        RUNTIME('createSession', {
            name: 'LAST'
        });
        RUNTIME('quit');
    });
    mapkey('ZR', 'Restore last session', function() {
        RUNTIME('openSession', {
            name: 'LAST'
        });
    });
    mapkey('ZQ', 'Quit', function() {
        RUNTIME('quit');
    });

`ZZ`会保存所有当前标签页到一个名为`LAST`的会话，然后退出。
`ZR`恢复名为`LAST`的会话。
`ZQ`就只退出，不保存当前会话。

用Surfingkeys在Chrome里保存会话相当于保存所有标签页的地址，打开会话则相当于在不同的标签页中打开所有保存其中的网页地址，所以会话基本上就是一个网页地址列表，每个会话有自己的名字。

你可以在命令模式下创建／管理多个不同名称的会话。按`:`打开命令窗口，然后输入:

    createSession works

就会创建一个名为`works`的会话，要打开该会话使用如下命令：

    openSession works

列出已保存的所有会话：

    listSession

删除某个会话：

    deleteSession works
