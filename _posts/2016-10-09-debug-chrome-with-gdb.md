---
layout: post
title: debug Chromium with gdb under Ubuntu
category: en
---

{{ page.title }}
================

## Prepare

1. build Chromium by referring [The Chromium Projects](http://dev.chromium.org/developers/how-tos/get-the-code) and [depot_tools_tutorial](https://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html#_setting_up)

        git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
        export PATH=/works/depot_tools:$PATH
        fetch chromium

    in case of that you need proxy to fetch dependency.

        vim /works/depot_tools/src/build/linux/install-chromeos-fonts.py:62
            subprocess.check_call(['curl', '-x', '127.0.0.1:8123', '-L', url, '-o', tarball])
        ./src/build/install-build-deps.sh

    in case of that you need proxy to sync code, create ~/.boto

        [Boto]
        proxy=127.0.0.1
        proxy_port=8123

    then

        export NO_AUTH_BOTO_CONFIG=~/.boto
        HTTP_PROXY=http://127.0.0.1:8123 gclient sync

        fetch blink
        ./gn gen out/Default
        ninja -v -C out/Default

1. run Chromium

        cd /works/depot_tools/src
        ./out/Default/chrome

## Debugging existing Tab

1. `Shift-Esc` to open Task manager of Chromium, get the process id of the Tab you'd like to debug

1. run gdb to attach the process

        gdb -p <Chromium process id>

1. set breakpoint after symbols loaded.

        Reading symbols from /works/depot_tools/src/out/Default/chrome...done.
        Reading symbols from /works/depot_tools/src/out/Default/./libbase.so...done.
        Loaded symbols for /works/depot_tools/src/out/Default/./libbase.so
        Reading symbols from /works/depot_tools/src/out/Default/./libskia.so...done.
        Loaded symbols for /works/depot_tools/src/out/Default/./libskia.so
        Reading symbols from /works/depot_tools/src/out/Default/./libmojo_public_system.so...done.
        Loaded symbols for /works/depot_tools/src/out/Default/./libmojo_public_system.so
        Reading symbols from /works/depot_tools/src/out/Default/./libbase_i18n.so...done.
        Loaded symbols for /works/depot_tools/src/out/Default/./libbase_i18n.so
        Reading symbols from /works/depot_tools/src/out/Default/./libicui18n.so...done.
        ...

        (gdb) break permissions_parser.cc:186

1. reload an extension from chrome://extensions/, breakpoint will be hit.

        (gdb) print extension->location()
        $9 = extensions::Manifest::UNPACKED
        (gdb) print extension->id()
        $10 = "dnbindhjmpldfhljnpigngncfdekagmm"
        (gdb) where
        #0  extensions::(anonymous namespace)::ParseHelper (extension=0x17a54f165b60, key=0x5558fbbad451 <extensions::manifest_keys::kPermissions> "permissions",
            api_permissions=0x17a54fd91c80, host_permissions=0x17a54fd91d10, error=0x7fffd75f97b8) at ../../extensions/common/manifest_handlers/permissions_parser.cc:186
        #1  0x00005558f8b47076 in extensions::PermissionsParser::Parse (this=0x17a54f04dfc0, extension=0x17a54f165b60, error=0x7fffd75f97b8)
            at ../../extensions/common/manifest_handlers/permissions_parser.cc:247
        #2  0x00005558f8acf1a6 in extensions::Extension::InitFromValue (this=0x17a54f165b60, flags=38, error=0x7fffd75f97b8) at ../../extensions/common/extension.cc:536
        #3  0x00005558f8ace993 in extensions::Extension::Create (path=..., location=extensions::Manifest::UNPACKED, value=..., flags=38, explicit_id="dnbindhjmpldfhljnpigngncfdekagmm",
            utf8_error=0x7fffd75f9b18) at ../../extensions/common/extension.cc:137
        #4  0x00005558f8b01d1c in ExtensionMsg_Loaded_Params::ConvertToExtension (this=0x17a54f29a620, error=0x7fffd75f9b18) at ../../extensions/common/extension_messages.cc:88
        #5  0x00005558f73ea426 in extensions::Dispatcher::OnLoaded (this=0x17a54ec2c220, loaded_extensions=std::__debug::vector of length 1, capacity 1 = {...})
            at ../../extensions/renderer/dispatcher.cc:1075
        #6  0x00005558f73f9979 in base::DispatchToMethodImpl<extensions::Dispatcher*, void (extensions::Dispatcher::*)(std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > const&), std::tuple<std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > > const&, 0ul> (
            obj=@0x7fffd75f9fc8: 0x17a54ec2c220, method=
            (void (extensions::Dispatcher::*)(extensions::Dispatcher * const, const std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > &)) 0x5558f73ea340 <extensions::Dispatcher::OnLoaded(std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > const&)>, args=empty std::tuple)
            at ../../base/tuple.h:144
        #7  0x00005558f73f98d8 in base::DispatchToMethod<extensions::Dispatcher*, void (extensions::Dispatcher::*)(std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > const&), std::tuple<std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > > const&> (obj=@0x7fffd75f9fc8: 0x17a54ec2c220,
            method=
            (void (extensions::Dispatcher::*)(extensions::Dispatcher * const, const std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > &)) 0x5558f73ea340 <extensions::Dispatcher::OnLoaded(std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > const&)>, args=empty std::tuple)
            at ../../base/tuple.h:151
        #8  0x00005558f73f97df in IPC::DispatchToMethod<extensions::Dispatcher, void (extensions::Dispatcher::*)(std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > const&), void, std::tuple<std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > > > (obj=0x17a54ec2c220, method=
            (void (extensions::Dispatcher::*)(extensions::Dispatcher * const, const std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > &)) 0x5558f73ea340 <extensions::Dispatcher::OnLoaded(std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > const&)>, tuple=empty std::tuple)
            at ../../ipc/ipc_message_templates.h:26
        #9  0x00005558f73ef53b in IPC::MessageT<ExtensionMsg_Loaded_Meta, std::tuple<std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > >, void>::Dispatch<extensions::Dispatcher, extensions::Dispatcher, void, void (extensions::Dispatcher::*)(std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > const&)> (msg=0x17a54edb9e80, obj=0x17a54ec2c220, sender=0x17a54ec2c220, parameter=0x0, func=
            (void (extensions::Dispatcher::*)(extensions::Dispatcher * const, const std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > &)) 0x5558f73ea340 <extensions::Dispatcher::OnLoaded(std::__debug::vector<ExtensionMsg_Loaded_Params, std::allocator<ExtensionMsg_Loaded_Params> > const&)>)
            at ../../ipc/ipc_message_templates.h:121
        #10 0x00005558f73e9268 in extensions::Dispatcher::OnControlMessageReceived (this=0x17a54ec2c220, message=...) at ../../extensions/renderer/dispatcher.cc:940
        #11 0x00007f60c63a0190 in content::RenderThreadImpl::OnControlMessageReceived (this=0x17a54ec7f320, msg=...) at ../../content/renderer/render_thread_impl.cc:1633
        #12 0x00007f60c41ac53a in content::ChildThreadImpl::OnMessageReceived (this=0x17a54ec7f328, msg=...) at ../../content/child/child_thread_impl.cc:765
        #13 0x00007f60c2f2e998 in IPC::ChannelProxy::Context::OnDispatchMessage (this=0x17a54eb3d720, message=...) at ../../ipc/ipc_channel_proxy.cc:314
        #14 0x00007f60c2f3542b in base::internal::FunctorTraits<void (IPC::ChannelProxy::Context::*)(IPC::Message const&), void>::Invoke<scoped_refptr<IPC::ChannelProxy::Context> const&, IPC::Message const&> (method=
            (void (IPC::ChannelProxy::Context::*)(IPC::ChannelProxy::Context * const, const IPC::Message &)) 0x7f60c2f2e900 <IPC::ChannelProxy::Context::OnDispatchMessage(IPC::Message const&)>, receiver_ptr=..., args=...) at ../../base/bind_internal.h:214
        #15 0x00007f60c2f35316 in base::internal::InvokeHelper<false, void>::MakeItSo<void (IPC::ChannelProxy::Context::* const&)(IPC::Message const&), scoped_refptr<IPC::ChannelProxy::Context> const&, IPC::Message const&> (functor=
            @0x17a54edb9e70: (void (IPC::ChannelProxy::Context::*)(IPC::ChannelProxy::Context * const, const IPC::Message &)) 0x7f60c2f2e900 <IPC::ChannelProxy::Context::OnDispatchMessage(IPC::Message const&)>, args=..., args=...) at ../../base/bind_internal.h:283
        #16 0x00007f60c2f352a3 in base::internal::Invoker<base::internal::BindState<void (IPC::ChannelProxy::Context::*)(IPC::Message const&), scoped_refptr<IPC::ChannelProxy::Context>, IPC::Message>, void ()>::RunImpl<void (IPC::ChannelProxy::Context::* const&)(IPC::Message const&), std::tuple<scoped_refptr<IPC::ChannelProxy::Context>, IPC::Message> const&, 0ul, 1ul>(void (IPC::ChannelProxy::Context::* const&)(IPC::Message const&), std::tuple<scoped_refptr<IPC::ChannelProxy::Context>, IPC::Message> const&, base::IndexSequence<0ul, 1ul>) (functor=
            @0x17a54edb9e70: (void (IPC::ChannelProxy::Context::*)(IPC::ChannelProxy::Context * const, const IPC::Message &)) 0x7f60c2f2e900 <IPC::ChannelProxy::Context::OnDispatchMessage(IPC::Message const&)>, bound=empty std::tuple) at ../../base/bind_internal.h:346
        #17 0x00007f60c2f34fbc in base::internal::Invoker<base::internal::BindState<void (IPC::ChannelProxy::Context::*)(IPC::Message const&), scoped_refptr<IPC::ChannelProxy::Context>, IPC::Message>, void ()>::Run(base::internal::BindStateBase*) (base=0x17a54edb9e60) at ../../base/bind_internal.h:324
        #18 0x00007f60ca709c0e in base::Callback<void (), (base::internal::CopyMode)1>::Run() const (this=0x7fffd75fb7a0) at ../../base/callback.h:388
        #19 0x00007f60ca73d68b in base::debug::TaskAnnotator::RunTask (this=0x17a54eb42b40, queue_function=0x7f60bca828f0 "TaskQueueManager::PostTask", pending_task=...)
            at ../../base/debug/task_annotator.cc:54
        #20 0x00007f60bc3d2334 in blink::scheduler::TaskQueueManager::ProcessTaskFromWorkQueue (this=0x17a54eb42a20, work_queue=0x17a54ef17020, out_previous_task=0x7fffd75fbab8)
            at ../../third_party/WebKit/Source/platform/scheduler/base/task_queue_manager.cc:315
        #21 0x00007f60bc3d0105 in blink::scheduler::TaskQueueManager::DoWork (this=0x17a54eb42a20, run_time=..., from_main_thread=false)
            at ../../third_party/WebKit/Source/platform/scheduler/base/task_queue_manager.cc:218
        #22 0x00007f60bc3d7198 in base::internal::FunctorTraits<void (blink::scheduler::TaskQueueManager::*)(base::TimeTicks, bool), void>::Invoke<base::WeakPtr<blink::scheduler::TaskQueueManager> const&, base::TimeTicks const&, bool const&> (method=
            (void (blink::scheduler::TaskQueueManager::*)(blink::scheduler::TaskQueueManager * const, base::TimeTicks, bool)) 0x7f60bc3cfca0 <blink::scheduler::TaskQueueManager::DoWork(base::TimeTicks, bool)>, receiver_ptr=..., args=@0x17a54eb862c0: false, args=@0x17a54eb862c0: false) at ../../base/bind_internal.h:214
        #23 0x00007f60bc3d7044 in base::internal::InvokeHelper<true, void>::MakeItSo<void (blink::scheduler::TaskQueueManager::* const&)(base::TimeTicks, bool), base::WeakPtr<blink::scheduler::TaskQueueManager> const&, base::TimeTicks const&, bool const&> (functor=
            @0x17a54eb862b0: (void (blink::scheduler::TaskQueueManager::*)(blink::scheduler::TaskQueueManager * const, base::TimeTicks, bool)) 0x7f60bc3cfca0 <blink::scheduler::TaskQueueManager::DoWork(base::TimeTicks, bool)>, weak_ptr=..., args=@0x17a54eb862c0: false, args=@0x17a54eb862c0: false) at ../../base/bind_internal.h:303
        #24 0x00007f60bc3d6fa4 in base::internal::Invoker<base::internal::BindState<void (blink::scheduler::TaskQueueManager::*)(base::TimeTicks, bool), base::WeakPtr<blink::scheduler::TaskQueueManager>, base::TimeTicks, bool>, void ()>::RunImpl<void (blink::scheduler::TaskQueueManager::* const&)(base::TimeTicks, bool), std::tuple<base::WeakPtr<blink::scheduler::TaskQueueManager>, base::TimeTicks, bool> const&, 0ul, 1ul, 2ul>(void (blink::scheduler::TaskQueueManager::* const&)(base::TimeTicks, bool), std::tuple<base::WeakPtr<blink::scheduler::TaskQueueManager>, base::TimeTicks, bool> const&, base::IndexSequence<0ul, 1ul, 2ul>) (functor=
            @0x17a54eb862b0: (void (blink::scheduler::TaskQueueManager::*)(blink::scheduler::TaskQueueManager * const, base::TimeTicks, bool)) 0x7f60bc3cfca0 <blink::scheduler::TaskQueueManager::DoWork(base::TimeTicks, bool)>, bound=empty std::tuple) at ../../base/bind_internal.h:346
        #25 0x00007f60bc3d6cac in base::internal::Invoker<base::internal::BindState<void (blink::scheduler::TaskQueueManager::*)(base::TimeTicks, bool), base::WeakPtr<blink::scheduler::TaskQu---Type <return> to continue, or q <return> to quit---
        eueManager>, base::TimeTicks, bool>, void ()>::Run(base::internal::BindStateBase*) (base=0x17a54eb862a0) at ../../base/bind_internal.h:324
        #26 0x00007f60ca709c0e in base::Callback<void (), (base::internal::CopyMode)1>::Run() const (this=0x7fffd75fc358) at ../../base/callback.h:388
        #27 0x00007f60ca73d68b in base::debug::TaskAnnotator::RunTask (this=0x17a54ef18510, queue_function=0x7f60caa297f1 "MessageLoop::PostTask", pending_task=...)
            at ../../base/debug/task_annotator.cc:54
        #28 0x00007f60ca7bcbdc in base::MessageLoop::RunTask (this=0x17a54ef182e0, pending_task=...) at ../../base/message_loop/message_loop.cc:488
        #29 0x00007f60ca7bce74 in base::MessageLoop::DeferOrRunPendingTask (this=0x17a54ef182e0, pending_task=...) at ../../base/message_loop/message_loop.cc:497
        #30 0x00007f60ca7bd13e in base::MessageLoop::DoWork (this=0x17a54ef182e0) at ../../base/message_loop/message_loop.cc:621
        #31 0x00007f60ca7d44c3 in base::MessagePumpDefault::Run (this=0x17a54eba47a0, delegate=0x17a54ef182e0) at ../../base/message_loop/message_pump_default.cc:35
        #32 0x00007f60ca7bc5bf in base::MessageLoop::RunHandler (this=0x17a54ef182e0) at ../../base/message_loop/message_loop.cc:451
        #33 0x00007f60ca861804 in base::RunLoop::Run (this=0x7fffd75fc950) at ../../base/run_loop.cc:35
        #34 0x00007f60c6415880 in content::RendererMain (parameters=...) at ../../content/renderer/renderer_main.cc:198
        #35 0x00007f60c6798fce in content::RunZygote (main_function_params=..., delegate=0x7fffd75fd428) at ../../content/app/content_main_runner.cc:343
        #36 0x00007f60c6799610 in content::RunNamedProcessTypeMain (process_type="zygote", main_function_params=..., delegate=0x7fffd75fd428) at ../../content/app/content_main_runner.cc:426
        #37 0x00007f60c679b8a2 in content::ContentMainRunnerImpl::Run (this=0x17a54eba5b60) at ../../content/app/content_main_runner.cc:786
        #38 0x00007f60c6798672 in content::ContentMain (params=...) at ../../content/app/content_main.cc:20
        #39 0x00005558f67cf772 in ChromeMain (argc=2, argv=0x7fffd75fd578) at ../../chrome/app/chrome_main.cc:85
        #40 0x00005558f67cf722 in main (argc=2, argv=0x7fffd75fd578) at ../../chrome/app/chrome_exe_main_aura.cc:17


