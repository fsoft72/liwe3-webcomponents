<script lang="ts">
  import { PopoverMenu, type PopoverMenuConfig } from "@liwe3/webcomponents-svelte";

  let outputMessage = $state("Click a menu item to see output...");
  let dynamicMenuCounter = $state(1);
  let menu1: any;
  let menu2: any;
  let menu3: any;
  let menu4: any;
  let menu5: any;
  let menu6: any;
  let menu7: any;

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    outputMessage = `[${timestamp}] ${message}`;
  };

  // Example 1: Basic Menu Bar
  const menu1Items: PopoverMenuConfig[] = $state([
    {
      label: 'File',
      items: [
        { label: 'New', onclick: () => log('New file clicked') },
        { label: 'Open', onclick: () => log('Open file clicked') },
        { label: 'Save', onclick: () => log('Save file clicked') },
        { label: 'Close', onclick: () => log('Close file clicked') }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', onclick: () => log('Undo clicked') },
        { label: 'Redo', onclick: () => log('Redo clicked') },
        { label: 'Cut', onclick: () => log('Cut clicked') },
        { label: 'Copy', onclick: () => log('Copy clicked') },
        { label: 'Paste', onclick: () => log('Paste clicked') }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Zoom In', onclick: () => log('Zoom In clicked') },
        { label: 'Zoom Out', onclick: () => log('Zoom Out clicked') },
        { label: 'Reset Zoom', onclick: () => log('Reset Zoom clicked') }
      ]
    }
  ]);

  // Example 2: Nested Submenus
  const menu2Items: PopoverMenuConfig[] = $state([
    {
      label: 'Tools',
      items: [
        { label: 'Settings', onclick: () => log('Settings clicked') },
        {
          label: 'Advanced',
          items: [
            { label: 'Configuration', onclick: () => log('Configuration clicked') },
            {
              label: 'Developer',
              items: [
                { label: 'Console', onclick: () => log('Console clicked') },
                { label: 'Debugger', onclick: () => log('Debugger clicked') },
                {
                  label: 'Network',
                  items: [
                    { label: 'Monitor', onclick: () => log('Monitor clicked') },
                    { label: 'Analytics', onclick: () => log('Analytics clicked') }
                  ]
                }
              ]
            },
            { label: 'System', onclick: () => log('System clicked') }
          ]
        }
      ]
    }
  ]);

  // Example 3: Menu with Separators
  const menu3Items: PopoverMenuConfig[] = $state([
    {
      label: 'File',
      items: [
        { label: 'New Document', onclick: () => log('New Document clicked') },
        { label: 'New Window', onclick: () => log('New Window clicked') },
        { label: '---sep' },
        { label: 'Open', onclick: () => log('Open clicked') },
        { label: 'Open Recent', onclick: () => log('Open Recent clicked') },
        { label: '---sep' },
        { label: 'Save', onclick: () => log('Save clicked') },
        { label: 'Save As', onclick: () => log('Save As clicked') },
        { label: '---sep' },
        { label: 'Exit', onclick: () => log('Exit clicked') }
      ]
    }
  ]);

  // Example 4: Disabled Menu Items
  const menu4Items: PopoverMenuConfig[] = $state([
    {
      label: 'Edit',
      items: [
        { label: 'Cut', onclick: () => log('Cut clicked') },
        { label: 'Copy', onclick: () => log('Copy clicked') },
        { label: 'Paste', onclick: () => log('Paste clicked'), enabled: false },
        { label: '---sep' },
        { label: 'Delete', onclick: () => log('Delete clicked'), enabled: false },
        { label: '---sep' },
        { label: 'Select All', onclick: () => log('Select All clicked') }
      ]
    }
  ]);

  // Example 5: Application Menu
  const menu5Items: PopoverMenuConfig[] = $state([
    {
      label: 'File',
      items: [
        { label: 'New File (Ctrl+N)', onclick: () => log('New File') },
        { label: 'New Window (Ctrl+Shift+N)', onclick: () => log('New Window') },
        { label: '---sep' },
        { label: 'Open File (Ctrl+O)', onclick: () => log('Open File') },
        { label: 'Open Folder (Ctrl+K Ctrl+O)', onclick: () => log('Open Folder') },
        { label: '---sep' },
        { label: 'Save (Ctrl+S)', onclick: () => log('Save') },
        { label: 'Save As (Ctrl+Shift+S)', onclick: () => log('Save As') },
        { label: '---sep' },
        {
          label: 'Preferences',
          items: [
            { label: 'Settings', onclick: () => log('Settings') },
            { label: 'Keyboard Shortcuts', onclick: () => log('Keyboard Shortcuts') },
            { label: 'Color Theme', onclick: () => log('Color Theme') }
          ]
        },
        { label: '---sep' },
        { label: 'Exit', onclick: () => log('Exit') }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo (Ctrl+Z)', onclick: () => log('Undo') },
        { label: 'Redo (Ctrl+Y)', onclick: () => log('Redo') },
        { label: '---sep' },
        { label: 'Cut (Ctrl+X)', onclick: () => log('Cut') },
        { label: 'Copy (Ctrl+C)', onclick: () => log('Copy') },
        { label: 'Paste (Ctrl+V)', onclick: () => log('Paste') },
        { label: '---sep' },
        { label: 'Find (Ctrl+F)', onclick: () => log('Find') },
        { label: 'Replace (Ctrl+H)', onclick: () => log('Replace') }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Command Palette (Ctrl+Shift+P)', onclick: () => log('Command Palette') },
        { label: '---sep' },
        {
          label: 'Appearance',
          items: [
            { label: 'Zoom In (Ctrl++)', onclick: () => log('Zoom In') },
            { label: 'Zoom Out (Ctrl+-)', onclick: () => log('Zoom Out') },
            { label: 'Reset Zoom (Ctrl+0)', onclick: () => log('Reset Zoom') },
            { label: '---sep' },
            { label: 'Full Screen (F11)', onclick: () => log('Full Screen') }
          ]
        },
        { label: '---sep' },
        { label: 'Toggle Sidebar (Ctrl+B)', onclick: () => log('Toggle Sidebar') },
        { label: 'Toggle Terminal (Ctrl+`)', onclick: () => log('Toggle Terminal') }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Documentation', onclick: () => log('Documentation') },
        { label: 'Keyboard Shortcuts', onclick: () => log('Keyboard Shortcuts') },
        { label: '---sep' },
        { label: 'Report Issue', onclick: () => log('Report Issue') },
        { label: 'About', onclick: () => log('About') }
      ]
    }
  ]);

  // Example 6: Dynamic Menu Updates
  let menu6Items: PopoverMenuConfig[] = $state([
    {
      label: 'Static Menu 1',
      items: [
        { label: 'Option 1', onclick: () => log('Static Menu 1 - Option 1') },
        { label: 'Option 2', onclick: () => log('Static Menu 1 - Option 2') }
      ]
    },
    {
      label: 'Static Menu 2',
      items: [
        { label: 'Option A', onclick: () => log('Static Menu 2 - Option A') },
        { label: 'Option B', onclick: () => log('Static Menu 2 - Option B') }
      ]
    }
  ]);

  const addDynamicMenu = () => {
    const newMenu: PopoverMenuConfig = {
      label: `Dynamic ${dynamicMenuCounter}`,
      items: [
        { label: `Item ${dynamicMenuCounter}.1`, onclick: () => log(`Dynamic ${dynamicMenuCounter}.1 clicked`) },
        { label: `Item ${dynamicMenuCounter}.2`, onclick: () => log(`Dynamic ${dynamicMenuCounter}.2 clicked`) }
      ]
    };
    menu6Items = [...menu6Items, newMenu];
    dynamicMenuCounter++;
    log(`Added Dynamic Menu ${dynamicMenuCounter - 1}`);
  };

  const removeDynamicMenu = () => {
    if (menu6Items.length > 2) {
      menu6Items = menu6Items.slice(0, -1);
      log('Removed last menu item');
    } else {
      log('Cannot remove - minimum 2 menus required');
    }
  };

  // Example 7: Context Menu Style
  const menu7Items: PopoverMenuConfig[] = $state([
    {
      label: 'Actions',
      items: [
        { label: 'Copy Link', onclick: () => log('Copy Link') },
        { label: 'Open in New Tab', onclick: () => log('Open in New Tab') },
        { label: 'Download', onclick: () => log('Download') },
        { label: '---sep' },
        { label: 'Properties', onclick: () => log('Properties') },
        { label: 'Inspect Element', onclick: () => log('Inspect Element') },
        { label: '---sep' },
        {
          label: 'More Actions',
          items: [
            { label: 'Bookmark', onclick: () => log('Bookmark') },
            { label: 'Share', onclick: () => log('Share') },
            { label: 'Print', onclick: () => log('Print') }
          ]
        }
      ]
    }
  ]);
