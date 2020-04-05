---
layout: post
title: debug chromium with lldb under Mac OSX
category: en
---

{{ page.title }}
================

After Chromium.app is built successfully, launch it, then start lldb

    $ lldb "/works/depot_tools/src/out/Default/Chromium.app/Contents/Versions/60.0.3077.0/Chromium Helper.app/Contents/MacOS/Chromium Helper"

If you can not list source code properly, it may because that you are running `lldb` in a different working directory, try below command to set the right one:

    platform settings -w /works/depot_tools/chromium/src/out/Debug/

    (lldb) source info
    Lines found in module `libblink_core.dylib
    [0x000000018ab89f5a-0x000000018ab89f79): /works/depot_tools/chromium/src/third_party/blink/renderer/platform/heap/visitor.h:114:5

## Debugging existing Tab

1. Set breakpoint, just ignore warning.

        (lldb) breakpoint set -f Element.cpp -l 179

1. `Shift-Esc` to open Task manager of Chromium, get the process id of the Tab you'd like to debug, then attach to it.

        (lldb) process attach -p 55304
        (lldb) cont

1. reload the tab, to hit the breakpoint.

        * thread #1: tid = 0x2148b6, 0x0000000138cde2d0 libblink_core.dylib`blink::Element::Element(this=0x00001aa5ad4897d8, tagName=0x000000013b9dc118, document=0x00001aa5ad488a60, type=CreateHTMLElement) + 32 at Element.cpp:179, name = 'CrRendererMain', queue = 'com.apple.main-thread', stop reason = breakpoint 1.2
            frame #0: 0x0000000138cde2d0 libblink_core.dylib`blink::Element::Element(this=0x00001aa5ad4897d8, tagName=0x000000013b9dc118, document=0x00001aa5ad488a60, type=CreateHTMLElement) + 32 at Element.cpp:179
           176  Element::Element(const QualifiedName& tagName, Document* document, ConstructionType type)
           177      : ContainerNode(document, type)
           178      , m_tagName(tagName)
        -> 179  {
           180  }
           181
           182  Element::~Element()
        (lldb) bt
        * thread #1: tid = 0x2148b6, 0x0000000138cde2d0 libblink_core.dylib`blink::Element::Element(this=0x00001aa5ad4897d8, tagName=0x000000013b9dc118, document=0x00001aa5ad488a60, type=CreateHTMLElement) + 32 at Element.cpp:179, name = 'CrRendererMain', queue = 'com.apple.main-thread', stop reason = breakpoint 1.2
          * frame #0: 0x0000000138cde2d0 libblink_core.dylib`blink::Element::Element(this=0x00001aa5ad4897d8, tagName=0x000000013b9dc118, document=0x00001aa5ad488a60, type=CreateHTMLElement) + 32 at Element.cpp:179
            frame #1: 0x00000001386d2d7f libblink_core.dylib`blink::HTMLElement::HTMLElement(this=0x00001aa5ad4897d8, tagName=0x000000013b9dc118, document=0x00001aa5ad488a60, type=CreateHTMLElement) + 111 at HTMLElement.h:163
            frame #2: 0x00000001392ed216 libblink_core.dylib`blink::HTMLHtmlElement::HTMLHtmlElement(this=0x00001aa5ad4897d8, document=0x00001aa5ad488a60) + 54 at HTMLHtmlElement.cpp:39
            frame #3: 0x00000001392ece8d libblink_core.dylib`blink::HTMLHtmlElement::HTMLHtmlElement(this=0x00001aa5ad4897d8, document=0x00001aa5ad488a60) + 29 at HTMLHtmlElement.cpp:40
            frame #4: 0x00000001392ece5b libblink_core.dylib`blink::HTMLHtmlElement::create(document=0x00001aa5ad488a60) + 43 at HTMLHtmlElement.cpp:43
            frame #5: 0x000000013947f8e6 libblink_core.dylib`blink::HTMLConstructionSite::insertHTMLHtmlStartTagBeforeHTML(this=0x000000dbed2e9560, token=0x00007fff565508b0) + 134 at HTMLConstructionSite.cpp:393
            frame #6: 0x000000013950a344 libblink_core.dylib`blink::HTMLTreeBuilder::defaultForBeforeHTML(this=0x000000dbed2e9538) + 116 at HTMLTreeBuilder.cpp:2516
            frame #7: 0x0000000139500318 libblink_core.dylib`blink::HTMLTreeBuilder::processStartTag(this=0x000000dbed2e9538, token=0x00007fff56550e60) + 504 at HTMLTreeBuilder.cpp:1072
            frame #8: 0x00000001394ffd78 libblink_core.dylib`blink::HTMLTreeBuilder::processToken(this=0x000000dbed2e9538, token=0x00007fff56550e60) + 232 at HTMLTreeBuilder.cpp:397
            frame #9: 0x00000001394feceb libblink_core.dylib`blink::HTMLTreeBuilder::constructTree(this=0x000000dbed2e9538, token=0x00007fff56550e60) + 91 at HTMLTreeBuilder.cpp:357
            frame #10: 0x0000000139497774 libblink_core.dylib`blink::HTMLDocumentParser::constructTreeFromCompactHTMLToken(this=0x000000dbed2e9170, compactToken=0x00003b816ba1c010) + 84 at HTMLDocumentParser.cpp:704
            frame #11: 0x0000000139496673 libblink_core.dylib`blink::HTMLDocumentParser::processTokenizedChunkFromBackgroundParser(this=0x000000dbed2e9170, popChunk=unique_ptr<blink::HTMLDocumentParser::TokenizedChunk, std::__1::default_delete<blink::HTMLDocumentParser::TokenizedChunk> > @ 0x00007fff56551888) + 3155 at HTMLDocumentParser.cpp:504
            frame #12: 0x0000000139490a27 libblink_core.dylib`blink::HTMLDocumentParser::pumpPendingSpeculations(this=0x000000dbed2e9170) + 1671 at HTMLDocumentParser.cpp:575
            frame #13: 0x000000013949038f libblink_core.dylib`blink::HTMLDocumentParser::resumeParsingAfterYield(this=0x000000dbed2e9170) + 191 at HTMLDocumentParser.cpp:262
            frame #14: 0x00000001394c792d libblink_core.dylib`blink::HTMLParserScheduler::continueParsing(this=0x00002649c0e6fc58) + 29 at HTMLParserScheduler.cpp:159
            frame #15: 0x00000001394c8cd2 libblink_core.dylib`void base::internal::FunctorTraits<void (blink::HTMLParserScheduler::*)(), void>::Invoke<blink::WeakPersistent<blink::HTMLParserScheduler> const&>(method=10 79 4c 39 01 00 00 00 00 00 00 00 00 00 00 00, receiver_ptr=0x00007faf118a57f0)(), blink::WeakPersistent<blink::HTMLParserScheduler> const&&&) + 130 at bind_internal.h:214
            frame #16: 0x00000001394c8bd5 libblink_core.dylib`void base::internal::InvokeHelper<true, void>::MakeItSo<void (functor=0x00007faf118a57e0, weak_ptr=0x00007faf118a57f0)(), blink::WeakPersistent<blink::HTMLParserScheduler> const&>(void (blink::HTMLParserScheduler::* const&&&)(), blink::WeakPersistent<blink::HTMLParserScheduler> const&&&) + 85 at bind_internal.h:305
            frame #17: 0x00000001394c8b78 libblink_core.dylib`void base::internal::Invoker<base::internal::BindState<void (blink::HTMLParserScheduler::*)(), blink::WeakPersistent<blink::HTMLParserScheduler> >, void ()>::RunImpl<void (functor=0x00007faf118a57e0, bound=0x00007faf118a57f0, (null)=IndexSequence<0> @ 0x00007fff565519d8)(), std::__1::tuple<blink::WeakPersistent<blink::HTMLParserScheduler> > const&, 0ul>(void (blink::HTMLParserScheduler::* const&&&)(), std::__1::tuple<blink::WeakPersistent<blink::HTMLParserScheduler> > const&&&, base::IndexSequence<0ul>) + 72 at bind_internal.h:361
            frame #18: 0x00000001394c8adc libblink_core.dylib`base::internal::Invoker<base::internal::BindState<void (blink::HTMLParserScheduler::*)(), blink::WeakPersistent<blink::HTMLParserScheduler> >, void ()>::Run(base=0x00007faf118a57c0) + 44 at bind_internal.h:339
            frame #19: 0x00000001347adf8b libblink_platform.dylib`base::internal::RunMixin<base::Callback<void (), (base::internal::CopyMode)1, (base::internal::RepeatMode)1> >::Run(this=0x000001d87a8e8ee8) const + 59 at callback.h:64
            frame #20: 0x00000001347adf22 libblink_platform.dylib`WTF::Function<void (), (WTF::FunctionThreadAffinity)1>::operator(this=0x000001d87a8e8e90)() + 258 at Functional.h:204
            frame #21: 0x0000000134b30cb4 libblink_platform.dylib`blink::CancellableTaskFactory::CancellableTask::run(this=0x000001d87a81c820) + 100 at CancellableTaskFactory.cpp:27
            frame #22: 0x0000000134b86c89 libblink_platform.dylib`blink::scheduler::WebTaskRunnerImpl::runTask(task=<unavailable>) + 41 at web_task_runner_impl.cc:79
            frame #23: 0x0000000134b8803a libblink_platform.dylib`void base::internal::FunctorTraits<void (*)(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >), void>::Invoke<std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> > >(function=(libblink_platform.dylib`blink::scheduler::WebTaskRunnerImpl::runTask(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >) at web_task_runner_impl.cc:78), args=0x00007fff56551e90)(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >), std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >&&) + 362 at bind_internal.h:164
            frame #24: 0x0000000134b87e70 libblink_platform.dylib`void base::internal::InvokeHelper<false, void>::MakeItSo<void (functor=0x00007faf11889440, args=0x00007fff56551e90)(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >), std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> > >(void (* const&&&)(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >), std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >&&) + 48 at bind_internal.h:285
            frame #25: 0x0000000134b87d66 libblink_platform.dylib`void base::internal::Invoker<base::internal::BindState<void (*)(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >), base::internal::PassedWrapper<std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> > > >, void ()>::RunImpl<void (functor=0x00007faf11889440, bound=0x00007faf11889448, (null)=IndexSequence<0> @ 0x00007fff56551e10)(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >), std::__1::tuple<base::internal::PassedWrapper<std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> > > > const&, 0ul>(void (* const&&&)(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >), std::__1::tuple<base::internal::PassedWrapper<std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> > > > const&&&, base::IndexSequence<0ul>) + 118 at bind_internal.h:361
            frame #26: 0x0000000134b87c9c libblink_platform.dylib`base::internal::Invoker<base::internal::BindState<void (*)(std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> >), base::internal::PassedWrapper<std::__1::unique_ptr<blink::WebTaskRunner::Task, std::__1::default_delete<blink::WebTaskRunner::Task> > > >, void ()>::Run(base=0x00007faf11889420) + 44 at bind_internal.h:339
            frame #27: 0x000000011d87cbeb libbase.dylib`base::internal::RunMixin<base::Callback<void (), (base::internal::CopyMode)1, (base::internal::RepeatMode)1> >::Run(this=0x00007fff56552210) const + 59 at callback.h:64
            frame #28: 0x000000011d8bff84 libbase.dylib`base::debug::TaskAnnotator::RunTask(this=0x00007faf106154f0, queue_function="TaskQueueManager::PostTask", pending_task=0x00007fff565521f8) + 676 at task_annotator.cc:54
            frame #29: 0x0000000134b4e627 libblink_platform.dylib`blink::scheduler::TaskQueueManager::ProcessTaskFromWorkQueue(this=0x00007faf10615440, work_queue=0x00007faf11837130) + 1639 at task_queue_manager.cc:337
            frame #30: 0x0000000134b4ac72 libblink_platform.dylib`blink::scheduler::TaskQueueManager::DoWork(this=0x00007faf10615440, run_time=TimeTicks @ 0x00007fff56552648, from_main_thread=true) + 1410 at task_queue_manager.cc:234
            frame #31: 0x0000000134b53fa7 libblink_platform.dylib`void base::internal::FunctorTraits<void (blink::scheduler::TaskQueueManager::*)(base::TimeTicks, bool), void>::Invoke<base::WeakPtr<blink::scheduler::TaskQueueManager> const&, base::TimeTicks const&, bool const&>(method=f0 a6 b4 34 01 00 00 00 00 00 00 00 00 00 00 00, receiver_ptr=0x00007faf10615b60, args=0x00007faf10615b70, args=0x00007faf10615b78)(base::TimeTicks, bool), base::WeakPtr<blink::scheduler::TaskQueueManager> const&&&, base::TimeTicks const&&&, bool const&&&) + 199 at bind_internal.h:214
            frame #32: 0x0000000134b53d90 libblink_platform.dylib`void base::internal::InvokeHelper<true, void>::MakeItSo<void (functor=0x00007faf10615b50, weak_ptr=0x00007faf10615b60, args=0x00007faf10615b70, args=0x00007faf10615b78)(base::TimeTicks, bool), base::WeakPtr<blink::scheduler::TaskQueueManager> const&, base::TimeTicks const&, bool const&>(void (blink::scheduler::TaskQueueManager::* const&&&)(base::TimeTicks, bool), base::WeakPtr<blink::scheduler::TaskQueueManager> const&&&, base::TimeTicks const&&&, bool const&&&) + 128 at bind_internal.h:305
            frame #33: 0x0000000134b53d0a libblink_platform.dylib`void base::internal::Invoker<base::internal::BindState<void (blink::scheduler::TaskQueueManager::*)(base::TimeTicks, bool), base::WeakPtr<blink::scheduler::TaskQueueManager>, base::TimeTicks, bool>, void ()>::RunImpl<void (functor=0x00007faf10615b50, bound=0x00007faf10615b60, (null)=IndexSequence<0, 1, 2> @ 0x00007fff56552908)(base::TimeTicks, bool), std::__1::tuple<base::WeakPtr<blink::scheduler::TaskQueueManager>, base::TimeTicks, bool> const&, 0ul, 1ul, 2ul>(void (blink::scheduler::TaskQueueManager::* const&&&)(base::TimeTicks, bool), std::__1::tuple<base::WeakPtr<blink::scheduler::TaskQueueManager>, base::TimeTicks, bool> const&&&, base::IndexSequence<0ul, 1ul, 2ul>) + 138 at bind_internal.h:361
            frame #34: 0x0000000134b53c1c libblink_platform.dylib`base::internal::Invoker<base::internal::BindState<void (blink::scheduler::TaskQueueManager::*)(base::TimeTicks, bool), base::WeakPtr<blink::scheduler::TaskQueueManager>, base::TimeTicks, bool>, void ()>::Run(base=0x00007faf10615b30) + 44 at bind_internal.h:339
            frame #35: 0x000000011d87cbeb libbase.dylib`base::internal::RunMixin<base::Callback<void (), (base::internal::CopyMode)1, (base::internal::RepeatMode)1> >::Run(this=0x00007fff56552eb8) const + 59 at callback.h:64
            frame #36: 0x000000011d8bff84 libbase.dylib`base::debug::TaskAnnotator::RunTask(this=0x00007faf10614f38, queue_function="MessageLoop::PostTask", pending_task=0x00007fff56552ea0) + 676 at task_annotator.cc:54
            frame #37: 0x000000011d99ad3d libbase.dylib`base::MessageLoop::RunTask(this=0x00007faf10614e00, pending_task=0x00007fff56552ea0) + 877 at message_loop.cc:488
            frame #38: 0x000000011d99b324 libbase.dylib`base::MessageLoop::DeferOrRunPendingTask(this=0x00007faf10614e00, pending_task=PendingTask @ 0x00007fff56552ea0) + 68 at message_loop.cc:497
            frame #39: 0x000000011d99bd9d libbase.dylib`base::MessageLoop::DoWork(this=0x00007faf10614e00) + 669 at message_loop.cc:621
            frame #40: 0x000000011d9acdc8 libbase.dylib`base::MessagePumpCFRunLoopBase::RunWork(this=0x00007faf10613590) + 104 at message_pump_mac.mm:330
            frame #41: 0x000000011d9acd4c libbase.dylib`::___ZN4base24MessagePumpCFRunLoopBase13RunWorkSourceEPv_block_invoke(.block_descriptor=<unavailable>) + 28 at message_pump_mac.mm:307
            frame #42: 0x000000011d95532a libbase.dylib`base::mac::CallWithEHFrame(void () block_pointer) + 10 at call_with_eh_frame_asm.S:36
            frame #43: 0x000000011d9ac2b5 libbase.dylib`base::MessagePumpCFRunLoopBase::RunWorkSource(info=0x00007faf10613590) + 101 at message_pump_mac.mm:306
            frame #44: 0x00007fff9216f7e1 CoreFoundation`__CFRUNLOOP_IS_CALLING_OUT_TO_A_SOURCE0_PERFORM_FUNCTION__ + 17
            frame #45: 0x00007fff9214ef1c CoreFoundation`__CFRunLoopDoSources0 + 556
            frame #46: 0x00007fff9214e43f CoreFoundation`__CFRunLoopRun + 927
            frame #47: 0x00007fff9214de38 CoreFoundation`CFRunLoopRunSpecific + 296
            frame #48: 0x00007fff96076ed9 Foundation`-[NSRunLoop(NSRunLoop) runMode:beforeDate:] + 270
            frame #49: 0x000000011d9ad8a9 libbase.dylib`base::MessagePumpNSRunLoop::DoRun(this=0x00007faf10613590, delegate=0x00007faf10614e00) + 137 at message_pump_mac.mm:608
            frame #50: 0x000000011d9aca9a libbase.dylib`base::MessagePumpCFRunLoopBase::Run(this=0x00007faf10613590, delegate=0x00007faf10614e00) + 122 at message_pump_mac.mm:238
            frame #51: 0x000000011d99a54a libbase.dylib`base::MessageLoop::RunHandler(this=0x00007faf10614e00) + 298 at message_loop.cc:451
            frame #52: 0x000000011da63195 libbase.dylib`base::RunLoop::Run(this=0x00007fff565549f8) + 85 at run_loop.cc:35
            frame #53: 0x0000000125efc4e1 libcontent.dylib`content::RendererMain(parameters=0x00007fff56555160) + 4465 at renderer_main.cc:198
            frame #54: 0x0000000126410ac7 libcontent.dylib`content::RunNamedProcessTypeMain(process_type="renderer", main_function_params=0x00007fff56555160, delegate=0x00007fff565555e0) + 599 at content_main_runner.cc:418
            frame #55: 0x00000001264129b6 libcontent.dylib`content::ContentMainRunnerImpl::Run(this=0x00007faf10403160) + 1462 at content_main_runner.cc:786
            frame #56: 0x000000012641032d libcontent.dylib`content::ContentMain(params=0x00007fff565555c0) + 349 at content_main.cc:20
            frame #57: 0x00000001098e67f3 libchrome_dll.dylib`::ChromeMain(argc=19, argv=0x00007fff56555730) + 83 at chrome_main.cc:85
            frame #58: 0x00000001096a9d7c Chromium Helper`main(argc=19, argv=0x00007fff56555730) + 780 at chrome_exe_main_mac.c:85
            frame #59: 0x00000001096a9a64 Chromium Helper`start + 52

