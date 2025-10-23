# AITextEditor

A text editor with AI-powered text continuation suggestions using OpenAI-compatible APIs.

## Basic Usage

```html
<liwe3-ai-text-editor id="myEditor"></liwe3-ai-text-editor>

<script type="module">
  import '@liwe3/webcomponents';

  const editor = document.getElementById('myEditor');

  // Set API key
  editor.setApiKey('your-openai-api-key');

  // Optional: Set initial text
  editor.setText('Start writing here...');
</script>
```

## TypeScript Usage

```typescript
import { AITextEditorElement, AITextEditorConfig } from '@liwe3/webcomponents';

const editor = document.getElementById('myEditor') as AITextEditorElement;

// Configure the editor
editor.setApiKey('your-openai-api-key');
editor.setSystemPrompt('You are a helpful writing assistant...');
editor.setModelName('gpt-4');
editor.setSuggestionDelay(2); // 2 seconds
```

## Features

### AI-Powered Suggestions

The editor automatically suggests text continuations as you type. After a configurable delay (default: 1 second), it sends your current text to an AI API and displays suggestions as ghost text.

### Tab to Accept

Press `Tab` to accept suggestions paragraph by paragraph. Each press accepts one paragraph of the suggestion, allowing you to review and accept incrementally.

### Visual Status Indicator

A colored dot in the top-left corner indicates API key status:
- **Gray:** No API key set
- **Green:** API key configured

### Persistent API Key

The API key is stored securely in localStorage (base64 encoded) and persists across browser sessions.

## Configuration

### API Key Setup

```typescript
// Set API key
editor.setApiKey('sk-...');

// Get current API key
const apiKey = editor.getApiKey();
```

The API key is automatically saved to localStorage and restored on page load.

**Source:** `AITextEditor.ts:551-590`

### Suggestion Delay

Configure how long to wait after typing stops before requesting a suggestion:

```typescript
// Set delay to 2 seconds
editor.setSuggestionDelay(2);

// Get current delay (in seconds)
const delay = editor.getSuggestionDelay();
```

**Default:** 1 second

**Source:** `AITextEditor.ts:595-604`

### System Prompt

Customize the AI's behavior by setting a system prompt:

```typescript
editor.setSystemPrompt(
  'You are a technical writer. Continue the documentation naturally and professionally.'
);

// Get current system prompt
const prompt = editor.getSystemPrompt();
```

**Default:**
```
You are a helpful writing assistant. Continue the user's text naturally and coherently.
Provide 1-3 sentences that would logically follow their writing. Keep the same tone and style.
Do not repeat what they've already written.
```

**Source:** `AITextEditor.ts:609-618`

### API Endpoint

The editor supports any OpenAI-compatible API:

```typescript
// Use custom endpoint
editor.setApiEndpoint('https://your-api.com/v1/chat/completions');

// Get current endpoint
const endpoint = editor.getApiEndpoint();
```

**Default:** `https://api.openai.com/v1/chat/completions`

**Source:** `AITextEditor.ts:623-633`

### Model Name

Specify which AI model to use:

```typescript
editor.setModelName('gpt-4');

// Get current model
const model = editor.getModelName();
```

**Default:** `gpt-3.5-turbo`

**Source:** `AITextEditor.ts:638-647`

### Context

Provide additional context that will be included with each API request:

```typescript
editor.setContext(`
Project: Technical Documentation
Audience: Software Developers
Style: Professional, concise
`);

// Get current context
const context = editor.getContext();
```

The context is prepended to each API request to help guide the AI's responses.

**Source:** `AITextEditor.ts:652-662`

## Methods

### `setText(text: string)`

Sets the editor's text content.

**Parameters:**
- `text` - The text to set

**Example:**
```typescript
editor.setText('Hello, world!');
```

**Source:** `AITextEditor.ts:534`

---

### `getText(): string`

Gets the current text content.

**Returns:** `string` - The current text

**Example:**
```typescript
const text = editor.getText();
console.log(text);
```

**Source:** `AITextEditor.ts:544`

---

### `setApiKey(key: string)`

Sets the API key and saves it to localStorage.

**Parameters:**
- `key` - The API key

**Example:**
```typescript
editor.setApiKey('sk-...');
```

**Source:** `AITextEditor.ts:551`

---

### `getApiKey(): string`

Gets the current API key.

**Returns:** `string` - The API key

**Example:**
```typescript
const key = editor.getApiKey();
```

**Source:** `AITextEditor.ts:588`

