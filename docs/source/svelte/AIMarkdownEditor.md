# AIMarkdownEditor (Svelte)

Svelte wrapper for the `liwe3-ai-markdown-editor` web component. Provides a markdown editor with AI-powered text continuation suggestions, formatting toolbar, and preview mode.

## Usage

```svelte
<script lang="ts">
  import { AIMarkdownEditor } from '@liwe3/webcomponents-svelte';

  let content = $state('');
  let apiKey = $state('your-api-key');
</script>

<AIMarkdownEditor
  bind:value={content}
  {apiKey}
  systemPrompt="You are a technical documentation writer."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | The markdown content. Supports `bind:value`. |
| `apiKey` | `string` | `""` | OpenAI API key. |
| `systemPrompt` | `string` | (Default prompt) | System prompt for the AI. Supports `bind:systemPrompt`. |
| `suggestionDelay` | `number` | `3000` | Delay in ms before requesting suggestion. |
| `apiEndpoint` | `string` | (OpenAI URL) | API endpoint URL. |
| `modelName` | `string` | `"gpt-3.5-turbo"` | Model name to use. |
| `context` | `string` | `""` | Additional context for AI suggestions. |
| `showSettings` | `boolean` | `true` | Whether to show the settings button in the toolbar. |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `onchange` | `(value: string) => void` | Fired when text changes. |
| `onbeforesuggestion` | `(data: any) => boolean` | Fired before AI request. Return `true` to cancel. |

## Component Exports

Access methods via component instance binding:

```svelte
<script>
  let editorRef;
</script>

<AIMarkdownEditor bind:this={editorRef} ... />
```

| Method | Description |
|--------|-------------|
| `setText(text)` | Sets text content. |
| `getText()` | Gets text content. |
| `setContext(ctx)` | Sets AI context. |
| `getContext()` | Gets AI context. |
| `setSystemPrompt(p)` | Sets system prompt. |
| `getSystemPrompt()` | Gets system prompt. |
| `setApiKey(key)` | Sets API key. |
| `getApiKey()` | Gets API key. |
| `setSuggestionDelay(s)` | Sets delay in seconds. |
| `getSuggestionDelay()` | Gets delay in seconds. |
| `setApiEndpoint(url)` | Sets API endpoint. |
| `getApiEndpoint()` | Gets API endpoint. |
| `setModelName(name)` | Sets model name. |
| `getModelName()` | Gets model name. |
| `setShowSettings(show)` | Shows or hides the settings button. |
| `getShowSettings()` | Gets settings button visibility. |

## Toolbar Features

The toolbar provides quick formatting buttons:

- **Bold** (`**text**`)
- **Italic** (`*text*`)
- **Underline** (`<u>text</u>`)
- **Unordered List** (`- item`)
- **Ordered List** (`1. item`)
- **Preview** - Toggle between edit and preview mode
- **Settings** - Open AI configuration modal (controlled by `showSettings` prop)

## Example: Hiding Settings Button

When you want to manage API configuration programmatically without exposing the settings UI to users:

```svelte
<script lang="ts">
  import { AIMarkdownEditor } from '@liwe3/webcomponents-svelte';

  let content = $state('');
  let showSettings = $state(false);
</script>

<!-- Settings button is hidden -->
<AIMarkdownEditor
  bind:value={content}
  apiKey="your-api-key"
  modelName="gpt-4"
  systemPrompt="You are a technical writer."
  {showSettings}
/>

<!-- Toggle button to show/hide settings -->
<button onclick={() => showSettings = !showSettings}>
  {showSettings ? 'Hide' : 'Show'} Settings Button
</button>
```

## Example: Full Featured Editor

```svelte
<script lang="ts">
  import { AIMarkdownEditor } from '@liwe3/webcomponents-svelte';

  let content = $state('# Welcome\n\nStart writing...');
  let editorRef: any;

  const handleChange = (value: string) => {
    console.log('Content updated:', value.length, 'characters');
  };

  const handleBeforeSuggestion = (data: any) => {
    // Return true to cancel the suggestion request
    if (data.text.length < 10) {
      console.log('Text too short for suggestions');
      return true;
    }
    return false;
  };
</script>

<div class="editor-container">
  <AIMarkdownEditor
    bind:this={editorRef}
    bind:value={content}
    apiKey="your-api-key"
    suggestionDelay={2000}
    systemPrompt="You are a helpful writing assistant for markdown documents."
    showSettings={true}
    onchange={handleChange}
    onbeforesuggestion={handleBeforeSuggestion}
  />
</div>

<style>
  .editor-container {
    height: 500px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }
</style>
```
