---
layout: post
title: HTTP代理类型
category: cn
---

{{ page.title }}
================

* 使用透明代理，对方服务器可以知道你使用了代理，并且也知道你的真实IP。
* 使用匿名代理，对方服务器可以知道你使用了代理，但不知道你的真实IP。
* 使用高匿名代理，对方服务器不知道你使用了代理，更不知道你的真实IP。

| HTTP头信息 | 透明 |匿名 |高匿名 |
|:|
| REMOTE_ADDR | 代理服务器IP |代理服务器IP | 代理服务器IP |
| HTTP_PROXY_CONNECTION | keep-alive | keep-alive | 不显示 |
| HTTP_VIA | 代理服务器信息 | 不显示 | 不显示 |
| HTTP_X_FORWARDED_FOR | 你的真是IP或随机IP | 不显示 | 不显示 |
