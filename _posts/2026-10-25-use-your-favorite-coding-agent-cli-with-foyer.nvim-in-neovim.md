---
layout: post
title: Use your favorite coding agent CLI with Foyer.nvim in neovim
category: en
---

{{ page.title }}
================

[foyer.nvim](https://github.com/brookhong/foyer.nvim) runs your coding agent
CLIs (pi, Claude Code, opencode, any of them) inside Neovim, one per project,
and lets you write prompts to them in a normal Vim buffer. If you keep your
agents in tmux panes beside the editor, this replaces that.

### 1. Setup

```lua
require('foyer').setup({
    commands = {
        p = { 'pi', '-c' },
        c = { 'claude', '-c' },
        t = { 'pi', '-c', cwd = vim.env.HOME, scope = 'global' },  -- a side chat
    },
})
vim.keymap.set({ 'n', 'v' }, '<leader>a', require('foyer').prompt)
vim.keymap.set('n', '<leader>b', require('foyer').jump)
```

Each letter but the global `t` is per project. With two repos open, `api` and
`frontend`, `p` is a separate agent in each, started in its root on first use.
With `-c`, the CLI picks up that directory's last conversation after a restart.

### 2. Ask

In `api`, press `<leader>a p`. A buffer opens beside your code: write with
everything Vim has, and `<CR>` (`<C-s>` in Insert mode) sends it as one prompt,
newlines intact.

### 3. Point at code

Select lines before `<leader>a p`, and they go along, labelled:

````
keep this one as it is, it's called from the worker too

Selected in my editor: /repo/api/src/retry.c, lines 118-131
```c
…the lines you selected…
```
````

Or type `@` mid-prompt to mention an open file: `<CR>` puts in `@src/retry.c`,
`<C-l>` adds the line, `@src/retry.c:120`.

### 4. Move on, and check back

While pi works, switch to the `frontend` tab page; `<leader>a c` starts Claude
Code there. An agent's key shows its terminal while it works, a fresh prompt
after. pi reports its state, so foyer says "pi · api is done" wherever you are
and marks the `api` tab page; `<leader>b` gets you there with one key. `O` in a
terminal opens a prompt above it, the answer still in view.

### 5. Ask on the side

`<leader>a t` is one chat for the whole session, from any project, for
questions about neither. It borrows the current window and gives it back.

### 6. Reuse, and quit

Each agent keeps its own history across sessions: `<Up>` walks it, `<C-f>`
lists your most used prompts, and `prompts` in `setup()` pins your own on top.
`:qa` is refused while an agent is busy; tomorrow, `-c` picks each
conversation back up.

Shells, gdb and REPLs get the same buffer and history, and every key foyer maps
can be changed: see `:help foyer`, and install it from the
[README](https://github.com/brookhong/foyer.nvim#installation).
