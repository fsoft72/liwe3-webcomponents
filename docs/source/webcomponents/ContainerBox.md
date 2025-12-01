# ContainerBox Component

A container component that wraps elements and shows a context menu on hover or via a persistent button.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px; height: 300px;">
  <liwe3-container-box id="demo-container">
    <div style="background: #f0f0f0; padding: 20px; height: 250px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
      Hover over this box or click the menu button
    </div>
  </liwe3-container-box>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('demo-container');
    if (container) {
      customElements.whenDefined('liwe3-container-box').then(() => {
        container.setMenuItems([
          { label: 'Action 1', onclick: () => alert('Action 1 clicked') },
          { label: 'Action 2', onclick: () => alert('Action 2 clicked') },
          { label: '---sep' },
          { label: 'Submenu', items: [
              { label: 'Sub Action 1', onclick: () => alert('Sub Action 1') },
              { label: 'Sub Action 2', onclick: () => alert('Sub Action 2') }
            ] 
          }
        ]);
      });
    }
  });
</script>

## Usage

```html
<liwe3-container-box>
  <div class="my-content">
    Hover over me to see the menu button
  </div>
</liwe3-container-box>

<script>
  const container = document.querySelector('liwe3-container-box');
  container.setMenuItems([
    { label: 'Edit', onclick: () => console.log('Edit clicked') },
    { label: 'Delete', onclick: () => console.log('Delete clicked') }
  ]);
</script>
```

## Configuration

The component is primarily configured via methods, but some options can be set via attributes.

### MenuPosition Type

```typescript
type MenuPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
```

### PopoverMenuItem Interface

```typescript
interface PopoverMenuItem {
  label: string;
  onclick?: () => void;
  items?: PopoverMenuItem[]; // For submenus
  enabled?: boolean; // Default: true
}
```

## Methods

| Method | Description |
|--------|-------------|
| `setMenuPosition(position: MenuPosition)` | Sets the position of the menu button. Default: `'bottom-left'`. |
| `getMenuPosition()` | Gets the current menu button position. |
| `setMenuItems(items: PopoverMenuItem[])` | Sets the items to display in the menu. |
| `getMenuItems()` | Gets the current menu items. |
| `setAlwaysShowMenu(value: boolean)` | Sets whether the menu button is always visible (true) or only on hover (false). |
| `getAlwaysShowMenu()` | Gets the current visibility state of the menu button. |

## Styling

The component uses Shadow DOM but exposes CSS variables for customization:

```css
liwe3-container-box {
  --font-family: sans-serif;
  
  /* Menu Button Styling */
  --container-box-menu-bg: #fff;
  --container-box-menu-border: #ddd;
  --container-box-menu-radius: 4px;
  --container-box-menu-padding: 6px 10px;
  --container-box-menu-shadow: 0 2px 8px rgba(0,0,0,0.15);
  --container-box-menu-color: #333;
  --container-box-menu-hover-bg: #f5f5f5;
  
  /* Menu Button Offset */
  --container-box-menu-offset: 8px;
}
```

## Slots

| Slot | Description |
|------|-------------|
| (default) | The content to be wrapped by the container. |
