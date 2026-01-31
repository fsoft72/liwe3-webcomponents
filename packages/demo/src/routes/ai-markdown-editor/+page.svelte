<script lang="ts">
import { AIMarkdownEditor } from '@liwe3/webcomponents-svelte';

let editorValue = $state<string>( '' );
let apiKey = $state<string>( '' );
let apiKeyInput = $state<string>( '' );
let suggestionDelay = $state<number>( 1 );
let showSettings = $state<boolean>( true );

// Editor instance reference (for calling methods)
let editorInstance : any;

// Handle editor change events
const handleEditorChange = ( value : string ) => {
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

	if ( editorInstance ) {
		editorInstance.setText( sampleText );
		editorValue = sampleText;
	}
};
</script>

<div class="page-container">
	<h1>AIMarkdownEditor Component Demo</h1>
	<p class="subtitle">Markdown editor with AI-powered continuation suggestions</p>

	<!-- Controls Section -->
	<section class="demo-section">
		<h2>Controls</h2>
		<div class="controls-box">
			<div class="control-row">
				<label class="checkbox-label">
					<input type="checkbox" bind:checked={showSettings}>
					Show Settings Button
				</label>
				<span class="status-badge" class:visible={showSettings} class:hidden={!showSettings}>
					Settings: {showSettings ? 'Visible' : 'Hidden'}
				</span>
			</div>
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
				{showSettings}
			/>
		</div>

		<div class="instructions">
			<h3>How to use:</h3>
			<ul>
				<li><strong>Tab</strong> - Accept the current AI suggestion</li>
				<li><strong>Escape</strong> - Dismiss the suggestion</li>
				<li><strong>Toolbar</strong> - Use buttons to format text or toggle preview</li>
				<li><strong>Settings</strong> - Click the gear icon to configure API settings (when visible)</li>
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

.controls-box {
	background: #f8f9fa;
	padding: 1.5rem;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
}

.control-row {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.checkbox-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
	font-weight: 500;
	color: #333;
}

.checkbox-label input[type="checkbox"] {
	width: 18px;
	height: 18px;
	cursor: pointer;
}

.status-badge {
	padding: 0.5rem 1rem;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 500;
}

.status-badge.visible {
	background: #d4edda;
	color: #155724;
}

.status-badge.hidden {
	background: #f8d7da;
	color: #721c24;
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
