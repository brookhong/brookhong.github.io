---
layout: post
title: Vim package manager for YouCompleteMe
category: en
---

{{ page.title }}
================

[YouCompleteMe](https://github.com/Valloric/YouCompleteMe) is really a good code completion engine for Vim, but it seems awkward to manage it with common plugin manager such as [Vundle](https://github.com/VundleVim/Vundle.vim).

To install/update `YouCompleteMe` with `Vundle`, I basically need two steps:

    PluginUpdate # in vim

then run in shell:

    cd <MyVimFiles>/bundle/YouCompleteMe
    ./install.py

The scheme works good when I work only on some specific host.

But I usually work across multiple hosts, before I adopted `YouCompleteMe`, I run `PluginUpdate` on my mac laptop to update all vim plugins, then if I need update vim files on other hosts, I could easily run `rsync` `MyVimFiles` to achieve that.

After `YouCompleteMe` was in, my work flow is broken. The installation of `YouCompleteMe` on my mac laptop won't work on my linux server, to sync folder of YouCompleteMe to other host does not make sense, let alone the size of YouCompleteMe is much larger than all of other plugins.

Looks like there are no much OS dependent files, from my case(install.py --java-completer), I made a diff to get changes from `install.py --java-completer`. Except those .pyc files and files from third-party eclipse.jdt.ls, the only OS dependent file is `YouCompleteMe/third_party/ycmd/ycm_core.so`.

Anyway `rsync` will override `ycm_core.so`, which will break my installation on linux server.

Thus I could NOT manage `YouCompleteMe` in same way as for other plugins. I need put YouCompleteMe into a separate path to exclude it from sync. I finally decided to use vim built-in package manager(:h :packadd) to manage YouCompleteMe.

Here is the directory structure of my dot files.

    MyDotFiles
    ├── vimfiles
    │   ├── bundle/vundle
    │   └── main.vim
    └── vimpack

I created a folder named `vimpack` for all plugins that will be loaded on demand, since I don't always need YouCompleteMe, and the plugins is greatly increasing start-up time of vim. Then add YouCompleteMe as a submodule of repository of my dot files:

    cd MyDotFiles
    git submodule add https://github.com/Valloric/YouCompleteMe.git vimpack/pack/plugins/opt/YouCompleteMe

Edit my main.vim to include vimpack folder into `packpath`:

```vim
    let &packpath = "<path_to_MyDotFiles>/vimpack,".&packpath

    function! LoadYouCompleteMe()
      let g:ycm_log_level = 'debug'
      let g:ycm_collect_identifiers_from_comments_and_strings = 1
      let g:ycm_add_preview_to_completeopt = 0
      set completeopt=menu,menuone
      let g:ycm_filepath_completion_use_working_dir = 1
      let g:ycm_key_invoke_completion = '<c-z>'
      packadd YouCompleteMe
      nnoremap <leader>td :YcmCompleter GoToDefinition<CR>
      nnoremap <leader>tf :YcmCompleter FixIt<CR>
      nnoremap <leader>ti :YcmCompleter GoToInclude<CR>
      nnoremap <leader>tr :YcmCompleter GetDoc<CR>
    endfunction
    nmap <leader>td :call LoadYouCompleteMe()<CR>
```

Now the steps to install/update YouCompleteMe changed to

    1. git submodule update --init --recursive
    2. ./vimpack/pack/plugins/opt/YouCompleteMe/install.py --java-completer --clang-completer

Then I could rsync my vimfiles safely without breaking my YouCompleteMe installation, and I could load YouCompleteMe on demand with `std`(my vim leader key is `s`).

## Java Semantic Completion

>https://github.com/Valloric/YouCompleteMe#java-semantic-completion
>In order to provide semantic analysis, the Java completion engine requires knowledge of your project structure. In particular it needs to know the class path to use, when compiling your code. Fortunately jdt.ls supports eclipse project files, maven projects and gradle projects.

## C-family Semantic Completion
To install completer for c-family languages.

    ./vimpack/pack/plugins/opt/YouCompleteMe/install.py --clang-completer

>Every c-family project is different. It is not possible for YCM to guess what compiler flags to supply for your project. Fortunately, YCM provides a mechanism for you to generate the flags for a particular file with arbitrary complexity. This is achieved by requiring you to provide a Python module which implements a trival function which, given the file name as argument, returns a list of compiler flags to use to compile that file.

>YCM looks for a .ycm_extra_conf.py file in the directory of the opened file or in any directory above it in the hierarchy (recursively); when the file is found, it is loaded (only once!) as a Python module. YCM calls a FlagsForFile method in that module which should provide it with the information necessary to compile the current file. You can also provide a path to a global .ycm_extra_conf.py file, which will be used as a fallback. To prevent the execution of malicious code from a file you didn't write YCM will ask you once per .ycm_extra_conf.py if it is safe to load. This can be disabled and you can white-/blacklist files. See the Options section for more details.

[Completion doesn't work with the C++ standard library headers](https://github.com/Valloric/YouCompleteMe#completion-doesnt-work-with-the-c-standard-library-headers)

For example,
```python
    _default_flags = [
        '-DUSE_CLANG_COMPLETER',
        '-std=c++14',
        '-x',
        'c++',
        '-isystem',
        '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include/c++/v1',
        '-isystem',
        '/usr/local/include',
        '-isystem',
        '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/clang/9.0.0/include',
        '-isystem',
        '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include',
        '-isystem',
        '/usr/include',
    ]
```
