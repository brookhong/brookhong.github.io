---
layout: post
title: Use VIM as a quick launcher
category: en
---

{{ page.title }}
================

[k.vim](https://github.com/brookhong/k.vim) provides an extension of ctrlp, so that you convert VIM into a quick launcher like [Find and Run Robot (FARR)](http://www.donationcoder.com/Software/Mouser/findrun/index.html) or launchy. And I prefer it to other options, as it's more flexible and intuitive.

You edit the list file (by default `~/.ctrlpk`) to put all your favorite commands by specifying their full paths, with each whole command in one line.
Place a `!` at the start of a line to keep scratch window open for that command.

1. Install [ctrlp.vim](https://github.com/kien/ctrlp.vim)
1. Install [k.vim](https://github.com/brookhong/k.vim)
1. Enable k.vim extension for ctrlp

        let g:ctrlp_extensions = ['k']
        nnoremap <silent> <leader>qe :CtrlPK<CR>
        " let g:ctrlp_k_favorites = '/path/to/your/list' " if you don't like the default path


Demo screencast.

![k.vim](/assets/images/klauncher.gif)
