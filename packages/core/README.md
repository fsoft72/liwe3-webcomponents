# @liwe3/webcomponents

A collection of reusable, framework-agnostic web components built with TypeScript.

## Features

- **SmartSelect**: A customizable select dropdown with search, multi-select, and keyboard navigation
- **AITextEditor**: A text editor with AI-powered text continuation suggestions
- Framework-agnostic (works with vanilla JS, React, Vue, Svelte, Angular, etc.)
- TypeScript support with full type definitions
- Zero dependencies (web components only)
- Tree-shakeable - import only what you need

## Installation

```bash
npm install @liwe3/webcomponents
# or
pnpm add @liwe3/webcomponents
# or
yarn add @liwe3/webcomponents
```

## Usage

### Import All Components

```typescript
import '@liwe3/webcomponents';
```

### Import Individual Components

```typescript
// Import only SmartSelect
import '@liwe3/webcomponents/smart-select';

// Import only AITextEditor
import '@liwe3/webcomponents/ai-text-editor';
```

### Using with TypeScript

```typescript
import { SmartSelectElement, AITextEditorElement, type SelectOption } from '@liwe3/webcomponents';

// Access element instances with proper typing
const select = document.querySelector('liwe3-select') as SmartSelectElement;
select.setOptions([
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' }
]);
```

## Components

### SmartSelect

A powerful select dropdown with advanced features.

#### Features

- Single and multi-select modes
- Search/filter options
- Keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Custom styling via CSS variables
- Automatic positioning (viewport-aware)
- Full TypeScript support

#### Basic Usage

```html
<liwe3-select
  placeholder="Select an option"
  searchable
  multiple
></liwe3-select>

<script type="module">
  import '@liwe3/webcomponents/smart-select';

  const select = document.querySelector('liwe3-select');

  // Set options
  select.options = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'py', label: 'Python' }
  ];

  // Listen for changes
  select.addEventListener('change', (e) => {
    console.log('Selected:', e.detail.value);
  });
</script>
```

#### Attributes

- `multiple` - Enable multi-select mode
- `searchable` - Enable search/filter functionality
- `placeholder` - Placeholder text (default: "Select an option")
- `disabled` - Disable the select

#### Properties

```typescript
// Get/set value
select.value; // string | string[]
select.value = 'js'; // Set single value
select.value = ['js', 'ts']; // Set multiple values (when multiple=true)

// Get/set options
select.options; // SelectOption[]
select.setOptions([...]);

// Control dropdown
select.open();
select.close();
select.toggle();

// Select/deselect options
select.selectOption('js');
select.deselectOption('js');
select.getSelectedOptions(); // SelectOption[]
```

#### Events

- `change` - Fired when selection changes (detail: { value })
- `open` - Fired when dropdown opens
- `close` - Fired when dropdown closes
- `search` - Fired when search query changes (detail: { query })

#### CSS Variables

```css
liwe3-select {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size: 14px;
  --padding: 8px 12px;
  --border: 1px solid #ccc;
  --border-radius: 4px;
  --background: white;
  --focus-color: #007bff;

  /* Tag styles (multi-select) */
  --tag-background: #e9ecef;
  --tag-border-radius: 12px;
  --tag-color: #495057;
  --remove-color: #6c757d;
  --remove-hover-color: #dc3545;

  /* Dropdown styles */
  --dropdown-background: white;
  --dropdown-border: 1px solid #ccc;
  --dropdown-border-radius: 4px;
  --dropdown-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Option styles */
  --option-color: #333;
  --option-hover-background: #f8f9fa;
  --option-focused-background: #007bff;
  --option-focused-color: white;
  --option-selected-background: #e3f2fd;
  --option-selected-color: #1976d2;
  --no-options-color: #6c757d;
}
```

### AITextEditor

A text editor with AI-powered suggestions.

#### Features

- AI-powered text continuation
- Configurable AI endpoint (OpenAI, LM Studio, etc.)
- Tab to accept suggestions
- Escape to dismiss
- Paragraph-by-paragraph acceptance
- localStorage API key management
- Custom system prompts
- Context support for better suggestions

