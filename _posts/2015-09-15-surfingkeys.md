---
layout: post
title: Surfingkeys -- A better alternative for vimium or cVim
category: en
---

{{ page.title }}
================

[Surfingkeys -- expand your browser with javascript and keyboard](https://github.com/brookhong/Surfingkeys)

[Demo on youtube](https://www.youtube.com/watch?v=ROqfE9d7Iwo&feature=youtu.be)

About two years ago, I post a question -- [What else tools that can help one like VIM?](http://www.linkedin.com/grp/post/154653-119166234#commentID_discussion%3A119166234%3Agroup%3A154653) on linkedin.com.

My list does not change much, it still looks like below

* vim
* git
* chrome

But there are some changes,

* DiffMerge is not in the list anymore, as I'm getting happy with vim diff.
* chrome is getting firm in the list.

When it comes to chrome, we must talk about chrome extension. I may give my list of chrome extensions some day in future. There are some extensions that brings the vim spirit to chrome. I used [philc/vimium](https://github.com/philc/vimium) for almost one year, then I switched to [1995eaton/chromium-vim](https://github.com/1995eaton/chromium-vim) for half a year.

I'm almost happy with them, but as more and more of my daily tasks need to be done in chrome. I need a better extension which can do what I want simply by pressing some keystrokes, that looks more like map key in vim.

vimium supports map key customization, but the target actions are limited. cVim tries to simulate vimL, with a strange grammar, not even to say the [neovim](https://github.com/neovim/neovim) project is trying to deprecate vimL. And those makes me hard to map a key to my own javascript function.

Javascript is good enough for users to create their own mappings, I don't bother to create a lame script language, which are painful for both me and the users. Thus essentially I created an extension -- [Surfingkeys](https://github.com/brookhong/Surfingkeys) which does the job below:

    mapkey('c-y', 'Show me the money', function() {
        alert('a well-known phrase uttered by characters in the 1996 film Jerry Maguire');
    });

The first parameter is the keystroke, the second is a help message that describes the action, which will also be displayed in help popover.And the third is what you want the keystroke to trigger, it can be a snippet of Javascript code or a Javascript function.

Most features from vimium or cVim are implemented by adding a `mapkey` call in settings, which is totaly described in javascript. These features are:

* scroll in page
* follow links
* history forward/backward
* switch/close/restore/duplicate tab
* open urls from bookmarks/history
* open search engines

Besides that, Surfingkeys provides some of my favorite features.

## Search selected with

I like this feature from when I was using Firefox. For both Firefox and Chrome, the extensions make it through context menu. Surfingkeys makes it through key mappings. By default, when you press `sg` in normal mode, it will search selected text with google, if there is none selected, it will search text from system clipboard with google. In visual mode, it will search selected text with google.

The `g` in `sg` is a search alias for google, there are some other built-in search aliases -- like `w` for bing. So press `sw` to search selected with bing. Refer to [Add search alias to omnibar](https://github.com/brookhong/Surfingkeys#add-search-alias-to-omnibar) to add your own search alias, especially those search engines for company inside.

## The vim-like marks

You can create vim-like marks by pressing `m`, followed by a word character(0-9, A-Z, a-z), used as mark name. For example, if you press `ma` on this page, you'll create a mark named `a` which points to this page. Then pressing `'a` anywhere, you'll jump to this page.

It's a faster bookmark.

## A better bookmark finder

You can find what you want by typing something, also can navigate into a bookmark folder, and search in it.

## A large cursor in visual mode

The cursor is made large for visibility, as sometimes it's not easy for human to locate a normal cursor on a web page.
