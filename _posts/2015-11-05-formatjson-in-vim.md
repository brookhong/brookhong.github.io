---
layout: post
title: Format JSON in VIM
category: en
---

{{ page.title }}
================

Put vim snippet(which depends on python) below in your vim configuration file

    if !has("python")
        finish
    endif

    python << EOF
    import vim
    import json
    def FormatJSON(fmtlStart, fmtlEnd):
        fmtlStart = fmtlStart-1
        jsonStr = "\n".join(vim.current.buffer[fmtlStart:fmtlEnd])
        prettyJson = json.dumps(json.loads(jsonStr), sort_keys=True, indent=4, separators=(',', ': '), ensure_ascii=False)
        prettyJson = prettyJson.encode('utf8')
        vim.current.buffer[fmtlStart:fmtlEnd] = prettyJson.split('\n')
    EOF

    com! -range -bar FmtJSON :python FormatJSON(<line1>, <line2>)


Now, open a file containing json string, go to the line where the json string starts.

If the json string is all in one line like below, just run command `:FmtJSON`:

    {"name": "brook", "country": "中国"}


If the json string is across multiple lines like below, press `V` to enter visual mode first, then select the json string from start to end, then run command `:FmtJSON`:

    {"name": "brook",
        "country": "中国"}
