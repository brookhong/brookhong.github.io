---
layout: post
title: Use your favorite coding agent CLI with Foyer.nvim in neovim
category: en
---

{{ page.title }}
================

# Why foyer.nvim

**You live in Neovim. Your shell, your debugger and your coding agent live in
terminals. foyer.nvim is the room between them, where everything you are about
to say gets written in a real Vim buffer first.**

---

## Sound familiar?

- You're writing a careful, three-paragraph prompt for Claude Code, opencode or
  pi in a one-line TUI input box. You want `ciw`. You want undo. You get a
  backspace key.
- You paste a multi-line prompt into the agent, and it **sends the first line on
  its own**, before you've finished explaining.
- You want to ask about *this function*, so you yank forty lines, paste them in,
  and then type "in src/parser.c, around line 120…" anyway.
- You've typed "fix this" to an agent, and it asks you *which file*.
- You have an agent running in each of three projects, and you can't remember
  which terminal is the one working on *this* repo, so you ask the wrong one.
- A quick question unrelated to the project means either cluttering your
  project agent's conversation or leaving the editor for a chat tab.
- You handed the agent a long task ten minutes ago, and checking on it means
  hunting through your buffers for its terminal.
- You've half-typed a long `docker run …` at the shell prompt, spotted a typo
  forty characters back, and are now holding the left arrow key.
- You typed the same "run the tests and summarise the failures" prompt
  yesterday, and the day before.

foyer.nvim fixes each of these, and you don't have to change how you work.

---

## Scenario 1: Talking to a coding agent like you write code

**The pain.** Agent CLIs are where a lot of the thinking happens now, and their
input boxes are the worst editor you use all day. Long prompts are painful to
write, mistakes are painful to fix, and multi-line text is a gamble.

**With foyer.** First, give each agent you use a letter. A string is the
command line; a table splits the program from its arguments, and the program
name is what the prompt window's title shows:

```lua
require('foyer').setup({
    commands = {
        c = { 'claude', '-c' },
        o = { 'opencode', '-c' },
    },
})
```

Those flags matter. foyer starts each agent in the project root, and both of
these CLIs can pick up **the last conversation it had in that directory** with
`-c`. So after a restart,
`<leader>a o` puts you back in the middle of this project's conversation instead
of starting from scratch, while every other project resumes its own. Leave the
flag off if you want a fresh session each time.

Then map one key to reach them:

```lua
-- <leader>a, then an agent's letter
vim.keymap.set({ 'n', 'v' }, '<leader>a', function()
    require('foyer').terminal_command({ win_type = 'sidebar' })
end)
```

Now press `<leader>a` and a letter: `c` for Claude Code, `o` for opencode.
Pick a different letter and you're asking a different agent;
none of them has to be running yet, because foyer starts the one you picked on
first use. A real buffer opens: a float, or a sidebar if you prefer. Write as
much as you like, across as many lines as you like, with every motion, text
object, macro and plugin you already have. Press `<C-s>` in insert mode, or
`<CR>` in normal mode, and the whole thing reaches that agent as **one
prompt**.

Multi-line sends are wrapped in bracketed paste, so the agent inserts your
newlines instead of reading them as Enter. The prompt window then turns into
the agent's terminal, so you watch the answer come in exactly where you asked.
`<CR>` puts it away again.

A prompt sent while the agent is still starting waits until it's ready. If the
agent opens on a question of its own, such as whether to trust the folder,
foyer won't answer it for you: it tells you, and the prompt is one `<Up>` away.

Forgot a letter? Pause after `<leader>a` and a picker lists every agent you
configured.

<img width="1808" height="196" alt="The terminal picker, listing each agent by its letter" src="https://github.com/user-attachments/assets/a87dec0f-a607-40df-850b-dde8a2a55574" />

---

## Scenario 2: "Look at these lines": select, don't copy-paste

**The pain.** To ask about a piece of code you yank it, paste it, and then type
where it came from. Skip the pasting and just give a `file:line`, and the agent
reads a chunk around that line and answers about the wrong one, or reads the
file on disk while your unsaved edits have moved everything down.

**With foyer.** Select the lines, press `<leader>a`, pick the agent, and type
your question: *"why does this leak on the error path?"*. foyer attaches the
selection as you send, saying plainly what it is:

````
why does this leak on the error path?

Selected in my editor: /repo/src/parser.c, lines 118-131
```c
…the lines you selected…
```
````

The agent gets the exact lines you meant, as your buffer has them, and the full
path for anything around them it wants to read. If the buffer has unsaved
changes, the label says so. A selection longer than 40 lines is sent as its
location only, so a slip of the finger doesn't paste a whole file. The window
title shows `src/parser.c:118-131` before you send, so you always know what's
going along. If you type nothing, nothing is sent: a selection alone asks the
agent nothing.

