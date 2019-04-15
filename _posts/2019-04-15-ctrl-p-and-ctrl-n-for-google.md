---
layout: post
title: Ctrl-p and Ctrl-n for Google
category: en
---

{{ page.title }}
================
I was recently thrilled to feel that `Ctrl-p` and `Ctrl-n` are so much handier than `↑` and `↓`, and these two shortcuts apply to many cases, even the console of Inspect tool in Chrome.

But why doesn't Google support them in its search box? Before Google officially supports them(I hope they would), I added `Ctrl-p` and `Ctrl-n` to search box with [Surfingkeys](https://chrome.google.com/webstore/detail/surfingkeys/gfbliohnnapiefjpjlpjnehglfpaknnc).

![google](https://user-images.githubusercontent.com/288207/56137974-786cb980-5fc8-11e9-9096-cdb7d81880fd.gif)


Below is the snippet for that, you need save it in your SurfingKeys' setting.

    if (window.origin === "https://www.google.com") {
        function cycleGoogleSuggestions(forward) {
            var suggestions = document.querySelectorAll("ul>li.sbct");
            var selected = document.querySelector("ul>li.sbct.sbhl");
            var next;
            if (selected) {
                selected.classList.remove("sbhl");
                var next = Array.from(suggestions).indexOf(selected) + (forward ? 1 : -1);
                if (next === suggestions.length || next === -1) {
                    next = {innerText: window.userInput};
                } else {
                    next = suggestions[next];
                    next.classList.add("sbhl");
                }
            } else {
                window.userInput = document.querySelector("input.gsfi").value;
                next = forward ? suggestions[0] : suggestions[suggestions.length - 1];
                next.classList.add("sbhl");
            }
            document.querySelector("input.gsfi").value = next.innerText;
        }
        imapkey('<Ctrl-p>', 'cycle google suggestions', function () {
            cycleGoogleSuggestions(false);
        });
        imapkey('<Ctrl-n>', 'cycle google suggestions', function () {
            cycleGoogleSuggestions(true);
        });
    }
