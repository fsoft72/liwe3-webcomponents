# Svelte Wrappers Overview

The `@liwe3/webcomponents-svelte` package provides Svelte 5 wrappers for the core web components. These wrappers ensure seamless integration with Svelte's reactivity system.

## Installation

```bash
npm install @liwe3/webcomponents-svelte
# or
pnpm add @liwe3/webcomponents-svelte
# or
yarn add @liwe3/webcomponents-svelte
```

## Usage

Import the components directly in your Svelte files:

```svelte
<script>
  import { 
    SmartSelect, 
    AITextEditor,
    ChunkUploader,
    ContainerBox,
    DateSelector,
    Drawer,
    PopoverMenu,
    Toasts,
    TreeView
  } from '@liwe3/webcomponents-svelte';
</script>

<SmartSelect ... />
<AITextEditor ... />
```

## Available Wrappers

| Component | Description |
|-----------|-------------|
| [SmartSelect](./SmartSelect.md) | Wrapper for `<liwe3-select>` |
| [AITextEditor](./AITextEditor.md) | Wrapper for `<liwe3-ai-text-editor>` |
| [ChunkUploader](./ChunkUploader.md) | Wrapper for `<liwe3-chunk-uploader>` |
| [ContainerBox](./ContainerBox.md) | Wrapper for `<liwe3-container-box>` |
| [DateSelector](./DateSelector.md) | Wrapper for `<liwe3-date-selector>` |
| [Drawer](./Drawer.md) | Wrapper for `<liwe3-drawer>` |
| [PopoverMenu](./PopoverMenu.md) | Wrapper for `<liwe3-popover-menu>` |
| [Toasts](./Toasts.md) | Wrapper for `<liwe3-toast>` |
| [TreeView](./TreeView.md) | Wrapper for `<liwe3-tree-view>` |

## Features

- **Svelte 5 Runes**: Built using the latest Svelte 5 reactivity model.
- **Two-way Binding**: Supports `bind:value` for easy state management.
- **Type Safety**: Full TypeScript support with proper prop types.
- **SSR Compatible**: Components are dynamically imported on mount to avoid SSR issues with Web Components.
