---
layout: post
title: Address bar with vim support in Chrome
category: en
---

{{ page.title }}
================


[Surfingkeys](https://github.com/brookhong/Surfingkeys) provides a mimic address bar with vim support, so that you could edit URL with vim for navigation in Chrome.

Surfingkeys achieves that by providing an embeded vim editor, which mimics address bar. All lines in buffer of the opened editor will be treated as URL input, which will be opened in tabs after you closed the editor by pressing `Enter` or `:wq`.

There are two ways to activate the mimic address bar.

1. `su` to open it with current url in buffer
![su](https://cloud.githubusercontent.com/assets/288207/25035930/47fe1b4e-2123-11e7-8607-1a35815c3676.gif)

1. `Ctrl-i` from Omnibar to open it with selected URL in buffer
![ctrl_i](https://cloud.githubusercontent.com/assets/288207/25035938/545b1ab8-2123-11e7-821c-8b049cfb2cc0.gif)
