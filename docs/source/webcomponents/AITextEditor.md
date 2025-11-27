# AITextEditor Component

A text editor with AI-powered text continuation suggestions. It connects to OpenAI-compatible APIs to provide inline text completion.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
  <liwe3-ai-text-editor id="demo-editor" style="height: 300px;"></liwe3-ai-text-editor>
  <div style="margin-top: 10px;">
    <input type="password" id="demo-api-key" placeholder="Enter OpenAI API Key to test" style="padding: 8px; width: 250px;">
    <button id="demo-set-key" style="padding: 8px 16px; cursor: pointer;">Set Key</button>
    <span id="key-status" style="margin-left: 10px; color: #666;"></span>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('demo-editor');
    const keyInput = document.getElementById('demo-api-key');
    const setBtn = document.getElementById('demo-set-key');
    const status = document.getElementById('key-status');

    if (editor && setBtn && keyInput) {
      customElements.whenDefined('liwe3-ai-text-editor').then(() => {
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
      });
    }
  });
</script>

## Usage

```html
<liwe3-ai-text-editor></liwe3-ai-text-editor>

<script>
  const editor = document.querySelector('liwe3-ai-text-editor');
  editor.setApiKey('your-api-key');
</script>
```

## Configuration

The component can be configured via methods.

| Config Option | Default | Description |
|---------------|---------|-------------|
| `apiKey` | `""` | The API key for the AI service. Stored in localStorage. |
| `suggestionDelay` | `1000` (ms) | Delay after typing stops before requesting a suggestion. |
| `systemPrompt` | "You are a helpful..." | The system prompt sent to the AI model. |
| `apiEndpoint` | `https://api.openai.com/v1/chat/completions` | The API endpoint URL. |
| `modelName` | `gpt-3.5-turbo` | The model name to use. |
| `context` | `""` | Additional context to provide to the AI. |

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

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string }` | Fired when the text content changes. |
| `beforeSuggestion` | `{ text, context, apiEndpoint, modelName, systemPrompt }` | Fired before requesting a suggestion. Cancellable. |
| `error` | `{ message: string }` | Fired when an error occurs (e.g., API failure). |

## Keyboard Shortcuts

- **Tab**: Accept the current suggestion (paragraph by paragraph).
- **Escape**: Dismiss the current suggestion.
- **Arrow Keys / Home / End**: Dismiss suggestion and move cursor.

## Styling

The component uses Shadow DOM. The editor is styled to look like a standard textarea but with a background layer for ghost text.

```css
/* Example of how to size the component */
liwe3-ai-text-editor {
  width: 100%;
  height: 400px;
}
```
