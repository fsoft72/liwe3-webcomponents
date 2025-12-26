# LiWE3 Web Components

Welcome to the documentation for the LiWE3 Web Components library. This monorepo contains a collection of framework-agnostic web components and their Svelte 5 wrappers.

## Packages

### Core Package (`@liwe3/webcomponents`)

The core package provides vanilla Web Components that work in any framework or with plain HTML/JavaScript.

- **Zero dependencies** (runtime)
- **Shadow DOM** encapsulation
- **TypeScript** support
- **Auto-registration**

[Explore Web Components](./webcomponents/index.md)

### Svelte Package (`@liwe3/webcomponents-svelte`)

The Svelte package provides idiomatic Svelte 5 wrappers for the core components.

- **Svelte 5 Runes** support
- **Two-way binding** (`bind:value`)
- **Type safety**
- **Event forwarding**

[Explore Svelte Wrappers](./svelte/index.md)

## Installation

```bash
# Install core web components
pnpm add @liwe3/webcomponents

# Install Svelte wrappers (if using Svelte)
pnpm add @liwe3/webcomponents-svelte
```
