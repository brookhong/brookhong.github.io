---
layout: post
title: Surfingkeys across all pages
category: en
---

{{ page.title }}
================

You may get annoying when you come to below pages, as Surfingkeys(actually all normal extensions) does not work on those pages.

* Chrome built-in pages like `chrome://extensions/`
* Google Webstore https://chrome.google.com/webstore/category/extensions
* Pages from other extensions like chrome-extension://youmaygetannoyingwhenyoucometobe/options.html

That's because the browser Chrome does not allow that for security reason.

I fecthed Chromium source code, and created a patch to whitelist Surfingkeys, so that Surfingkeys could work on above pages.

## Download from onedrive.live.com

### 67.0.3391
* [Chromium 67.0.3391(Brook Build) For Mac](https://1drv.ms/u/s!AtpOdm9tOTsajVhFHNQ2pYukAuZJ) md5 584dd714f6ac96a90f5f990d20284662
* [Chromium_installer 67.0.3391(Brook Build) For Windows](https://1drv.ms/u/s!AtpOdm9tOTsajVnDjh9DQzpG6-HQ) md5 77815be6f46339a64629519548ba1b00

### 66.0.3329
* [macOS -- Chromium 66.0.3329(Brook Build) For Mac](https://1drv.ms/u/s!AtpOdm9tOTsajVbxJY3q4yxu4w91) md5 1e6c9b070f4de31d96b8835e3ceb3f90

### 63.0.3238
* [Windows -- Chromium_installer 63.0.3238(Brook Build) For Windows](https://1drv.ms/u/s!AtpOdm9tOTsajTeRhgEm3RtyA9vO) md5 025ad56d311cacd369b03dfd0fde8126
* [macOS -- Chromium 63.0.3238(Brook Build) For Mac](https://1drv.ms/u/s!AtpOdm9tOTsajTZfQUPQJqVLJPtk) md5 2ae9f20612015cfa2c72193fd8aaf224

## Download from pan.baidu.com

### 67.0.3391
* [Chromium 67.0.3391(Brook Build) For Mac](https://pan.baidu.com/s/1UCGN-n9zE3d5xlmRwuBJqw) md5 584dd714f6ac96a90f5f990d20284662
* [Chromium_installer 67.0.3391(Brook Build) For Windows](https://pan.baidu.com/s/1mIA7MSGhBFkRvioDZNxQPQ) md5 77815be6f46339a64629519548ba1b00

### 63.0.3238
* [Windows -- Chromium_installer 63.0.3238(Brook Build) For Windows](https://pan.baidu.com/s/1slv6kDB) md5 025ad56d311cacd369b03dfd0fde8126
* [macOS -- Chromium 63.0.3238(Brook Build) For Mac](https://pan.baidu.com/s/1dFetAkL) md5 2ae9f20612015cfa2c72193fd8aaf224


## Screenshots

![image](https://user-images.githubusercontent.com/288207/31577261-c7ca6e1c-b0d0-11e7-9da1-c4c0732214de.png)
![image](https://user-images.githubusercontent.com/288207/31435705-282aaf70-ae46-11e7-8487-1792bdd5fd2c.png)

## History
* 2017/10/20 2nd build with proprietary_codecs
* 2017/10/14 1st build

## How the patch works

patch code

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

whitelist Surfingkeys here.

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
