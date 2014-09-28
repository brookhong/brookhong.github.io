---
layout: post_cn
title: 基于github gist的跨机器剪贴板
category: cn
---

{{ page.title }}
================

几年前流行这样一个笑话：“是这样的张总, 您在家里的电脑上按了ctrl+c，然后在公司的电脑上再按ctrl+v是肯定不行的。即使同一篇文章也不行。不不，多贵的电脑都不行。“

[cloudboard.vim](https://github.com/brookhong/cloudboard.vim)帮助vim实现这样一个笑话一样的功能。
在家里的机器上复制一段文本到某个云剪贴板，回到办公室从该云剪贴板里粘贴。

### 安装
vim本身必须支持python, 可以使用命令`:python print 'hello'`试试。

    Bundle 'brookhong/cloudboard.vim'

### 使用方法

1. 运行命令`:CBInit`设置你的云剪贴板。

1. `v`进入选择模式，选中你要复制的内容，运行命令`:CBYank 0`把选中的内容复制到0号云寄存器。

    ![cbyank](/assets/images/cbyank.gif)

1. 在另一台机器上打开vim，执行命令`:CBPut 0`粘贴0号云寄存器中的内容。

    ![cbput](/assets/images/cbput.gif)

#### 关于云寄存器

编号从0开始，你可以使用任意编号，比如：

    :CBYank 5
    :CBPut 5

`:CBList`可以把所有寄存器中的内容列出来。

#### 关于云寄存器的自动清空

`:CBAutoClear 2`可以开关2号云寄存器的自动清空。

当自动清空打开时，寄存器中的内容一旦被读取，就会自动清空，下次再执行`:CBPut 2`的时候粘贴不了任何内容。

#### 关于云文件

    :CBSave test.c      把选中的内容保存到云文件test.c。
    :CBLoad test.c      读取云文件test.c到当前buffer。
    :CBRm test.c        删除云文件test.c。
    :CBListFiles        列出所有的云文件。

读取云文件需要两次对GITHUB的请求，所以相对云寄存器较慢。但当你希望长久保存某段文字，或者内容很长时，最好使用云文件。

#### 推荐设置

    nnoremap <space>p :CBPut 
    vnoremap <space>y :CBYank 
