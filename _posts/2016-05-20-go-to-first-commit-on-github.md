---
layout: post
title: go to first commit on github
category: en
---

{{ page.title }}
================

There are many times that I want to see the first commit of a project on github.com, it's annoying to click the `Older` link again and again. Below is my solution with Surfingkeys before github provides a formal way.

Add below into your own settings(The function is from [FarhadG/init](https://github.com/FarhadG/init)),

    mapkey('gl', 'Go to last page of commits on github', function() {

        (function openFirstCommit(args) {
            // args[1] is the `orgname/repo` url fragment
            // args[2] is the optional branch or hash

            return fetch('https://api.github.com/repos/' + args[1] + '/commits?sha=' + (args[2] || ''))

            // the link header has additional urls for paging
            // parse the original JSON for the case where no other pages exist
                .then(res => Promise.all([res.headers.get('link'), res.json()]))

            // get last page of commits
                .then(results => {
                    // results[0] is the link
                    // results[1] is the first page of commits

                    if (results[0]) {
                        // the link contains two urls in the form
                        // <https://github.com/...>; rel=blah, <https://github.com/...>; rel=thelastpage
                        // split the url out of the string
                        var pageurl = results[0].split(',')[1].split(';')[0].slice(2, -1);
                        // fetch the last page
                        return fetch(pageurl).then(res => res.json());
                    }

                    // if no link, we know we're on the only page
                    return results[1];
                })

            // get the last commit and extract the url
                .then(commits => {
                    window.location = commits.pop().html_url;
                })

        })(window.location.pathname.match(/\/([^\/]+\/[^\/]+)(?:\/tree\/([^\/]+))?/));

    }, {domain: /github.com/i});

Press `gl` to go to last page.
