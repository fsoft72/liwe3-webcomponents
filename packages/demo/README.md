# @liwe3/demo

Demo SvelteKit application showcasing the `@liwe3/webcomponents-svelte` package.

## Features

- **Home Page**: Overview of the project and available components
- **SmartSelect Demo**: Interactive examples showing all features of the SmartSelect component
- **AITextEditor Demo**: Comprehensive demo of the AI-powered text editor with settings

## Development

```bash
# Make sure you've built the core packages first
cd ../..
pnpm run build

# Install dependencies (if not already done)
pnpm install

# Run the demo app
cd packages/demo
pnpm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
pnpm run build
pnpm run preview
```

## Technologies

- **SvelteKit**: Full-stack Svelte framework
- **Svelte 5**: Latest version with runes support
- **TypeScript**: Full type safety
- **Vite**: Fast build tool and dev server

## Components Demonstrated

### SmartSelect
- Basic single selection
- Searchable dropdown
- Multi-select with tags
- Disabled state
- Keyboard navigation (Arrow keys, Enter, Escape, Tab)

### AITextEditor
- AI-powered text continuation
- Configurable API settings
- Real-time word count
- Sample text loading
- Keyboard shortcuts (Tab to accept, Escape to dismiss)

### AIMarkdownEditor
- Markdown editor with toolbar
- AI-powered text continuation
- Live preview toggle
- Settings management

### MarkdownPreview
- Renders markdown content
- Supports code blocks and tables
- Dynamically loads markdown library

## Project Structure

```
packages/demo/
├── src/
│   ├── routes/
│   │   ├── smart-select/
│   │   │   └── +page.svelte
│   │   ├── ai-text-editor/
│   │   │   └── +page.svelte
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   └── app.html
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```