---

### `setSuggestionDelay(seconds: number)`

Sets the delay (in seconds) before requesting suggestions after typing stops.

**Parameters:**
- `seconds` - Delay in seconds

**Example:**
```typescript
editor.setSuggestionDelay(2); // 2 second delay
```

**Source:** `AITextEditor.ts:595`

---

### `getSuggestionDelay(): number`

Gets the current suggestion delay in seconds.

**Returns:** `number` - Delay in seconds

**Example:**
```typescript
const delay = editor.getSuggestionDelay();
```

**Source:** `AITextEditor.ts:602`

---

### `setSystemPrompt(prompt: string)`

Sets the system prompt for the AI.

**Parameters:**
- `prompt` - The system prompt

**Example:**
```typescript
editor.setSystemPrompt('You are a helpful assistant...');
```

**Source:** `AITextEditor.ts:609`

---

### `getSystemPrompt(): string`

Gets the current system prompt.

**Returns:** `string` - The system prompt

**Example:**
```typescript
const prompt = editor.getSystemPrompt();
```

**Source:** `AITextEditor.ts:616`

---

### `setApiEndpoint(endpoint: string)`

Sets the API endpoint URL.

**Parameters:**
- `endpoint` - The API endpoint URL

**Example:**
```typescript
editor.setApiEndpoint('https://api.example.com/v1/chat/completions');
```

**Source:** `AITextEditor.ts:623`

---

### `getApiEndpoint(): string`

Gets the current API endpoint.

**Returns:** `string` - The API endpoint URL

**Example:**
```typescript
const endpoint = editor.getApiEndpoint();
```

**Source:** `AITextEditor.ts:631`

---

### `setModelName(modelName: string)`

Sets the AI model name.

**Parameters:**
- `modelName` - The model name (e.g., 'gpt-4', 'gpt-3.5-turbo')

**Example:**
```typescript
editor.setModelName('gpt-4');
```

**Source:** `AITextEditor.ts:638`

---

### `getModelName(): string`

Gets the current model name.

**Returns:** `string` - The model name

**Example:**
```typescript
const model = editor.getModelName();
```

**Source:** `AITextEditor.ts:646`

---

### `setContext(context: string)`

Sets additional context for AI requests.

**Parameters:**
- `context` - Context text

**Example:**
```typescript
editor.setContext('This is a technical blog post about web components.');
```

**Source:** `AITextEditor.ts:653`

---

### `getContext(): string`

Gets the current context.

**Returns:** `string` - The context text

**Example:**
```typescript
const context = editor.getContext();
```

**Source:** `AITextEditor.ts:660`

## Events

### `change`

Fired when the text content changes (user typing or suggestion accepted).

**Detail:**
```typescript
{
  value: string
}
```

**Example:**
```typescript
editor.addEventListener('change', (e) => {
  console.log('Text changed:', e.detail.value);
});
```

**Source:** `AITextEditor.ts:205`, `AITextEditor.ts:474`, `AITextEditor.ts:536`

---

### `beforeSuggestion`

Fired before making an AI suggestion request. Can be cancelled by calling `event.preventDefault()`.

**Detail:**
```typescript
{
  text: string;          // Text up to cursor
  context: string;       // Current context
  apiEndpoint: string;   // API endpoint
  modelName: string;     // Model name
  systemPrompt: string;  // System prompt
}
```

**Cancelable:** Yes

**Example:**
```typescript
editor.addEventListener('beforeSuggestion', (e) => {
  console.log('About to request suggestion for:', e.detail.text);

  // Cancel if text is too short
  if (e.detail.text.length < 10) {
    e.preventDefault();
  }
});
```

**Source:** `AITextEditor.ts:333-346`

---

### `error`

Fired when an API error occurs.

**Detail:**
```typescript
{
  message: string
}
```

**Example:**
```typescript
editor.addEventListener('error', (e) => {
  console.error('API Error:', e.detail.message);
  alert('Failed to get AI suggestion: ' + e.detail.message);
});
```

**Source:** `AITextEditor.ts:506-510`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Accept next paragraph of suggestion |
| `Escape` | Dismiss current suggestion |
| Arrow keys, clicks | Dismiss suggestion and move cursor |

**Source:** `AITextEditor.ts:307-316`

## CSS Customization

The editor is styled to look like a simple text area with monospace font. You can customize its appearance:

```css
liwe3-ai-text-editor {
  width: 100%;
  height: 400px;
  display: block;
}

/* The editor is in shadow DOM, but you can use CSS custom properties */
/* Currently, the component doesn't expose CSS variables, but you can */
/* wrap it and style the container */
```

