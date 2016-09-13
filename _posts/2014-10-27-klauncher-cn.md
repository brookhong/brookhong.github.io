---
layout: post
title: 通过vim快速启动程序
category: cn
---

{{ page.title }}
================

曾经有一阵我很喜欢[Find and Run Robot (FARR)](http://www.donationcoder.com/Software/Mouser/findrun/index.html)，类似的工具还有launchy，后来慢慢的这类软件淡出了我的必选列表。

原因有两点：

1. 常用的软件越来越少，固定到任务栏，然后`win`+数字就解决问题。
1. 越来越懒，不想把所有的exe放在一起，不想安装软件，能copy就copy，能不copy就不copy。

但还是有个把软件偶尔需要启动，下面是我作为一个vimer的解决方案。

1. 安装[ctrlp.vim](https://github.com/kien/ctrlp.vim)
1. 安装[k.vim](https://github.com/brookhong/k.vim)
1. k.vim提供了一个ctrlp的扩展，激活k.vim的ctrlp扩展

        let g:ctrlp_extensions = ['k']
        nnoremap <silent> <leader>qe :CtrlPK<CR>

然后看图。

![k.vim](/assets/images/klauncher.gif)

`~/.ctrlpk`文件里的内容，每一行就是一条命令，如果你希望命令执行的结果保留在scratch窗口里，在行首加上`!`。

如果不想使用home目录下的文件，可以设置

    let g:ctrlp_k_favorites = '/path/to/your/list'
