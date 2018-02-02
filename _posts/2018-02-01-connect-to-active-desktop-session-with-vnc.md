---
layout: post
title: connect to active desktop session with VNC
category: en
---

{{ page.title }}
================

# Problem
I mainly work on a mac laptop, but sometimes I have some tasks on an ubuntu desktop. `ssh` works well for some non-GUI tasks, but for those tasks with GUI on ubuntu desktop, I have to move my hands to desktop's keyboard away from laptop's keyboard, back and forth. Many times I pressed laptop's keyboard while I intended to input for desktop, or vice versa.

# Solution
If I could connect to the active session on ubuntu desktop from my laptop, then I could only type on my laptop's keyboard, which apparently solves the problem.

That is `x11vnc`.

1. apt-get install x11vnc

2. run x11vnc on ubuntu

    x11vnc -display :0 -usepw -allow *ip_of_laptop* -shared

3. From Mac laptop, `Command + k` in `Finder` to connect to:

    vnc://*ip_or_hostname_of_ubuntu*:5900

![image](https://user-images.githubusercontent.com/288207/35672143-87380f22-0778-11e8-811d-eb13758e23ff.png)