## Debugging new Tab

1. use `ps axf` to find parent process id of renderer process, here is 9644 as below

         9633 pts/4    Sl   390:11  |   \_ /works/depot_tools/src/out/Default/chrome
         9639 pts/4    S      0:00  |       \_ /works/depot_tools/src/out/Default/chrome --type=zygote
         9641 pts/4    S      0:00  |       |   \_ /works/depot_tools/src/out/Default/nacl_helper
         9644 pts/4    S      0:00  |       |   \_ /works/depot_tools/src/out/Default/chrome --type=zygote
         9739 pts/4    Sl     1:27  |       |       \_ /works/depot_tools/src/out/Default/chrome --type=renderer --enable-features=DocumentWriteEvaluator<DisallowFetchForDocWrittenScriptsInMa
        10680 pts/4    Sl     0:13  |       |       \_ /works/depot_tools/src/out/Default/chrome --type=renderer --enable-features=DocumentWriteEvaluator<DisallowFetchForDocWrittenScriptsInMa
        21358 pts/4    Sl     0:01  |       |       \_ /works/depot_tools/src/out/Default/chrome --type=renderer --enable-features=DocumentWriteEvaluator<DisallowFetchForDocWrittenScriptsInMa
        32013 pts/4    Sl     0:00  |       |       \_ /works/depot_tools/src/out/Default/chrome --type=renderer --enable-features=DocumentWriteEvaluator<DisallowFetchForDocWrittenScriptsInMa
         9675 pts/4    Sl   178:43  |       \_ /works/depot_tools/src/out/Default/chrome --type=gpu-process --enable-features=DocumentWriteEvaluator<DisallowFetchForDocWrittenScriptsInMainFra
         9685 pts/4    S      0:00  |           \_ /works/depot_tools/src/out/Default/chrome --type=gpu-broker

