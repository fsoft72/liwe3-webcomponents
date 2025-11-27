# PopoverMenu

A customizable menu component with support for nested submenus and fixed positioning.

## Basic Usage

```html
<liwe3-popover-menu id="myMenu"></liwe3-popover-menu>

<script type="module">
  import '@liwe3/webcomponents';

  const menu = document.getElementById('myMenu');

  menu.setItems([
    {
      label: 'File',
      items: [
        { label: 'New', onclick: () => console.log('New') },
        { label: 'Open', onclick: () => console.log('Open') },
        { label: 'Save', onclick: () => console.log('Save') }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Cut', onclick: () => console.log('Cut') },
        { label: 'Copy', onclick: () => console.log('Copy') },
        { label: 'Paste', onclick: () => console.log('Paste') }
      ]
    }
  ]);
</script>
```

## TypeScript Usage

```typescript
import { PopoverMenuElement, PopoverMenuConfig, PopoverMenuItem } from '@liwe3/webcomponents';

const menu = document.getElementById('myMenu') as PopoverMenuElement;

const menuConfig: PopoverMenuConfig[] = [
  {
    label: 'File',
    items: [
      { label: 'New', onclick: () => console.log('New') },
      { label: 'Open', onclick: () => console.log('Open') }
    ]
  }
];

menu.setItems(menuConfig);
```

## Types

### PopoverMenuConfig

Top-level menu configuration:

```typescript
type PopoverMenuConfig = {
  label: string;           // Menu button label
  items: PopoverMenuItem[]; // Menu items
};
```

**Source:** `PopoverMenu.ts:13-16`

### PopoverMenuItem

Individual menu item configuration:

```typescript
type PopoverMenuItem = {
  label: string;                // Item label (use '---sep' for separator)
  enabled?: boolean;            // Enable/disable item (default: true)
  items?: PopoverMenuItem[];    // Nested submenu items
  onclick?: () => void;         // Click handler
};
```

**Source:** `PopoverMenu.ts:6-11`

## Features

### Nested Submenus

Create multi-level menu hierarchies:

```typescript
menu.setItems([
  {
    label: 'Edit',
    items: [
      { label: 'Undo', onclick: () => console.log('Undo') },
      { label: 'Redo', onclick: () => console.log('Redo') },
      {
        label: 'Transform',
        items: [
          { label: 'Uppercase', onclick: () => console.log('Uppercase') },
          { label: 'Lowercase', onclick: () => console.log('Lowercase') },
          {
            label: 'Advanced',
            items: [
              { label: 'Title Case', onclick: () => console.log('Title Case') },
              { label: 'Snake Case', onclick: () => console.log('Snake Case') }
            ]
          }
        ]
      }
    ]
  }
]);
```

**Source:** `PopoverMenu.ts:318-361`

### Menu Separators

Add visual separators between menu items using the special label `'---sep'`:

```typescript
menu.setItems([
  {
    label: 'File',
    items: [
      { label: 'New', onclick: () => console.log('New') },
      { label: 'Open', onclick: () => console.log('Open') },
      { label: '---sep' }, // Separator
      { label: 'Save', onclick: () => console.log('Save') },
      { label: 'Save As', onclick: () => console.log('Save As') },
      { label: '---sep' }, // Separator
      { label: 'Exit', onclick: () => console.log('Exit') }
    ]
  }
]);
```

**Source:** `PopoverMenu.ts:294-297`

### Disabled Items

Disable menu items by setting `enabled: false`:

```typescript
menu.setItems([
  {
    label: 'Edit',
    items: [
      { label: 'Cut', onclick: () => console.log('Cut') },
      { label: 'Copy', onclick: () => console.log('Copy') },
      { label: 'Paste', enabled: false, onclick: () => console.log('Paste') } // Disabled
    ]
  }
]);
```

Disabled items are grayed out and non-interactive.

**Source:** `PopoverMenu.ts:313-316`

