# AITextEditor (Svelte)

Svelte wrapper for the `liwe3-ai-text-editor` web component.

## Usage

```svelte
<script lang="ts">
  import { AITextEditor } from '@liwe3/webcomponents-svelte';

  let content = $state('');
  let apiKey = $state('your-api-key');
</script>

<AITextEditor
  bind:value={content}
  {apiKey}
  systemPrompt="You are a technical writer."
  placeholder="Start typing..."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | The text content. Supports `bind:value`. |
| `apiKey` | `string` | `""` | OpenAI API key. |
| `systemPrompt` | `string` | (Default prompt) | System prompt for the AI. Supports `bind:systemPrompt`. |
| `suggestionDelay` | `number` | `3000` | Delay in ms before requesting suggestion. |
| `apiEndpoint` | `string` | (OpenAI URL) | API endpoint URL. |
| `modelName` | `string` | `"gpt-3.5-turbo"` | Model name to use. |
| `placeholder` | `string` | (Default text) | Placeholder text. |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `onchange` | `(value: string) => void` | Fired when text changes. |
| `oncompletionerror` | `(error: string) => void` | Fired when an error occurs during AI completion. |
| `onbeforesuggestion` | `(data: any) => boolean` | Fired before AI request. Return `true` to cancel. |

## Component Exports

Access methods via component instance binding:

```svelte
<script>
  let editorRef;
</script>

<AITextEditor bind:this={editorRef} ... />
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
