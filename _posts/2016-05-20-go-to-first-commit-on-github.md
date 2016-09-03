---
layout: post
title: go to first commit on github
category: en
---

{{ page.title }}
================

There are many times that I want to see the first commit of a project on github.com, it's annoying to click the `Older` link again and again. Below is my solution with Surfingkeys before github provides a formal way.

Add below into your own settings,

    mapkey('gl', 'Go to last page of commits on github', function() {
        var commits = parseInt($('li.commits span.num').text().trim().replace(/,/g, ''));
        // current page size of github is 35, make corresponding change if github changes it
        var page_size = 35;
        var fp = Math.ceil(commits/page_size);
        window.location.href = "{0}?page={1}".format($('li.commits>a')[0].href, fp);
    }, {domain: /github.com/i});

Then on a project home page(with `Code` tab active) like https://github.com/JakeWharton/butterknife, press `gl` to go to last page.