### Fixed Positioning

The menu uses `position: fixed` with intelligent overflow detection to ensure menus and submenus are always visible within the viewport, even when opened near screen edges.

**Source:** `PopoverMenu.ts:486-580`

### Hover and Click Interactions

- **Main menu:** Opens on click
- **Submenus:** Open on hover after 100ms delay, or immediately on click
- **Outside click:** Closes all menus

**Source:** `PopoverMenu.ts:325-349`, `PopoverMenu.ts:443-463`

## Methods

### `setItems(items: PopoverMenuConfig[])`

Sets the menu configuration.

**Parameters:**
- `items` - Array of menu configurations

**Example:**
```typescript
menu.setItems([
  {
    label: 'File',
    items: [
      { label: 'New', onclick: () => console.log('New') }
    ]
  }
]);
```

**Source:** `PopoverMenu.ts:69`

---

### `getItems(): PopoverMenuConfig[]`

Gets the current menu configuration.

**Returns:** `PopoverMenuConfig[]`

**Example:**
```typescript
const items = menu.getItems();
console.log(items);
```

**Source:** `PopoverMenu.ts:77`

---

### `addMenuItem(item: PopoverMenuConfig, index?: number | null)`

Adds a new top-level menu item.

**Parameters:**
- `item` - Menu configuration to add
- `index` - Optional position (default: append to end)

**Example:**
```typescript
menu.addMenuItem({
  label: 'Help',
  items: [
    { label: 'Documentation', onclick: () => console.log('Docs') },
    { label: 'About', onclick: () => console.log('About') }
  ]
});

// Insert at specific position
menu.addMenuItem({
  label: 'View',
  items: [
    { label: 'Zoom In', onclick: () => console.log('Zoom In') }
  ]
}, 1); // Insert at index 1
```

**Source:** `PopoverMenu.ts:84`

---

### `removeMenuItem(index: number)`

Removes a top-level menu item by index.

**Parameters:**
- `index` - Index of the menu item to remove

**Example:**
```typescript
menu.removeMenuItem(0); // Remove first menu
```

**Source:** `PopoverMenu.ts:96`

---

### `updateMenuItem(index: number, item: PopoverMenuConfig)`

Updates a top-level menu item.

**Parameters:**
- `index` - Index of the menu item to update
- `item` - New menu configuration

**Example:**
```typescript
menu.updateMenuItem(0, {
  label: 'File (Updated)',
  items: [
    { label: 'New File', onclick: () => console.log('New File') }
  ]
});
```

**Source:** `PopoverMenu.ts:106`

## CSS Custom Properties

Customize the appearance using CSS variables:

```css
liwe3-popover-menu {
  /* General */
  --font-family: 'Your Font', sans-serif;

  /* Menu Bar */
  --popover-menu-bar-background: #fff;
  --popover-menu-bar-border: #ddd;
  --popover-menu-bar-radius: 6px;
  --popover-menu-bar-padding: 4px;
  --popover-menu-bar-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  /* Menu Trigger Buttons */
  --popover-menu-trigger-color: #333;
  --popover-menu-trigger-hover-bg: #f0f0f0;
  --popover-menu-trigger-active-bg: #e3f2fd;
  --popover-menu-trigger-active-color: #1976d2;

  /* Dropdown/Popover */
  --popover-menu-border: #ccc;
  --popover-menu-radius: 6px;
  --popover-menu-background: white;
  --popover-menu-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* Menu Items */
  --popover-menu-item-color: #333;
  --popover-menu-item-hover-bg: #f5f5f5;
  --popover-menu-item-disabled-color: #999;

  /* Submenu Arrow */
  --popover-menu-submenu-arrow-color: #666;

  /* Separator */
  --popover-menu-separator-color: #e0e0e0;
}
```

