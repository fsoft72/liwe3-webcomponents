<script lang="ts">
  import { AIMarkdownEditor } from "@liwe3/webcomponents-svelte";
  import { onMount } from "svelte";

  let editorValue = $state<string>("");
  let apiKey = $state<string>("");
  let apiKeyInput = $state<string>("");
  let showApiKeySettings = $state<boolean>(false);
  let suggestionDelay = $state<number>(1);

  // Editor instance reference (for calling methods)
  let editorInstance: any;

  // Calculate word count reactively
  const wordCount = $derived.by(() => {
    if (!editorValue || editorValue.trim() === "") return 0;
    return editorValue.trim().split(/\s+/).length;
  });

  // Handle API key save
  const saveApiKey = () => {
    if (apiKeyInput.trim()) {
      apiKey = apiKeyInput.trim();
      showApiKeySettings = false;
    }
  };

  // Handle API key load on mount
  onMount(() => {
    if (editorInstance) {
      const savedKey = editorInstance.getApiKey();
      if (savedKey) {
        apiKey = savedKey;
        apiKeyInput = savedKey;
      }
    }
  });

  // Handle editor change events
  const handleEditorChange = (value: string) => {
    editorValue = value;
  };

  // Sample text for quick testing
  const loadSampleText = () => {
    const sampleText = `# AI Markdown Editor Demo

This component combines a markdown editor with AI-powered text continuation.

## Features
- **Markdown Support**: Write in markdown with toolbar support
- **AI Continuation**: Get suggestions as you type
- **Preview Mode**: Toggle between editor and preview

## How to use
1. Set your OpenAI API key
2. Start writing
3. Use the toolbar for formatting
4. Press Tab to accept AI suggestions

Try it out!`;

    if (editorInstance) {
      editorInstance.setText(sampleText);
      editorValue = sampleText;
    }
  };
</script>

<div class="page-container">
  <h1>AIMarkdownEditor Component Demo</h1>
  <p class="subtitle">Markdown editor with AI-powered continuation suggestions</p>

  <!-- API Key Settings -->
  <section class="demo-section">
    <div class="settings-header">
      <h2>Settings</h2>
      <button
        class="toggle-btn"
        onclick={() => (showApiKeySettings = !showApiKeySettings)}
      >
        {showApiKeySettings ? "Hide" : "Show"} Settings
      </button>
    </div>

    {#if showApiKeySettings}
      <div class="settings-box">
        <div class="setting-item">
          <label for="api-key">OpenAI API Key:</label>
          <div class="input-group">
            <input
              id="api-key"
              type="password"
              bind:value={apiKeyInput}
              placeholder="sk-..."
              class="api-key-input"
            />
            <button class="save-btn" onclick={saveApiKey}>Save</button>
          </div>
          <small class="hint">
            Your API key is stored locally in your browser and never sent to our
            servers. Get your API key from <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener">OpenAI</a
            >.
          </small>
        </div>

        <div class="setting-item">
          <label for="delay">Suggestion Delay (seconds):</label>
          <input
            id="delay"
            type="number"
            bind:value={suggestionDelay}
            min="0.5"
            max="5"
            step="0.5"
            class="delay-input"
          />
          <small class="hint">
            Time to wait after you stop typing before requesting AI suggestions.
          </small>
        </div>
      </div>
    {/if}

    <div class="status-bar">
      <span class="status-item">
        API Key: <span class={apiKey ? "status-ok" : "status-missing"}>
          {apiKey ? "Configured ✓" : "Not set ✗"}
        </span>
      </span>
      <span class="status-item">
        Word Count: <strong>{wordCount}</strong>
      </span>
    </div>
  </section>

  <!-- Editor Demo -->
  <section class="demo-section">
    <div class="editor-header">
      <h2>Editor</h2>
      <button class="load-sample-btn" onclick={loadSampleText}>
        Load Sample Text
      </button>
    </div>

    <div class="editor-box">
      <AIMarkdownEditor
        bind:this={editorInstance}
        onchange={handleEditorChange}
        {apiKey}
        suggestionDelay={suggestionDelay * 1000}
      />
    </div>

    <div class="instructions">
      <h3>How to use:</h3>
      <ul>
        <li><strong>Tab</strong> - Accept the current AI suggestion</li>
        <li><strong>Escape</strong> - Dismiss the suggestion</li>
        <li><strong>Toolbar</strong> - Use buttons to format text or toggle preview</li>
      </ul>
    </div>
  </section>

  <!-- Editor Content Output -->
  {#if editorValue}
    <section class="demo-section">
      <h2>Raw Content</h2>
      <div class="output-box">
        <pre><code>{editorValue}</code></pre>
      </div>
    </section>
  {/if}
</div>

<style>
  .page-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .subtitle {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 3rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #444;
  }

  .demo-section {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .demo-section:last-child {
    border-bottom: none;
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .toggle-btn {
    padding: 0.5rem 1rem;
    background: #4facfe;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .toggle-btn:hover {
    background: #3a8fd9;
  }

  .settings-box {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    margin-bottom: 1rem;
  }

  .setting-item {
    margin-bottom: 1.5rem;
  }

  .setting-item:last-child {
    margin-bottom: 0;
  }

  .setting-item label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
  }

  .api-key-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
    font-family: "Monaco", "Menlo", monospace;
  }

  .save-btn {
    padding: 0.5rem 1.5rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .save-btn:hover {
    background: #218838;
  }

  .delay-input {
    width: 100px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .hint {
    display: block;
    margin-top: 0.5rem;
    color: #666;
    font-size: 0.85rem;
  }

  .hint a {
    color: #4facfe;
    text-decoration: none;
  }

  .hint a:hover {
    text-decoration: underline;
  }

  .status-bar {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  .status-item {
    color: #666;
  }

  .status-ok {
    color: #28a745;
    font-weight: 600;
  }

  .status-missing {
    color: #dc3545;
    font-weight: 600;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .load-sample-btn {
    padding: 0.5rem 1rem;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .load-sample-btn:hover {
    background: #5a6268;
  }

  .editor-box {
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e0e0e0;
  }

  .instructions {
    margin-top: 1rem;
    padding: 1rem;
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 6px;
  }

  .instructions ul {
    margin: 0.5rem 0 0 1.5rem;
    padding: 0;
  }

  .instructions li {
    margin-bottom: 0.5rem;
    color: #856404;
  }

  .output-box {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    overflow-x: auto;
  }

  .output-box pre {
    margin: 0;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .output-box code {
    color: #333;
  }
</style>
