---
layout: post
title: vim sessions for chrome with extenstion -- Surfingkeys
category: en
---

{{ page.title }}
================

This is about vim session in Chrome with [Surfingkeys -- A Chrome vim extenstion](https://chrome.google.com/webstore/detail/surfingkeys/gfbliohnnapiefjpjlpjnehglfpaknnc).

Before we dive into the details, let's feel vim session in Chrome first.

Press `ZZ` on any page, oops, Chrome quits with all tabs closed.

Don't panic, open your chrome, click on empty area of the new tab to let page content get focus. And press `ZR`, see what you get now. Every tab is back.

That is what vim session does for Chrome.

To discover the magic, just press `se` to open settings, and press `ff` to open the default mappings, you'll see

    mapkey('ZZ', 'Save session and quit', function() {
        RUNTIME('createSession', {
            name: 'LAST'
        });
        RUNTIME('quit');
    });
    mapkey('ZR', 'Restore last session', function() {
        RUNTIME('openSession', {
            name: 'LAST'
        });
    });
    mapkey('ZQ', 'Quit', function() {
        RUNTIME('quit');
    });

`ZZ` will save all current tabs into a session named `LAST` then quit.
`ZR` will restore the session named `LAST`.
`ZQ` will just quit.

To create session in Chrome with Surfingkeys will save URLs for all tabs, and to open a session will open all the URLs of the session in different tab, so basically a session is a list of URLs, which has a name.

You can create multiple sessions with different names in command mode. Press `:` to open omnibar for commands, then input:

    createSession works

Surfingkeys will create a session named `works` for you, to open the session with command input as:

    openSession  works

To list all your saved sessions:

    listSession

To delete a session:

    deleteSession  works
