---
layout: post
title: view diff file side by side in vim
category: en
---

{{ page.title }}
================

Say you have a patch file (diff file), and you want to view the diff file side by side in vim.

Paste below vim script into your vimrc, and for each diff file you open in vim, press `<leader>vd` you'll view the diff file side by side.

    function! Vimdiff()
        let lines = getline(0, '$')
        let la = []
        let lb = []
        for line in lines
            if line[0] == '-'
                call add(la, line[1:])
            elseif line[0] == '+'
                call add(lb, line[1:])
            else
                call add(la, line)
                call add(lb, line)
            endif
        endfor
        tabnew
        set bt=nofile
        vertical new
        set bt=nofile
        call append(0, la)
        diffthis
        exe "normal \<C-W>l"
        call append(0, lb)
        diffthis
    endfunction
    autocmd FileType diff       nnoremap <silent> <leader>vd :call Vimdiff()<CR>


For example,

![diff1](https://cloud.githubusercontent.com/assets/288207/18225436/1042cdde-7224-11e6-9e5b-de6ce5be18bf.png)
![diff2](https://cloud.githubusercontent.com/assets/288207/18225437/11d1c3f8-7224-11e6-987d-9e03a6c8f853.png)
