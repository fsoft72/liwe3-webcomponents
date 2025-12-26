# Liwe3 Web Components Monorepo

A collection of reusable, framework-agnostic web components with Svelte 5 wrappers.

See working demo at [Github Pages Demo](https://liwe3.github.io/liwe3-webcomponents/)

## Packages

### [@liwe3/webcomponents](./packages/core/)

Core web components built with vanilla TypeScript. Framework-agnostic and can be used in any project.

```bash
npm install @liwe3/webcomponents
```

**Components:**
- `SmartSelect` - Advanced select dropdown with search, multi-select, and keyboard navigation
- `AITextEditor` - Text editor with AI-powered text continuation suggestions

### [@liwe3/webcomponents-svelte](./packages/svelte/)

Svelte 5 wrappers for the core web components. Provides idiomatic Svelte API with full runes support.

```bash
npm install @liwe3/webcomponents @liwe3/webcomponents-svelte
```

## Quick Start

### Using Core Web Components

```html
<script type="module">
  import '@liwe3/webcomponents';

  const select = document.querySelector('liwe3-select');
  select.options = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' }
  ];
</script>

<liwe3-select searchable></liwe3-select>
```

### Using Svelte Wrappers

```svelte
<script>
  import { SmartSelect } from '@liwe3/webcomponents-svelte';

  let value = $state();
  const options = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' }
  ];
</script>

<SmartSelect bind:value {options} searchable />
```

## Development

### Setup

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm run build
```

### Building Individual Packages

```bash
# Build core web components
pnpm run build:core

# Build Svelte wrappers
pnpm run build:svelte
```

### Building Demo App

```bash
# Build all packages first
pnpm run build

# Run the demo app
cd packages/demo
pnpm run dev
```

The demo app will be available at `http://localhost:5173`

### Deploying Demos to GitHub Pages

The repository includes static HTML demos in `packages/core/demos/` that showcase each component.

```bash
# Deploy to gh-pages branch (recommended)
pnpm run deploy:demos

# Or deploy to docs/ folder on main branch
pnpm run deploy:demos:docs
```

For detailed instructions, see [DEPLOY_DEMOS.md](./DEPLOY_DEMOS.md)

### Package Structure

```
liwe3-webcomponents/
├── packages/
│   ├── core/                 # @liwe3/webcomponents
│   │   ├── src/
│   │   │   ├── SmartSelect.ts
│   │   │   ├── AITextEditor.ts
│   │   │   └── index.ts
│   │   ├── dist/            # Built files
│   │   └── package.json
│   │
│   ├── svelte/              # @liwe3/webcomponents-svelte
│   │   ├── src/lib/
│   │   │   ├── SmartSelect.svelte
│   │   │   ├── AITextEditor.svelte
│   │   │   └── index.ts
│   │   ├── dist/            # Built files
│   │   └── package.json
│   │
│   └── demo/                # Demo SvelteKit app
│       ├── src/routes/
│       │   ├── smart-select/
│       │   ├── ai-text-editor/
│       │   └── +page.svelte
│       └── package.json
│
├── pnpm-workspace.yaml
└── package.json
```

## Publishing

### Core Package

```bash
cd packages/core
npm login
npm publish
```

### Svelte Package

```bash
cd packages/svelte
npm login
npm publish
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
