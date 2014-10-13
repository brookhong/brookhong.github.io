---
layout: post_cn
title: 用Zed Attack Proxy (ZAP)拦截调试HTTP/HTTPS
category: cn
---

{{ page.title }}
================

Chrome中的Developer Tools里有个Network页，可以监控浏览器出去的所有网络请求，调试问题时非常有用。

假如你发送HTTP/HTTPS请求的不是浏览器，而是自己写的一个应用，如何拦截监控该应用发出的请求？

[OWASP Zed Attack Proxy Project](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project)就是这样一个免费开源的拦截代理，它是一个代理，起拦截作用。

    At its heart ZAP is an intercepting proxy.

所以基本上，就是让你的应用使用zaproxy作为代理访问HTTP/HTTPS服务，zaproxy会拦截所有请求，并返回服务端回来的响应。

### 拦截一个java程序的HTTP请求
1. zaproxy代理设置

    `Tools` -> `Options` -> `Local proxy`

    ![zaproxy0](/assets/images/zaproxy0.png)

1. 在你的应用中使用zaproxy，下面的示例在命令行中让一个java程序使用zaproxy提供的HTTP代理

        java -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=8080 -cp .;d:\Downloads\json-20140107.jar JGet


### 拦截一个java程序的HTTPS请求

如果你的服务端提供的是HTTPS服务，需要在你的应用中导入ZAP Root CA certificate。

1. 生成ZAP Root CA certificate文件

    `Tools` -> `Options` -> `Dynamic SSL Certificates` -> `Save`

    ![zaproxy1](/assets/images/zaproxy1.png)

1. 把上一步生成的ZAP证书导入到你的应用，下面的示例（以管理员身份运行，修改对应的jre路径）把该证书导入java

        keytool -import -keystore "C:\Program Files\Java\jdk1.7.0_51\jre\lib\security\cacerts" -file D:\owasp_zap_root_ca.cer -storepass changeit

1. 在你的应用中使用zaproxy，下面的示例在命令行中让一个java程序使用zaproxy提供的https代理

        java -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=8080 -cp .;d:\Downloads\json-20140107.jar JGet

    ![zaproxy2](/assets/images/zaproxy2.png)

### 拦截curl命令发出的HTTPS请求

    curl -x 127.0.0.1:8080 --cacert /d/owasp_zap_root_ca.cer -H "Authorization: token ****************************************" https://api.github.com/gists/********************/comments/******* -d '{ "body": "test" }'

    -x 127.0.0.1:8080                   告诉curl使用代理
    --cacert /d/owasp_zap_root_ca.cer   告诉curl使用ZAP证书
    ***********                         隐藏信息，用你自己的

最后，因为各种浏览器也是一种HTTP/HTTPS客户端，当然也可以使用zaproxy拦截你浏览器发出去的请求，只要把浏览器使用的代理设置成zaproxy所提供的，访问HTTPS服务也同样需要安装ZAP证书。
