# AIMarkdownEditor Component

A markdown editor with AI-powered text continuation suggestions. It combines the `AITextEditor` with a toolbar for markdown formatting and a preview mode.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
  <liwe3-ai-markdown-editor id="demo-md-editor" style="height: 400px;"></liwe3-ai-markdown-editor>
  <div style="margin-top: 10px;">
    <input type="password" id="demo-md-api-key" placeholder="Enter OpenAI API Key to test" style="padding: 8px; width: 250px;">
    <button id="demo-md-set-key" style="padding: 8px 16px; cursor: pointer;">Set Key</button>
    <span id="md-key-status" style="margin-left: 10px; color: #666;"></span>
  </div>
  <div style="margin-top: 10px;">
    <label>
      <input type="checkbox" id="demo-show-settings" checked>
      Show Settings Button
    </label>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('demo-md-editor');
    const keyInput = document.getElementById('demo-md-api-key');
    const setBtn = document.getElementById('demo-md-set-key');
    const status = document.getElementById('md-key-status');
    const showSettingsCheckbox = document.getElementById('demo-show-settings');

    if (editor && setBtn && keyInput) {
      customElements.whenDefined('liwe3-ai-markdown-editor').then(() => {
        // Check if key is already set
        if (editor.getApiKey()) {
          status.textContent = 'API Key is set';
          keyInput.value = '';
        }

        setBtn.addEventListener('click', () => {
          const key = keyInput.value.trim();
          if (key) {
            editor.setApiKey(key);
            status.textContent = 'API Key set successfully!';
            keyInput.value = '';
            setTimeout(() => status.textContent = 'API Key is set', 2000);
          }
        });

        showSettingsCheckbox.addEventListener('change', (e) => {
          editor.setShowSettings(e.target.checked);
        });
      });
    }
  });
</script>

## Usage

```html
<liwe3-ai-markdown-editor></liwe3-ai-markdown-editor>

<script>
  const editor = document.querySelector('liwe3-ai-markdown-editor');
  editor.setApiKey('your-api-key');
</script>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `show-settings` | `string` | `"true"` | Controls visibility of the settings button. Set to `"false"` to hide. |

```html
<!-- Hide the settings button -->
<liwe3-ai-markdown-editor show-settings="false"></liwe3-ai-markdown-editor>
```

## Configuration

The component can be configured via methods. All AI-related configurations are passed through to the embedded `AITextEditor`.

| Config Option | Default | Description |
|---------------|---------|-------------|
| `apiKey` | `""` | The API key for the AI service. Stored in localStorage. |
| `suggestionDelay` | `1` (second) | Delay after typing stops before requesting a suggestion. |
| `systemPrompt` | "You are a helpful..." | The system prompt sent to the AI model. |
| `apiEndpoint` | `https://api.openai.com/v1/chat/completions` | The API endpoint URL. |
| `modelName` | `gpt-3.5-turbo` | The model name to use. |
| `context` | `""` | Additional context to provide to the AI. |
| `showSettings` | `true` | Whether to show the settings button in the toolbar. |

## Methods

| Method | Description |
|--------|-------------|
| `setText(text: string)` | Sets the text content of the editor. |
| `getText()` | Gets the current text content. |
| `setApiKey(key: string)` | Sets the API key. |
| `getApiKey()` | Gets the current API key. |
| `setSuggestionDelay(seconds: number)` | Sets the suggestion delay in seconds. |
| `getSuggestionDelay()` | Gets the suggestion delay in seconds. |
| `setSystemPrompt(prompt: string)` | Sets the system prompt. |
| `getSystemPrompt()` | Gets the current system prompt. |
| `setApiEndpoint(endpoint: string)` | Sets the API endpoint URL. |
| `getApiEndpoint()` | Gets the current API endpoint. |
| `setModelName(model: string)` | Sets the model name. |
| `getModelName()` | Gets the current model name. |
| `setContext(context: string)` | Sets additional context for the AI. |
| `getContext()` | Gets the current context. |
| `setShowSettings(show: boolean)` | Shows or hides the settings button in the toolbar. |
| `getShowSettings()` | Gets the current visibility state of the settings button. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string }` | Fired when the text content changes. |
| `beforeSuggestion` | `{ text, context, apiEndpoint, modelName, systemPrompt }` | Fired before requesting a suggestion. Cancellable with `event.preventDefault()`. |

## Toolbar Features

The toolbar provides quick formatting buttons:

- **Bold** (`**text**`)
- **Italic** (`*text*`)
- **Underline** (`<u>text</u>`)
- **Unordered List** (`- item`)
- **Ordered List** (`1. item`)
- **Preview** - Toggle between edit and preview mode
- **Settings** - Open AI configuration modal (can be hidden with `showSettings`)

## Keyboard Shortcuts

- **Tab**: Accept the current AI suggestion (paragraph by paragraph).
- **Escape**: Dismiss the current suggestion.

## Styling

The component uses Shadow DOM. The editor fills its container by default.

```css
/* Example of how to size the component */
liwe3-ai-markdown-editor {
  width: 100%;
  height: 500px;
}
```

## Example: Hiding Settings Button

When you want to manage API configuration programmatically without exposing the settings UI to users:

```html
<liwe3-ai-markdown-editor id="editor" show-settings="false"></liwe3-ai-markdown-editor>

<script>
  const editor = document.getElementById('editor');
  
  // Configure programmatically
  editor.setApiKey('your-api-key');
  editor.setModelName('gpt-4');
  editor.setSystemPrompt('You are a technical documentation writer.');
  
  // Can also toggle dynamically
  editor.setShowSettings(true); // Show the button
  editor.setShowSettings(false); // Hide the button
</script>
```
