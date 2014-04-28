---
layout: post
title: split string with dict
category: en
---

{{ page.title }}
================


    function splitWithDict(str, dict) {
        var ret = [];
        for (var i = 0, l = str.length; i < l;) {

            var matched = dict.map(function(u) {
                return 1;
            }), matched_total = dict.length;

            for (var k = 0; matched_total > 1; k++) {
                for (var j = 0, jl = dict.length; j < jl; j++) {
                    if (matched[j] === 1 && str[i + k] !== dict[j][k]) {
                        matched[j] = 0;
                        matched_total --;
                    }
                }
            }

            for(var j = 0, jl = matched.length; j < jl; j++) {
                if (matched[j] === 1) {
                    ret.push(dict[j]);

                    i += dict[j].length;
                    break;
                }
            }
        }

        console.log(ret.join(' '));
    }

    // splitWithDict("linkdomelementwithpieceofdata", ["data", "dom", "element", "link", "of", "piece", "with"]);
    splitWithDict("arethereanyplanstomovefromcommonjsmodulestoes6modulesandimportsyntax", ["and", "any", "are", "commonjs", "es6", "from", "import", "modules", "move", "plans", "syntax", "there", "to"]);
