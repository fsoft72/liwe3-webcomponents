# Drawer Component

A collapsible side panel component that can be expanded, shrunk, or closed with smooth animations.

## Usage

```html
<liwe3-drawer
  title="My Drawer"
  direction="horizontal"
  state="expanded"
>
  <p>Drawer content goes here.</p>
</liwe3-drawer>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | The expansion direction of the drawer. |
| `duration` | `number` | `300` | Animation duration in milliseconds. |
| `show-title-when-shrunk` | `boolean` | `false` | Whether to show the title when in shrunk state. |
| `closable` | `boolean` | `true` | Whether to show the close button. |
| `title` | `string` | `""` | The title text displayed in the header. |
| `icon` | `string` | `"☰"` | The icon for the toggle button. |
| `state` | `'expanded' \| 'shrunk' \| 'closed'` | `'expanded'` | The current state of the drawer. |
| `show-toggle-button` | `boolean` | `true` | Whether to show the expand/shrink toggle button. |
| `content-padding` | `string` | `"16px"` | Padding for the content area. |

## Methods

| Method | Description |
|--------|-------------|
| `expand()` | Expands the drawer. |
| `shrink()` | Shrinks the drawer to its minimal size. |
| `close()` | Closes the drawer and removes it from the DOM. |
| `toggle()` | Toggles between expanded and shrunk states. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `drawer-state-change` | `{ oldState, newState }` | Fired when the state changes. |
| `drawer-expanded` | - | Fired when the drawer expands. |
| `drawer-shrunk` | - | Fired when the drawer shrinks. |
| `drawer-closed` | - | Fired when the drawer closes. |

## Styling

The component exposes several CSS variables for customization:

```css
liwe3-drawer {
  --drawer-bg: #ffffff;
  --drawer-border: #e5e7eb;
  --drawer-text: #1f2937;
  --drawer-icon-bg: #f3f4f6;
  --drawer-icon-hover: #e5e7eb;
  --drawer-button-hover: #f9fafb;
  --drawer-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  /* Sizing */
  --drawer-horizontal-size: 300px;
  --drawer-vertical-size: 300px;
  --drawer-horizontal-shrunk-size: 48px;
  --drawer-vertical-shrunk-size: 48px;
}
```
