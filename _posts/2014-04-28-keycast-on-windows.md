---
layout: post
title: KeyCastOW -- keycast on windows
category: en
---

{{ page.title }}
================

keystroke visualizer for Windows,  lets you easily display your keystrokes while recording screencasts.

* small footprint (one 100kb executable file)
* green and portable, only depends on windows system dlls
* prenty of settings for keystroke display
* hotkey to turn on/off

[download](/assets/downloads/keycastow.zip) | [report issues](https://github.com/brookhong/brookhong.github.io/issues)

## History

### 2014-09-23 2.0.0.3
* fixed bug [Y(offset to left bottom corner) not working in settings](https://github.com/brookhong/brookhong.github.io/issues/8)
* new feature [Display only command keys](https://github.com/brookhong/brookhong.github.io/issues/7)

### 2014-08-27 2.0.0.2
* fixed issue [Doesn't display Shift key](https://github.com/brookhong/brookhong.github.io/issues/5)

![Screencast of keycastow](/assets/images/keycastow_shift.gif)

### 2014-05-26 2.0.0.1
* flicker free
* anti-aliasing rounded corner
* opacity settings for text/background/border
* settings preview in dialog
* branding string on screen
* fixed some bugs

![Screencast of keycastow](/assets/images/keycastow2.gif)
![settings of keycastow](/assets/images/keycastow.png)

### 2014-04-28 1.0.0.1

As MAC user, I use [keycastr](https://github.com/sdeken/keycastr), an open-source keystroke visualizer to create tech demo animation.

I'm also a Windows user, I googled alternatives of keycastr for windows several times.
There are some, but none makes me happy like keycastr from MAC.

Thus one day in March of this year(2014), I finally started my own one -- KeyCastOW, the `OW` after keycast means On Windows.

For some reasons, this is not open-sourced, but it's free.

For demo, here I'm using gVim under Windows with my [vim configuration](https://github.com/brookhong/vimfiles).

My `<leader>` key in VIM is `s`, so don't be surprised when you're seeing my
actions started with `s` in normal mode.
And I do have some window operations started with `<Space>`.

Here we go.

![Screencast of keycastow](/assets/images/keycastow.gif)

The animations are created with [LICEcap](http://www.cockos.com/licecap/)
plus [KeyCastOW](/assets/downloads/keycastow.zip).