Already writing the prompt when you realise it should point at code in another
file? Type `@`: the open files pop up, along with the ones you used recently,
each at the line you last changed.
`<CR>` drops in `@src/parser.c:120`; `<C-l>` drops in the whole block, the
same as if you'd selected those lines before you started.

---

## Scenario 3: "Fix this", and the agent knows what *this* is

**The pain.** Agents run in a terminal and can't see your editor. Every request
has to start with where you are.

**With foyer.** Every terminal foyer starts gets `$FOYER_CONTEXT` in its
environment. It names a small JSON file holding the file you were in, your
cursor line and your selection, refreshed each time you reach the agent through
foyer:

```json
{"captured_at":"…","launch_info":{"project_root":"/repo",
 "current_file":"src/parser.c","current_line":118,
 "start_line":118,"end_line":131}}
```

Install the included **agent skill** (opencode, Claude Code, …). It costs
one line of the model's context until you actually say "this file", "here" or
"my selection". Then the agent reads the file instead of asking you. With no
skill support, a three-line rule in `AGENTS.md` or `CLAUDE.md` does the same
job.

Nothing gets scraped or guessed: it's the context *you* attached, with a
timestamp, so an agent can tell that "fix this" was said twenty minutes ago and
check before acting on it.

---

## Scenario 4: One key per tool, in every project

**The pain.** An agent's conversation is about one repo. Run one per project
and the terminal buffers pile up, you lose track of which conversation lives
in which, and starting the right one means `:term`, `cd`, and launching the
agent again.

**With foyer.** Every letter from Scenario 1 is already per project, with
nothing more to configure. An entry can also choose where its agent starts
(`cwd`), or pick the agent per project (a function):

```lua
require('foyer').setup({
    commands = {
        c = { 'claude', '-c' },
        o = { 'opencode', '-c' },
        -- a function of the project root: Claude Code at work, opencode elsewhere
        a = function(root)
            if root:find('/work/', 1, true) then return { 'claude', '-c' } end
            return { 'opencode', '-c' }
        end,
    },
})
```

- **Terminals are per project.** `o` in `~/work/api` and `o` in
  `~/work/frontend` are two separate agents, each started in its own repo, each
  reused from then on. Switch projects and the same key gets you the right one.
- **It's fast if you know the keys and helpful if you don't.** If you type
  `<leader>a o` without pausing, nothing pops up. Pause, and a small picker
  lists every key, marks the terminals already running with `●`, and lists
  the global ones (Scenario 5) at the bottom, tagged `global`.
- **The agent can depend on the project.** With an entry that is a function,
  `a` means whatever agent that repo should get, so your fingers learn one key
  instead of a policy.

---

## Scenario 5: A side chat for tangents

**The pain.** Halfway through a task you wonder about something unrelated: how
`epoll` differs from `kqueue`, what a flag in some other tool does, how to word
an email. Ask the project's agent and you clutter a conversation that's meant
to be about this repo. Switch to a chat tab in the browser and you've left your
editor and lost your flow.

**With foyer.** Keep one agent for tangents, apart from your project agents:

```lua
-- one chat for the whole session, from wherever you are; started in $HOME,
-- so -c picks the same chat back up after a restart
F = { 'opencode', '-c --agent counselor',
      cwd = vim.env.HOME, scope = 'global' },
```

`scope = 'global'` means there is just one of it, not one per project, so
`<leader>a F` reaches the same chat from any repo. It's a conversation of its
own, not a helper to the code on screen, so it doesn't open beside your code:
the prompt takes over the window you're in, like turning to another page. Send,
and the chat's answer appears right there. `<CR>` turns back to the file you
were reading, with your windows exactly as you left them. Your project agents
never saw the detour.

A tangent about some code you're looking at works too: select it first, and
`<leader>a F` attaches it as in Scenario 2. The full path in the label means
the side chat, which doesn't live in any one project, can still find the file
for more context. The window title tells you which agent
you're about to ask: `opencode · global` for the side chat, `opencode · api` for
the agent of the `api` project.

---

## Scenario 6: Rescuing the line you already half-typed *(experimental)*

**The pain.** You're forty characters into a command, or halfway through a
prompt in an agent's input box, and spot a mistake at the start. Readline
motions are not Vim motions, and an agent's input box usually has fewer still.

**With foyer.** Press `<C-x>e` in **any** terminal buffer: a shell, a REPL, an
agent, even one foyer didn't start. Whatever is on the input line is lifted into
a floating buffer, cursor at the end, ready to fix with Vim. Send it back and
carry on editing it there.

