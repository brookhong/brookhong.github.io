---
layout: post
title: A ports/memory leak from extensions of Google Chrome
category: en
---

{{ page.title }}
================
A memory issue of [Surfingkeys](https://github.com/brookhong/Surfingkeys) has upset me for months, since I tried to reduce memory usage by removing UI frames of background tabs. (The Chrome extension implements its own UI within a frame, so that it won't mess any page content.) But the memory usage hasn't been reduced obviously after such an improvement, which is supposed to be effective.

From `Activity Monitor` under MacOS, except the memory of the extension process which stays high, the number of open Ports also keeps increasing as page reloading or tab opening/closing. After diving into the source code of Chromium for weeks, I found a solid proof of Mach port leak with lldb, which then leads to memory leak, and even leads to the extension crash when the number of open ports reaches to some limit.

With several weekends spending on root cause investigation, I finally fixed the issue of Chromium(Google Chrome), and [the fix](https://chromium-review.googlesource.com/c/chromium/src/+/2132536) has been merged into Chromium officially. The performance of extensions in all Chromium based browsers across all platforms including MacOS, Windows and Linux will be improved by this fix, if there were iframes inserted by the extensions, such as Surfingkeys and Vimium, etc. For other platforms than MacOS, the leaked objects are not Mach Ports, they are counterparts of system event objects.

## The root cause first.

For those who just want to know the root cause, I put it here first.

    void RenderThreadImpl::AddRoute(int32_t routing_id, IPC::Listener* listener) {
      ChildThreadImpl::GetRouter()->AddRoute(routing_id, listener);
      auto it = pending_frame_creates_.find(routing_id);
      if (it == pending_frame_creates_.end())
        return;

      RenderFrameImpl* frame = RenderFrameImpl::FromRoutingID(routing_id);
      if (!frame)
        return;

      GetChannel()->AddListenerTaskRunner(
          routing_id,
          frame->GetTaskRunner(blink::TaskType::kInternalNavigationAssociated));

      // *** HERE IS WHERE THE LEAK STARTS ***
      unfreezable_message_filter_->AddListenerUnfreezableTaskRunner(
          routing_id,
          frame->GetTaskRunner(
              blink::TaskType::kInternalNavigationAssociatedUnfreezable));

      scoped_refptr<PendingFrameCreate> create(it->second);
      frame->BindFrame(it->second->TakeFrameReceiver());
      pending_frame_creates_.erase(it);
    }

    void RenderThreadImpl::RemoveRoute(int32_t routing_id) {
      ChildThreadImpl::GetRouter()->RemoveRoute(routing_id);
      // *** HERE IS WHERE THE LEAK SHOULD BE FIXED ***
      GetChannel()->RemoveListenerTaskRunner(routing_id);
    }

A task runner is added into `unfreezable_message_filter_` whenever a frame is created but never gets removed as other task runners added to a channel from `GetChannel()`.

    frame #0: 0x000000014119bcf5 libcontent.dylib`content::RenderThreadImpl::UnfreezableMessageFilter::AddListenerUnfreezableTaskRunner(this=0x00007fa3f9c47990, routing_id=57, unfreezable_task_runner=scoped_refptr<base::SingleThreadTaskRunner> @ 0x00007ffeebf66800) at ../../content/renderer/render_thread_impl.cc:2271:3
    frame #1: 0x000000014119b882 libcontent.dylib`content::RenderThreadImpl::AddRoute(this=0x00007fa3fa010400, routing_id=57, listener=0x00007fa3fc027400) at ../../content/renderer/render_thread_impl.cc:889:32
    frame #2: 0x00000001410f4259 libcontent.dylib`content::RenderFrameImpl::Initialize(this=0x00007fa3fc027400) at ../../content/renderer/render_frame_impl.cc:1945:24
    frame #3: 0x00000001410f51b8 libcontent.dylib`content::RenderFrameImpl::CreateFrame(routing_id=57, interface_provider=PendingRemote<service_manager::mojom::InterfaceProvider> @ 0x00007ffeebf67b30, browser_interface_broker=PendingRemote<blink::mojom::BrowserInterfaceBroker> @ 0x00007ffeebf67b28, previous_routing_id=55, opener_routing_id=-2, parent_routing_id=54, previous_sibling_routing_id=-2, devtools_frame_token=0x00007fa3f9f62ea0, replicated_state=0x00007fa3f9f62d80, compositor_deps=0x00007fa3fa010400, widget_params=0x00007fa3f9f61800, frame_owner_properties=0x00007fa3f9f62eb0, has_committed_real_load=false) at ../../content/renderer/render_frame_impl.cc:1664:17
    frame #4: 0x00000001411a4a82 libcontent.dylib`content::RenderThreadImpl::CreateFrame(this=0x00007fa3fa010400, params=content::mojom::CreateFrameParamsPtr @ 0x00007ffeebf68530) at ../../content/renderer/render_thread_impl.cc:1861:3
    frame #5: 0x000000013deb027a libcontent.dylib`content::mojom::RendererStubDispatch::Accept(impl=0x00007fa3fa010400, message=0x00007ffeebf6bf20) at gen/content/common/renderer.mojom.cc:1032:13
    frame #6: 0x00000001411a9f85 libcontent.dylib`content::mojom::RendererStub<mojo::RawPtrImplRefTraits<content::mojom::Renderer> >::Accept(this=0x00007fa3fa010938, message=0x00007ffeebf6bf20) at gen/content/common/renderer.mojom.h:234:12
    frame #7: 0x000000010c9b552b libbindings.dylib`mojo::InterfaceEndpointClient::HandleValidatedMessage(this=0x00007fa3f9c54220, message=0x00007ffeebf6bf20) at ../../mojo/public/cpp/bindings/lib/interface_endpoint_client.cc:554:54
    frame #8: 0x000000010c9b4de1 libbindings.dylib`mojo::InterfaceEndpointClient::HandleIncomingMessageThunk::Accept(this=0x00007fa3f9c54348, message=0x00007ffeebf6bf20) at ../../mojo/public/cpp/bindings/lib/interface_endpoint_client.cc:140:18
    frame #9: 0x000000010c9c6133 libbindings.dylib`mojo::MessageDispatcher::Accept(this=0x00007fa3f9c54358, message=0x00007ffeebf6bf20) at ../../mojo/public/cpp/bindings/lib/message_dispatcher.cc:41:19
    frame #10: 0x000000010c9b8198 libbindings.dylib`mojo::InterfaceEndpointClient::HandleIncomingMessage(this=0x00007fa3f9c54220, message=0x00007ffeebf6bf20) at ../../mojo/public/cpp/bindings/lib/interface_endpoint_client.cc:356:22
    frame #11: 0x000000010edc9e8e libipc.dylib`IPC::(anonymous namespace)::ChannelAssociatedGroupController::AcceptOnProxyThread(this=0x00007fa3f9d0f500, message=Message @ 0x00007ffeebf6bf20) at ../../ipc/ipc_mojo_bootstrap.cc:933:24

Here, I printed out below data within `lldb`,

    (lldb) p &(((sequence_manager::internal::TaskQueueImpl::TaskRunner *)unfreezable_task_runner.get())->task_poster_->operations_controller_.shutdown_complete_)
    (base::WaitableEvent *) $27 = 0x00007fa3f9e0b400

Please note that the `0x00007fa3f9e0b400` is just the `base::WaitableEvent` created in below stack.

The task runner (`base::sequence_manager::internal::TaskQueueImpl::TaskRunner` -- child of `base::SingleThreadTaskRunner`) being held in `unfreezable_message_filter_` refers to an object of `base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster`, which holds an object of `base::internal::OperationsController`, which then holds an object of `base::WaitableEvent`, which finally holds an open mach port.

    frame #0: 0x000000010b81281c libbase.dylib`base::WaitableEvent::WaitableEvent(this=0x00007fa3f9e0b400, reset_policy=MANUAL, initial_state=NOT_SIGNALED) at ../../base/synchronization/waitable_event_mac.cc:39:3
    frame #1: 0x000000010b812e71 libbase.dylib`base::WaitableEvent::WaitableEvent(this=0x00007fa3f9e0b400, reset_policy=MANUAL, initial_state=NOT_SIGNALED) at ../../base/synchronization/waitable_event_mac.cc:29:29
    frame #2: 0x000000010b5fd6c7 libbase.dylib`base::internal::OperationsController::OperationsController(this=0x00007fa3f9e0b3f8) at ../../base/task/common/operations_controller.cc:11:23
    frame #3: 0x000000010b5fd6e5 libbase.dylib`base::internal::OperationsController::OperationsController(this=0x00007fa3f9e0b3f8) at ../../base/task/common/operations_controller.cc:11:44
    frame #4: 0x000000010b638125 libbase.dylib`base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster::GuardedTaskPoster(this=0x00007fa3f9e0b3f0, outer=0x00007fa3f9e46a90) at ../../base/task/sequence_manager/task_queue_impl.cc:62:35
    frame #5: 0x000000010b63817d libbase.dylib`base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster::GuardedTaskPoster(this=0x00007fa3f9e0b3f0, outer=0x00007fa3f9e46a90) at ../../base/task/sequence_manager/task_queue_impl.cc:63:21
    frame #6: 0x000000010b638e62 libbase.dylib`scoped_refptr<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster> base::MakeRefCounted<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster, base::sequence_manager::internal::TaskQueueImpl*>(args=0x00007ffeebf64bf8) at ../../base/memory/scoped_refptr.h:99:16
    frame #7: 0x000000010b638be0 libbase.dylib`base::sequence_manager::internal::TaskQueueImpl::TaskQueueImpl(this=0x00007fa3f9e46a90, sequence_manager=0x00007fa3fc008a00, time_domain=0x00007fa3f9f26ef0, spec=0x00007ffeebf65528) at ../../base/task/sequence_manager/task_queue_impl.cc:119:20
    frame #8: 0x000000010b63903d libbase.dylib`base::sequence_manager::internal::TaskQueueImpl::TaskQueueImpl(this=0x00007fa3f9e46a90, sequence_manager=0x00007fa3fc008a00, time_domain=0x00007fa3f9f26ef0, spec=0x00007ffeebf65528) at ../../base/task/sequence_manager/task_queue_impl.cc:128:58
    frame #9: 0x000000010b6128b4 libbase.dylib`std::__1::__unique_if<base::sequence_manager::internal::TaskQueueImpl>::__unique_single std::__1::make_unique<base::sequence_manager::internal::TaskQueueImpl, base::sequence_manager::internal::SequenceManagerImpl*, base::sequence_manager::TimeDomain*&, base::sequence_manager::TaskQueue::Spec const&>(__args=0x00007ffeebf64e38, __args=0x00007ffeebf64e58, __args=0x00007ffeebf65528) at /works/depot_tools/chromium/src/buildtools/third_party/libc++/trunk/include/memory:3043:32
    frame #10: 0x000000010b612656 libbase.dylib`base::sequence_manager::internal::SequenceManagerImpl::CreateTaskQueueImpl(this=0x00007fa3fc008a00, spec=0x00007ffeebf65528) at ../../base/task/sequence_manager/sequence_manager_impl.cc:385:7
    frame #11: 0x0000000193c4fc82 libblink_platform.dylib`scoped_refptr<blink::scheduler::MainThreadTaskQueue> base::sequence_manager::SequenceManager::CreateTaskQueueWithType<blink::scheduler::MainThreadTaskQueue, blink::scheduler::MainThreadTaskQueue::QueueCreationParams const&, blink::scheduler::MainThreadSchedulerImpl*&>(this=0x00007fa3fc008a00, spec=0x00007ffeebf65528, args=0x00007ffeebf65520, args=0x00007fa3fc00c858) at ../../base/task/sequence_manager/sequence_manager.h:218:45
    frame #12: 0x0000000193c4f7ae libblink_platform.dylib`blink::scheduler::MainThreadSchedulerHelper::NewTaskQueue(this=0x00007fa3fc00bdd0, params=0x00007ffeebf65520) at ../../third_party/blink/renderer/platform/scheduler/main_thread/main_thread_scheduler_helper.cc:67:26
    frame #13: 0x0000000193c518c8 libblink_platform.dylib`blink::scheduler::MainThreadSchedulerImpl::NewTaskQueue(this=0x00007fa3fc00ba00, params=0x00007ffeebf65520) at ../../third_party/blink/renderer/platform/scheduler/main_thread/main_thread_scheduler_impl.cc:739:57
    frame #14: 0x0000000193c39b86 libblink_platform.dylib`blink::scheduler::FrameTaskQueueController::CreateTaskQueue(this=0x0000002a42694eb0, queue_traits=blink::scheduler::QueueTraits @ 0x00007ffeebf65338) at ../../third_party/blink/renderer/platform/scheduler/main_thread/frame_task_queue_controller.cc:123:36
    frame #15: 0x0000000193c394c9 libblink_platform.dylib`blink::scheduler::FrameTaskQueueController::GetTaskQueue(this=0x0000002a42694eb0, queue_traits=QueueTraits @ 0x00007ffeebf658b8) at ../../third_party/blink/renderer/platform/scheduler/main_thread/frame_task_queue_controller.cc:45:5
    frame #16: 0x0000000193c25e49 libblink_platform.dylib`blink::scheduler::FrameSchedulerImpl::GetTaskQueue(this=0x0000002a4275cd90, type=kInternalInspector) at ../../third_party/blink/renderer/platform/scheduler/main_thread/frame_scheduler_impl.cc:544:40
    frame #17: 0x0000000193c25afc libblink_platform.dylib`blink::scheduler::FrameSchedulerImpl::GetTaskRunner(this=0x0000002a4275cd90, type=kInternalInspector) at ../../third_party/blink/renderer/platform/scheduler/main_thread/frame_scheduler_impl.cc:528:51
    frame #18: 0x0000000186d9c2fc libblink_core.dylib`blink::LocalFrame::GetTaskRunner(this=0x00000029967be438, type=kInternalInspector) at ../../third_party/blink/renderer/core/frame/local_frame.cc:928:28
    frame #19: 0x0000000186d9b37f libblink_core.dylib`blink::LocalFrame::LocalFrame(this=0x00000029967be438, client=0x00000029967be2f8, page=0x00000029967bd048, owner=0x00000040024095f8, inheriting_agent_factory=0x00000047130b9530, interface_registry=0x00007fa3ff93bec0, clock=0x000000010b8aebf0) at ../../third_party/blink/renderer/core/frame/local_frame.cc:879:11
    frame #20: 0x0000000186d9cd3d libblink_core.dylib`blink::LocalFrame::LocalFrame(this=0x00000029967be438, client=0x00000029967be2f8, page=0x00000029967bd048, owner=0x00000040024095f8, inheriting_agent_factory=0x00000047130b9530, interface_registry=0x00007fa3ff93bec0, clock=0x000000010b8aebf0) at ../../third_party/blink/renderer/core/frame/local_frame.cc:884:62
    frame #21: 0x0000000186ee425f libblink_core.dylib`blink::LocalFrame* blink::MakeGarbageCollected<blink::LocalFrame, blink::LocalFrameClientImpl*, blink::Page&, blink::FrameOwner*&, blink::WindowAgentFactory*&, blink::InterfaceRegistry*&>(args=0x00007ffeebf66470, args=0x00000029967bd048, args=0x00007ffeebf66480, args=0x00007ffeebf66478, args=0x00000029967be298) at ../../third_party/blink/renderer/platform/heap/heap.h:535:30
    frame #22: 0x0000000186ee2b76 libblink_core.dylib`blink::WebLocalFrameImpl::InitializeCoreFrame(this=0x00000029967be1d0, page=0x00000029967bd048, owner=0x00000040024095f8, name=0x00000029967bde48, window_agent_factory=0x00000047130b9530, sandbox_flags=kNone, opener_feature_state=size=0) at ../../third_party/blink/renderer/core/frame/web_local_frame_impl.cc:1827:16
    frame #23: 0x0000000186ee28fa libblink_core.dylib`blink::WebLocalFrameImpl::CreateProvisional(client=0x00007fa3fc027400, interface_registry=0x00007fa3ff93bec0, previous_web_frame=0x00000029967bdd88, frame_policy=0x00007fa3f9f62e20) at ../../third_party/blink/renderer/core/frame/web_local_frame_impl.cc:1743:14
    frame #24: 0x0000000186ee262d libblink_core.dylib`blink::WebLocalFrame::CreateProvisional(client=0x00007fa3fc027400, interface_registry=0x00007fa3ff93bec0, previous_frame=0x00000029967bdd88, frame_policy=0x00007fa3f9f62e20) at ../../third_party/blink/renderer/core/frame/web_local_frame_impl.cc:1682:10
    frame #25: 0x00000001410f48a4 libcontent.dylib`content::RenderFrameImpl::CreateFrame(routing_id=57, interface_provider=PendingRemote<service_manager::mojom::InterfaceProvider> @ 0x00007ffeebf67b30, browser_interface_broker=PendingRemote<blink::mojom::BrowserInterfaceBroker> @ 0x00007ffeebf67b28, previous_routing_id=55, opener_routing_id=-2, parent_routing_id=54, previous_sibling_routing_id=-2, devtools_frame_token=0x00007fa3f9f62ea0, replicated_state=0x00007fa3f9f62d80, compositor_deps=0x00007fa3fa010400, widget_params=0x00007fa3f9f61800, frame_owner_properties=0x00007fa3f9f62eb0, has_committed_real_load=false) at ../../content/renderer/render_frame_impl.cc:1551:17
    frame #26: 0x00000001411a4a82 libcontent.dylib`content::RenderThreadImpl::CreateFrame(this=0x00007fa3fa010400, params=content::mojom::CreateFrameParamsPtr @ 0x00007ffeebf68530) at ../../content/renderer/render_thread_impl.cc:1861:3
    frame #27: 0x000000013deb027a libcontent.dylib`content::mojom::RendererStubDispatch::Accept(impl=0x00007fa3fa010400, message=0x00007ffeebf6bf20) at gen/content/common/renderer.mojom.cc:1032:13
    frame #28: 0x00000001411a9f85 libcontent.dylib`content::mojom::RendererStub<mojo::RawPtrImplRefTraits<content::mojom::Renderer> >::Accept(this=0x00007fa3fa010938, message=0x00007ffeebf6bf20) at gen/content/common/renderer.mojom.h:234:12
    frame #29: 0x000000010c9b552b libbindings.dylib`mojo::InterfaceEndpointClient::HandleValidatedMessage(this=0x00007fa3f9c54220, message=0x00007ffeebf6bf20) at ../../mojo/public/cpp/bindings/lib/interface_endpoint_client.cc:554:54
    frame #30: 0x000000010c9b4de1 libbindings.dylib`mojo::InterfaceEndpointClient::HandleIncomingMessageThunk::Accept(this=0x00007fa3f9c54348, message=0x00007ffeebf6bf20) at ../../mojo/public/cpp/bindings/lib/interface_endpoint_client.cc:140:18
    frame #31: 0x000000010c9c6133 libbindings.dylib`mojo::MessageDispatcher::Accept(this=0x00007fa3f9c54358, message=0x00007ffeebf6bf20) at ../../mojo/public/cpp/bindings/lib/message_dispatcher.cc:41:19
    frame #32: 0x000000010c9b8198 libbindings.dylib`mojo::InterfaceEndpointClient::HandleIncomingMessage(this=0x00007fa3f9c54220, message=0x00007ffeebf6bf20) at ../../mojo/public/cpp/bindings/lib/interface_endpoint_client.cc:356:22
    frame #33: 0x000000010edc9e8e libipc.dylib`IPC::(anonymous namespace)::ChannelAssociatedGroupController::AcceptOnProxyThread(this=0x00007fa3f9d0f500, message=Message @ 0x00007ffeebf6bf20) at ../../ipc/ipc_mojo_bootstrap.cc:933:24


The open port should be destructed when the `GuardedTaskPoster` is freed as it works for other ports below, but since there is a reference to the `GuardedTaskPoster` through the `TaskRunner`, the `GuardedTaskPoster` is never freed, then the Mach Port is kept open until the extension is terminated.

    frame #0: 0x000000010b7f541d libbase.dylib`base::mac::internal::ReceiveRightTraits::Free(port=32019) at ../../base/mac/scoped_mach_port.cc:24:3
    frame #1: 0x000000010b7f1f8c libbase.dylib`base::ScopedGeneric<unsigned int, base::mac::internal::ReceiveRightTraits>::FreeIfNecessary(this=0x00007fa3ff968888) at ../../base/scoped_generic.h:279:7
    frame #2: 0x000000010b7f1f10 libbase.dylib`base::ScopedGeneric<unsigned int, base::mac::internal::ReceiveRightTraits>::~ScopedGeneric(this=0x00007fa3ff968888) at ../../base/scoped_generic.h:124:5
    frame #3: 0x000000010b7edc65 libbase.dylib`base::ScopedGeneric<unsigned int, base::mac::internal::ReceiveRightTraits>::~ScopedGeneric(this=0x00007fa3ff968888) at ../../base/scoped_generic.h:122:28
    frame #4: 0x000000010b8156e8 libbase.dylib`base::WaitableEvent::ReceiveRight::~ReceiveRight(this=0x00007fa3ff968880) at ../../base/synchronization/waitable_event_mac.cc:377:44
    frame #5: 0x000000010b815755 libbase.dylib`base::WaitableEvent::ReceiveRight::~ReceiveRight(this=0x00007fa3ff968880) at ../../base/synchronization/waitable_event_mac.cc:377:44
    frame #6: 0x000000010b816a57 libbase.dylib`void base::RefCountedThreadSafe<base::WaitableEvent::ReceiveRight, base::DefaultRefCountedThreadSafeTraits<base::WaitableEvent::ReceiveRight> >::DeleteInternal<base::WaitableEvent::ReceiveRight>(x=0x00007fa3ff968880) at ../../base/memory/ref_counted.h:418:5
    frame #7: 0x000000010b816a25 libbase.dylib`base::DefaultRefCountedThreadSafeTraits<base::WaitableEvent::ReceiveRight>::Destruct(x=0x00007fa3ff968880) at ../../base/memory/ref_counted.h:373:5
    frame #8: 0x000000010b813688 libbase.dylib`base::RefCountedThreadSafe<base::WaitableEvent::ReceiveRight, base::DefaultRefCountedThreadSafeTraits<base::WaitableEvent::ReceiveRight> >::Release(this=0x00007fa3ff968880) const at ../../base/memory/ref_counted.h:407:7
    frame #9: 0x000000010b816178 libbase.dylib`scoped_refptr<base::WaitableEvent::ReceiveRight>::Release(ptr=0x00007fa3ff968880) at ../../base/memory/scoped_refptr.h:322:8
    frame #10: 0x000000010b81615a libbase.dylib`scoped_refptr<base::WaitableEvent::ReceiveRight>::~scoped_refptr(this=0x00007fa3ff968cf8) at ../../base/memory/scoped_refptr.h:224:7
    frame #11: 0x000000010b812ed5 libbase.dylib`scoped_refptr<base::WaitableEvent::ReceiveRight>::~scoped_refptr(this=0x00007fa3ff968cf8) at ../../base/memory/scoped_refptr.h:217:20
    frame #12: 0x000000010b812eb8 libbase.dylib`base::WaitableEvent::~WaitableEvent(this=0x00007fa3ff968cf0) at ../../base/synchronization/waitable_event_mac.cc:45:31
    frame #13: 0x000000010b812ef5 libbase.dylib`base::WaitableEvent::~WaitableEvent(this=0x00007fa3ff968cf0) at ../../base/synchronization/waitable_event_mac.cc:45:31
    frame #14: 0x000000010b5fd815 libbase.dylib`base::internal::OperationsController::~OperationsController(this=0x00007fa3ff968ce8) at ../../base/task/common/operations_controller.cc:24:1
    frame #15: 0x000000010b5fd8c5 libbase.dylib`base::internal::OperationsController::~OperationsController(this=0x00007fa3ff968ce8) at ../../base/task/common/operations_controller.cc:13:47
    frame #16: 0x000000010b6381b6 libbase.dylib`base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster::~GuardedTaskPoster(this=0x00007fa3ff968ce0) at ../../base/task/sequence_manager/task_queue_impl.cc:65:57
    frame #17: 0x000000010b638205 libbase.dylib`base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster::~GuardedTaskPoster(this=0x00007fa3ff968ce0) at ../../base/task/sequence_manager/task_queue_impl.cc:65:56
    frame #18: 0x000000010b645167 libbase.dylib`void base::RefCountedThreadSafe<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster, base::DefaultRefCountedThreadSafeTraits<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster> >::DeleteInternal<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster>(x=0x00007fa3ff968ce0) at ../../base/memory/ref_counted.h:418:5
    frame #19: 0x000000010b645135 libbase.dylib`base::DefaultRefCountedThreadSafeTraits<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster>::Destruct(x=0x00007fa3ff968ce0) at ../../base/memory/ref_counted.h:373:5
    frame #20: 0x000000010b645118 libbase.dylib`base::RefCountedThreadSafe<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster, base::DefaultRefCountedThreadSafeTraits<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster> >::Release(this=0x00007fa3ff968ce0) const at ../../base/memory/ref_counted.h:407:7
    frame #21: 0x000000010b6450d8 libbase.dylib`scoped_refptr<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster>::Release(ptr=0x00007fa3ff968ce0) at ../../base/memory/scoped_refptr.h:322:8
    frame #22: 0x000000010b6450ba libbase.dylib`scoped_refptr<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster>::~scoped_refptr(this=0x00007fa3ff95e7d8) at ../../base/memory/scoped_refptr.h:224:7
    frame #23: 0x000000010b6386a5 libbase.dylib`scoped_refptr<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster>::~scoped_refptr(this=0x00007fa3ff95e7d8) at ../../base/memory/scoped_refptr.h:217:20

## How to reproduce the issue easily.

I have created a bug -- [1063577 - Mach port leak from extension under MacOS - chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1063577), which described how to easily reproduce the bug without Surfingkeys. I believe this bug also affects all extensions using iframe such as [vimium](https://github.com/philc/vimium).

## How to find the root cause.

To find the root cause of this issue in such a large project as Chromium is not a trivial task for me. `lldb` is a great tool to help on this. After attaching to the extension process, set breakpoint as below

    breakpoint set --name mach_port_construct
    breakpoint set --name mach_port_allocate

so that we could find where the mach ports are opened, but which is just the first step on the journey, and I was wrongly directed to investigate memory leak of `blink` by the call stack, since the port was open on `LocalFrame` construction.

    frame #19: 0x0000000186d9b37f libblink_core.dylib`blink::LocalFrame::LocalFrame(this=0x00000029967be438, client=0x00000029967be2f8, page=0x00000029967bd048, owner=0x00000040024095f8, inheriting_agent_factory=0x00000047130b9530, interface_registry=0x00007fa3ff93bec0, clock=0x000000010b8aebf0) at ../../third_party/blink/renderer/core/frame/local_frame.cc:879:11

There two kinds of memory management schemes -- `base::MakeRefCounted` and `blink::MakeGarbageCollected` in Chromium. The ref-count scheme is widely used and wellknown. The other scheme is so-called oilpan -- [Blink GC API reference](https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/platform/heap/BlinkGCAPIReference.md), I like the name oilpan, which is very intuitive and imaginative. I spent much time on finding object leak of blink, as I thought it was some object there keeping the mach port open, and ever thought I had found the cause -- [1058367 - HTMLDocument in iframe from chrome extension does not get freed if it contains an input element. - chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=1058367). But the issue only happens in debug version of Chromium.

After I built Chromium release with [a patch](https://github.com/brookhong/chromilab/blob/master/6c80da46daa9a3715b9fd698817d5022d1a533f5.80.0.3987.0/Portleak_debug.diff) to track the suspected leaking objects, I found I was wrong except that the mach ports do get leaked. I turned back to look into which objects are holding the mach ports and the referrence chain behind it.

With above patch I also could identify which `TaskRunner` is leaked after page reloaded, then find the address of `AddRef` of `TaskRunner` by

    image lookup -vn "base::RefCountedThreadSafe<base::TaskRunner, base::TaskRunnerTraits>::AddRef"

Set breakpoint with address(in libbase.dylib) found above, to set breakpoint with file name and line number dose not work in this case, since `base::RefCountedThreadSafe` is implemented as template class,

    breakpoint set -a <address_of_addref_of_taskrunner> -c this==<address_of_taskrunner>

Also set breakpoint on the address of below symbol with right condition

    image lookup -vn "base::RefCountedThreadSafe<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster, base::DefaultRefCountedThreadSafeTraits<base::sequence_manager::internal::TaskQueueImpl::GuardedTaskPoster> >::AddRef"

Then finally identified the root cause listed above.

Anyway the effort I spent on root cause(there were many back-and-forth debugging) was nearly 20 times of the effort I spent on writing the fix.
