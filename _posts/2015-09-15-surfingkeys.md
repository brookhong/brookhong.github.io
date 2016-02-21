---
layout: post
title: Surfingkeys -- A better alternative for vimium or cVim
category: en
---

{{ page.title }}
================

[Surfingkeys -- expand your browser with javascript and keyboard](https://github.com/brookhong/Surfingkeys)

[Demo on youtube](https://www.youtube.com/watch?v=ROqfE9d7Iwo&feature=youtu.be)

About two years ago, I posted a question -- [What else tools that can help one like VIM?](http://www.linkedin.com/grp/post/154653-119166234#commentID_discussion%3A119166234%3Agroup%3A154653) on linkedin.com.

My list does not change much, it still looks much like below:

* vim
* git
* chrome

But there are some changes,

* DiffMerge is not in the list anymore, as I'm getting more used to vim diff.
* chrome is still firmly in this list.

When it comes to chrome, we must talk about a particular chrome extension. I may list my favorite chrome extensions someday but there are some particulare extensions that brings the vim spirit to chrome. I used [philc/vimium](https://github.com/philc/vimium) for almost one year, then I switched to [1995eaton/chromium-vim](https://github.com/1995eaton/chromium-vim) for half a year.

I'm almost happy with these two but as more and more of my daily tasks need to be done in chrome, I need a better extension.
An extension which can do what I want simply by pressing some keystrokes, that looks more like map key in vim.

vimium supports map key customization, but the target actions are limited. cVim tries to simulate vimL with a strange grammar (simulating
vimL may not even be a good idea because the [neovim](https://github.com/neovim/neovim) project is trying to deprecate vimL).
These things make it hard, for example, to map a key to a javascript function I've made.

Javascript is good enough for users to create their own mappings.  I don't need to create another lame scripting language, which is painful for both me and the users.
So I created an extension -- [Surfingkeys](https://github.com/brookhong/Surfingkeys) which works like this:

    mapkey('c-y', 'Show me the money', function() {
        alert('a well-known phrase uttered by characters in the 1996 film Jerry Maguire');
    });

The first parameter is the keystroke, the second is a help message that describes the action, which will also be displayed in help popover.
The third parameter is what you want the keystroke to trigger, it can be a snippet of Javascript code or a Javascript function.

Most features from vimium or cVim are implemented by adding a `mapkey` call in settings, which is totaly described in javascript. These features are:

* scroll page
* follow links
* history forward/backward
* switch/close/restore/duplicate tab
* open urls from bookmarks/history
* open search engines

Besides that, Surfingkeys provides some of my favorite features.

### Search selected with

I like this feature from when I was using Firefox. For both Firefox and Chrome, extensions are used through a context menu.
Surfingkeys does this through key mappings. By default, when you press `sg` in normal mode, it will search selected text with google, if there is none selected, it will search text from system clipboard with google. In visual mode, it will search selected text with google.

The `g` in `sg` is a search alias for google, there are some other built-in search aliases -- like `w` for bing. So press `sw` to search selected with bing. Refer to [Add search alias to omnibar](https://github.com/brookhong/Surfingkeys#add-search-alias-to-omnibar) to add your own search alias, useful for internal company search engines.

### The vim-like marks

You can create vim-like marks by pressing `m`, followed by a word character(0-9, A-Z, a-z), used as a marker. For example, if you press `ma` on this page, you'll create a mark named `a` which points to this page. Then pressing `'a` anywhere, you'll jump to this page.

Essentially, it's a faster bookmark.

### A better bookmark finder

You can find what you want by typing something, also can navigate into a bookmark folder, and search in it.

### A large cursor in visual mode

The cursor is made large for visibility, as sometimes it's not easy for human to locate a normal cursor on a web page.


## Shortcuts reference

The default shortcuts are created per the rules:

* easy for one hand(left)
* respect famous binding from VIM
* first letter of words

### sessions

        ZQ       Quit
        ZZ       Save session and quit
        ZR       Restore last session

### tabs

        T        Choose a tab
        E        Go one tab left
        R        Go one tab right
        B        Go one tab history back
        F        Go one tab history forward
        alt-p    pin/unpin current tab
        x        Close current tab
        X        Restore closed tab
        yt       Duplicate current tab
        on       Open Chrome newtab
        g0       Go to the first tab
        g$       Go to the last tab
        <<       Move current tab to left
        >>       Move current tab to right

### scroll

        e        Scroll a page up
        d        Scroll a page down
        j        Scroll down
        k        Scroll up
        h        Scroll left
        l        Scroll right
        G        Scroll to the bottom of the page
        gg       Scroll to the top of the page
        zH       Scroll all the way to the left
        zL       Scroll all the way to the right
        cs       Change scroll target

### mouse

        gf       Open a link in non-active new tab
        f        Open a link
        af       Open a link in new tab
        alt-f    Open multiple links in a new tab
        q        Click on an Image or a button
        i        Go to edit box

### history

        S        Go back in history
        D        Go forward in history

### current page

        r        Reload the page
        gu       Go up one path in the URL
        gU       Go to root of current URL hierarchy
        /        Find in current page
        n        Next found text
        N        Previous found text
        p        Paste html on current page.
        [[       Click on the previous link on current page
        ]]       Click on the next link on current page
        ;m       Mouse out last element
        ;j       Close downloads shelf
        ;p       Paste html on current page
        ;q       Insert jquery library on current page

### clipboard

        ys       Copy current page's source
        yy       Copy current page's URL
        yl       Copy current page's title
        yf       Copy a link URL to the clipboard
        cc       Open selected link or link from clipboard

### omnibar

        t        Open an URLs
        b        Open a bookmark
        ab       Bookmark current page to selected folder
        oh       Open URL from history
        om       Open URL from vim-like marks
        ob       Open Search with alias b
        og       Open Search with alias g
        ow       Open Search with alias w
        ox       Open recently closed
        :        Open commands

### visual mode

        v        Toggle visual mode
        *        Find selected text in current page

### vim-like marks

        m        Add current URL to vim-like marks
        '        Jump to vim-like mark

### frames

        w        Switch frames

### settings

        se       Edit Settings
        sr       Reset Settings

### search selected with

        sg       Search selected with google
        sog      Search selected only in this site with google
        sob      Search selected only in this site with baidu
        sow      Search selected only in this site with bing
        sos      Search selected only in this site with stackoverflow
        soh      Search selected only in this site with github
        sb       Search selected with baidu
        sw       Search selected with bing
        ss       Search selected with stackoverflow
        sh       Search selected with github

### chrome urls

        gb       Open Chrome Bookmarks
        gj       Open Chrome Bookmarks
        gc       Open Chrome Cache
        gd       Open Chrome Downloads
        gh       Open Chrome History
        gk       Open Chrome Cookies
        ge       Open Chrome Extensions
        gn       Open Chrome net-internals
        gs       View page source
        si       Open Chrome Inpect

### usages

        ctrl-i   Show usage
        u        Show usage

### proxy

        spa      set proxy mode `always`
        spb      set proxy mode `byhost`
        spd      set proxy mode `direct`
        sps      set proxy mode `system`
        spi      show proxy info
        cp       Toggle proxy for current site

### Settings with key mappings like vimium

    map('u', 'e');
    mapkey('p', "Open the clipboard's URL in the current tab", function() {
        Normal.getContentFromClipboard(function(response) {
            window.location.href = response.data;
        });
    });
    map('P', 'cc');
    map('gi', 'i');
    map('F', 'af');
    map('gf', 'w');
    map('`', '\'');
    // save default key `t` to temp key `>_t`
    map('>_t', 't');
    // create a new key `t` for default key `on`
    map('t', 'on');
    // create a new key `o` for saved temp key `>_t`
    map('o', '>_t');
    map('H', 'S');
    map('L', 'D');
    map('gt', 'R');
    map('gT', 'E');
    map('K', 'R');
    map('J', 'E');
