<script lang="ts">
  import { toastAdd } from "@liwe3/webcomponents-svelte";

  // Example toast configurations
  const showInfoToast = () => {
    toastAdd({
      title: "Information",
      text: "This is an informational message to keep you updated about system changes.",
      type: "info",
      closable: true,
    });
  };

  const showSuccessToast = () => {
    toastAdd({
      title: "Success!",
      text: "Your operation completed successfully and all changes have been saved.",
      type: "success",
      closable: true,
    });
  };

  const showWarningToast = () => {
    toastAdd({
      title: "Warning",
      text: "Please review your changes carefully before continuing with this action.",
      type: "warning",
      closable: true,
    });
  };

  const showErrorToast = () => {
    toastAdd({
      title: "Error",
      text: "Something went wrong while processing your request. Please try again.",
      type: "error",
      closable: true,
    });
  };

  const showAutoDismissToast = (duration: number) => {
    toastAdd({
      title: "Auto-Dismiss",
      text: `This toast will automatically close in ${duration / 1000} seconds.`,
      type: "info",
      duration: duration,
      closable: true,
    });
  };

  const showCustomIconToast = () => {
    toastAdd({
      title: "Custom Icon",
      text: "This toast has a custom star icon image.",
      type: "info",
      icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/%3E%3C/svg%3E',
      closable: true,
    });
  };

  const showToastWithButtons = () => {
    toastAdd({
      title: "New Message",
      text: "You have received a new message from Sarah. Would you like to view it now?",
      type: "info",
      closable: true,
      buttons: [
        {
          label: "Dismiss",
          onClick: () => console.log("Dismissed"),
        },
        {
          label: "View",
          onClick: () => {
            console.log("View clicked");
            alert("Opening message...");
          },
        },
      ],
    });
  };

  const showConfirmationToast = () => {
    toastAdd({
      title: "Confirm Action",
      text: "Are you sure you want to delete this item? This action cannot be undone.",
      type: "warning",
      closable: true,
      buttons: [
        {
          label: "Cancel",
          onClick: () => console.log("Cancelled"),
        },
        {
          label: "Delete",
          onClick: () => {
            console.log("Deleted");
            toastAdd({
              title: "Deleted",
              text: "The item has been successfully deleted.",
              type: "success",
              duration: 3000,
            });
          },
        },
      ],
    });
  };

  const showNonClosableToast = () => {
    toastAdd({
      title: "Processing",
      text: "Please wait while we process your request. This may take a few moments...",
      type: "info",
      closable: false,
      duration: 5000,
    });
  };

  const showMultipleToasts = () => {
    toastAdd({
      title: "First Toast",
      text: "This is the first toast in a series.",
      type: "info",
      duration: 3000,
    });

    setTimeout(() => {
      toastAdd({
        title: "Second Toast",
        text: "This is the second toast.",
        type: "success",
        duration: 3000,
      });
    }, 500);

    setTimeout(() => {
      toastAdd({
        title: "Third Toast",
        text: "This is the third and final toast.",
        type: "warning",
        duration: 3000,
      });
    }, 1000);
  };
</script>

