<script lang="ts">
  import { TreeView } from "@liwe3/webcomponents-svelte";
  import type { TreeNode } from "@liwe3/webcomponents";

  // Tree data state
  let treeData = $state<TreeNode[]>([
    {
      id: "1",
      label: "Documents",
      expanded: true,
      children: [
        {
          id: "1-1",
          label: "Work",
          expanded: false,
          children: [
            { id: "1-1-1", label: "Project Proposal.pdf" },
            { id: "1-1-2", label: "Meeting Notes.docx" },
            { id: "1-1-3", label: "Budget 2024.xlsx" },
          ],
        },
        {
          id: "1-2",
          label: "Personal",
          expanded: false,
          children: [
            { id: "1-2-1", label: "Resume.pdf" },
            { id: "1-2-2", label: "Cover Letter.docx" },
          ],
        },
      ],
    },
    {
      id: "2",
      label: "Projects",
      expanded: true,
      children: [
        {
          id: "2-1",
          label: "Web Development",
          expanded: false,
          children: [
            {
              id: "2-1-1",
              label: "Frontend",
              children: [
                { id: "2-1-1-1", label: "index.html" },
                { id: "2-1-1-2", label: "styles.css" },
                { id: "2-1-1-3", label: "app.js" },
              ],
            },
            {
              id: "2-1-2",
              label: "Backend",
              children: [
                { id: "2-1-2-1", label: "server.ts" },
                { id: "2-1-2-2", label: "database.ts" },
              ],
            },
          ],
        },
        {
          id: "2-2",
          label: "Mobile App",
          children: [
            { id: "2-2-1", label: "MainActivity.java" },
            { id: "2-2-2", label: "activity_main.xml" },
          ],
        },
      ],
    },
    {
      id: "3",
      label: "Downloads",
      children: [
        { id: "3-1", label: "Image.png" },
        { id: "3-2", label: "Video.mp4" },
        { id: "3-3", label: "Archive.zip" },
      ],
    },
  ]);

  // Custom icons example
  let customIconsData = $state<TreeNode[]>([
    {
      id: "root",
      label: "Project Root",
      customIcon: "🏠",
      expanded: true,
      children: [
        {
          id: "src",
          label: "src",
          customIcon: "📦",
          children: [
            { id: "app.ts", label: "app.ts", customIcon: "📘" },
            { id: "utils.ts", label: "utils.ts", customIcon: "📘" },
          ],
        },
        {
          id: "public",
          label: "public",
          customIcon: "🌐",
          children: [
            { id: "index.html", label: "index.html", customIcon: "📄" },
            { id: "styles.css", label: "styles.css", customIcon: "🎨" },
          ],
        },
        { id: "readme", label: "README.md", customIcon: "📖" },
        { id: "package", label: "package.json", customIcon: "📦" },
      ],
    },
  ]);

  // Selected IDs state
  let selectedIds = $state<string[]>([]);
  let customSelectedIds = $state<string[]>([]);

  // TreeView component reference
  let treeViewRef: any;
  let customTreeViewRef: any;

  // Event handlers
  const handleSelectionChange = (ids: string[]) => {
    console.log("Selection changed:", ids);
  };

  const handleToggle = (event: CustomEvent) => {
    console.log("Node toggled:", event.detail);
  };

  const handleItemSelected = (event: CustomEvent) => {
    console.log("Item double-clicked:", event.detail);
    alert(`Double-clicked: ${event.detail.node.label}`);
  };

  // Button handlers
  const handleExpandAll = () => {
    treeViewRef?.expandAll();
  };

  const handleCollapseAll = () => {
    treeViewRef?.collapseAll();
  };

  const handleSelectAll = () => {
    treeViewRef?.selectAll();
  };

  const handleDeselectAll = () => {
    treeViewRef?.deselectAll();
  };

  // Derived values
  const selectedCount = $derived(selectedIds.length);
  const selectedLabels = $derived.by(() => {
    const findLabels = (nodes: TreeNode[], ids: string[]): string[] => {
      const labels: string[] = [];
      const traverse = (node: TreeNode) => {
        if (ids.includes(node.id)) {
          labels.push(node.label);
        }
        node.children?.forEach(traverse);
      };
      nodes.forEach(traverse);
      return labels;
    };
    return findLabels(treeData, selectedIds);
  });
