# ContainerBox (Svelte)

Svelte wrapper for the `liwe3-container-box` web component.

## Usage

```svelte
<script lang="ts">
  import { ContainerBox } from '@liwe3/webcomponents-svelte';
  import type { PopoverMenuItem } from '@liwe3/webcomponents';

  const menuItems: PopoverMenuItem[] = [
    { label: 'Edit', onclick: () => console.log('Edit') },
    { label: 'Delete', onclick: () => console.log('Delete') }
  ];
</script>

<ContainerBox {menuItems} menuPosition="top-right">
  <div class="card">
    <h3>Card Title</h3>
    <p>Card content...</p>
  </div>
</ContainerBox>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuPosition` | `MenuPosition` | `"bottom-left"` | Position of the menu button. |
| `menuItems` | `PopoverMenuItem[]` | `[]` | Array of menu items. |
| `alwaysShowMenu` | `boolean` | `false` | Whether menu button is always visible. |

## Slots

| Slot | Description |
|------|-------------|
| (default) | Content to be wrapped by the container. |