**Source:** `PopoverMenu.ts:131-232`

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PopoverMenu Example</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 20px;
    }

    liwe3-popover-menu {
      margin-bottom: 20px;
      --popover-menu-trigger-active-bg: #4f46e5;
      --popover-menu-trigger-active-color: white;
      --popover-menu-item-hover-bg: #f0f0ff;
    }

    .content {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-top: 20px;
    }

    .log {
      background: white;
      padding: 15px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      max-height: 300px;
      overflow-y: auto;
    }

    .log-entry {
      padding: 4px 0;
      border-bottom: 1px solid #eee;
    }
  </style>
</head>
<body>
  <h1>PopoverMenu Example</h1>

  <liwe3-popover-menu id="menu"></liwe3-popover-menu>

  <div class="content">
    <h2>Action Log</h2>
    <div id="log" class="log">
      <em>Click menu items to see actions here...</em>
    </div>
    <button onclick="clearLog()" style="margin-top: 10px; padding: 8px 16px;">Clear Log</button>
  </div>

  <script type="module">
    import '@liwe3/webcomponents';

    const menu = document.getElementById('menu');
    const log = document.getElementById('log');

    const logAction = (action) => {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = `[${new Date().toLocaleTimeString()}] ${action}`;
      log.appendChild(entry);
      log.scrollTop = log.scrollHeight;
    };

    window.clearLog = () => {
      log.innerHTML = '<em>Log cleared</em>';
    };

    // Define menu structure
    menu.setItems([
      {
        label: 'File',
        items: [
          {
            label: 'New',
            items: [
              { label: 'Text File', onclick: () => logAction('New Text File') },
              { label: 'Folder', onclick: () => logAction('New Folder') },
              { label: 'Project', onclick: () => logAction('New Project') }
            ]
          },
          { label: 'Open', onclick: () => logAction('Open File') },
          { label: 'Open Recent', enabled: false },
          { label: '---sep' },
          { label: 'Save', onclick: () => logAction('Save') },
          { label: 'Save As', onclick: () => logAction('Save As') },
          { label: 'Save All', onclick: () => logAction('Save All') },
          { label: '---sep' },
          { label: 'Close', onclick: () => logAction('Close') },
          { label: 'Exit', onclick: () => logAction('Exit') }
        ]
      },
      {
        label: 'Edit',
        items: [
          { label: 'Undo', onclick: () => logAction('Undo') },
          { label: 'Redo', onclick: () => logAction('Redo') },
          { label: '---sep' },
          { label: 'Cut', onclick: () => logAction('Cut') },
          { label: 'Copy', onclick: () => logAction('Copy') },
          { label: 'Paste', onclick: () => logAction('Paste') },
          { label: '---sep' },
          {
            label: 'Transform',
            items: [
              { label: 'Uppercase', onclick: () => logAction('Transform: Uppercase') },
              { label: 'Lowercase', onclick: () => logAction('Transform: Lowercase') },
              { label: 'Title Case', onclick: () => logAction('Transform: Title Case') },
              { label: '---sep' },
              {
                label: 'Advanced',
                items: [
                  { label: 'Snake Case', onclick: () => logAction('Transform: Snake Case') },
                  { label: 'Camel Case', onclick: () => logAction('Transform: Camel Case') },
                  { label: 'Kebab Case', onclick: () => logAction('Transform: Kebab Case') }
                ]
              }
            ]
          }
        ]
      },
      {
        label: 'View',
        items: [
          { label: 'Toggle Sidebar', onclick: () => logAction('Toggle Sidebar') },
          { label: 'Toggle Panel', onclick: () => logAction('Toggle Panel') },
          { label: '---sep' },
          {
            label: 'Zoom',
            items: [
              { label: 'Zoom In', onclick: () => logAction('Zoom In') },
              { label: 'Zoom Out', onclick: () => logAction('Zoom Out') },
              { label: 'Reset Zoom', onclick: () => logAction('Reset Zoom') }
            ]
          }
        ]
      },
      {
        label: 'Help',
        items: [
          { label: 'Documentation', onclick: () => logAction('Open Documentation') },
          { label: 'Keyboard Shortcuts', onclick: () => logAction('Show Shortcuts') },
          { label: '---sep' },
          { label: 'About', onclick: () => logAction('Show About') }
        ]
      }
    ]);

    // Demo: Dynamically add a menu item
    setTimeout(() => {
      menu.addMenuItem({
        label: 'Tools',
        items: [
          { label: 'Settings', onclick: () => logAction('Open Settings') },
          { label: 'Extensions', onclick: () => logAction('Manage Extensions') }
        ]
      }, 3);
      logAction('Added "Tools" menu dynamically');
    }, 2000);
  </script>