## Debugging new Tab

1. Set breakpoint, just ignore warning.

        (lldb) breakpoint set -l 130 -f chrome_extensions_client.cc

1. wait for next process.

        (lldb) process attach -w

1. click the new-tab button in title bar of Chromium, breakpoint will be hit.

        $ lldb "/works/depot_tools/src/out/Default/Chromium.app/Contents/Versions/55.0.2860.0/Chromium Helper.app/Contents/MacOS/Chromium Helper"
        (lldb) target create "/works/depot_tools/src/out/Default/Chromium.app/Contents/Versions/55.0.2860.0/Chromium Helper.app/Contents/MacOS/Chromium Helper"
        Current executable set to '/works/depot_tools/src/out/Default/Chromium.app/Contents/Versions/55.0.2860.0/Chromium Helper.app/Contents/MacOS/Chromium Helper' (x86_64).
        (lldb) breakpoint set -l 130 -f chrome_extensions_client.cc
        Breakpoint 1: no locations (pending).
        WARNING:  Unable to resolve breakpoint to any actual locations.
        (lldb) process attach -w                                                                                                                                                                            1 location added to breakpoint 1
        Process 55852 stopped
        * thread #1: tid = 0x217373, 0x00007fff6ea58b80 dyld`ImageLoaderMachO::getInstallPath() const, queue = 'com.apple.main-thread', stop reason = signal SIGSTOP
            frame #0: 0x00007fff6ea58b80 dyld`ImageLoaderMachO::getInstallPath() const
        dyld`ImageLoaderMachO::getInstallPath:
        ->  0x7fff6ea58b80 <+0>: pushq  %rbp
            0x7fff6ea58b81 <+1>: movq   %rsp, %rbp
            0x7fff6ea58b84 <+4>: movl   0x70(%rdi), %ecx
            0x7fff6ea58b87 <+7>: xorl   %eax, %eax

        (lldb) cont
        Process 55852 resuming
        Process 55852 stopped
        * thread #1: tid = 0x217373, 0x000000010d84af22 libchrome_dll.dylib`extensions::ChromeExtensionsClient::Initialize(this=0x00000001151167f8) + 146 at chrome_extensions_client.cc:130, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
            frame #0: 0x000000010d84af22 libchrome_dll.dylib`extensions::ChromeExtensionsClient::Initialize(this=0x00000001151167f8) + 146 at chrome_extensions_client.cc:130
           127    // meant to be a general solution.
           128    // TODO(dmazzoni): remove this once we have an extension API that
           129    // allows any extension to request read-only access to webui pages.
        -> 130    scripting_whitelist_.push_back(extension_misc::kChromeVoxExtensionId);
           131  }
           132
           133  const PermissionMessageProvider&
        (lldb)
