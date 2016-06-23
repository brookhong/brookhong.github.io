---
layout: post
title: use fugitive to diff branches or commits
category: en
---

{{ page.title }}
================

To diff one file with fugitive is quite easy, just use command:

* `Gvdiff HEAD^` to diff with HEAD^
* `Gvdiff 0d39a336b9511af255544fd176816f4a21c199e5` to diff with specific commit

To diff all files between branches or commits is kind of obscure, it took me some time to figure out. Mark down here, hope that it helps others who are using fugitive.


1. open a total git diff with command `Gtabedit 0d39a336b9511af255544fd176816f4a21c199e5`(replace `0d39a336b9511af255544fd176816f4a21c199e5` with the branch or the commit id you'd like to diff against). The total diff window is opened as below.

    ![fugitive_diff_branch](https://cloud.githubusercontent.com/assets/288207/16300099/adbf9b88-3970-11e6-94dc-ed8a220a591a.png)

1. jump to a folded line for some file(such as line 8 in above screenshot), press `O` to open diff for that file in a new tab.

    ![fugitive_diff_file](https://cloud.githubusercontent.com/assets/288207/16300100/b03f54f2-3970-11e6-9782-8ca01b48657d.png)
