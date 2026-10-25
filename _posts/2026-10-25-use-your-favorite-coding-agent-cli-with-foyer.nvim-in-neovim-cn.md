---
layout: post
title: 在 neovim 中使用 Foyer.nvim 搭配你最喜欢的编程代理 CLI
category: cn
---

{{ page.title }}
================

[foyer.nvim](https://github.com/brookhong/foyer.nvim) 让你在 Neovim 里运行编码 Agent 的 CLI（pi、Claude Code、opencode，哪个都行），
每个项目一个，并在一个普通的 Vim 缓冲区里给它们写提示词。如果你现在把 Agent 放在编辑器旁边的 tmux 窗格里，它可以取而代之。

### 1. 配置

```lua
require('foyer').setup({
    commands = {
        p = { 'pi', '-c' },
        c = { 'claude', '-c' },
        t = { 'pi', '-c', cwd = vim.env.HOME, scope = 'global' },  -- 日常咨询
    },
})
vim.keymap.set({ 'n', 'v' }, '<leader>a', require('foyer').prompt)
vim.keymap.set('n', '<leader>b', require('foyer').jump)
```

除了全局的 `t`，每个字母都按项目区分。开着 `api` 和 `frontend` 两个项目时，`p` 在两边各是一个独立的 Agent，第一次用到时在各自的根目录启动。
有了 `-c`，重启之后 CLI 会接上这个目录里的上一段对话。

### 2. 提问

在 `api` 里按 `<leader>a p`，代码旁边打开一个缓冲区。用 Vim 的全部本事写提示词，`<CR>`（插入模式下 `<C-s>`）
把它作为一条提示词发出，换行原样保留。

### 3. 指着代码问

按 `<leader>a p` 之前先选中几行，它们会带标注一起发过去：

````
这个别动，worker 也在调用它

Selected in my editor: /repo/api/src/retry.c, lines 118-131
```c
…你选中的那几行…
```
````

或者写到一半输入 `@`，提到某个已打开的文件：`<CR>` 插入 `@src/retry.c`，`<C-l>` 再带上行号，`@src/retry.c:120`。

### 4. 去忙别的，再回来看

pi 干活的时候，切到 `frontend` 标签页，`<leader>a c` 在那里启动 Claude Code。Agent 还在忙时再按一次它的键，
看到的是它的终端；忙完了，就是一个新的提示窗口。pi 会报告自己的状态，所以不管你在哪，foyer 都会告诉你
"pi · api is done"，并在 `api` 标签页上做个标记。`<leader>b` 给每个标签页、窗口和最近的文件一个单键标签。
在终端里按 `O`，提示窗口在它上方打开，回答仍然看得见。

### 5. 题外话

`<leader>a t` 是整个会话共用的一个日常咨询，从哪个项目都能打开，专问两边都无关的事。它借用当前窗口，用完还回来。

### 6. 复用，然后下班

每个 Agent 都有自己的历史，跨会话保存：`<Up>` 逐条翻看，`<C-f>` 列出最常用的提示词，
`setup()` 里的 `prompts` 把你自己的几条固定在最上面。Agent 在忙时 `:qa` 会被拒绝；
明天，`-c` 让每段对话接着进行。

shell、gdb 和 REPL 也能用同样的缓冲区和历史。foyer 映射的每个键都能改，详见 `:help foyer`。
安装方法见 [README](https://github.com/brookhong/foyer.nvim#installation)。
