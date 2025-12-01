<script lang="ts">
	import { CheckList } from '@liwe3/webcomponents-svelte';
	import type { CheckListItem } from '@liwe3/webcomponents';

	let items: CheckListItem[] = $state([
		{ label: 'Learn Svelte 5', checked: true },
		{ label: 'Build a web component', checked: true },
		{ label: 'Create a wrapper', checked: false }
	]);

	let title = $state('My Svelte Checklist');

	function handleChange(newItems: CheckListItem[]) {
		console.log('Items changed:', newItems);
		items = newItems;
	}

	function addItem() {
		items = [...items, { label: 'New Item', checked: false }];
	}
</script>

<div class="container">
	<h1>CheckList Demo</h1>
	
	<div class="demo-section">
		<h2>Interactive Demo</h2>
		<div class="checklist-wrapper">
			<CheckList 
				bind:title 
				bind:items 
				onchange={handleChange} 
			/>
		</div>
	</div>

	<div class="demo-section">
		<h2>State Inspection</h2>
		<div class="controls">
			<label>
				Title: <input type="text" bind:value={title} />
			</label>
			<button onclick={addItem}>Add Item Externally</button>
		</div>
		
		<pre>{JSON.stringify(items, null, 2)}</pre>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: sans-serif;
	}

	h1 {
		border-bottom: 1px solid #eee;
		padding-bottom: 10px;
	}

	.demo-section {
		margin-bottom: 40px;
		background: #f9f9f9;
		padding: 20px;
		border-radius: 8px;
	}

	.checklist-wrapper {
		background: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.controls {
		margin-bottom: 20px;
		display: flex;
		gap: 10px;
		align-items: center;
	}

	input {
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		padding: 5px 10px;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	pre {
		background: #333;
		color: #fff;
		padding: 10px;
		border-radius: 4px;
		overflow: auto;
	}
</style>