<div class="demo-container">
  <header class="demo-header">
    <h1>Toast Component</h1>
    <p class="subtitle">
      A flexible and customizable toast notification system
    </p>
  </header>

  <section class="demo-section">
    <h2>Overview</h2>
    <p>
      The Toast component provides a beautiful way to show notifications to
      users. It supports multiple types, custom icons, action buttons,
      auto-dismiss functionality, and smooth animations.
    </p>
  </section>

  <section class="demo-section">
    <h2>Basic Toast Types</h2>
    <p>Click the buttons below to see different toast notification types:</p>
    <div class="button-grid">
      <button class="btn btn-info" onclick={showInfoToast}>Info Toast</button>
      <button class="btn btn-success" onclick={showSuccessToast}
        >Success Toast</button
      >
      <button class="btn btn-warning" onclick={showWarningToast}
        >Warning Toast</button
      >
      <button class="btn btn-error" onclick={showErrorToast}>Error Toast</button
      >
    </div>
  </section>

  <section class="demo-section">
    <h2>Auto-Dismiss Toasts</h2>
    <p>These toasts will automatically disappear after a specified duration:</p>
    <div class="button-grid">
      <button class="btn btn-info" onclick={() => showAutoDismissToast(3000)}
        >3 Second Toast</button
      >
      <button class="btn btn-success" onclick={() => showAutoDismissToast(5000)}
        >5 Second Toast</button
      >
      <button class="btn btn-warning" onclick={() => showAutoDismissToast(7000)}
        >7 Second Toast</button
      >
    </div>
  </section>

  <section class="demo-section">
    <h2>Custom Icons</h2>
    <p>Add custom images or icons to your toast notifications:</p>
    <div class="button-grid">
      <button class="btn btn-custom" onclick={showCustomIconToast}
        >Custom Icon Toast</button
      >
    </div>
  </section>

  <section class="demo-section">
    <h2>Action Buttons</h2>
    <p>Add interactive buttons to your toasts:</p>
    <div class="button-grid">
      <button class="btn btn-info" onclick={showToastWithButtons}
        >Toast with Buttons</button
      >
      <button class="btn btn-success" onclick={showConfirmationToast}
        >Confirmation Toast</button
      >
    </div>
  </section>

  <section class="demo-section">
    <h2>Advanced Features</h2>
    <p>Additional toast capabilities:</p>
    <div class="button-grid">
      <button class="btn btn-warning" onclick={showNonClosableToast}
        >Non-Closable Toast (5s)</button
      >
      <button class="btn btn-custom" onclick={showMultipleToasts}
        >Show Multiple Toasts</button
      >
    </div>
  </section>

  <section class="demo-section">
    <h2>Usage Example</h2>
    <p>
      First, add the <code>&lt;Toasts /&gt;</code> component to your layout to initialize
      the toast system:
    </p>
    <div class="code-block">
      <pre><code
          >&lt;!-- +layout.svelte --&gt;
&lt;script&gt;
  import &#123; Toasts &#125; from '@liwe3/webcomponents-svelte';
&lt;/script&gt;

&lt;Toasts /&gt;

&lt;slot /&gt;</code
        ></pre>
    </div>

    <p style="margin-top: 1.5rem;">
      Then use <code>toastAdd()</code> anywhere in your app:
    </p>
    <div class="code-block">
      <pre><code
          >&lt;script&gt;
  import &#123; toastAdd &#125; from '@liwe3/webcomponents-svelte';

  const handleClick = () => &#123;
    toastAdd(&#123;
      title: 'Success!',
      text: 'Your changes have been saved.',
      type: 'success',
      duration: 5000,
      closable: true,
      buttons: [
        &#123;
          label: 'Undo',
          onClick: () => console.log('Undo clicked')
        &#125;,
        &#123;
          label: 'View',
          onClick: () => console.log('View clicked')
        &#125;
      ]
    &#125;);
  &#125;;
&lt;/script&gt;

&lt;button onclick=&#123;handleClick&#125;&gt;Show Toast&lt;/button&gt;</code
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
          <td><code>""</code></td>
          <td>The toast title</td>
        </tr>
        <tr>
          <td><code>text</code></td>
          <td><code>string</code></td>
          <td><code>""</code></td>
          <td>The toast message text</td>
        </tr>
        <tr>
          <td><code>type</code></td>
          <td><code>'info' | 'success' | 'warning' | 'error'</code></td>
          <td><code>'info'</code></td>
          <td>The toast type/severity</td>
        </tr>
        <tr>
          <td><code>icon</code></td>
          <td><code>string</code></td>
          <td><code>undefined</code></td>
          <td>URL to custom icon/image</td>
        </tr>
        <tr>
          <td><code>closable</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Show close X button</td>
        </tr>
        <tr>
          <td><code>duration</code></td>
          <td><code>number</code></td>
          <td><code>0</code></td>
          <td>Auto-dismiss after milliseconds (0 = no auto-dismiss)</td>
        </tr>
        <tr>
          <td><code>buttons</code></td>
          <td><code>ToastButton[]</code></td>
          <td><code>[]</code></td>
          <td>Array of action buttons</td>
        </tr>
        <tr>
          <td><code>onclose</code></td>
          <td><code>() => void</code></td>
          <td><code>undefined</code></td>
          <td>Callback when toast is closed</td>
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
          <td><code>ToastConfig</code></td>
          <td>Shows the toast with the given configuration</td>
        </tr>
        <tr>
          <td><code>close()</code></td>
          <td>-</td>
          <td>Closes the toast with animation</td>
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

  .btn-info {
    background: #17a2b8;
    color: white;
  }

  .btn-success {
    background: #28a745;
    color: white;
  }

  .btn-warning {
    background: #ffc107;
    color: #333;
  }

  .btn-error {
    background: #dc3545;
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
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
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
    font-family: "Monaco", "Menlo", monospace;
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