1. attach parent process of renderer process with gdb

        gdb -p 9644

1. set breakpoint after symbols loaded.

        (gdb) break chrome_extensions_client.cc:130

1. now let gdb automatically attach child process newly forked (important)

        (gdb) set follow-fork-mode child

1. click the new-tab button in title bar of Chromium, breakpoint will be hit.

        [New process 1030]
        [Thread debugging using libthread_db enabled]
        Using host libthread_db library "/lib/x86_64-linux-gnu/libthread_db.so.1".
        [Switching to process 1030]

        Breakpoint 1, extensions::ChromeExtensionsClient::Initialize (this=0x5558fd4750a0 <extensions::g_client+8>) at ../../chrome/common/extensions/chrome_extensions_client.cc:130
        warning: Source file is more recent than executable.
        130       scripting_whitelist_.push_back(extension_misc::kChromeVoxExtensionId);

        (gdb) where
        #0  extensions::ChromeExtensionsClient::Initialize (this=0x5558fd4750a0 <extensions::g_client+8>) at ../../chrome/common/extensions/chrome_extensions_client.cc:130
        #1  0x00005558f8b0c71a in extensions::ExtensionsClient::Set (client=0x5558fd4750a0 <extensions::g_client+8>) at ../../extensions/common/extensions_client.cc:40
        #2  0x00005558fa5477b3 in ChromeContentRendererClient::ChromeContentRendererClient (this=0x5558fd452af0 <g_chrome_content_renderer_client+8>)
            at ../../chrome/renderer/chrome_content_renderer_client.cc:318
        #3  0x00005558f67d7825 in base::DefaultLazyInstanceTraits<ChromeContentRendererClient>::New (instance=0x5558fd452af0 <g_chrome_content_renderer_client+8>)
            at ../../base/lazy_instance.h:69
        #4  0x00005558f67d1916 in base::LazyInstance<ChromeContentRendererClient, base::DefaultLazyInstanceTraits<ChromeContentRendererClient> >::Pointer (
            this=0x5558fd452ae8 <g_chrome_content_renderer_client>) at ../../base/lazy_instance.h:163
        #5  0x00005558f67d104b in ChromeMainDelegate::CreateContentRendererClient (this=0x7fffd75fd428) at ../../chrome/app/chrome_main_delegate.cc:1022
        #6  0x00007f60c6799c68 in content::ContentClientInitializer::Set (process_type="renderer", delegate=0x7fffd75fd428) at ../../content/app/content_main_runner.cc:276
        #7  0x00007f60c6798f33 in content::RunZygote (main_function_params=..., delegate=0x7fffd75fd428) at ../../content/app/content_main_runner.cc:333
        #8  0x00007f60c6799610 in content::RunNamedProcessTypeMain (process_type="zygote", main_function_params=..., delegate=0x7fffd75fd428) at ../../content/app/content_main_runner.cc:426
        #9  0x00007f60c679b8a2 in content::ContentMainRunnerImpl::Run (this=0x17a54eba5b60) at ../../content/app/content_main_runner.cc:786
        #10 0x00007f60c6798672 in content::ContentMain (params=...) at ../../content/app/content_main.cc:20
        #11 0x00005558f67cf772 in ChromeMain (argc=2, argv=0x7fffd75fd578) at ../../chrome/app/chrome_main.cc:85
        #12 0x00005558f67cf722 in main (argc=2, argv=0x7fffd75fd578) at ../../chrome/app/chrome_exe_main_aura.cc:17

        (gdb) info inferiors 
          Num  Description       Executable        
        * 2    process 1030      /works/depot_tools/src/out/Default/chrome 
          1    <null>            /works/depot_tools/src/out/Default/chrome
