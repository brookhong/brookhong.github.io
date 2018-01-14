---
layout: post
title: Chrome VS Firefox
category: en
---

{{ page.title }}
================

I ported [Surfingkeys](https://github.com/brookhong/Surfingkeys) from Chrome to Firefox(above 57, which has webextension API supports), and learned some things from the process. Here is a simple comparison between them, which does not cover Firefox before 57, since I had not used Firefox for a lot of while before this.

| | Chrome(63) | Firefox(57) |
|:|
| Extension | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Devtools | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| PDF viewer | ⭐⭐ | ⭐⭐⭐⭐ |
| Robustion/Performance | ⭐⭐⭐⭐ | ⭐⭐⭐ |


# Extension

For extensions(add-ons), Chrome beats Firefox from both quantity and quality. Chrome provides a de facto standard of APIs, and its implementation becomes more robust than Firefox(newly implemented since 57).

Publishing an add-on on AMO is subjected to reviews of a bunch of qualified reviewers, which leads [some arguments](https://discourse.mozilla.org/t/how-does-review-of-addons-works-and-why-you-dont-need-to-write-add-ons-for-firefox/11980). Publishing extension on Chrome Web Store is simple, every user could be reviewer and report abuse.

# Devtools

Chrome's Devtools for JS debugging wins by a great margin.

With Chrome, it's easy to set breakpoint in context of top window, frames or some extension. With Firefox, breakpoint for JS from Add-On sometimes does not work at all, sometimes works after a reload with `Inspect tool` opened.

With Chrome, you could declare a variable in context of top window, frames or some extension. With Firefox, you could not declare a variable in context of some Add-On, please see [How to access add-on content script in Firefox console?](https://stackoverflow.com/questions/42571706/how-to-access-add-on-content-script-in-firefox-console), you could not even know which one is top window from UI.

## Chrome's Inspect tool
![image](https://user-images.githubusercontent.com/288207/34869456-e93d7f48-f7c1-11e7-944d-07b62e5e07ba.png)

## Firefox's Inspect tool
![image](https://user-images.githubusercontent.com/288207/34869496-0efcb64a-f7c2-11e7-8995-951723b40aa4.png)

And with `Inspect tool` opened, page reload in Firefox sometimes eats much of your CPU resource. Firefox 57 gets fast only in some cases.

# PDF viewer

PDF viewer in Firefox beats its opponent in Chrome. Why? All extensions for Chrome do not work on PDF documents unless an extension introduces extra handling for them, but all add-ons for Firefox work perfectly on PDF documents.

# Robustion/Performance

Comparison of performance without full usage scenarios does not make sense. And for nowadays when hardware resource is not a bottleneck on desktop machine, robustion/steady sometimes is more important than speed. The rates I am giving to these two browsers come from my experience rather than any benchmark tool.
