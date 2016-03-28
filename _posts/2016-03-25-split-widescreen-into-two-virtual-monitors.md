---
layout: post
title: Ubuntu下把宽屏显示器切成两个虚拟的显示器
category: cn
---

{{ page.title }}
================

[原文](http://superuser.com/questions/115076/how-to-vertically-split-widescreen-into-two-virtual-workspaces-on-ubuntu-gnome)

1. 下载[Xinerama.c](/assets/downloads/Xinerama.c)
1. 编它

        gcc -O2 -Wall Xinerama.c -fPIC -o libXinerama.so.1.0.0 -shared

1. 用它

        cd /usr/lib/x86_64-linux-gnu
        sudo mv libXinerama.so.1.0.0 libXinerama.so.1.0.0.bk # 用之前备份一下，以防万一
        sudo cp /works/libXinerama.so.1.0.0 .

1. 创建配置文件，告诉它你想怎样切分宽屏显示器

    vim ~/.fakexinerama

        2
        0 0 1720 1440
        1720 0 1720 1440

    这里1440是显示器原始高度，1720是显示器原始宽度的一半。

1. 注销重新登录就好了，如果你需要设置按键在显示器之间移动窗口，可以打开`CompizConfig Settings Manager`，`Window Management` -> `Put` -> `Put to Next Output`，设置按键[参考](http://askubuntu.com/questions/141752/keyboard-shortcut-to-move-windows-between-monitors)。
