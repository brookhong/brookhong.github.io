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

    mapkey('<Ctrl-y>', 'Show me the money', function() {
        Normal.showPopup('a well-known phrase uttered by characters in the 1996 film Jerry Maguire (Escape to close).');
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

## VIM editor

Thanks ACE for the vim editor, Surfingkeys integrates ACE for the vim editor. The vim editor is used:

* to edit any input on html page
* to edit URL to open in new tab
* to edit settings

### Edit any input on html page

In normal mode, press capital `I`, then use a hint letter to pick up a input box. A vim editor is opened for you to edit text. The vim editor is opened in lightly different way for `input` and `textarea`.

For `input` element, the vim editor has only one line, you use vim-bindings keys to edit your text, then press `Enter` or `:w` to write your text back to the input element.

For `textarea` element, the vim editor is opened in bigger size, after you complete your edit, then press `Ctrl-Enter` or `:w` to write your text back to the textarea element.

`Esc` or `:q` to quit vim editor without writing text back.

`Tab` completion works with all words on current page, `Space` to choose a match from popup.

If you enter insert mode with `i` or mouse click, you will edit your input in normal way. You could also open vim editor at that time by pressing `Ctrl-i`.

Remember that in insert mode, press `Ctrl-i` to open vim editor.

### Edit URL to open in new tab

`su` to open vim editor to edit current URL, then `Enter` or `:w` to open the input URL, which works just like address bar with vim-binding keys.

`Tab` completion works with all URLs from bookmark/history, `Space` to choose a match from popup.

### Edit settings

`se` to open settings editor, `:w` to save settings.

## Shortcuts reference

The default shortcuts are created per the rules:

* easy for one hand(left)
* respect famous binding from VIM
* first letter of words

### Help

        ?                     Show usage
        <Ctrl-i>              Show usage
        <Ctrl-1>              show pressed key
        u                     Show usage

### Mouse Click

        gf                    Open a link in non-active new tab
        <Alt-f>               Open multiple links in a new tab
        f                     Open a link
        af                    Open a link in new tab
        i                     Go to edit box
        I                     Go to edit box with vim editor
        q                     Click on an Image or a button
        [[                    Click on the previous link on current page
        ]]                    Click on the next link on current page
        ;m                    mouse out last element

### Scroll Page / Element

        cs                    Change scroll target
        gg                    Scroll to the top of the page
        e                     Scroll a page up
        d                     Scroll a page down
        j                     Scroll down
        k                     Scroll up
        h                     Scroll left
        l                     Scroll right
        G                     Scroll to the bottom of the page
        0                     Scroll all the way to the left
        $                     Scroll all the way to the right
        w                     Switch frames

### Tabs

        g0                    Go to the first tab
        g$                    Go to the last tab
        T                     Choose a tab
        <Alt-p>               pin/unpin current tab
        <Alt-m>               mute/unmute current tab
        <<                    Move current tab to left
        yt                    Duplicate current tab
        E                     Go one tab left
        R                     Go one tab right
        on                    Open Chrome newtab
        x                     Close current tab
        X                     Restore closed tab
        >>                    Move current tab to right

### Page Navigation

        su                    Edit current URL with vim editor
        gu                    Go up one path in the URL
        gU                    Go to root of current URL hierarchy
        B                     Go one tab history back
        F                     Go one tab history forward
        S                     Go back in history
        D                     Go forward in history
        r                     Reload the page

### Sessions

        ZQ                    quit chrome
        ZZ                    Save session and quit
        ZR                    Restore last session

### Search selected with

        sg                    Search selected with google
        sog                   Search selected only in this site with google
        soG                   Search selected only in this site with google interactively
        sob                   Search selected only in this site with baidu
        soB                   Search selected only in this site with baidu interactively
        sow                   Search selected only in this site with bing
        soW                   Search selected only in this site with bing interactively
        sos                   Search selected only in this site with stackoverflow
        soS                   Search selected only in this site with stackoverflow interactively
        soh                   Search selected only in this site with github
        soH                   Search selected only in this site with github interactively
        sG                    Search selected with google interactively
        sb                    Search selected with baidu
        sB                    Search selected with baidu interactively
        sw                    Search selected with bing
        sW                    Search selected with bing interactively
        ss                    Search selected with stackoverflow
        sS                    Search selected with stackoverflow interactively
        sh                    Search selected with github
        sH                    Search selected with github interactively

### Clipboard

        cc                    Open selected link or link from clipboard
        ya                    Copy a link URL to the clipboard
        ys                    Copy current page's source
        yj                    Copy current settings
        yd                    Copy current downloading URL
        yy                    Copy current page's URL
        yl                    Copy current page's title
        yf                    Copy form data on current page
        ;p                    Paste html on current page

### Omnibar

        ab                    Bookmark current page to selected folder
        t                     Open an URLs
        ox                    Open recently closed URL
        oh                    Open URL from history
        om                    Open URL from vim-like marks
        ob                    Open Search with alias b
        og                    Open Search with alias g
        ow                    Open Search with alias w
        H                     Open opened URL in current tab
        b                     Open a bookmark
        :                     Open commands

### Visual Mode

        v                     Toggle visual mode
        /                     Find in current page
        *                     Find selected text in current page
        n                     Next found text
        N                     Previous found text
        l                     forward character
        h                     backward character
        j                     forward line
        k                     backward line
        w                     forward word
        e                     forward word
        b                     backward word
        )                     forward sentence
        (                     backward sentence
        }                     forward paragraph
        {                     backward paragraph
        0                     backward lineboundary
        $                     forward lineboundary
        G                     forward documentboundary
        gg                    backward documentboundary
        y                     Copy selected text
        *                     Search word under the cursor
        <Enter>               Click on node under cursor.
        sg                    Search selected with google
        sog                   Search selected only in this site with google
        soG                   Search selected only in this site with google interactively
        sob                   Search selected only in this site with baidu
        soB                   Search selected only in this site with baidu interactively
        sow                   Search selected only in this site with bing
        soW                   Search selected only in this site with bing interactively
        sos                   Search selected only in this site with stackoverflow
        soS                   Search selected only in this site with stackoverflow interactively
        soh                   Search selected only in this site with github
        soH                   Search selected only in this site with github interactively
        sG                    Search selected with google interactively
        sb                    Search selected with baidu
        sB                    Search selected with baidu interactively
        sw                    Search selected with bing
        sW                    Search selected with bing interactively
        ss                    Search selected with stackoverflow
        sS                    Search selected with stackoverflow interactively
        sh                    Search selected with github
        sH                    Search selected with github interactively

### vim-like marks

        m                     Add current URL to vim-like marks
        '                     Jump to vim-like mark

### Settings

        se                    Edit Settings
        sr                    Reset Settings

### Chrome URLs

        si                    Open Chrome Inpect
        gb                    Open Chrome Bookmarks
        gc                    Open Chrome Cache
        gd                    Open Chrome Downloads
        gh                    Open Chrome History
        gk                    Open Chrome Cookies
        ge                    Open Chrome Extensions
        gn                    Open Chrome net-internals
        gs                    View page source
        ;j                    Close Downloads Shelf

### Proxy

        cp                    Toggle proxy for current site
        spa                   set proxy mode `always`
        spb                   set proxy mode `byhost`
        spd                   set proxy mode `direct`
        sps                   set proxy mode `system`
        spi                   show proxy info
        sfr                   show failed web requests of current page

### Misc

        ;q                    Insert jquery library on current page

### Insert Mode

        <Ctrl-i>              Open vim editor for current input

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
