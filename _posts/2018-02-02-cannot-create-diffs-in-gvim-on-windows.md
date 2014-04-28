---
layout: post
title: Cannot create diffs in Gvim on Windows
category: en
---

{{ page.title }}
================

Gvim release on Windows does not contain diff utility, so when you diff files with gVim, you'll get error:

    Cannot create diffs

You need install diff utility to resolve the issue,

* [DiffUtils for Windows](http://gnuwin32.sourceforge.net/packages/diffutils.htm)

and its dependencies

* [LibIntl for Windows](http://gnuwin32.sourceforge.net/packages/libintl.htm)
* [LibIconv for Windows](http://gnuwin32.sourceforge.net/packages/libiconv.htm)

Or you could download a full zip from [here](/assets/downloads/diff4gVim.zip), which contains:

      Length      Date    Time    Name
    ---------  ---------- -----   ----
       150528  05-24-2004 14:46   diff.exe
       978432  02-02-2018 12:16   libiconv2.dll
       103424  05-06-2005 21:52   libintl3.dll
    ---------                     -------
      1232384                     3 files