</script>

<div class="demo-container">
  <header class="demo-header">
    <h1>PopoverMenu Component</h1>
    <p class="subtitle">
      A customizable menu bar with nested submenus
    </p>
  </header>

  <section class="demo-section">
    <h2>Overview</h2>
    <p>
      The PopoverMenu component provides a flexible menu bar system with support for
      unlimited nested submenus, hover and click interactions, smart positioning to
      prevent overflow, and full keyboard accessibility.
    </p>
  </section>

  <section class="demo-section">
    <h2>Features</h2>
    <ul class="feature-list">
      <li>Multiple top-level menu items</li>
      <li>Unlimited nested submenu levels</li>
      <li>Hover and click interactions</li>
      <li>Smart positioning to prevent overflow</li>
      <li>Separator support for menu organization</li>
      <li>Enable/disable menu items</li>
      <li>Fully customizable with CSS variables</li>
      <li>TypeScript support with full type definitions</li>
      <li>SSR-safe implementation</li>
    </ul>
  </section>

  <section class="demo-section">
    <h2>Example 1: Basic Menu Bar</h2>
    <p class="description">
      A simple menu bar with File, Edit, and View menus. Click on menu items to see them in action.
    </p>
    <div class="menu-container">
      <PopoverMenu bind:this={menu1} items={menu1Items} />
    </div>
  </section>

  <section class="demo-section">
    <h2>Example 2: Nested Submenus</h2>
    <p class="description">
      Demonstrates multi-level nested submenus with hover interactions. Hover over items with arrows to open submenus.
    </p>
    <div class="menu-container">
      <PopoverMenu bind:this={menu2} items={menu2Items} />
    </div>
  </section>

  <section class="demo-section">
    <h2>Example 3: Menu with Separators</h2>
    <p class="description">
      Shows how to use separators to organize menu items into logical groups.
    </p>
    <div class="menu-container">
      <PopoverMenu bind:this={menu3} items={menu3Items} />
    </div>
  </section>

  <section class="demo-section">
    <h2>Example 4: Disabled Menu Items</h2>
    <p class="description">
      Demonstrates disabled menu items that cannot be clicked or interacted with.
    </p>
    <div class="menu-container">
      <PopoverMenu bind:this={menu4} items={menu4Items} />
    </div>
  </section>

  <section class="demo-section">
    <h2>Example 5: Application Menu</h2>
    <p class="description">
      A complete application menu bar example with typical menu structure including keyboard shortcuts in labels.
    </p>
    <div class="menu-container">
      <PopoverMenu bind:this={menu5} items={menu5Items} />
    </div>
  </section>

  <section class="demo-section">
    <h2>Example 6: Dynamic Menu Updates</h2>
    <p class="description">
      Demonstrates adding and removing menu items dynamically.
    </p>
    <div class="menu-container">
      <PopoverMenu bind:this={menu6} items={menu6Items} />
    </div>
    <div class="button-row">
      <button class="btn btn-primary" onclick={addDynamicMenu}>
        Add Menu Item
      </button>
      <button class="btn btn-danger" onclick={removeDynamicMenu}>
        Remove Last Menu
      </button>
    </div>
  </section>

  <section class="demo-section">
    <h2>Example 7: Context Menu Style</h2>
    <p class="description">
      A single-menu example that works like a context menu with multiple options.
    </p>
    <div class="menu-container">
      <PopoverMenu bind:this={menu7} items={menu7Items} />
    </div>
  </section>

  <section class="demo-section">
    <h2>Output Console</h2>
    <div class="output-area">
      <pre>{outputMessage}</pre>
    </div>
  </section>

  <section class="demo-section">
    <h2>Usage Example</h2>
    <div class="code-block">
      <pre><code>&lt;script lang="ts"&gt;
  import &#123; PopoverMenu, type PopoverMenuConfig &#125; from '@liwe3/webcomponents-svelte';

  const menuItems: PopoverMenuConfig[] = [
    &#123;
      label: 'File',
      items: [
        &#123; label: 'New', onclick: () => console.log('New file') &#125;,
        &#123; label: 'Open', onclick: () => console.log('Open file') &#125;,
        &#123; label: '---sep' &#125;, // Separator
        &#123; label: 'Save', onclick: () => console.log('Save file') &#125;,
        &#123;
          label: 'Export',
          items: [
            &#123; label: 'PDF', onclick: () => console.log('Export as PDF') &#125;,
            &#123; label: 'HTML', onclick: () => console.log('Export as HTML') &#125;
          ]
        &#125;
      ]
    &#125;,
    &#123;
      label: 'Edit',
      items: [
        &#123; label: 'Cut', onclick: () => console.log('Cut') &#125;,
        &#123; label: 'Copy', onclick: () => console.log('Copy') &#125;,
        &#123; label: 'Paste', onclick: () => console.log('Paste'), enabled: false &#125;
      ]
    &#125;
  ];
