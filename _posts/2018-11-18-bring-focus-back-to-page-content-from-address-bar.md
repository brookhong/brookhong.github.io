---
layout: post
title: Bring focus back to page content from address bar
category: en
---

{{ page.title }}
================

As a Surfingkeys(or Vimium) user, it's annoying that focus could not be easily put back to page content with keyboard shortcuts from the address bar.

There are some solutions for this problem
1. to add search engine as below on [chrome://settings/searchEngines](chrome://settings/searchEngines), then pressing the keyword (such as `;`) and `Enter` will bring focus back to page content.
![image](https://user-images.githubusercontent.com/288207/48667866-2c9e0d00-eb1b-11e8-9b06-afdef1993320.png)

    This solution has been mentioned on below pages

    * https://superuser.com/questions/324266/google-chrome-mac-set-keyboard-focus-from-address-bar-back-to-page
    * https://github.com/philc/vimium/issues/840

1. use `Tab` directly, but it will iterate through all the icons after the address bar, which means you need press `Tab` several times depending on how many extensions you have installed in your chrome. Fortunately there is a way to avoid this on Mac, mentioned [in chromium-dev google group by tapted](https://groups.google.com/a/chromium.org/forum/#!msg/chromium-dev/-15pKoT9HMM/RKdxVD7-BwAJ)

    > If macOS `System Preferences` -> `Keyboard` -> `Shortcuts` -> `Full Keyboard Access` is set to "Text boxes and lists only", then Tab from the omnibox should go to the web page.

I personally prefer to solution 2.
