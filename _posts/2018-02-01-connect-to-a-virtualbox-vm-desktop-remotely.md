---
layout: post
title: connect to a VirtualBox VM desktop remotely
category: en
---

{{ page.title }}
================
1. install [Oracle VM VirtualBox Extension Pack](https://www.virtualbox.org/wiki/Downloads)
2. enable server of Remote Display for the virtual machine.

    ![image](https://user-images.githubusercontent.com/288207/35672008-09c8cdb0-0778-11e8-8ffc-7abe3f456cdb.png)
3. set up Microsoft Remote Desktop on laptop

    ![image](https://user-images.githubusercontent.com/288207/35672877-d6c397c6-077a-11e8-9567-6f7f5b24a23c.png)

    * Connection name   - give the connection a name.
    * PC name           - IP address of VirtualBox host (not the guest) in the form 192.168.1.162:3389
    * User name         - user name on the guest OS
    * Password          - password for the guest OS user
