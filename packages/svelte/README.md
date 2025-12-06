# @liwe3/webcomponents-svelte

Svelte 5 wrappers for [@liwe3/webcomponents](https://www.npmjs.com/package/@liwe3/webcomponents).

## Installation

```bash
npm install @liwe3/webcomponents @liwe3/webcomponents-svelte
# or
pnpm add @liwe3/webcomponents @liwe3/webcomponents-svelte
# or
yarn add @liwe3/webcomponents @liwe3/webcomponents-svelte
```

## Usage

### SmartSelect

```svelte
<script>
  import { SmartSelect } from '@liwe3/webcomponents-svelte';

  let selectedValue = $state();

  const options = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'py', label: 'Python' }
  ];

  const handleChange = (newValue) => {
    console.log('Selected:', newValue);
  };
</script>

<SmartSelect
  bind:value={selectedValue}
  {options}
  searchable
  placeholder="Select a language"
  onchange={handleChange}
/>
```

### AITextEditor

```svelte
<script>
  import { AITextEditor } from '@liwe3/webcomponents-svelte';

  let content = $state('');
  let systemPrompt = $state("You are a helpful writing assistant.");

  const handleChange = (newValue) => {
    console.log('Content changed:', newValue);
  };
</script>

<AITextEditor
  bind:value={content}
  bind:systemPrompt
  apiKey="your-api-key"
  apiEndpoint="https://api.openai.com/v1/chat/completions"
  modelName="gpt-3.5-turbo"
  placeholder="Start writing..."
  onchange={handleChange}
  style="width: 100%; height: 400px;"
/>
```

### AIMarkdownEditor

```svelte
<script>
  import { AIMarkdownEditor } from '@liwe3/webcomponents-svelte';

  let content = $state('');
</script>

<AIMarkdownEditor
  bind:value={content}
  apiKey="your-api-key"
  style="width: 100%; height: 500px;"
/>
```

### MarkdownPreview

```svelte
<script>
  import { MarkdownPreview } from '@liwe3/webcomponents-svelte';

  let content = $state('# Hello World');
</script>

<MarkdownPreview value={content} />
```

## Features

- **Full Svelte 5 Support**: Uses Svelte 5 runes (`$state`, `$bindable`, `$effect`)
- **TypeScript**: Full type safety
- **Reactive**: All props are reactive and two-way bindable where appropriate
- **SSR Safe**: Components are loaded dynamically to prevent SSR issues

## Components

### SmartSelect Props

- `multiple` (boolean): Enable multi-select mode
- `searchable` (boolean): Enable search functionality
- `placeholder` (string): Placeholder text
- `disabled` (boolean): Disable the select
- `value` (string | string[], bindable): Selected value(s)
- `options` (SelectOption[]): Array of `{value, label}` objects
- `onchange` (function): Change event handler
- `onopen` (function): Open event handler
- `onclose` (function): Close event handler
- `onsearch` (function): Search event handler

### AITextEditor Props

- `value` (string, bindable): Editor content
- `apiKey` (string): API key for AI service
- `suggestionDelay` (number): Delay before showing suggestions (ms)
- `systemPrompt` (string, bindable): System prompt for AI
- `apiEndpoint` (string): API endpoint URL
- `modelName` (string): Model name to use
- `placeholder` (string): Placeholder text
- `onbeforesuggestion` (function): Called before requesting suggestion
- `onchange` (function): Change event handler

### AIMarkdownEditor Props

- `value` (string, bindable): Editor content
- `apiKey` (string): API key for AI service
- `suggestionDelay` (number): Delay before showing suggestions (ms)
- `systemPrompt` (string, bindable): System prompt for AI
- `apiEndpoint` (string): API endpoint URL
- `modelName` (string): Model name to use
- `context` (string): Additional context for AI
- `onbeforesuggestion` (function): Called before requesting suggestion
- `onchange` (function): Change event handler

### MarkdownPreview Props

- `value` (string): Markdown content to render
- `libUrl` (string): URL to load marked library from
- `onlibraryloaded` (function): Called when library is loaded

## License

MIT

## Links

- [Core Package](https://www.npmjs.com/package/@liwe3/webcomponents)
- [GitHub Repository](https://github.com/liwe3/webcomponents)
