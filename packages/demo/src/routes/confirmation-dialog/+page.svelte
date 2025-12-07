<script lang="ts">
	import { confirmationDialogAdd } from '@liwe3/webcomponents-svelte';

	// Basic dialog
	const showBasicDialog = () => {
		confirmationDialogAdd({
			title: 'Confirmation Dialog',
			body: '<p>This is a basic confirmation dialog with default settings.</p>',
		});
	};

	// Delete file dialog
	const showDeleteDialog = () => {
		const dialog = confirmationDialogAdd({
			title: 'Delete File',
			body: '<p>Are you sure you want to delete <strong>document.pdf</strong>?</p><p>This action cannot be undone.</p>',
			buttons: [
				{
					label: 'Delete',
					backgroundColor: '#dc3545',
					onClick: () => {
						alert('File deleted!');
						dialog?.close();
					},
				},
				{
					label: 'Cancel',
					onClick: () => {
						console.log('Cancelled');
						dialog?.close();
					},
				},
			],
		});
	};

	// Save changes dialog
	const showSaveChangesDialog = () => {
		const dialog = confirmationDialogAdd({
			title: 'Unsaved Changes',
			body: '<p>You have unsaved changes. Do you want to save them before leaving?</p>',
			buttons: [
				{
					label: "Don't Save",
					onClick: () => {
						alert('Changes discarded');
						dialog?.close();
					},
				},
				{
					label: 'Cancel',
					onClick: () => {
						console.log('Cancelled');
						dialog?.close();
					},
				},
				{
					label: 'Save',
					backgroundColor: '#28a745',
					onClick: () => {
						alert('Changes saved!');
						dialog?.close();
					},
				},
			],
		});
	};

	// HTML content dialog
	const showHtmlContentDialog = () => {
		confirmationDialogAdd({
			title: 'Rich HTML Content',
			body: `
				<h3 style="margin-top: 0;">Features</h3>
				<ul style="margin: 10px 0; padding-left: 20px;">
					<li><strong>Bold text</strong> and <em>italic text</em></li>
					<li>Lists and formatting</li>
					<li>Any HTML content supported</li>
				</ul>
				<p style="color: #666; font-style: italic;">You can use any HTML content in the dialog body!</p>
			`,
		});
	};

	// Long scrollable content
	const showLongContentDialog = () => {
		const longContent = `
			<h3 style="margin-top: 0;">Privacy Policy</h3>
			<p>This is a very long content to demonstrate scrolling behavior. The buttons will remain sticky at the bottom.</p>
			${Array(20)
				.fill(0)
				.map(
					(_, i) => `
				<h4>Section ${i + 1}</h4>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
			`,
				)
				.join('')}
			<p><strong>End of document</strong></p>
		`;

		const dialog = confirmationDialogAdd({
			title: 'Scrollable Content',
			body: longContent,
			buttons: [
				{
					label: 'I have read this',
					backgroundColor: '#28a745',
					onClick: () => {
						alert('Thank you for reading!');
						dialog?.close();
					},
				},
			],
		});
	};

	// Modal vs non-modal
	const showNonModalDialog = () => {
		confirmationDialogAdd({
			title: 'Non-Modal Dialog',
			body: '<p>This is a non-modal dialog. The background is not dimmed.</p>',
			modal: false,
		});
	};

	// Stacked dialogs
	const showStackedDialogs = () => {
		confirmationDialogAdd({
			title: 'First Dialog',
			body: '<p>This is the first dialog. Click the button below to open a second dialog on top.</p>',
			buttons: [
				{
					label: 'Open Second Dialog',
					backgroundColor: '#667eea',
					onClick: () => {
						confirmationDialogAdd({
							title: 'Second Dialog',
							body: '<p>This is the second dialog stacked on top of the first one.</p>',
						});
					},
				},
			],
		});
	};

	// Form dialog
	const showFormDialog = () => {
		const dialog = confirmationDialogAdd({
			title: 'Contact Form',
			body: `
				<form id="contactForm" style="margin-top: 10px;">
					<div style="margin-bottom: 15px;">
						<label style="display: block; margin-bottom: 5px; font-weight: 500;">Name:</label>
						<input type="text" id="name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Enter your name">
					</div>
					<div style="margin-bottom: 15px;">
						<label style="display: block; margin-bottom: 5px; font-weight: 500;">Email:</label>
						<input type="email" id="email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Enter your email">
					</div>
					<div style="margin-bottom: 15px;">
						<label style="display: block; margin-bottom: 5px; font-weight: 500;">Message:</label>
						<textarea id="message" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;" placeholder="Enter your message"></textarea>
					</div>
				</form>
			`,
			buttons: [
				{
					label: 'Submit',
					backgroundColor: '#28a745',
					onClick: () => {
						// Access form elements from shadow DOM
						const name = (dialog?.shadowRoot.getElementById('name') as HTMLInputElement)?.value;
						const email = (dialog?.shadowRoot.getElementById('email') as HTMLInputElement)?.value;
						const message = (dialog?.shadowRoot.getElementById('message') as HTMLTextAreaElement)
							?.value;

						if (name && email && message) {
							alert(`Form submitted!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
							dialog?.close();
						} else {
							alert('Please fill in all fields');
						}
					},
				},
			],
		});
	};
</script>

<div class="demo-container">
	<header class="demo-header">
		<h1>Confirmation Dialog Component</h1>
		<p class="subtitle">
			A customizable confirmation dialog with HTML body, modal backdrop, and custom buttons
		</p>
	</header>

	<section class="demo-section">
		<h2>Overview</h2>
		<p>
			The ConfirmationDialog component provides a powerful way to show modal dialogs to users.
			It supports HTML content, custom buttons, modal backdrop with blur effect, keyboard
			controls, and smooth animations.
		</p>
	</section>

	<section class="demo-section">
		<h2>Basic Dialogs</h2>
		<p>Click the buttons below to see different dialog configurations:</p>
		<div class="button-grid">
			<button class="btn btn-primary" onclick={showBasicDialog}>Basic Dialog</button>
			<button class="btn btn-danger" onclick={showDeleteDialog}>Delete Confirmation</button>
			<button class="btn btn-warning" onclick={showSaveChangesDialog}>Unsaved Changes</button>
		</div>
	</section>

	<section class="demo-section">
		<h2>HTML Content</h2>
		<p>Dialogs support rich HTML content including lists, formatting, and more:</p>
		<div class="button-grid">
			<button class="btn btn-info" onclick={showHtmlContentDialog}>HTML Content</button>
			<button class="btn btn-info" onclick={showLongContentDialog}>Scrollable Content</button>
		</div>
	</section>

	<section class="demo-section">
		<h2>Advanced Features</h2>
		<p>Additional dialog capabilities:</p>
		<div class="button-grid">
			<button class="btn btn-custom" onclick={showNonModalDialog}>Non-Modal Dialog</button>
			<button class="btn btn-primary" onclick={showStackedDialogs}>Stacked Dialogs</button>
			<button class="btn btn-success" onclick={showFormDialog}>Form Dialog</button>
		</div>
	</section>

	<section class="demo-section">
		<h2>Usage Example</h2>
		<p>
			First, add the <code>&lt;ConfirmationDialogs /&gt;</code> component to your layout to initialize
			the dialog system:
		</p>
		<div class="code-block">
			<pre><code
					>&lt;!-- +layout.svelte --&gt;
&lt;script&gt;
  import &#123; ConfirmationDialogs &#125; from '@liwe3/webcomponents-svelte';
&lt;/script&gt;

&lt;ConfirmationDialogs /&gt;

&lt;slot /&gt;</code
				></pre>
		</div>

		<p style="margin-top: 1.5rem;">
			Then use <code>confirmationDialogAdd()</code> anywhere in your app:
		</p>
		<div class="code-block">
			<pre><code
					>&lt;script&gt;
  import &#123; confirmationDialogAdd &#125; from '@liwe3/webcomponents-svelte';

  const handleDelete = () => &#123;
    const dialog = confirmationDialogAdd(&#123;
      title: 'Delete File',
      body: '&lt;p&gt;Are you sure?&lt;/p&gt;',
      buttons: [
        &#123;
          label: 'Delete',
          backgroundColor: '#dc3545',
          onClick: () => &#123;
            console.log('Deleted');
            dialog?.close();
          &#125;
        &#125;,
        &#123;
          label: 'Cancel',
          onClick: () => dialog?.close()
        &#125;
      ],
      modal: true,
      escToClose: true,
      clickToClose: true
    &#125;);
  &#125;;
&lt;/script&gt;

&lt;button onclick=&#123;handleDelete&#125;&gt;Delete&lt;/button&gt;</code
				></pre>
		</div>
	</section>

	<section class="demo-section">
		<h2>Props</h2>
		<table class="props-table">
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
					<td><code>title</code></td>
					<td><code>string</code></td>
					<td><code>"Confirmation Dialog"</code></td>
					<td>The dialog title</td>
				</tr>
				<tr>
					<td><code>body</code></td>
					<td><code>string</code></td>
					<td><code>""</code></td>
					<td>The dialog body (supports HTML)</td>
				</tr>
				<tr>
					<td><code>buttons</code></td>
					<td><code>ConfirmationDialogButton[]</code></td>
					<td><code>[]</code></td>
					<td>Array of custom buttons</td>
				</tr>
				<tr>
					<td><code>modal</code></td>
					<td><code>boolean</code></td>
					<td><code>true</code></td>
					<td>Dim background and prevent interaction outside</td>
				</tr>
				<tr>
					<td><code>escToClose</code></td>
					<td><code>boolean</code></td>
					<td><code>true</code></td>
					<td>Allow Esc key to close the dialog</td>
				</tr>
				<tr>
					<td><code>clickToClose</code></td>
					<td><code>boolean</code></td>
					<td><code>true</code></td>
					<td>Allow clicking outside to close</td>
				</tr>
				<tr>
					<td><code>onClose</code></td>
					<td><code>() => void</code></td>
					<td><code>undefined</code></td>
					<td>Callback when dialog is closed</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section class="demo-section">
		<h2>Button Configuration</h2>
		<table class="props-table">
			<thead>
				<tr>
					<th>Property</th>
					<th>Type</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>label</code></td>
					<td><code>string</code></td>
					<td>Button text</td>
				</tr>
				<tr>
					<td><code>backgroundColor</code></td>
					<td><code>string</code></td>
					<td>Optional background color (e.g., '#dc3545')</td>
				</tr>
				<tr>
					<td><code>onClick</code></td>
					<td><code>() => void</code></td>
					<td>Callback when button is clicked</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section class="demo-section">
		<h2>Methods</h2>
		<table class="props-table">
			<thead>
				<tr>
					<th>Method</th>
					<th>Parameters</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>show(config)</code></td>
					<td><code>ConfirmationDialogConfig</code></td>
					<td>Shows the dialog with the given configuration</td>
				</tr>
				<tr>
					<td><code>close()</code></td>
					<td>-</td>
					<td>Closes the dialog with animation</td>
				</tr>
			</tbody>
		</table>
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
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.demo-section h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #1a1a1a;
	}

	.demo-section p {
		color: #666;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.button-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.btn {
		padding: 12px 24px;
		font-size: 15px;
		font-weight: 500;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.btn:active {
		transform: translateY(0);
	}

	.btn-primary {
		background: #667eea;
		color: white;
	}

	.btn-danger {
		background: #dc3545;
		color: white;
	}

	.btn-warning {
		background: #ffc107;
		color: #333;
	}

	.btn-success {
		background: #28a745;
		color: white;
	}

	.btn-info {
		background: #17a2b8;
		color: white;
	}

	.btn-custom {
		background: #6c757d;
		color: white;
	}

	.code-block {
		background: #1e1e1e;
		padding: 1.5rem;
		border-radius: 8px;
		overflow-x: auto;
	}

	.code-block pre {
		margin: 0;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
	}

	.code-block code {
		color: #d4d4d4;
		line-height: 1.5;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1rem;
	}

	.props-table th,
	.props-table td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid #e0e0e0;
	}

	.props-table th {
		background: #f8f9fa;
		font-weight: 600;
		color: #333;
	}

	.props-table code {
		background: #f8f9fa;
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 0.9em;
		font-family: 'Monaco', 'Menlo', monospace;
		color: #e83e8c;
	}

	@media (max-width: 768px) {
		.demo-container {
			padding: 1rem;
		}

		.demo-header h1 {
			font-size: 2rem;
		}

		.button-grid {
			grid-template-columns: 1fr;
		}

		.props-table {
			font-size: 0.85rem;
		}

		.props-table th,
		.props-table td {
			padding: 0.5rem;
		}
	}
</style>
