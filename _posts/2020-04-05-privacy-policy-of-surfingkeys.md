---
layout: post
title: Privacy Policy of Surfingkeys
category: en
---

{{ page.title }}
================
Surfingkeys is an extension(addon) for Chromium based browsers(Google Chrome and Microsoft Edge), Firefox based browsers(Firefox), and Safari. It provides vim like keybindings for user to navigate the web with those browsers.

The extension is an open-sourced software developed by [Brook Hong](https://github.com/brookhong/Surfingkeys). The basic functions are similar across all browsers, but there are some differences, see [feature availability](https://github.com/brookhong/Surfingkeys#feature-availability)

## Permissions

In order to perform actions with shortcuts, the extension will request below permissions.

* `tabs` for tab operations with shortcuts.
* `history` to quickly launch URL from history with Omnibar
* `bookmarks` to quickly launch URL from bookmarks with Omnibar
* `storage` to store query history/vim-like marks.
* `sessions` to create/list/open sessions from Omnibar.
* `downloads` to close download shelf with shortcut.
* `topSites` to quickly launch URL from topSites with Omnibar.
* `clipboardRead` to launch URL form clipboard.
* `clipboardWrite` to copy page URL/title with shortcut, copy selection in visual mode.
* `proxy` for the extension to quickly switch proxy.
* `nativeMessaging` for the extension to talk with local neovim instance. With this permission, it does not mean the extension can read any data on your computer. Basically it can only exchange message with the program you designate(for Surfingkeys, it should be neovim) in a local JSON file, see [how](https://github.com/brookhong/Surfingkeys/blob/master/src/nvim/server/Readme.md). If you don't set up the local JSON file, the extension can do NOTHING even with the permission granted. Learn more about [native messaging](https://developer.chrome.com/docs/apps/nativeMessaging/).

## Data collection

The extension does not collect any data except on the built-in pages from the extension itself with Chromium bases browsers, the built-in pages are:

* <EXTENSION_BASE>/pdf_viewer.html
* <EXTENSION_BASE>/start.html
* <EXTENSION_BASE>/markdown.html
* <EXTENSION_BASE>/options.html

The collected data contains only the URLs of those pages, only for the purpose of which built-in pages should be kept or removed from this extension.

## Contact Information

Create a [New Issue](https://github.com/brookhong/Surfingkeys/issues/new) for me.