The component uses internal styling for:
- Text area with monospace font
- Ghost text suggestions (gray color)
- Loading spinner
- Status indicator (colored dot)

**Source:** `AITextEditor.ts:48-169`

## How It Works

### Suggestion Flow

1. User types in the editor
2. After a delay (default: 1 second), the component sends text up to cursor position to the AI API
3. The API response is split into paragraphs
4. The first paragraph is displayed as ghost text after the cursor
5. User presses `Tab` to accept the current paragraph
6. The next paragraph (if any) is then shown
7. Process repeats until all paragraphs are accepted

**Source:** `AITextEditor.ts:289-361`, `AITextEditor.ts:424-484`

### Background Layer Technique

The component uses a clever two-layer approach:
- **Foreground:** Transparent textarea for user input
- **Background:** Div showing the user's text plus ghost text suggestions

This allows the ghost text to appear inline with the user's text while keeping the textarea fully functional.

**Source:** `AITextEditor.ts:243-277`

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AITextEditor Example</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    liwe3-ai-text-editor {
      width: 100%;
      height: 400px;
      display: block;
      margin-bottom: 20px;
    }

    .config {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .config input {
      width: 100%;
      padding: 8px;
      margin: 5px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .config label {
      display: block;
      margin-top: 10px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>AI Text Editor Example</h1>

  <div class="config">
    <label>
      API Key:
      <input type="password" id="apiKey" placeholder="sk-...">
    </label>
    <label>
      Model:
      <input type="text" id="model" value="gpt-3.5-turbo">
    </label>
    <label>
      Suggestion Delay (seconds):
      <input type="number" id="delay" value="1" min="0.5" max="10" step="0.5">
    </label>
  </div>

  <liwe3-ai-text-editor id="editor"></liwe3-ai-text-editor>

  <div id="status"></div>

  <script type="module">
    import '@liwe3/webcomponents';

    const editor = document.getElementById('editor');
    const apiKeyInput = document.getElementById('apiKey');
    const modelInput = document.getElementById('model');
    const delayInput = document.getElementById('delay');
    const status = document.getElementById('status');

    // Load saved API key
    apiKeyInput.value = editor.getApiKey();

    // Configure editor
    apiKeyInput.addEventListener('input', (e) => {
      editor.setApiKey(e.target.value);
    });

    modelInput.addEventListener('input', (e) => {
      editor.setModelName(e.target.value);
    });

    delayInput.addEventListener('input', (e) => {
      editor.setSuggestionDelay(parseFloat(e.target.value));
    });

    // Set initial text
    editor.setText('Welcome to the AI Text Editor. Start typing and the AI will suggest continuations...');

    // Listen to changes
    editor.addEventListener('change', (e) => {
      status.textContent = `Characters: ${e.detail.value.length}`;
    });

    // Listen to errors
    editor.addEventListener('error', (e) => {
      status.textContent = `Error: ${e.detail.message}`;
      status.style.color = 'red';
      setTimeout(() => {
        status.style.color = '';
      }, 5000);
    });

    // Optional: Set custom system prompt
    editor.setSystemPrompt(
      'You are a helpful writing assistant. Continue the text naturally. ' +
      'Keep the same tone and style. Provide 1-2 sentences.'
    );
  </script>
</body>
</html>
```

## Using with Alternative AI Providers

The editor works with any OpenAI-compatible API:

### OpenAI

```typescript
editor.setApiEndpoint('https://api.openai.com/v1/chat/completions');
editor.setApiKey('sk-...');
editor.setModelName('gpt-4');
```

### Azure OpenAI

```typescript
editor.setApiEndpoint('https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2023-05-15');
editor.setApiKey('your-azure-key');
editor.setModelName('gpt-4');
```

### Local LLM (Ollama, LM Studio, etc.)

```typescript
editor.setApiEndpoint('http://localhost:11434/v1/chat/completions');
editor.setApiKey(''); // Often not needed for local
editor.setModelName('llama2');
```

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Security Considerations

- API keys are stored in localStorage with base64 encoding (not true encryption)
- For production use, consider implementing a backend proxy to avoid exposing API keys in the browser
- The component supports the `beforeSuggestion` event to implement custom authorization logic

## Related Components

- [SmartSelect](./SmartSelect.md)
- [Toast](./Toast.md)
- [PopoverMenu](./PopoverMenu.md)
