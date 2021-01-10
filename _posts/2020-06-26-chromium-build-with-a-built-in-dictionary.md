---
layout: post
title: Chromium build with a built-in dictionary
category: en
---

{{ page.title }}
================

A useful feature has been implemented in Chromium now, which is to click to translate, though there are many extensions created for this, their user experiences are not good:

* Extensions mostly depend on some external translation service, which brings network issues such as service unavailable or network latency etc. It does hurt user experiences even in nowadays that 5G is coming.
* They just do not work on some sites, especially for PDF files.

From [chromium_release - OneDrive](https://1drv.ms/u/s!AtpOdm9tOTsajTM-iSDL6dhnb46o?e=zkVgua),

1. Download `Chromium_installer.exe` for Windows, or `Chromium.dmg` for MacOS.
1. Download a dictionary file -- dictorium.db(the one from above link is just a English-Chinese dictionary). You could build one with [SqliteDictBuilder](https://github.com/brookhong/SqliteDictBuilder) if you can not find a proper one.

### Install dictionary

Just put the dictionary -- a DB file named `dictorium.db` under your `Downloads` folder such as `~/Downloads/` for MacOS. You could customize the path if you prefer to a different one on `chrome://settings/dict`.

### Quick translation anywhere

You can click on any word on any page to get its translation from your installed dictionary. If the word is in some link, mouseover the word and wait for a while. The translation for the target word will be fetched then displayed in a popover as below.

![image](https://user-images.githubusercontent.com/288207/85425837-4aabd900-b5ac-11ea-8695-5f0bbd0f9bbe.png)

It also works for built-in PDF viewer from Chromium itself, but you need doubleclick a word to select it to get its translation.

![image](https://user-images.githubusercontent.com/288207/85875697-344d8980-b807-11ea-9e59-97d28d91f467.png)

This feature is turned on for all sites by default, you can customize it on `chrome://settings/content/dict`. You can hold `Alt` key to flip the switch, for example, you have disabled the feature on https://www.quora.com/, you can still click a word(or mouseover a word in a link) to get translation by holding `Alt` key.

### Query in address bar

You need input `d `(d followed with a space) to activate it first, as it helps to avoid breaking default matching for URLs. For example, input `d smi` in address bar brings me this with fuzzy lookup, which is triggered after 3 letters input except the activation code `d `.

![image](https://user-images.githubusercontent.com/288207/85426910-acb90e00-b5ad-11ea-943e-970240c0eead.png)

### Query history

Access `chrome://dictorium/`, you could find all history of dictorium query.
![image](https://user-images.githubusercontent.com/288207/104154783-b8bcce00-5420-11eb-900a-cc28aed74e98.png)