> **Experimental.** A terminal has no "give me your input line" request, so
> foyer works it out: it sends the program's clear-input key (`Ctrl-U`) and
> watches where the cursor lands. That works well in ordinary shells and in
> agents that clear their input on `Ctrl-U`. An unusual or slow prompt can
> confuse it, and a program configured with `''` as its clear-input key (see
> `send_prefix`, under "Try it in two minutes") has nothing for foyer to read
> back.

```lua
vim.api.nvim_create_autocmd('TermOpen', {
    callback = function(ev)
        vim.keymap.set('t', '<C-x>e',
            '<C-\\><C-n><Cmd>lua require("foyer").edit_input()<CR>',
            { buffer = ev.buf })
    end,
})
```

---

## Scenario 7: Prompts worth keeping

**The pain.** Good prompts get typed again and again, and terminal history is a
blunt tool that doesn't survive a restart.

**With foyer.** Each terminal has its own history, saved across Neovim
sessions. `<C-p>`/`<C-n>` walk it. Type a few words first, and only the entries
containing them come up, with the match highlighted. Your zsh history and your
agent history stay separate.

---

## Scenario 8: One key to ask, and to check on it

**The pain.** You hand the agent a long task and go back to your code. A few
minutes later you want to know how it's getting on, which means finding its
terminal among your buffers, then finding your way back.

**With foyer.** Press the same `<leader>a o` you asked with. If the agent is
still working, still producing output, foyer shows you its terminal instead of
a prompt, scrolled to the latest output, so you see where it has got to. If it
has gone quiet, you get a fresh prompt for the next request. One key does both,
based on what the agent is doing right now.

Seen enough? `<CR>` puts the terminal away. Want to start on your follow-up
while it works? `<C-o>` takes you to the prompt.

---

## The small things that add up

- **`edit_selection()`** opens any visual selection in a floating scratch
  buffer and writes it back. Good for reworking a paragraph or a gnarly regex in
  isolation.
- **Clean yanks from terminals.** The trailing whitespace a terminal pads every
  line with is stripped when you yank.
- **`[p` / `]p`** jump between shell prompts in the scrollback.
- **`x`** toggles a terminal window to full screen and back.
- **`tab_switch()`** moves to the next window worth looking at, skipping the
  slivers a full-screen window leaves behind.
- **`jump()`** labels every tab, window, buffer and recent file, laid out as
  they sit on screen; type a label to go there, with Shift for a new tab. Names
  are just long enough to tell apart, and squeezed windows are left out.

<img width="1227" height="707" alt="foyer.jump() laying out tabs, buffers and recent files, each with a label" src="https://github.com/user-attachments/assets/d53489db-25a1-46cf-ad8a-81e07cffeedf" />

---

## What foyer is not

Being clear about this saves you an afternoon:

- **It is not an agent or an AI client.** It talks to whatever CLI you already
  use, through its terminal. Bring your own agent.
- **It doesn't scrape your screen.** The context an agent sees is what you
  attached, published only for terminals foyer started.
- **Reading back a half-typed line is experimental.** `edit_input()` works by
  sending the clear-input key and watching where the cursor lands, in a shell
  or an agent alike. That's dependable with ordinary shells, but an unusual
  prompt or a very slow one can confuse it.
- **Some things are fixed for now.** The keymaps inside foyer's windows, a few
  timings, and the register used by `edit_selection()` (`a`) can't be changed
  yet.

---

## Try it in two minutes

```lua
-- lazy.nvim
{
    'brookhong/foyer.nvim',
    opts = {
        commands = {
            c = { 'claude', '-c' },
            o = { 'opencode', '-c' },
        },
    },
    keys = {
        { '<leader>a', function() require('foyer').terminal_command({ win_type = 'sidebar' }) end,
          mode = { 'n', 'v' }, desc = 'foyer: prompt a terminal' },
    },
}
```

Link the agent skill as well, so your agent can resolve "this file" by itself.
The [README](../README.md#giving-an-agent-your-editor-context) has the one-liner.

Then try it:

1. Open a file in a git repo and press `<leader>a`, then `o`.
2. Write a multi-line prompt and send it with `<C-s>`.
3. Select a function, press `<leader>a c` to ask Claude Code this time, and
   type *"what does this do?"*.

**Using `pi`?** Before each send, foyer clears the agent's input line with
`Ctrl-U` and its screen with `Ctrl-L`. `pi` opens its model picker on `Ctrl-L`,
which would swallow your prompt, so tell foyer to send only `Ctrl-U` to it:

```lua
opts = {
    commands = { p = 'pi' },
    send_prefix = { pi = { vim.keycode('<C-u>'), '' } },   -- { clear input, clear screen }
},
```

`send_prefix` is keyed by program name, so it applies whichever letter runs
`pi`, in every project. Any other program that uses those keys for something
else can be given its own pair the same way.
