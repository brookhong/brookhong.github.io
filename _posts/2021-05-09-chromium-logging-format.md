---
layout: post
title: Chromium logging format
category: en
---

{{ page.title }}
================
To enable logging for Chrome/Chromium, you can just append `--enable-logging` to the launch command, then logs could be found from console or `~/Library/Application Support/Chromium/chrome_debug.log`. Refer to [How to enable logging - The Chromium Projects](https://www.chromium.org/for-testers/enable-logging) for more details.

To figure out the logging format, please refer to `LogMessage::Init` from file `base/logging.cc` in Chromium repo, basically it is as below:

    [PROCESS_ID:THREAD_ID:MMDD/TIME:LOGGING_LEVEL:SOURCE_CODE_FILE_NAME(LINE_NUMBER)]


Under MacOS, the `THREAD_ID` is actually a mach port name that bound to the thread, refer to `base::PlatformThread::CurrentId` in `base/threading/platform_thread_posix.cc`. That is why the thread id from `chrome_debug.log` is different from thread id from debugger such as `lldb`, `lsmp` is a useful tool to see connection of those two ids.

For example, the thread id from `chrome_debug.log` is `775` as below:

    [2945:775:0509/102523.114814:ERROR:***********.cc(505)] ******************

Now attach to the process `2945` with `lldb`:

    lldb -p 2945

and list all threads with

    thread list

There is no thread with id `775`, but there is a thread with id `0x78f15`.

    * thread #1: tid = 0x78f15, 0x00007fff6aaeedfa libsystem_kernel.dylib`mach_msg_trap + 10, name = 'CrBrowserMain', queue = 'com.apple.main-thread', stop reason = signal SIGSTOP

There seems no connection between the number `775` and `0x78f15`, but the connection can be found with `sudo lsmp -p 2945` and its output

      name      ipc-object    rights     flags   boost  reqs  recv  send ... identifier  type
    ---------   ----------  ----------  -------- -----  ---- ----- ----- ... ----------- ------------
    0x00000307  0x4139aedb  send        --------        ---            1 ... 0x00000000  THREAD (0x78f15)


The mach port name `0x00000307` is associated with thread `0x78f15`, `0x00000307` is just the hex value of `775`.
