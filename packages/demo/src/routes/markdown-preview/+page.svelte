<script lang="ts">
  import { MarkdownPreview } from "@liwe3/webcomponents-svelte";

  let markdownValue = $state<string>(`# Markdown Preview Demo

This is a **live preview** of markdown content.

## Features
- Renders standard markdown
- Supports code blocks
- Supports tables
- Supports images

\`\`\`javascript
console.log("Hello World");
\`\`\`

| Feature | Status |
|---------|--------|
| Bold    | ✅     |
| Italic  | ✅     |
| Lists   | ✅     |
`);

  let libUrl = $state<string>("https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js");
</script>

<div class="page-container">
  <h1>MarkdownPreview Component Demo</h1>
  <p class="subtitle">Renders markdown content using a dynamically loaded library</p>

  <div class="demo-layout">
    <div class="input-section">
      <h2>Input Markdown</h2>
      <textarea bind:value={markdownValue}></textarea>
    </div>

    <div class="preview-section">
      <h2>Preview</h2>
      <div class="preview-box">
        <MarkdownPreview value={markdownValue} {libUrl} />
      </div>
    </div>
  </div>
</div>

<style>
  .page-container {
    max-width: 1200px;
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

  .demo-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    height: 600px;
  }

  .input-section, .preview-section {
    display: flex;
    flex-direction: column;
  }

  textarea {
    flex: 1;
    width: 100%;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-family: "Monaco", "Menlo", monospace;
    font-size: 0.9rem;
    resize: none;
    box-sizing: border-box;
  }

  .preview-box {
    flex: 1;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: white;
    overflow-y: auto;
  }
</style>