</body>
</html>
```

## Advanced Usage

### Dynamic Menu Updates

Update menus dynamically based on application state:

```typescript
const menu = document.getElementById('menu') as PopoverMenuElement;

// Get current menus
const items = menu.getItems();

// Update the first menu
items[0].items.push({
  label: 'New Dynamic Item',
  onclick: () => console.log('Dynamic!')
});

menu.setItems(items);
```

### Conditional Menu Items

Show/hide items based on state:

```typescript
const canSave = true;
const hasSelection = false;

menu.setItems([
  {
    label: 'Edit',
    items: [
      { label: 'Cut', enabled: hasSelection, onclick: () => console.log('Cut') },
      { label: 'Copy', enabled: hasSelection, onclick: () => console.log('Copy') },
      { label: 'Paste', onclick: () => console.log('Paste') }
    ]
  },
  {
    label: 'File',
    items: [
      { label: 'Save', enabled: canSave, onclick: () => console.log('Save') }
    ]
  }
]);
```

### Menu as Application Bar

Use the component as an application menu bar:

```html
<style>
  liwe3-popover-menu {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>

<liwe3-popover-menu id="appMenu"></liwe3-popover-menu>
```

### Context Menu

While not the primary use case, you can create a context menu:

```typescript
const contextMenu = document.createElement('liwe3-popover-menu');
contextMenu.style.position = 'fixed';
contextMenu.style.display = 'none';

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();

  contextMenu.setItems([
    {
      label: 'Context',
      items: [
        { label: 'Action 1', onclick: () => console.log('Action 1') },
        { label: 'Action 2', onclick: () => console.log('Action 2') }
      ]
    }
  ]);

  // Position at cursor
  contextMenu.style.left = e.clientX + 'px';
  contextMenu.style.top = e.clientY + 'px';
  contextMenu.style.display = 'block';

  // Programmatically trigger the menu
  const trigger = contextMenu.shadowRoot.querySelector('.popover-menu-trigger');
  trigger?.click();
});
```

## Behavior Details

### Menu Opening

- Main menus open on click
- Active menu is highlighted
- Clicking the same menu again closes it

**Source:** `PopoverMenu.ts:443-463`

### Submenu Opening

- Submenus open on hover after 100ms
- Submenus can also be opened by clicking
- Only one submenu branch stays open at a time

**Source:** `PopoverMenu.ts:325-349`

### Menu Closing

- Clicking outside closes all menus
- Clicking a leaf item (with onclick) closes all menus
- Pressing Escape closes menus (if you add support)

**Source:** `PopoverMenu.ts:427-438`, `PopoverMenu.ts:352-356`

### Viewport Constraints

The component automatically adjusts menu positioning:
- Prevents overflow beyond viewport edges
- Positions submenus to the left if no space on the right
- Positions menus above trigger if no space below
- Maintains minimum margins from screen edges

**Source:** `PopoverMenu.ts:486-580`

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Accessibility Considerations

Current limitations:
- No keyboard navigation (Arrow keys, Enter, Escape)
- No ARIA attributes for screen readers
- No focus management

These are areas for future improvement.

## Related Components

- [SmartSelect](./SmartSelect.md)
- [AITextEditor](./AITextEditor.md)
- [Toast](./Toast.md)
