<script lang="ts">
import { SortableContainer } from '@liwe3/webcomponents-svelte';
import type {
	HandlePosition,
	ReorgEventDetail,
	SortDirection,
} from '@liwe3/webcomponents';

let outputMessage = $state(
	'Drag items using the handles to reorder them...',
);
let direction : SortDirection = $state( 'v' );
let handlePosition : HandlePosition = $state( 'end' );

const log = ( message : string ) => {
	const timestamp = new Date().toLocaleTimeString();
	outputMessage = `[${timestamp}] ${message}`;
};

const handleReorg = ( event : CustomEvent<ReorgEventDetail> ) => {
	log( `New order: ${event.detail.ids.join( ', ' )}` );
};

const directions : { value : SortDirection; label : string }[] = [
	{ value: 'v', label: 'Vertical' },
	{ value: 'h', label: 'Horizontal' },
];

const handlePositions : { value : HandlePosition; label : string }[] = [
	{ value: 'start', label: 'Start (left/top)' },
	{ value: 'end', label: 'End (right/bottom)' },
];

const items = [
	{ id: 'item-1', icon: '📦', title: 'Item 1', description: 'First sortable item' },
	{ id: 'item-2', icon: '🎨', title: 'Item 2', description: 'Second sortable item' },
	{ id: 'item-3', icon: '🚀', title: 'Item 3', description: 'Third sortable item' },
	{ id: 'item-4', icon: '⭐', title: 'Item 4', description: 'Fourth sortable item' },
	{ id: 'item-5', icon: '🔥', title: 'Item 5', description: 'Fifth sortable item' },
];

const horizontalItems = [
	{ id: 'h-1', color: '#667eea', label: 'A' },
	{ id: 'h-2', color: '#764ba2', label: 'B' },
	{ id: 'h-3', color: '#f093fb', label: 'C' },
	{ id: 'h-4', color: '#f5576c', label: 'D' },
];
</script>

<div class="demo-container">
	<header class="demo-header">
		<h1>SortableContainer Component</h1>
		<p class="subtitle">
			Drag and drop sorting container with customizable handles
		</p>
	</header>

	<section class="demo-section">
		<h2>Interactive Demo</h2>
		<div class="controls">
			<div class="control-group">
				<label for="direction-select">Direction:</label>
				<select id="direction-select" bind:value={direction}>
					{#each directions as dir}
						<option value={dir.value}>{dir.label}</option>
					{/each}
				</select>
			</div>
			<div class="control-group">
				<label for="handle-position-select">Handle Position:</label>
				<select id="handle-position-select" bind:value={handlePosition}>
					{#each handlePositions as pos}
						<option value={pos.value}>{pos.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="example-area">
			<SortableContainer
				{direction}
				{handlePosition}
				onreorg={handleReorg}
			>
				{#if direction === 'v'}
					{#each items as item (item.id)}
						<div class="sortable-item" id={item.id}>
							<span class="item-icon">{item.icon}</span>
							<div class="item-content">
								<h4>{item.title}</h4>
								<p>{item.description}</p>
							</div>
						</div>
					{/each}
				{:else}
					{#each horizontalItems as item (item.id)}
						<div
							class="horizontal-item"
							id={item.id}
							style="background: linear-gradient(135deg, {item.color}, {item.color}dd)"
						>
							{item.label}
						</div>
					{/each}
				{/if}
			</SortableContainer>
		</div>
	</section>

	<section class="demo-section">
		<h2>Output Console</h2>
		<div class="output-area">
			<pre>{outputMessage}</pre>
		</div>
	</section>

	<section class="demo-section">
		<h2>Features</h2>
		<ul class="features-list">
			<li><strong>Drag Handles:</strong> Drag items only via the handle (dots icon)</li>
			<li><strong>Axis Locking:</strong> Items move only along the sorting axis</li>
			<li><strong>Smooth Animations:</strong> Elements animate when making space</li>
			<li><strong>Vertical/Horizontal:</strong> Support for both sorting directions</li>
			<li><strong>Handle Position:</strong> Configure handle at start or end</li>
			<li><strong>Touch Support:</strong> Works with mouse and touch devices</li>
			<li><strong>Event Callback:</strong> Get notified of reordering via <code>onreorg</code></li>
		</ul>
	</section>

	<section class="demo-section">
		<h2>Usage Example</h2>
		<pre class="code-block">{`<SortableContainer
  direction="v"
  handlePosition="end"
  onreorg={(e) => console.log(e.detail.ids)}
>
  <div id="item-1">Item 1</div>
  <div id="item-2">Item 2</div>
  <div id="item-3">Item 3</div>
</SortableContainer>`}</pre>
	</section>
</div>

<style>
.demo-container {
	max-width: 1000px;
	margin: 0 auto;
	padding: 2rem;
}

.demo-header {
	text-align: center;
	padding: 2rem 0;
	margin-bottom: 2rem;
	border-bottom: 2px solid #e0e0e0;
}

.demo-header h1 {
	font-size: 2.5rem;
	margin-bottom: 0.5rem;
	color: #1a1a1a;
}

.subtitle {
	font-size: 1.2rem;
	color: #666;
	margin: 0;
}

.demo-section {
	margin-bottom: 2rem;
	padding: 1.5rem;
	background: #f8f9fa;
	border-radius: 12px;
}

.demo-section h2 {
	font-size: 1.5rem;
	margin-bottom: 1rem;
	color: #333;
}

.controls {
	display: flex;
	gap: 1.5rem;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
}

.control-group {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.control-group label {
	font-weight: 500;
	color: #555;
}

.control-group select {
	padding: 0.5rem 1rem;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 1rem;
	background: white;
	cursor: pointer;
}

.example-area {
	background: white;
	padding: 1.5rem;
	border-radius: 8px;
	border: 1px solid #e0e0e0;
	min-height: 200px;
}

.sortable-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border-radius: 8px;
}

.item-icon {
	font-size: 1.5rem;
}

.item-content h4 {
	margin: 0 0 0.25rem 0;
	font-size: 1rem;
}

.item-content p {
	margin: 0;
	font-size: 0.875rem;
	opacity: 0.9;
}

.horizontal-item {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80px;
	height: 80px;
	border-radius: 8px;
	color: white;
	font-size: 1.5rem;
	font-weight: bold;
}

.output-area {
	background: #1a1a2e;
	color: #0f0;
	padding: 1rem;
	border-radius: 8px;
	font-family: "Monaco", "Menlo", monospace;
	font-size: 0.9rem;
	min-height: 60px;
}

.output-area pre {
	margin: 0;
	white-space: pre-wrap;
	word-break: break-word;
}

.features-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 0.75rem;
}

.features-list li {
	padding: 0.5rem 0;
	border-bottom: 1px solid #e0e0e0;
}

.features-list li:last-child {
	border-bottom: none;
}

.features-list code {
	background: #e9ecef;
	padding: 0.2rem 0.4rem;
	border-radius: 4px;
	font-size: 0.875rem;
}

.code-block {
	background: #1a1a2e;
	color: #e0e0e0;
	padding: 1rem;
	border-radius: 8px;
	overflow-x: auto;
	font-family: "Monaco", "Menlo", monospace;
	font-size: 0.875rem;
	margin: 0;
}
</style>
