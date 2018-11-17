---
layout: post
title: 在Chrome禁用的页面使用Surfingkeys
category: cn
---

{{ page.title }}
================

当你碰到下面这些页面时，可能会有点恼火，因为在这些页面所有快捷都不能用。

* Chrome自带的页面，如`chrome://extensions/`
* 谷歌扩展商店，https://chrome.google.com/webstore/category/extensions
* 其它扩展提供的页面，如`chrome-extension://youmaygetannoyingwhenyoucometobe/options.html`

出现这种情况是因为Chrome浏览器禁止在这些页面加载任何普通扩展程序。
我下载了Chromium源码，给程序打了个补丁，单独放开了对Surfingkeys的限制，这样你就可以随处使用它了。

## 从onedrive.live.com下载

### 最新稳定版 - 70.0.3538.102
* [Chromium 70.0.3538.102(Brook Build).dmg](https://1drv.ms/u/s!AtpOdm9tOTsajkFKDMnotaSkF_Eq) md5 1509a6ffc0cc7f30bdc58f1d51b4fba1
* [Chromium_installer 70.0.3538.102(Brook Build).exe](https://1drv.ms/u/s!AtpOdm9tOTsajkAqg4gbaEaJ9H07) md5 c8779be6c2f0a34778feab4e5d904617

## 从百度网盘下载

### 最新稳定版 - 70.0.3538.102
* [Chromium 70.0.3538.102(Brook Build).dmg](https://pan.baidu.com/s/1Q7eeAtUuD3RFr-3DBcGDjg) md5 1509a6ffc0cc7f30bdc58f1d51b4fba1
* [Chromium_installer 70.0.3538.102(Brook Build).exe](https://pan.baidu.com/s/1SWlxQPj5MlZqUWv_Dw9aXQ) md5 c8779be6c2f0a34778feab4e5d904617

## 截屏

![image](https://user-images.githubusercontent.com/288207/31577261-c7ca6e1c-b0d0-11e7-9da1-c4c0732214de.png)
![image](https://user-images.githubusercontent.com/288207/31435705-282aaf70-ae46-11e7-8487-1792bdd5fd2c.png)

## 历史
* 2017/10/20 第二次编译，增加视频支持。
* 2017/10/14 第一次编译

## 补丁代码

    diff --git a/content/browser/frame_host/navigator_impl.cc b/content/browser/frame_host/navigator_impl.cc
    index f637193e644f..60f9f5cd3644 100644
    --- a/content/browser/frame_host/navigator_impl.cc
    +++ b/content/browser/frame_host/navigator_impl.cc
    @@ -147,6 +147,10 @@ void NavigatorImpl::CheckWebUIRendererDoesNotDisplayNormalURL(
                   ->GetController()
                   ->GetBrowserContext(),
               url);
    +  bool whitelistedSurfingkeys = url.host() == "gfbliohnnapiefjpjlpjnehglfpaknnc";
    +  if (whitelistedSurfingkeys) {
    +    is_allowed_in_web_ui_renderer = true;
    +  }
       if ((enabled_bindings & BINDINGS_POLICY_WEB_UI) &&
           !is_allowed_in_web_ui_renderer) {
         // Log the URL to help us diagnose any future failures of this CHECK.
    diff --git a/extensions/renderer/extension_injection_host.cc b/extensions/renderer/extension_injection_host.cc
    index 86374f581ba6..376c887b150a 100644
    --- a/extensions/renderer/extension_injection_host.cc
    +++ b/extensions/renderer/extension_injection_host.cc
    @@ -50,6 +50,11 @@ PermissionsData::AccessType ExtensionInjectionHost::CanExecuteOnFrame(
         content::RenderFrame* render_frame,
         int tab_id,
         bool is_declarative) const {
    +  if (render_frame->GetWebFrame()->GetSecurityOrigin().Host().Utf8() != extension_->id()
    +      && (extension_->id() == "gfbliohnnapiefjpjlpjnehglfpaknnc")) {
    +    return PermissionsData::ACCESS_ALLOWED;
    +  }
    +
       blink::WebSecurityOrigin top_frame_security_origin =
           render_frame->GetWebFrame()->Top()->GetSecurityOrigin();
       // Only whitelisted extensions may run scripts on another extension's page.
    diff --git a/extensions/renderer/user_script_set.cc b/extensions/renderer/user_script_set.cc
    index 8b50ecc2a192..653829453f0a 100644
    --- a/extensions/renderer/user_script_set.cc
    +++ b/extensions/renderer/user_script_set.cc
    @@ -218,7 +218,11 @@ std::unique_ptr<ScriptInjection> UserScriptSet::GetInjectionForScript(
       GURL effective_document_url = ScriptContext::GetEffectiveDocumentURL(
           web_frame, document_url, script->match_about_blank());
     
    -  if (!script->MatchesURL(effective_document_url))
    +  // whitelisted Surfingkeys only on top frame
    +  bool whitelistedSurfingkeys = (!web_frame->Parent()
    +      && (script->extension_id() == "gfbliohnnapiefjpjlpjnehglfpaknnc"));
    +
    +  if (!script->MatchesURL(effective_document_url) && !whitelistedSurfingkeys)
         return injection;
     
       std::unique_ptr<ScriptInjector> injector(

## 补丁打在这里

      * frame #0: `extensions::ExtensionInjectionHost::CanExecuteOnFrame(this=0x00007f9882441fb0, document_url=0x00007fff5a0c8268, render_frame=0x00007f9883834400, tab_id=2, is_declarative=false) const at extension_injection_host.cc:53 [opt]
        frame #1: `extensions::UserScriptInjector::CanExecuteOnFrame(this=<unavailable>, injection_host=0x00007f9882441fb0, web_frame=0x000000308a9e1d18, tab_id=2) at user_script_injector.cc:204 [opt]
        frame #2: `extensions::UserScriptSet::GetInjectionForScript(this=0x00007f9885806ee8, script=0x00007f988273f6b0, render_frame=0x00007f9883834400, tab_id=2, run_location=DOCUMENT_START, document_url=<unavailable>, is_declarative=<unavailable>, log_activity=true) at user_script_set.cc:228 [opt]
        frame #3: `extensions::UserScriptSet::GetInjections(this=0x00007f9885806ee8, injections=0x00007fff5a0c87a0 size=1, render_frame=0x00007f9883834400, tab_id=2, run_location=DOCUMENT_START, log_activity=<unavailable>) at user_script_set.cc:88 [opt]
        frame #4: `extensions::UserScriptSetManager::GetAllInjections(this=0x00007f9885806ee0, injections=0x00007fff5a0c87a0 size=1, render_frame=0x00007f9883834400, tab_id=2, run_location=DOCUMENT_START) at user_script_set_manager.cc:67 [opt]
        frame #5: `extensions::ScriptInjectionManager::InjectScripts(this=0x00007f9885807120, frame=0x00007f9883834400, run_location=DOCUMENT_START) at script_injection_manager.cc:412 [opt]
        frame #6: `extensions::ExtensionFrameHelper::RunScriptsAtDocumentStart() [inlined] base::RepeatingCallback<void ()>::Run() const & at callback.h:92 [opt]
        frame #7: `extensions::ExtensionFrameHelper::RunScriptsAtDocumentStart() [inlined] extensions::(anonymous namespace)::RunCallbacksWhileFrameIsValid(base::WeakPtr<extensions::ExtensionFrameHelper>, std::__1::vector<base::RepeatingCallback<void ()>, std::__1::allocator<base::RepeatingCallback<void ()> > >*) at extension_frame_helper.cc:83 [opt]
        frame #8: `extensions::ExtensionFrameHelper::RunScriptsAtDocumentStart(this=<unavailable>) at extension_frame_helper.cc:166 [opt]
        frame #9: `content::RenderFrameImpl::RunScriptsAtDocumentElementAvailable(this=0x00007f9883834400) at render_frame_impl.cc:3890 [opt]
        frame #10: `blink::HTMLTreeBuilder::ProcessStartTag(this=0x000000308ab13948, token=0x00007fff5a0c8a60) at HTMLTreeBuilder.cpp:1010 [opt]
        frame #11: `blink::HTMLTreeBuilder::ConstructTree(this=0x000000308ab13948, token=0x00007fff5a0c8a60) at HTMLTreeBuilder.cpp:311 [opt]
        frame #12: `blink::HTMLDocumentParser::ProcessTokenizedChunkFromBackgroundParser(std::__1::unique_ptr<blink::HTMLDocumentParser::TokenizedChunk, std::__1::default_delete<blink::HTMLDocumentParser::TokenizedChunk> >) [inlined] blink::HTMLDocumentParser::ConstructTreeFromCompactHTMLToken(blink::CompactHTMLToken const&) at HTMLDocumentParser.cpp:747 [opt]
        frame #13: `blink::HTMLDocumentParser::ProcessTokenizedChunkFromBackgroundParser(this=0x000000308ab13590, pop_chunk=<unavailable>) at HTMLDocumentParser.cpp:534 [opt]
        frame #14: `blink::HTMLDocumentParser::PumpPendingSpeculations(this=0x000000308ab13590) at HTMLDocumentParser.cpp:608 [opt]
