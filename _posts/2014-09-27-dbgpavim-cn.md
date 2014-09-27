---
layout: post_cn
title: 用DBGPavim在Vim中调试PHP/Python程序
category: cn
---

{{ page.title }}
================


本文主要介绍如何在服务器上用VIM + XDebug调试PHP程序，目前虽然有不少介绍如何用Eclipse + XDebug在开发人员工作机上调试PHP的文章，但对于如何系统的配置VIM + XDebug还是比较少的，而且目前关于VIM设置的文章都用一个比较老的插件。这里主要介绍一个新插件[DBGPavim](https://github.com/brookhong/DBGPavim)，它相对于老的一些插件有很多优势。同时该插件可完美的用于Python程序的调试。另外VIM + XDebug相对于Eclipse + XDebug也有不少优势，将在文章讲述。

### 实现原理

![dbgpavim](/assets/images/dbgpavim0.png)

DBGp是调试器后台和调试器界面通信的一种协议，用于多种脚本语言的调试。XDebug是用于调试PHP的DBGp实现。VIM要和XDebug互通，实现PHP的调试，需要能够理解DBGp协议，并能发送DBGp指令。DBGPavim就是这样一个插件，它使VIM能够接受DBGp请求，并发送DBGp指令，以达到调试目的。DBGPavim的名字源于DBGp@VIM。

ActiveState提供了用于调试Python/Ruby的DBGp实现[Komodo Remote Debugging Package](http://code.activestate.com/komodo/remotedebugging/)，后面有一节将讲到如何使它和VIM互通，以调试Python。用户将能以此类推出如何调试ruby/nodejs等脚本语言。

### 配置XDebug

1. 安装XDebug可以参考http://xdebug.org/docs/install。
1. 编辑php.ini，加入以下两行：

        zend_extension=/path/to/xdebug.so
        xdebug.remote_enable=1

1. 编辑你的httpd.conf，加入以下行：

        php_value xdebug.remote_autostart 1

    注：这一行并非必须的，如果不加这一行，你需要在访问HTTP服务器的URL里加上XDEBUG_SESSION_START=1的参数，如： http://localhost/index.php?XDEBUG_SESSION_START=1。

1. 如果有多个开发人员同时需要调试不同的VirtualHost，可以在你的VirtualHost段中加入以下行：

        php_value xdebug.remote_port 9009

    注：这里的9009就是VIM作为DBGp服务器应当监听的端口，不同的开发人员在不同的VirtualHost中用各自不同的端口号。这个端口号和下一节提到的dbgPavimPort要一致。不加这一行，默认的端口号是9000。

1. 最后可通过phpinfo.php检查你的XDebug配置是否正确，你必须能够看到以下这些行的值如下（主要是前两列）：

        xdebug.remote_autostart	On	Off
        xdebug.remote_enable	On	On
        xdebug.remote_handler	dbgp	dbgp
        xdebug.remote_host	127.0.0.1	127.0.0.1
        xdebug.remote_port	9009	9000

    phpinfo.php文件内容如下：

        <?php
            phpinfo();
        ?>

### 配置VIM + DBGPavim

DBGPavim插件本身是用Python实现的，所以需要你的VIM支持Python 2.7。打开你的VIM，输入命令

    :version

如果能看到“+python”,说明你的VIM是支持Python的。
如果看到的是“-python”，说明你的VIM不支持Python，你可以按如下步骤编译自己的VIM：

1. 安装Python 2.7
1. export path=/path/to/python2.7/bin:$PATH
1. 用以下命令编译VIM：

        ./configure --prefix=/opt/vim --enable-pythoninterp --with-python-config-dir=/usr/lib/python2.7/config
        make
        make install

注：这里的/usr/lib/python2.7/config取决于你把Python2.7安装到什么位置。

从[这里](http://www.vim.org/scripts/script.php?script_id=4059)或者[这里](https://github.com/brookhong/DBGPavim)下载DBGPavim，放到你的~/.vim目录下，并编辑的你的~/.vimrc，加入以下两行：

    let g:dbgPavimPort = 9009
    let g:dbgPavimBreakAtEntry = 0

注：这里的9009和上一节的9009要一致，如果上一节没有配置xdebug.remote_port，这里也不需要配置，因为它们都会使用默认的9000。
dbgPavimBreakAtEntry=0告诉VIM不在入口处停下，这样只会在断点处停下。

你可以重新启动VIM，按F5检查你的DBGPavim配置是否正确。如果你配置成功的话，你会做VIM窗口的右下角看到提示信息如下：

    bap-LISN-9009

它表示VIM目前正在监听9009端口，bap说明它只会在断点处停下，其他提示信息格式如下：

    <bae|bap>-<LISN|PENDn|CONN|CLSD>

断点状态

    bae Break At Entry，在入口处停下
    bap Break only At breakPoints，只在断点处停下

调试器状态

    LISN	调试器已启动，正处于监听状态。
    PEND-n	调试器已捕捉到连接请求，可以按F5进入调试模式了。
    CONN	VIM正处于调试模式中。
    CLSD	调试器已停止。

### 在Apache环境下调试PHP

1. 现在确认配置正确后，可以用VIM打开你需要调试的文件，跳到你需要调试的行，按F10设置当前行为断点，并按F5启动调试器。
1. 用浏览器访问会调用相应PHP文件的URL，你会看到VIM状态栏里的的提示信息变成：

        bap-PEND-1

    它告诉你已经有一个连接被拦截，可以按F5开始调试了。

    ![dbgpavim](/assets/images/dbgpavim1.png)

1. 按F5进入调试模式，你会看到VIM窗口被分成三部分：左上为源码窗口，右上为变量查看窗口，下方为调用堆栈窗口。

    ![dbgpavim](/assets/images/dbgpavim2.png)

    在源码窗口里，把光标定位到某一个变量上面按F12，在变量查看窗口就能看到该变量的值，如果该变量不是简单变量，其成员也会显示出来。如果该变量的某个成员仍不是简单变量，该行后面会出现一个加号，在该行按回车键，该成员的值将被继续展开。

    如果你想直接查看某个变量的成员变量，可以按v切换到visual模式，选中该成员再按F12，比如$this->login。

    在堆栈窗口，当你在某一行按回车，将跳到该层。最上面一行是最底层，最下面一行是最顶层。切换调用堆栈的层次，可以帮助你查看各个层次的变量，比如有些全局变量只有在最顶层才能看到。

    对于源码中没有出现的变量，你可以通过命令:Pg来查看，比如：

        :Pg $this->memberShip

1. 你可以开始你的调试了，随时按F1可调出帮助窗口，再次F1就关闭帮助窗口。
    ![dbgpavim](/assets/images/dbgpavim3.png)

### 调试命令行启动的PHP程序

如果你需要调试命令行启动的PHP程序，也需要保证PHP程序端的设置是正确的。这些设置可以像前面一样在php.ini中设定，也可以通过命令行参数来设定。比如：

    php -dxdebug.remote_autostart=1 -dxdebug.remote_port=9009 test.php

如果你的命令行使用的ini和apache中php5_module使用的ini是一样的（通常情况是这样的），你不需要在参数中再来做这些设置。但如果你在ini中的设置是放在某个virtualhost段里，你仍然需要加上这些设置。
你可以通过命令行：

    php --ini

来查看你的命令行用的是哪个ini。

接着你可以使用命令：

    php -r "phpinfo();"|grep xdebug.remote_

来检查你的XDebug设置。

基本步骤如下：

1. 用VIM打开你需要调试的PHP文件，F10设置断点，F5启动调试监听。
1. 从命令行运行php程序如上。
1. 回到你的VIM窗口，将看到提示信息为PEND-1。
1. 按F5进入调试模式。

DBGPavim提供一个:Dp命令简化命令行程序的调试。只需打开你的PHP文件，输入命令:Dp即可。

### 调试Python程序

前面说过VIM + DBGPavim作为DBGp协议的服务器，可以与XDebug协同工作，也可以与ActiveState提供的Komodo Python Remote Debugging Client协同工作，实现Python程序的调试，具体步骤如下：

1. 从[这里](http://code.activestate.com/komodo/remotedebugging/)下载安装Komodo Python Remote Debugging Client，把解压后的bin目录加到你的PATH路径中，注意bin目录下的pydbgp文件。
1. 用VIM打开你需要调试的Python文件，F10设置断点，F5启动调试监听。
1. 通过pydbgp运行你的Python程序，如

        pydbgp -d 127.0.0.1:9009 test.py

    注：这里的9009端口就相当于上面为PHP调试时设置的xdebug.remote_port，需要和dbgPavimPort保持一致。
1. 回到你的VIM窗口，将看到提示信息为PEND-1。
1. 按F5进入调试模式。

上面的:Dp命令同样适用于Python调试，下图为Windows 7下用GVIM + pydbgp调试Python的截图。
![dbgpavim](/assets/images/dbgpavim4.png)

### VIM + DBGPavim相对于Eclipse + XDebug的优势

大多数服务器不会启动XServer，无法在服务器上启动Eclipse。如果在开发人员工作机上启动Eclipse + XDebug，就相当于把DBGp服务器在工作机上运行，你需要设置路径映射，也就是HTTP Server执行的一份代码在服务器上，Eclipse调试时打开的是一份代码，在工作机上，要保证这两份代码能对应上需要映射路径。当程序规模不大时，问题不大，当程序规模大时，会比较麻烦，而且要保证代码的同步，否则会串行。

同时可以遭遇网络防火墙之类的问题。

VIM + DBGPavim也是支持远程调试的，但同样避免不了路径映射的设置，如下：

    let g:dbgPavimPathMap = [['D:/works/php','/var/www'],]

### DBGPavim相对于其他插件的优势

DBGPavim源于VIM早期的一个DBGp插件http://www.vim.org/scripts/script.php?script_id=1152，从这个插件还衍生出其他一些DBGp插件。但DBGPavim重写了作为调试器后台的DBGp服务器，异步监听，使得VIM在监听DBGp的同时不妨碍用户与VIM之间的交互。用户按F5启动调试监听后，可继续使用VIM，随时可按F6停止监听。

DBGPavim会监听所有来自DBGp客户端如XDebug、pydbgp的DBGp连接，不像其它插件只能捕获第一个连接。这对于大规模的WEB程序是必须的，因为现在的一次网页加载通常会触发多个HTTP请求，而我们需要调试的可能来自其中的任何一个。
同时DBGPavim支持只在断点处停下，其它的插件都是在入口处停下，需要程序员一步步跟踪进去。这省了开发人员很大的麻烦，而且避免出错后一次次的重启调试。

相信你也已经发现，DBGPavim可以与Windows下的GVIM一起工作，并且工作的很好。

### DBGPavim的详细使用参考
VIM normal模式下

    F5	启动调试监听，或者有可调试连接时进入调试模式。
    F6	停止调试监听。
    F8	切换dbgPavimBreakAtEntry的值，按这个键你可以看到状态栏提示信息在bae和bap之间切换，即是否在PHP程序入口处停下。
    F10	在当前行设置或删除断点，在调试模式下同样适用。

调试模式下

    F1	打开或关闭帮助窗口
    F2	单步进入
    F3	单步跳过
    F4	单步退出
    F5	继续执行直到下一个断点，如果后续没有断点就退出调试模式。
    F6	停止调试，这个按键就导致VIM退出调试模式，并且停止调试监听。
    F7	调试时执行php语句，按下F7后，用户可在变量查看窗口输入php语句，回车后执行。
    F9	最大化某个子窗口，或者重置窗口布局。
    F11	查看当前执行环境下的所有变量的值，在不同的堆栈层次，会有不同的结果。
    F12	查看光标下的变量的值。

以上功能键为默认配置，你如果习惯多数浏览器的按键设置，可以把下面的代码加入你的.vimrc中：

    let g:dbgPavimKeyRun = '<F8>'
    let g:dbgPavimKeyStepOver = '<F10>'
    let g:dbgPavimKeyStepInto = '<F11>'
    let g:dbgPavimKeyStepOut = '<F12>'
    let g:dbgPavimKeyPropertyGet = '<F3>'
    let g:dbgPavimKeyContextGet = '<F4>'
    let g:dbgPavimKeyToggleBp = '<F9>'
    let g:dbgPavimKeyToggleBae = '<F5>'
    let g:dbgPavimKeyRelayout = '<F2>'

VIM命令，所有命令只有第一个字母为大写。

    :Bl	列出所有断点
    :Bp	与F10功能相同
    :Dp	这个命令可用于快速调试当前文件，它实现了如下功能：

        1. 检查命令行下XDebug/pydbgp的设置是否正确
        2. 启动调试器监听
        3. 用php/pydbgp执行当前文件

    :Pg <longfoo>	查看较长变量的值，比如:Pg $this->savings[3]
    :Up	调用堆栈往上一级
    :Dn	调用堆栈往下一级
    :Wc [$foo]	打开/关闭对变量$foo的监视。如果没有参数，就监视当前执行环境下的所有变量。
    :We <foo>	打开/关闭对语句foo的监视，即每一单步后自动执行foo语句。
    :Wl	列出所有被监视的变量或语句。
    :Children <n>	对于数组默认显示前1024个元素，这个命令可以修改。
    :Depth <n>	对于复杂变量，默认只显示下一层成员，这个命令可以设置限制多层。
    :Length <n>	对于字符串变量，默认执行显示前1024个字符，这个命令可以设置显示长度。

