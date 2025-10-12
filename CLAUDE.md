# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pnpm monorepo containing two packages:
- `@liwe3/webcomponents` (packages/core): Framework-agnostic web components built with vanilla TypeScript
- `@liwe3/webcomponents-svelte` (packages/svelte): Svelte 5 wrappers providing idiomatic Svelte API with runes support

The core package provides custom web components (`SmartSelect` and `AITextEditor`) that automatically register themselves on import. The Svelte package wraps these components to provide a more natural Svelte developer experience with proper reactivity using Svelte 5 runes.

## Build Commands

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm run build

# Build core web components only
pnpm run build:core

# Build Svelte wrappers only
pnpm run build:svelte

# Clean all build artifacts
pnpm run clean

# Watch mode for core package development
cd packages/core && pnpm run dev

# Watch mode for Svelte package development
cd packages/svelte && pnpm run dev
```

## Testing & Type Checking

The Svelte package has type checking available:
```bash
cd packages/svelte
pnpm run check           # Run type checking once
pnpm run check:watch     # Run type checking in watch mode
```

## Publishing

Each package is published independently to npm with public access. Before publishing:

1. Build the package: `pnpm run build:core` or `pnpm run build:svelte`
2. Navigate to the package directory: `cd packages/core` or `cd packages/svelte`
3. Run: `npm publish`

The `prepublishOnly` script ensures the package is built before publishing.

## Architecture

### Core Package (@liwe3/webcomponents)

Built using TypeScript and Vite, this package exports:
- Custom element classes (`SmartSelectElement`, `AITextEditorElement`)
- Registration functions (`defineSmartSelect()`, `defineAITextEditor()`)
- TypeScript interfaces (`SelectOption`, `AITextEditorConfig`)

Components auto-register on import with default tag names (`liwe3-select`, `liwe3-ai-text-editor`). Each component is a self-contained web component using Shadow DOM for encapsulation.

Key architectural patterns:
- **Shadow DOM**: All styling and markup is encapsulated
- **Property/Attribute sync**: Components support both property setters and HTML attributes
- **Event-driven**: Components dispatch CustomEvents for state changes
- **Framework-agnostic**: Can be used in any framework or vanilla HTML

### Svelte Package (@liwe3/webcomponents-svelte)

Built using SvelteKit's packaging system (`@sveltejs/package`). This package:
- Wraps core web components in `.svelte` files
- Provides Svelte 5 runes API (`$state`, `$derived`, `$effect`)
- Re-exports types from the core package
- Has `@liwe3/webcomponents` as both a peer dependency and workspace dependency

The Svelte wrappers bridge the gap between web component APIs and Svelte's reactivity system, providing:
- Two-way binding with `bind:value`
- Reactive props that sync with web component properties
- Proper TypeScript types
- Event forwarding from web components to Svelte components

### Web Component Implementation Details

**SmartSelect** (packages/core/src/SmartSelect.ts:11):
- Advanced dropdown with search, multi-select, keyboard navigation
- Uses fixed positioning for dropdown to handle viewport constraints
- Implements keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Supports both single and multiple selection modes
- Real-time search filtering
- Automatically repositions dropdown on scroll/resize

**AITextEditor** (packages/core/src/AITextEditor.ts:17):
- Text editor with AI-powered text continuation
- Uses OpenAI-compatible API endpoints
- Shows inline suggestions with ghost text
- Tab to accept suggestions paragraph by paragraph
- Stores API key in localStorage (base64 encoded)
- Configurable system prompt, API endpoint, and model
- Visual status indicator for API key presence

## Development Guidelines

### When Adding New Components

1. Create the web component in `packages/core/src/ComponentName.ts`
2. Export from `packages/core/src/index.ts`
3. Add build entry point in `packages/core/package.json` exports field
4. Create Svelte wrapper in `packages/svelte/src/lib/ComponentName.svelte`
5. Export from `packages/svelte/src/lib/index.ts`
6. Build both packages and test integration

### Web Component Requirements

- Use Shadow DOM for encapsulation
- Implement `observedAttributes` for reactive attributes
- Provide both property and attribute interfaces
- Dispatch CustomEvents for state changes
- Include JSDoc comments for all public methods
- Auto-register with `customElements.define()` at module load
- Check if element already registered before defining

### Svelte Wrapper Requirements

- Import and initialize the web component element
- Use `$state` for reactive local state
- Use `$effect` to sync Svelte props to web component properties
- Forward all relevant events from web component
- Provide proper TypeScript types
- Support `bind:value` for two-way binding where applicable

### Additional Requirements

- Every time you update `core` package, update the release version in `package.json` (eg. 1.0.0 to 1.0.1)
- Every time you update `svelte` package, update the release version in `package.json` (eg. 1.0.0 to 1.0.1)

