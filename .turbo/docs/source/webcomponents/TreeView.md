# TreeView Component

A tree view component for hierarchical data.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
  <liwe3-tree-view id="demo-tree"></liwe3-tree-view>
  <p>Selected: <span id="demo-tree-result">None</span></p>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const tree = document.getElementById('demo-tree');
    const result = document.getElementById('demo-tree-result');
    
    if (tree) {
      const data = [
        {
          id: '1',
          label: 'Root Folder',
          children: [
            { id: '1-1', label: 'File 1.txt' },
            { id: '1-2', label: 'File 2.txt' },
            { 
              id: '1-3', 
              label: 'Subfolder',
              children: [
                { id: '1-3-1', label: 'File 3.txt' }
              ]
            }
          ]
        },
        {
          id: '2',
          label: 'Another Folder',
          children: [
            { id: '2-1', label: 'File 4.txt' }
          ]
        }
      ];
      
      customElements.whenDefined('liwe3-tree-view').then(() => {
        tree.data = data;
      });
      
      tree.addEventListener('itemselected', (e) => {
        result.textContent = e.detail.node.label || e.detail.node.id;
      });
    }
  });
</script>

## Attributes & Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| \`data\` | \`data\` | \`TreeNode[]\` | \`[]\` | The hierarchical data to display. |
| \`indent-width\` | \`indentWidth\` | \`number\` | \`20\` | Indentation width in pixels for each level. |
| \`selected-ids\` | \`selectedNodeIds\` | \`string[]\` | \`[]\` | Array of selected node IDs. |
| \`show-border\` | \`showBorderEnabled\` | \`boolean\` | \`true\` | Whether to show the border around the tree view. |

### TreeNode Interface

\`\`\`typescript
type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: string; // Emoji or character
  customIcon?: string; // Custom icon class or content
  selected?: boolean;
  expanded?: boolean;
};
\`\`\`

## Methods

| Method | Description |
|--------|-------------|
| \`toggleExpansion(nodeId: string)\` | Toggles the expansion state of a node. |
| \`toggleSelection(nodeId: string)\` | Toggles the selection state of a node. |
| \`selectAll()\` | Selects all nodes in the tree. |
| \`deselectAll()\` | Deselects all nodes in the tree. |
| \`expandAll()\` | Expands all nodes in the tree. |
| \`collapseAll()\` | Collapses all nodes in the tree. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`toggle\` | \`{ nodeId: string, expanded: boolean }\` | Fired when a node is expanded or collapsed. |
| \`selectionchange\` | \`{ selectedIds: string[] }\` | Fired when the selection changes. |
| \`itemselected\` | \`{ node: TreeNode, nodeId: string }\` | Fired when a leaf node (no children) is double-clicked. |

## Styling

The component uses Shadow DOM but exposes CSS variables for customization:

\`\`\`css
liwe3-tree-view {
  --tree-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --tree-font-size: 14px;
  --tree-text-color: #333;
  --tree-background: transparent;
  
  /* Container */
  --tree-padding: 8px;
  --tree-border-radius: 10px;
  --tree-container-background: transparent;
  --tree-border: 1px solid rgba(15, 23, 42, 0.12);
  --tree-border-shadow: none;
  
  /* Node */
  --tree-node-border-radius: 6px;
  --tree-hover-background: rgba(0, 123, 255, 0.08);
  --tree-focus-color: #007bff;
  
  /* Icons */
  --tree-icon-color: #666;
  --tree-expand-hover-background: rgba(0, 0, 0, 0.1);
  --tree-custom-icon-size: 20px;
  
  /* Checkbox */
  --tree-checkbox-border: #ccc;
  --tree-checkbox-border-radius: 4px;
  --tree-checkbox-background: white;
  --tree-checkbox-checked-background: #007bff;
  --tree-checkbox-checked-border: #007bff;
  --tree-checkbox-hover-border: #999;
  --tree-checkbox-hover-shadow: rgba(0, 123, 255, 0.1);
  
  /* Label */
  --tree-label-color: #333;
  --tree-label-font-weight: 400;
  --tree-label-hover-color: #007bff;
  
  /* Guide Lines */
  --tree-guide-line-color: rgba(0, 0, 0, 0.1);
  --tree-indent-width: 20px;
  
  /* Empty State */
  --tree-empty-color: #999;
  
  /* Scrollbar */
  --tree-scrollbar-track: #f1f1f1;
  --tree-scrollbar-thumb: #888;
  --tree-scrollbar-thumb-hover: #555;
}
\`\`\`
