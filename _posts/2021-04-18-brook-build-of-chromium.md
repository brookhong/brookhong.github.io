---
layout: post
title: Brook Build of Chromium
category: en
---

{{ page.title }}
================
Years ago I started to use my own build of Chromium, now it becomes my necessity, it is worthy for me to start to maintain my own release for Chromium, and I believe some of you also love it. Currently there are 3 features added into the build, unfortunately there is no chance for these features to be merged into official repository, since some people may have security concerns for these features or think them not necessary for a Browser. If you love my build of Chromium, please bookmark this page and come back occasionally to check out latest release. I might also add more and more features into the build, your suggestions of new features will also be considered as long as the new features are not accepted by official repository but do really help a lot of users, also keep in mind to add new feature into such a large code base like Chromium takes really a lot of time and effort, so the features you suggested must be deliberated and you need to be patient for them.

## Download
[chromium_release - OneDrive](https://1drv.ms/u/s!AtpOdm9tOTsajTM-iSDL6dhnb46o?e=zkVgua), please download corresponding installer package with your OS, the exe file for Widnows, the dmg file for Mac, and the deb file for Linux.

## Whitelist Surfingkeys on some pages where Chrome extensions are forbidden.

The feature allows Surfingkeys on some pages where Chrome Extensions are forbidden such as

* Chrome built-in pages like `chrome://extensions/`
* Google Webstore https://chrome.google.com/webstore/category/extensions
* Pages from other extensions like chrome-extension://youmaygetannoyingwhenyoucometobe/options.html

So that you could use keyboard to navigate through all the tabs in your browser. The change is limited only to Surfingkeys extension by default, if you don't install Surfingkeys, this change does not make any difference from Chromium official release for you. It will not leak any permission to other extension.

There is a command line switch `--whitelisted-extension` added so that you could whilelist any other extension you'd like, for example, appending `--whitelisted-extension=dbepggeogbaibhgnhhndojpepiihcmeb` would enable `vimium` on those forbidden pages.

![Surfingkeys_on_webstore](https://user-images.githubusercontent.com/288207/31577261-c7ca6e1c-b0d0-11e7-9da1-c4c0732214de.png)
![Surfingkeys_on_extensions](https://user-images.githubusercontent.com/288207/31435705-282aaf70-ae46-11e7-8487-1792bdd5fd2c.png)

## Ctrl-L (Command -L on Mac) twice to switch focus back to page content.

To use those keyboard based navigation extensions such as Surfingkeys or Vimium, you always need to focus page content first, otherwise it won't work for most cases. [This page](https://brookhong.github.io/2018/11/18/bring-focus-back-to-page-content-from-address-bar.html) provides some tricky solutions for Google Chrome.

This feature is to provide a way to focus page out of box, you press `Ctrl-L` to focus address bar, then press `Ctrl-L` again to bring focus back to page. Basically `Ctrl-L` will be the shortcut to switch focus between address bar and page content back and forth.

## `Ctrl-N` as `↓` and `Ctrl-P` as `↑` everywhere

This feature is small but very easy for people to be addicted to. Under Mac OS, in URL bar of Chrome, if you type something there will be some URL suggestions listed out, you can use `↓` or `↑` to choose one, but you can also use `Ctrl-N` or `Ctrl-P` to navigate the URL suggestions. You'll love `Ctrl-N` and `Ctrl-P` in such cases after you got used to them. Then you come to a Windows or Linux machine some day, you use `Ctrl-N` to navigate down the URL suggestions, but it just opens a new Window. Neither does `Ctrl-P` do want you want.

Such suggestion cases also exist on HTML pages, for example, suggestions from input box of search engine like Google, plain input box of a form when you enable auto fill. Unfortunately `Ctrl-N` or `Ctrl-P` does not work with Chromium too in these cases under Mac, neither under Windows or Linux. You could make it work in some cases with Surfingkeys, see [Ctrl-p and Ctrl-n for Google](https://brookhong.github.io/2019/04/15/ctrl-p-and-ctrl-n-for-google.html), but it is not universal, the code snippet for Surfingkeys only works under Mac, as `Ctrl-N` and `Ctrl-P` are registered as system shortcuts of Chromium itself under Windows and Linux. Even under Mac the code snippet is just for the input box of Google, if you want it work on other sites, you will have to make corresponding changes. Even you're a Javascript guru, you would never make it work for the case of plain input box in a form with auto fill, as such suggestions are not populated within Javascript context.

This feature turns `Ctrl-N` into `↓` and `Ctrl-P` into `↑` for all the cases above without any Javascript work, of course you don't either have to install Surfingkeys. It just works out of box. There is a setting for you under Windows or Linux -- to treat `Ctrl-N` or `Ctrl-P` as `↓` or `↑` only when focus is in a input box.
![ctlr_n_settings](https://user-images.githubusercontent.com/288207/114701122-f6e5c880-9d54-11eb-8b87-9c47d5754703.png)

## Dictorium, a built-in dictionary

This feature is turned off by default, until you put a dictionary file named `dictorium.db` under a specific path (same as your `Downloads` folder by default, you could customize the path if you prefer to a different one on `chrome://settings/dict`.) [Here](https://1drv.ms/u/s!AtpOdm9tOTsajTM-iSDL6dhnb46o?e=zkVgua) is a prebuilt one, which is just a English-Chinese dictionary. You could build your own with [SqliteDictBuilder](https://github.com/brookhong/SqliteDictBuilder) if you can not find a proper one.

Now hold `Alt` key and click on a word on any page, you can see a popup like below, for a word in a link, you have to mouseover it for a while to get its translation, since clicking it will open the link.

![translation_in_popup](https://user-images.githubusercontent.com/288207/112706205-a4e01e80-8edd-11eb-90e0-9bd79b750308.png)

There are three icons at top right corner of the popup, the first one is to open current explanation in a tab, the second is to toggle auto read at the moment that popup of translation is displayed, the third is to open Dictorium history.

You can go to `chrome://settings/content/dict` toggle the switch to `Allowed`, so that you can just click a word to get translation without holding `Alt`. Or customize your settings by site, which means you have to hold `Alt` key and click to get translation only on the blocked sites, while on the allowed sites, you don't have to hold `Alt` key(actually holding `Alt` when clicking makes a reversed effect, if you hold `Alt` when clicking on allowed sites, you'll not get translation). For example, below settings will enable you click and translate on `quora.com` and `youtube.com`, but on `github.com` you have to hold `Alt` key when clicking.

![settings_by_site](https://user-images.githubusercontent.com/288207/112719445-04691900-8f34-11eb-887f-984967ff14be.png)

The word you just clicked will be collected and stored in local DB file as Dictorium history, which you can check out from `chrome://dictorium-history/`. On the Dictorium history page you can review the words you have ever clicked for translation, you could also select some of them and let Dictorium read aloud for you with text-to-speech engine.

![dictorium_history](https://user-images.githubusercontent.com/288207/112720946-53b34780-8f3c-11eb-8148-2b03ddd31785.png)

Dictorium works well with PDF files.
![dictorium_on_pdf](https://user-images.githubusercontent.com/288207/113555557-b20fb280-962d-11eb-8dab-dd0a72ce1a4e.png)

To query word directly from URL address bar, go to `chrome://dictorium-query/`, then just type any word(at least 3 letters) in the address bar to query it.

![query_in_address_bar](https://user-images.githubusercontent.com/288207/149357098-42fa1fcb-d3af-4a33-83ad-934744c97adb.png)

Dictorium is also well integrated with Surfingkeys, `Q` from Surfingkeys can use Dictorium directly.

## Enable extension installation from everywhere.

Disable the check on extension installation, which enables extension installation from other places than Chrome Web Store.
