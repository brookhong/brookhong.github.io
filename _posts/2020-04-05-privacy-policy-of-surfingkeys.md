---
layout: post
title: Privacy Policy of Surfingkeys
category: en
---

{{ page.title }}
================
Surfingkeys is an extension(addon) for Chromium based browsers(Google Chrome and Microsoft Edge) and Firefox based browsers(Firefox), it provides vim like keybindings for user to navigate the web with those browsers.

The extension is an open-sourced software developed by [Brook Hong](https://github.com/brookhong/Surfingkeys), distributed to end users for free. The basic functions are same across all browsers with some extra functions removed from Firefox version.

The extra functions(which may be changed in future) include:

* PDF viewer
* Mermaid diagram generator

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
* `webRequest*` for the extension to intercept network errors to display built-in page to toggle proxy.
* `proxy` for the extension to quickly switch proxy.

## Data collection

The extension does not collect any data except on the built-in pages from the extension itself with Chromium bases browsers, the built-in pages are:

* <EXTENSION_BASE>/pdf_viewer.html
* <EXTENSION_BASE>/start.html
* <EXTENSION_BASE>/markdown.html
* <EXTENSION_BASE>/mermaid.html
* <EXTENSION_BASE>/options.html

The collected data contains only the URLs of those pages, only for the purpose of which built-in pages should be kept or removed from this extension.

## Contact Information

Create a [New Issue](https://github.com/brookhong/Surfingkeys/issues/new) for me.
