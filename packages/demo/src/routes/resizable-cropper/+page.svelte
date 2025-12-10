<script lang="ts">
import { ResizableCropper, type ResizableCropperValues } from '@liwe3/webcomponents-svelte';

let width = $state<number>( 300 );
let height = $state<number>( 200 );
let minWidth = $state<number>( 50 );
let minHeight = $state<number>( 50 );
let aspectRatio = $state<string | undefined>( undefined );
let allowResize = $state<boolean>( true );
let allowCrop = $state<boolean>( true );
let disabled = $state<boolean>( false );

let currentValues = $state<ResizableCropperValues | null>( null );
let savedValues = $state<ResizableCropperValues | null>( null );
let lastAction = $state<string>( '-' );

let cropperRef : any;

const handleChange = ( values : ResizableCropperValues ) => {
	currentValues = values;
};

const handleRcwChange = ( detail : any ) => {
	lastAction = detail.action;
	console.log( 'rcw:change', detail );
};

const handleGetValues = () => {
	if ( cropperRef?.getValues ) {
		savedValues = cropperRef.getValues();
		console.log( 'Saved values:', savedValues );
	}
};

const handleSetExampleValues = () => {
	if ( cropperRef?.setValues ) {
		cropperRef.setValues( {
			wrapperWidth: 250,
			wrapperHeight: 180,
			zoom: 1.5,
			contentLeft: -50,
			contentTop: -30,
		} );
		console.log( 'Set example values' );
	}
};

const handleRestoreValues = () => {
	if ( cropperRef?.setValues && savedValues ) {
		cropperRef.setValues( savedValues );
		console.log( 'Restored values:', savedValues );
	}
};

const handleReset = () => {
	width = 300;
	height = 200;
	minWidth = 50;
	minHeight = 50;
	aspectRatio = undefined;
	allowResize = true;
	allowCrop = true;
	disabled = false;
	savedValues = null;
	lastAction = '-';
};
</script>