&lt;/script&gt;

&lt;PopoverMenu items=&#123;menuItems&#125; /&gt;</code></pre>
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
          <td><code>items</code></td>
          <td><code>PopoverMenuConfig[]</code></td>
          <td><code>[]</code></td>
          <td>Array of top-level menu configurations</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="demo-section">
    <h2>Types</h2>
    <div class="code-block">
      <pre><code>type PopoverMenuItem = &#123;
  label: string;
  enabled?: boolean;
  items?: PopoverMenuItem[];
  onclick?: () => void;
&#125;;

type PopoverMenuConfig = &#123;
  label: string;
  items: PopoverMenuItem[];
&#125;;</code></pre>
    </div>
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
          <td><code>setItems(items)</code></td>
          <td><code>PopoverMenuConfig[]</code></td>
          <td>Set the menu items</td>
        </tr>
        <tr>
          <td><code>getItems()</code></td>
          <td>-</td>
          <td>Get the current menu items</td>
        </tr>
        <tr>
          <td><code>addMenuItem(item, index)</code></td>
          <td><code>PopoverMenuConfig, number?</code></td>
          <td>Add a menu item at the specified index (or at the end)</td>
        </tr>
        <tr>
          <td><code>removeMenuItem(index)</code></td>
          <td><code>number</code></td>
          <td>Remove a menu item at the specified index</td>
        </tr>
        <tr>
          <td><code>updateMenuItem(index, item)</code></td>
          <td><code>number, PopoverMenuConfig</code></td>
          <td>Update a menu item at the specified index</td>
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

  .demo-section p,
  .description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .feature-list li {
    padding: 0.75rem 0;
    font-size: 1rem;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
  }

  .feature-list li:last-child {
    border-bottom: none;
  }

  .feature-list li::before {
    content: '✓';
    color: #28a745;
    font-weight: bold;
    margin-right: 10px;
    font-size: 18px;
  }

  .menu-container {
    margin-top: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    display: flex;
    justify-content: center;
  }

  .button-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
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

  .output-area {
    background: #e9ecef;
    border-radius: 8px;
    padding: 20px;
    min-height: 60px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
  }

  .output-area pre {
    margin: 0;
    color: #212529;
    white-space: pre-wrap;
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

    .button-row {
      flex-direction: column;
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
