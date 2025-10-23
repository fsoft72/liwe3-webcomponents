<script lang="ts">
	import { DateSelector } from '@liwe3/webcomponents-svelte';
	import type { DateRange } from '@liwe3/webcomponents';

	// Single date mode state
	let singleDate = $state<string | null>(null);

	// Range mode state
	let dateRange = $state<DateRange>({ start: null, end: null });

	// Format date for display
	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return 'None';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Format date range for display
	const formatDateRange = (range: DateRange) => {
		if (!range.start || !range.end) return 'None';
		return `${formatDate(range.start)} - ${formatDate(range.end)}`;
	};

	// Handlers for single date selection
	const handleDateSelected = (date: string) => {
		console.log('Date selected:', date);
	};

	// Handlers for range selection
	const handleRangeSelected = (range: DateRange) => {
		console.log('Range selected:', range);
	};
</script>

<div class="page-container">
	<h1>DateSelector Component Demo</h1>
	<p class="subtitle">Interactive date picker with single date and range selection modes</p>

	<!-- Basic Single Date Selection -->
	<section class="demo-section">
		<h2>Single Date Selection</h2>
		<p>Select a single date from the calendar. The selected date is highlighted in blue.</p>

		<div class="demo-box">
			<DateSelector
				bind:selectedDate={singleDate}
				ondateselected={handleDateSelected}
			/>

			<div class="output">
				<strong>Selected Date:</strong> {formatDate(singleDate)}
				<br>
				<strong>ISO Format:</strong> <code>{singleDate || 'null'}</code>
			</div>
		</div>
	</section>

	<!-- Range Selection -->
	<section class="demo-section">
		<h2>Date Range Selection</h2>
		<p>Select a date range by clicking the start date, then clicking the end date. Dates in between are highlighted.</p>

		<div class="demo-box">
			<DateSelector
				rangeMode
				bind:selectedRange={dateRange}
				onrangeselected={handleRangeSelected}
			/>

			<div class="output">
				<strong>Selected Range:</strong> {formatDateRange(dateRange)}
				<br>
				<strong>Start Date:</strong> <code>{dateRange.start || 'null'}</code>
				<br>
				<strong>End Date:</strong> <code>{dateRange.end || 'null'}</code>
			</div>
		</div>
	</section>

	<!-- Pre-selected Date -->
	<section class="demo-section">
		<h2>Pre-selected Date</h2>
		<p>A date selector with a date already selected (today's date).</p>

		<div class="demo-box">
			<DateSelector
				selectedDate={new Date().toISOString().split('T')[0]}
			/>
		</div>
	</section>

	<!-- Features -->
	<section class="demo-section">
		<h2>Features</h2>
		<ul class="feature-list">
			<li><strong>Single Date Mode:</strong> Select one date at a time</li>
			<li><strong>Range Mode:</strong> Select a start and end date</li>
			<li><strong>Month Navigation:</strong> Use arrow buttons to navigate between months</li>
			<li><strong>Year Selection:</strong> Click the year to select from a dropdown (±10 years)</li>
			<li><strong>Today Indicator:</strong> Today's date is highlighted with a light blue background</li>
			<li><strong>Hover Effects:</strong> In range mode, hovering shows preview of the range</li>
			<li><strong>Keyboard Accessible:</strong> Full keyboard navigation support</li>
			<li><strong>Auto Swap:</strong> If end date is before start date, they automatically swap</li>
		</ul>
	</section>

	<!-- Usage Example -->
	<section class="demo-section">
		<h2>Usage Example</h2>
		<p>Here's how to use the DateSelector component in your Svelte application:</p>

		<div class="code-block">
			<pre><code>{`<script lang="ts">
  import { DateSelector } from '@liwe3/webcomponents-svelte';
  import type { DateRange } from '@liwe3/webcomponents';

  let selectedDate = $state<string | null>(null);
  let dateRange = $state<DateRange>({ start: null, end: null });
</script>

<!-- Single date mode -->
<DateSelector bind:selectedDate={selectedDate} />

<!-- Range mode -->
<DateSelector
  rangeMode
  bind:selectedRange={dateRange}
  onrangeselected={(range) => console.log(range)}
/>`}</code></pre>
		</div>
	</section>

	<!-- API Reference -->
	<section class="demo-section">
		<h2>API Reference</h2>

		<h3>Props</h3>
		<table class="api-table">
			<thead>
				<tr>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>rangeMode</code></td>
					<td>boolean</td>
					<td>false</td>
					<td>Enable date range selection mode</td>
				</tr>
				<tr>
					<td><code>selectedDate</code></td>
					<td>string | null</td>
					<td>null</td>
					<td>Currently selected date (ISO format: YYYY-MM-DD)</td>
				</tr>
				<tr>
					<td><code>selectedRange</code></td>
					<td>DateRange</td>
					<td>{'{ start: null, end: null }'}</td>
					<td>Currently selected date range</td>
				</tr>
			</tbody>
		</table>

		<h3>Events</h3>
		<table class="api-table">
			<thead>
				<tr>
					<th>Event</th>
					<th>Payload</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>ondateselected</code></td>
					<td>string</td>
					<td>Fired when a date is selected in single mode</td>
				</tr>
				<tr>
					<td><code>onrangeselected</code></td>
					<td>DateRange</td>
					<td>Fired when a date range is selected in range mode</td>
				</tr>
			</tbody>
		</table>

		<h3>Methods</h3>
		<table class="api-table">
			<thead>
				<tr>
					<th>Method</th>
					<th>Parameters</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>setDate(dateStr)</code></td>
					<td>string</td>
					<td>Programmatically set the selected date</td>
				</tr>
				<tr>
					<td><code>setRange(start, end)</code></td>
					<td>string, string</td>
					<td>Programmatically set the date range</td>
				</tr>
				<tr>
					<td><code>getSelectedDate()</code></td>
					<td>-</td>
					<td>Returns the currently selected date</td>
				</tr>
				<tr>
					<td><code>getSelectedRange()</code></td>
					<td>-</td>
					<td>Returns the currently selected range</td>
				</tr>
				<tr>
					<td><code>clear()</code></td>
					<td>-</td>
					<td>Clears the current selection</td>
				</tr>
			</tbody>
		</table>
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

	h3 {
		font-size: 1.2rem;
		margin-top: 1.5rem;
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

	.demo-section > p {
		color: #666;
		margin-bottom: 1rem;
	}

	.demo-box {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.output {
		margin-top: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 4px;
		border: 1px solid #d0d0d0;
		font-size: 0.9rem;
		width: 100%;
	}

	.output code {
		background: #f0f0f0;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 0.85rem;
		color: #d63384;
	}

	.feature-list {
		background: #f8f9fa;
		padding: 1.5rem 1.5rem 1.5rem 2.5rem;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
		margin: 1rem 0;
	}

	.feature-list li {
		margin-bottom: 0.75rem;
		color: #444;
		line-height: 1.6;
	}

	.feature-list li:last-child {
		margin-bottom: 0;
	}

	.code-block {
		background: #1e1e1e;
		border-radius: 8px;
		padding: 1.5rem;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.code-block pre {
		margin: 0;
		color: #d4d4d4;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.code-block code {
		color: #d4d4d4;
	}

	.api-table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
	}

	.api-table thead {
		background: #f8f9fa;
	}

	.api-table th {
		text-align: left;
		padding: 0.75rem 1rem;
		font-weight: 600;
		color: #333;
		border-bottom: 2px solid #e0e0e0;
	}

	.api-table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #f0f0f0;
		color: #444;
	}

	.api-table tbody tr:last-child td {
		border-bottom: none;
	}

	.api-table code {
		background: #f0f0f0;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 0.85rem;
		color: #d63384;
	}

	.api-table tbody tr:hover {
		background: #f8f9fa;
	}
</style>