<div class="page-container">
	<header class="page-header">
		<div>
			<h1>ResizableCropper Demo</h1>
			<p class="subtitle">
				A simplified container for resizing and cropping images with zoom and pan support.
			</p>
		</div>
	</header>

	<main class="page-content">
		<section class="demo-section">
			<h2>Interactive Demo</h2>
			
			<div class="controls-panel">
				<div class="control-group">
					<label>
						Width:
						<input type="number" bind:value={width} min="50" max="800" />
					</label>
					<label>
						Height:
						<input type="number" bind:value={height} min="50" max="600" />
					</label>
					<label>
						Min Width:
						<input type="number" bind:value={minWidth} min="10" max="500" />
					</label>
					<label>
						Min Height:
						<input type="number" bind:value={minHeight} min="10" max="500" />
					</label>
				</div>

				<div class="control-group">
					<label>
						Aspect Ratio:
						<select bind:value={aspectRatio}>
							<option value={undefined}>None</option>
							<option value="16/9">16:9</option>
							<option value="4/3">4:3</option>
							<option value="1/1">1:1 (Square)</option>
							<option value="3/2">3:2</option>
						</select>
					</label>
					<label>
						<input type="checkbox" bind:checked={allowResize} />
						Allow Resize
					</label>
					<label>
						<input type="checkbox" bind:checked={allowCrop} />
						Allow Crop
					</label>
					<label>
						<input type="checkbox" bind:checked={disabled} />
						Disabled
					</label>
				</div>

				<div class="control-group">
					<button onclick={handleReset}>Reset</button>
				</div>
			</div>

			<div class="demo-container">
				<ResizableCropper
					bind:this={cropperRef}
					{width}
					{height}
					minWidth={minWidth}
					minHeight={minHeight}
					aspectRatio={aspectRatio}
					{allowResize}
					{allowCrop}
					{disabled}
					onchange={handleChange}
					onrcw:change={handleRcwChange}
				>
					<img src="https://picsum.photos/800/600?random=1" alt="Demo" />
				</ResizableCropper>
			</div>

			{#if currentValues}
				<div class="info-panel">
					<div><strong>Component State:</strong></div>
					<div>Wrapper Width: <span>{Math.round( currentValues.wrapperWidth )}</span>px</div>
					<div>Wrapper Height: <span>{Math.round( currentValues.wrapperHeight )}</span>px</div>
					<div>Content Width: <span>{Math.round( currentValues.contentWidth )}</span>px</div>
					<div>Content Height: <span>{Math.round( currentValues.contentHeight )}</span>px</div>
					<div>Content Left: <span>{Math.round( currentValues.contentLeft )}</span>px</div>
					<div>Content Top: <span>{Math.round( currentValues.contentTop )}</span>px</div>
					<div>Zoom: <span>{currentValues.zoom.toFixed( 2 )}</span>x</div>
					<div>Last Action: <span>{lastAction}</span></div>
				</div>
			{/if}

			<div class="button-group">
				<button onclick={handleGetValues}>Get Values</button>
				<button onclick={handleSetExampleValues}>Set Example Values</button>
				<button onclick={handleRestoreValues} disabled={!savedValues}>
					Restore Saved Values
				</button>
			</div>

			{#if savedValues}
				<pre class="values-output">{JSON.stringify( savedValues, null, 2 )}</pre>
			{/if}
		</section>

		<section class="demo-section">
			<h2>Different Configurations</h2>
			<div class="grid">
				<div class="card">
					<div class="card-header">Free Resize</div>
					<div class="card-body">
						<ResizableCropper width={200} height={150}>
							<img src="https://picsum.photos/600/400?random=2" alt="Demo" />
						</ResizableCropper>
					</div>
				</div>

				<div class="card">
					<div class="card-header">16:9 Aspect Ratio</div>
					<div class="card-body">
						<ResizableCropper width={240} height={135} aspectRatio="16/9">
							<img src="https://picsum.photos/600/400?random=3" alt="Demo" />
						</ResizableCropper>
					</div>
				</div>

				<div class="card">
					<div class="card-header">Resize Only</div>
					<div class="card-body">
						<ResizableCropper width={200} height={150} allowCrop={false}>
							<img src="https://picsum.photos/600/400?random=4" alt="Demo" />
						</ResizableCropper>
					</div>
				</div>

				<div class="card">
					<div class="card-header">Crop Only</div>
					<div class="card-body">
						<ResizableCropper width={200} height={150} allowResize={false}>
							<img src="https://picsum.photos/600/400?random=5" alt="Demo" />
						</ResizableCropper>
					</div>
				</div>
			</div>
		</section>

		<section class="demo-section">
			<h2>Usage Instructions</h2>
			<ul>
				<li><strong>Scale:</strong> Drag the round corner handle (bottom-right) to resize both wrapper and image together.</li>
				<li><strong>Crop:</strong> Drag the bottom or right bar handles to resize only the wrapper.</li>
				<li><strong>Pan:</strong> Click and drag directly on the image to reposition it.</li>
			</ul>
		</section>
	</main>
</div>

<style>
.page-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
}

.page-header {
	margin-bottom: 3rem;
}

.page-header h1 {
	font-size: 2.5rem;
	margin-bottom: 0.5rem;
	color: #1a202c;
}

.subtitle {
	color: #718096;
	font-size: 1.1rem;
}

.page-content {
	display: flex;
	flex-direction: column;
	gap: 3rem;
}

.demo-section {
	background: white;
	border-radius: 8px;
	padding: 2rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
	font-size: 1.8rem;
	margin-bottom: 1.5rem;
	color: #2d3748;
}

.controls-panel {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 2rem;
	padding: 1rem;
	background: #f7fafc;
	border-radius: 6px;
}

.control-group {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	align-items: center;
}

.control-group label {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	font-size: 0.95rem;
}

.control-group input[type="number"] {
	width: 80px;
	padding: 0.4rem;
	border: 1px solid #cbd5e0;
	border-radius: 4px;
}

.control-group select {
	padding: 0.4rem;
	border: 1px solid #cbd5e0;
	border-radius: 4px;
}

button {
	padding: 0.6rem 1.2rem;
	background: #4299e1;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 0.95rem;
	transition: background 0.2s;
}

button:hover {
	background: #3182ce;
}

button:disabled {
	background: #cbd5e0;
	cursor: not-allowed;
}

.demo-container {
	padding: 3rem;
	background: #f7fafc;
	border: 1px dashed #cbd5e0;
	border-radius: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 400px;
}

.info-panel {
	margin-top: 1.5rem;
	padding: 1rem;
	background: #e6fffa;
	border-left: 4px solid #38b2ac;
	border-radius: 4px;
	font-family: monospace;
	font-size: 0.9rem;
}

.info-panel div {
	margin: 0.3rem 0;
}

.info-panel span {
	font-weight: bold;
	color: #2c7a7b;
}

.button-group {
	margin-top: 1rem;
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
}

.values-output {
	margin-top: 1rem;
	background: #2d3748;
	color: #e2e8f0;
	padding: 1rem;
	border-radius: 6px;
	font-size: 0.85rem;
	overflow-x: auto;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1.5rem;
	margin-top: 1.5rem;
}

.card {
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	overflow: hidden;
}

.card-header {
	padding: 0.75rem 1rem;
	background: #f7fafc;
	border-bottom: 1px solid #e2e8f0;
	font-weight: 600;
	font-size: 0.9rem;
}

.card-body {
	padding: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 200px;
	background: #fafafa;
}

ul {
	list-style: disc;
	padding-left: 2rem;
}

ul li {
	margin: 0.5rem 0;
	line-height: 1.6;
}
</style>
