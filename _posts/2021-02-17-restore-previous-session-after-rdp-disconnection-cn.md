---
layout: post
title: 远程桌面断开后自动恢复原先会话
category: cn
---

{{ page.title }}
================
你从某个设备（比如手机）通过远程桌面登录到你的Windows 10电脑，手机端会显示桌面，这时电脑端会进入锁定状态。然后你在手机上断开远程桌面，但电脑端依然处于锁定状态，如何才能让电脑自动恢复原来的会话（登录状态）？

1. 打开`任务计划程序`，创建任务
1. `常规`里选择`不管用户是否登录都要运行`
![image](https://user-images.githubusercontent.com/288207/108468959-72ca1400-72c2-11eb-9154-266744d100d0.png)

1. 在`触发器`里新建触发器`当从用户会话断开连接时`
![image](https://user-images.githubusercontent.com/288207/108469168-bf155400-72c2-11eb-82b5-7666f4d2749f.png)

1. 在`操作`里新建操作`启动程序`
![image](https://user-images.githubusercontent.com/288207/108469247-dbb18c00-72c2-11eb-9103-b1a494dab415.png)

restore_previous_session.bat内容：

    set LOG_FILENAME=%TEMP%\restore_console_log.txt
    tscon 1 /dest:console /v >> %LOG_FILENAME%

参考[windows - Restore console session after remote desktop disconnects? - Super User](https://superuser.com/questions/767397/restore-console-session-after-remote-desktop-disconnects)。