</script>

<div class="page-container">
  <h1>TreeView Component Demo</h1>
  <p class="subtitle">
    Interactive tree view with checkboxes, infinite depth, and keyboard
    navigation
  </p>

  <!-- Basic TreeView -->
  <section class="demo-section">
    <h2>Basic TreeView</h2>
    <p>
      A hierarchical tree structure with folders and files. Double-click files
      to trigger selection event, double-click folders to expand/collapse.
    </p>

    <div class="demo-box">
      <div class="controls">
        <button onclick={handleExpandAll}>Expand All</button>
        <button onclick={handleCollapseAll}>Collapse All</button>
        <button onclick={handleSelectAll}>Select All</button>
        <button onclick={handleDeselectAll}>Deselect All</button>
      </div>

      <div class="tree-wrapper">
        <TreeView
          bind:this={treeViewRef}
          bind:data={treeData}
          bind:selectedIds={selectedIds}
          onselectionchange={handleSelectionChange}
          ontoggle={handleToggle}
          onitemselected={handleItemSelected}
        />
      </div>

      <div class="output">
        <strong>Selected Items:</strong> {selectedCount}
        {#if selectedLabels.length > 0}
          <br />
          <strong>Labels:</strong>
          <code>{selectedLabels.join(", ")}</code>
        {/if}
      </div>
    </div>
  </section>

  <!-- Custom Icons -->
  <section class="demo-section">
    <h2>Custom Icons</h2>
    <p>Use custom icons or emojis for nodes instead of the default folder/file icons.</p>

    <div class="demo-box">
      <div class="tree-wrapper">
        <TreeView
          bind:this={customTreeViewRef}
          bind:data={customIconsData}
          bind:selectedIds={customSelectedIds}
          indentWidth={24}
        />
      </div>

      <div class="output">
        <strong>Selected:</strong>
        {customSelectedIds.length}
        items
      </div>
    </div>
  </section>

  <!-- Custom Indent Width -->
  <section class="demo-section">
    <h2>Custom Indent Width</h2>
    <p>Adjust the indentation level for nested items (default is 20px).</p>

    <div class="demo-box">
      <div class="tree-wrapper">
        <TreeView
          data={[
            {
              id: "a",
              label: "Level 1",
              expanded: true,
              children: [
                {
                  id: "b",
                  label: "Level 2",
                  expanded: true,
                  children: [
                    {
                      id: "c",
                      label: "Level 3",
                      children: [{ id: "d", label: "Level 4" }],
                    },
                  ],
                },
              ],
            },
          ]}
          indentWidth={40}
        />
      </div>
    </div>
  </section>

  <!-- Features List -->
  <section class="demo-section">
    <h2>Features</h2>
    <ul class="features-list">
      <li>✅ Infinite nesting depth</li>
      <li>✅ Checkbox selection (single or multiple)</li>
      <li>✅ Expand/collapse folders</li>
      <li>✅ Default folder (📁/📂) and file (📄) icons</li>
      <li>✅ Custom icons support</li>
      <li>✅ Double-click to select items</li>
      <li>✅ Keyboard navigation support</li>
      <li>✅ Customizable indent width</li>
      <li>✅ CSS custom properties for theming</li>
      <li>✅ Smooth animations</li>
      <li>✅ Event-driven (selectionchange, toggle, itemselected)</li>
    </ul>
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

  .controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .controls button {
    padding: 0.5rem 1rem;
    border: 1px solid #4facfe;
    background: white;
    color: #4facfe;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .controls button:hover {
    background: #4facfe;
    color: white;
  }

  .tree-wrapper {
    background: white;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    padding: 1rem;
    max-height: 400px;
    overflow: auto;
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
    font-family: "Monaco", "Menlo", monospace;
    font-size: 0.85rem;
    color: #d63384;
  }

  .features-list {
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    list-style: none;
  }

  .features-list li {
    padding: 0.5rem 0;
    font-size: 1rem;
    color: #333;
  }
</style>
