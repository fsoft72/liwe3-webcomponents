# @liwe3/webcomponents Documentation

A collection of reusable, framework-agnostic web components built with vanilla TypeScript. These components use Shadow DOM for encapsulation and can be used in any web application, regardless of framework.

## Installation

```bash
npm install @liwe3/webcomponents
```

## Quick Start

All components are automatically registered when imported:

```typescript
import '@liwe3/webcomponents';

// Or import specific components
import { SmartSelectElement, toastAdd } from '@liwe3/webcomponents';
```

You can then use the components in your HTML:

```html
<liwe3-select id="mySelect"></liwe3-select>
<liwe3-ai-text-editor id="myEditor"></liwe3-ai-text-editor>
<liwe3-popover-menu id="myMenu"></liwe3-popover-menu>
```

## Available Components

### [SmartSelect](./SmartSelect.md)
A customizable dropdown component with search, multi-select, and keyboard navigation capabilities.

**Tag Name:** `<liwe3-select>`

**Key Features:**
- Single and multiple selection modes
- Searchable options with filtering
- Full keyboard navigation support
- Fixed positioning for viewport-aware dropdown placement
- Customizable styling via CSS variables

---

### [AITextEditor](./AITextEditor.md)
A text editor with AI-powered text continuation suggestions using OpenAI-compatible APIs.

**Tag Name:** `<liwe3-ai-text-editor>`

**Key Features:**
- AI-powered text suggestions
- Tab to accept suggestions paragraph by paragraph
- Configurable system prompt and API endpoint
- Visual status indicator for API key
- localStorage-based API key storage

---

### [AIMarkdownEditor](./AIMarkdownEditor.md)
A markdown editor with AI-powered text continuation suggestions. Combines the AITextEditor with a formatting toolbar and preview mode.

**Tag Name:** `<liwe3-ai-markdown-editor>`

**Key Features:**
- All AITextEditor features plus markdown support
- Formatting toolbar (bold, italic, underline, lists)
- Toggle between edit and preview modes
- Built-in settings modal for AI configuration
- `showSettings` property to hide/show the settings button

---

### [ChunkUploader](./ChunkUploader.md)
A file uploader component that supports chunked uploads for large files.

**Tag Name:** `<liwe3-chunk-uploader>`

---

### [ContainerBox](./ContainerBox.md)
A layout container component.

**Tag Name:** `<liwe3-container-box>`

---

### [DateSelector](./DateSelector.md)
A date selection component.

**Tag Name:** `<liwe3-date-selector>`

---

### [Drawer](./Drawer.md)
A side drawer component for navigation or panels.

**Tag Name:** `<liwe3-drawer>`

---

### [ImageView](./ImageView.md)
An image viewer component.

**Tag Name:** `<liwe3-image-view>`

---

### [PopoverMenu](./PopoverMenu.md)
A menu component with support for nested submenus and fixed positioning.

**Tag Name:** `<liwe3-popover-menu>`

**Key Features:**
- Multi-level nested menus
- Hover and click interactions
- Fixed positioning with overflow handling
- Enable/disable menu items
- Separator support

---

### [Toast](./Toast.md)
A notification system for displaying temporary messages with multiple styles and auto-dismiss functionality.

**Tag Name:** `<liwe3-toast>`

**Key Features:**
- Multiple types (info, success, warning, error)
- Custom icons and buttons
- Auto-dismiss with progress bar
- Pause on hover
- Programmatic API via `toastAdd()` helper

---

### [TreeView](./TreeView.md)
A tree view component for hierarchical data.

**Tag Name:** `<liwe3-tree-view>`

---

## Common Patterns

### Custom Tag Names

All components support custom tag names if you prefer not to use the default names:

```typescript
import { defineSmartSelect, defineAITextEditor, defineToast, definePopoverMenu } from '@liwe3/webcomponents';

// Register with custom tag names
defineSmartSelect('my-select');
defineAITextEditor('my-editor');
defineToast('my-toast');
definePopoverMenu('my-menu');
```

### Register All Components at Once

```typescript
import { defineAllComponents } from '@liwe3/webcomponents';

defineAllComponents();
```

### Styling Components

All components use CSS custom properties (variables) for styling. You can override these in your global CSS:

```css
:root {
  --font-family: 'Your Font', sans-serif;
  --focus-color: #007bff;
  --border-radius: 4px;
}
```

See individual component documentation for component-specific CSS variables.

### Event Handling

All components dispatch standard CustomEvents that you can listen to:

```typescript
const select = document.querySelector('liwe3-select');
select.addEventListener('change', (e) => {
  console.log('Selected value:', e.detail.value);
});
```

## Browser Support

These components use modern web standards including:
- Custom Elements (Web Components)
- Shadow DOM
- ES2020+ JavaScript features

Supported browsers:
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## TypeScript Support

Full TypeScript definitions are included. Import types alongside components:

```typescript
import {
  SmartSelectElement,
  SelectOption,
  AITextEditorElement,
  AITextEditorConfig,
  ToastElement,
  ToastConfig,
  ToastType,
  PopoverMenuElement,
  PopoverMenuConfig,
  PopoverMenuItem
} from '@liwe3/webcomponents';
```

## Framework Integration

### Vanilla JavaScript/HTML

```html
<liwe3-select id="mySelect"></liwe3-select>

<script type="module">
  import '@liwe3/webcomponents';

  const select = document.getElementById('mySelect');
  select.options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ];
</script>
```

### React

```tsx
import { useEffect, useRef } from 'react';
import '@liwe3/webcomponents';
import type { SmartSelectElement, SelectOption } from '@liwe3/webcomponents';

function MyComponent() {
  const selectRef = useRef<SmartSelectElement>(null);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' }
      ];
    }
  }, []);

  return <liwe3-select ref={selectRef} />;
}
```

### Svelte

For Svelte users, we provide dedicated wrappers with proper reactivity:

```bash
npm install @liwe3/webcomponents-svelte
```

```svelte
<script>
  import { SmartSelect } from '@liwe3/webcomponents-svelte';

  let selectedValue = $state('');
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ];
</script>

<SmartSelect
  {options}
  bind:value={selectedValue}
/>
```

## License

MIT
