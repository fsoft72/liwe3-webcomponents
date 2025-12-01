<script lang="ts">
	import { SmartSelect } from '@liwe3/webcomponents-svelte';
	import type { SelectOption } from '@liwe3/webcomponents';

	// Single select state
	let singleValue = $state<string>('');

	// Multi select state
	let multiValue = $state<string[]>([]);

	// Options for all examples
	const programmingLanguages: SelectOption[] = [
		{ value: 'js', label: 'JavaScript' },
		{ value: 'ts', label: 'TypeScript' },
		{ value: 'py', label: 'Python' },
		{ value: 'rust', label: 'Rust' },
		{ value: 'go', label: 'Go' },
		{ value: 'java', label: 'Java' },
		{ value: 'cpp', label: 'C++' },
		{ value: 'csharp', label: 'C#' },
		{ value: 'ruby', label: 'Ruby' },
		{ value: 'php', label: 'PHP' }
	];

	const frameworks: SelectOption[] = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' },
		{ value: 'solid', label: 'Solid' },
		{ value: 'qwik', label: 'Qwik' }
	];

	const users: SelectOption[] = [
		{ value: '1', label: 'Alice Johnson', image: 'https://i.pravatar.cc/150?u=1' },
		{ value: '2', label: 'Bob Smith', image: 'https://i.pravatar.cc/150?u=2' },
		{ value: '3', label: 'Charlie Brown', image: 'https://i.pravatar.cc/150?u=3' },
		{ value: '4', label: 'Diana Prince', image: 'https://i.pravatar.cc/150?u=4' },
		{ value: '5', label: 'Evan Wright', image: 'https://i.pravatar.cc/150?u=5' }
	];

	// Derived values for display
	const singleSelectedLabel = $derived.by(() => {
		if (!singleValue) return 'None';
		return programmingLanguages.find(opt => opt.value === singleValue)?.label || 'None';
	});

	const multiSelectedLabels = $derived.by(() => {
		if (!multiValue || multiValue.length === 0) return 'None';
		return multiValue
			.map(val => programmingLanguages.find(opt => opt.value === val)?.label)
			.filter(Boolean)
			.join(', ');
	});
</script>

<div class="page-container">
	<h1>SmartSelect Component Demo</h1>
	<p class="subtitle">Interactive examples of the SmartSelect component with Svelte 5 bindings</p>

	<!-- Basic Single Select -->
	<section class="demo-section">
		<h2>Basic Single Select</h2>
		<p>A simple dropdown with single selection.</p>

		<div class="demo-box">
			<SmartSelect
				bind:value={singleValue}
				options={programmingLanguages}
				placeholder="Select a programming language"
			/>

			<div class="output">
				<strong>Selected:</strong> {singleSelectedLabel}
				<br>
				<strong>Value:</strong> <code>{singleValue || 'null'}</code>
			</div>
		</div>
	</section>

	<!-- Searchable Select -->
	<section class="demo-section">
		<h2>Searchable Select</h2>
		<p>Enable search to filter options in real-time.</p>

		<div class="demo-box">
			<SmartSelect
				options={frameworks}
				placeholder="Search frameworks..."
				searchable
			/>
		</div>
	</section>

	<!-- Multi-Select -->
	<section class="demo-section">
		<h2>Multi-Select</h2>
		<p>Select multiple options at once. Selected items appear as tags.</p>

		<div class="demo-box">
			<SmartSelect
				bind:value={multiValue}
				options={programmingLanguages}
				placeholder="Select multiple languages"
				multiple
				searchable
			/>

			<div class="output">
				<strong>Selected:</strong> {multiSelectedLabels}
				<br>
				<strong>Values:</strong> <code>{JSON.stringify(multiValue)}</code>
			</div>
		</div>
	</section>

	<!-- Disabled State -->
	<section class="demo-section">
		<h2>Disabled State</h2>
		<p>Components can be disabled to prevent user interaction.</p>

		<div class="demo-box">
			<SmartSelect
				options={programmingLanguages}
				placeholder="This select is disabled"
				disabled
			/>
		</div>
	</section>

	<!-- Full Featured Example -->
	<section class="demo-section">
		<h2>Full Featured Example</h2>
		<p>Combining searchable + multiple selection for the best UX.</p>

		<div class="demo-box">
			<SmartSelect
				options={programmingLanguages}
				placeholder="Search and select multiple"
				multiple
				searchable
			/>
		</div>
	</section>

	<!-- With Images -->
	<section class="demo-section">
		<h2>With Images</h2>
		<p>Options can include images, perfect for user selection or rich content.</p>

		<div class="demo-box">
			<SmartSelect
				options={users}
				placeholder="Select a user..."
				searchable
			/>
			<div style="margin-top: 1rem;"></div>
			<SmartSelect
				options={users}
				placeholder="Select team members..."
				multiple
				searchable
			/>
		</div>
	</section>
</div>

<style>
	.page-container {
		max-width: 900px;
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
		margin-bottom: 0.5rem;
		color: #333;
	}

	.demo-section {
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e0e0e0;
	}

	.demo-section:last-child {
		border-bottom: none;
	}

	.demo-section > p {
		color: #666;
		margin-bottom: 1rem;
	}

	.demo-box {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
	}

	.output {
		margin-top: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 4px;
		border: 1px solid #d0d0d0;
		font-size: 0.9rem;
	}

	.output code {
		background: #f0f0f0;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 0.85rem;
		color: #d63384;
	}
</style>