#### Basic Usage

```html
<liwe3-ai-text-editor style="width: 100%; height: 400px;"></liwe3-ai-text-editor>

<script type="module">
  import '@liwe3/webcomponents/ai-text-editor';

  const editor = document.querySelector('liwe3-ai-text-editor');

  // Configure API
  editor.setApiKey('your-api-key');
  editor.setApiEndpoint('https://api.openai.com/v1/chat/completions');
  editor.setModelName('gpt-3.5-turbo');

  // Set initial text
  editor.setText('Once upon a time...');

  // Listen for changes
  editor.addEventListener('change', (e) => {
    console.log('Text:', e.detail.value);
  });

  // Handle before suggestion (optional - can cancel)
  editor.addEventListener('beforeSuggestion', (e) => {
    // Cancel suggestion if needed
    if (someCondition) {
      e.preventDefault();
    }
  });
</script>
```

#### Properties & Methods

```typescript
// Text content
editor.setText(text: string): void;
editor.getText(): string;

// API configuration
editor.setApiKey(key: string): void;
editor.getApiKey(): string;
editor.setApiEndpoint(endpoint: string): void;
editor.getApiEndpoint(): string;
editor.setModelName(modelName: string): void;
editor.getModelName(): string;

// Suggestion settings
editor.setSuggestionDelay(seconds: number): void; // Default: 1 second
editor.getSuggestionDelay(): number;
editor.setSystemPrompt(prompt: string): void;
editor.getSystemPrompt(): string;

// Context for better suggestions
editor.setContext(context: string): void;
editor.getContext(): string;
```

#### Events

- `change` - Fired when text changes (detail: { value })
- `beforeSuggestion` - Fired before requesting AI suggestion (cancelable)
  - detail: { text, context, apiEndpoint, modelName, systemPrompt }
- `error` - Fired when an error occurs (detail: { message })

#### Keyboard Shortcuts

- `Tab` - Accept current suggestion paragraph
- `Escape` - Dismiss suggestion
- Arrow keys/Click - Dismiss suggestion and move cursor

#### Using with Local LM Studio

```javascript
editor.setApiEndpoint('http://localhost:1234/v1/chat/completions');
editor.setModelName('local-model');
editor.setApiKey(''); // No API key needed for local
```

## Custom Tag Names

You can register components with custom tag names:

```typescript
import { defineSmartSelect, defineAITextEditor } from '@liwe3/webcomponents';

defineSmartSelect('my-select');
defineAITextEditor('my-editor');
```

```html
<my-select></my-select>
<my-editor></my-editor>
```

## Framework Integration

### React

```tsx
import '@liwe3/webcomponents';
import { useRef, useEffect } from 'react';
import type { SmartSelectElement } from '@liwe3/webcomponents';

function MyComponent() {
  const selectRef = useRef<SmartSelectElement>(null);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.setOptions([
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' }
      ]);
    }
  }, []);

  return <liwe3-select ref={selectRef} />;
}
```

### Vue

```vue
<template>
  <liwe3-select ref="select" @change="handleChange" />
</template>

<script setup>
import '@liwe3/webcomponents';
import { ref, onMounted } from 'vue';

const select = ref(null);

onMounted(() => {
  select.value.setOptions([
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]);
});

const handleChange = (e) => {
  console.log('Selected:', e.detail.value);
};
</script>
```

### Svelte

```svelte
<script>
  import '@liwe3/webcomponents';
  import { onMount } from 'svelte';

  let selectElement;

  onMount(() => {
    selectElement.setOptions([
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ]);
  });

  const handleChange = (e) => {
    console.log('Selected:', e.detail.value);
  };
</script>

<liwe3-select bind:this={selectElement} on:change={handleChange} />
```

## Browser Support

Modern browsers with Web Components support:
- Chrome/Edge 67+
- Firefox 63+
- Safari 10.1+

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Build in watch mode
pnpm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
