---
title: Working with Large Files in Neovim
description: Strategies for handling large JSON files, scratch buffers, and external tools in Neovim.
---

# Working with Large Files in Neovim

When working with large files in Neovim, especially JSON files, performance can become an issue. This guide covers strategies for maintaining productivity while working with large files.

## Understanding Scratch Buffers

A scratch buffer in Neovim is a temporary buffer that exists only in memory - it's not tied to any file on disk. This is a built-in concept in Neovim/Vim, not an addon.

**Key characteristics:**

- No file association - they don't correspond to any file on your filesystem
- Temporary - content is lost when you close Neovim (unless you explicitly save it)
- Perfect for temporary work - great for jotting notes, testing code snippets, or calculations

**Creating scratch buffers:**

```vim
:enew    " Creates a new empty buffer
:new     " Creates new buffer in horizontal split
:vnew    " Creates new buffer in vertical split
```

Default filetype:
Scratch buffers have no filetype by default. Set one manually for syntax highlighting

**Default filetype:** Scratch buffers have no filetype by default. Set one manually for syntax highlighting:

vim

    :set filetype=json
    :set ft=python

## Performance Issues with Large Files

Large files can cause several problems:

- Slow syntax highlighting
- Freezing when scrolling
- High memory usage
- Unresponsive editor

**Immediate fixes:**

vim

    :syntax off                 " Disable syntax highlighting
    :set maxmempattern=5000     " Increase pattern matching limit
    :set synmaxcol=200         " Limit syntax highlighting to first 200 columns

## External Tools for Large JSON Files

### fx - Interactive JSON Viewer

bash

    npm install -g fx
    fx large.json

Features: Navigate with arrow keys, expand/collapse objects, search, filter, and edit values inline.

### jq with less

bash

    jq '.' large.json | less
    jq '.users[0].profile' large.json           # Query specific paths
    jq '.items[] | select(.price > 100)' large.json  # Filter arrays

### jless - JSON Viewer

bash

    cargo install jless
    jless large.json

Features: Vim-like navigation, collapsible tree view, search functionality.

## Integrating External Tools with Neovim

### Using fx with open buffers

**Save and open externally:**

vim

    :w           " Save the buffer first
    :!fx %       " Open current file with fx
    :e!          " Reload file after external editing

**Terminal split approach (recommended):**

vim

    :w                   " Save first
    :split term://fx %   " Opens fx in terminal split within Neovim

**Add keybinding:**

lua

    vim.keymap.set('n', '<leader>fx', function()
      vim.cmd('write')
      vim.cmd('split term://fx ' .. vim.fn.expand('%'))
    end, { desc = 'Open current JSON file in fx' })

## Saving Scratch Buffers

**Save to file:**

vim

    :w filename.json
    :w /path/to/file.json

**Save to temporary location:**

vim

    :w /tmp/scratch.json    " Linux/Mac
    :w %TEMP%\scratch.json  " Windows

**Quick save with input:**

lua

    vim.keymap.set('n', '<leader>ws', function()
      local filename = vim.fn.input('Save as: ')
      if filename ~= '' then
        vim.cmd('write ' .. filename)
      end
    end, { desc = 'Save scratch buffer as...' })

## Configuration for Large Files

Add this to your Neovim config to automatically handle large files:

lua

    -- Disable heavy features for files over 1MB
    vim.api.nvim_create_autocmd("BufReadPre", {
      pattern = "*",
      callback = function()
        local file_size = vim.fn.getfsize(vim.fn.expand("%"))
        if file_size > 1024 * 1024 then  -- 1MB
          vim.opt_local.syntax = "off"
          vim.opt_local.filetype = ""
          vim.opt_local.undolevels = -1
        end
      end,
    })

## Recommended Workflow

1. **For exploration:** Use external tools like `fx` or `jless` to navigate and understand structure
2. **For editing:** Use `jq` to extract specific sections, edit smaller pieces in Neovim
3. **For temporary work:** Use scratch buffers, save when needed
4. **For performance:** Configure automatic large file detection and feature disabling

This approach gives you the full power of Neovim's editing capabilities while maintaining performance and usability with large files.
