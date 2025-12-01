# Drawer (Svelte)

Svelte wrapper for the `liwe3-drawer` web component.

## Usage

```svelte
<script lang="ts">
  import { Drawer } from '@liwe3/webcomponents-svelte';

  let drawerState = $state('expanded');
</script>

<Drawer 
  title="My Drawer" 
  bind:state={drawerState}
  onstatechange={(e) => console.log(e.detail)}
>
  <p>Drawer content...</p>
</Drawer>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Expansion direction. |
| `duration` | `number` | `300` | Animation duration (ms). |
| `showTitleWhenShrunk` | `boolean` | `false` | Show title when shrunk. |
| `closable` | `boolean` | `true` | Show close button. |
| `title` | `string` | `""` | Header title. |
| `icon` | `string` | `"☰"` | Toggle button icon. |
| `state` | `DrawerState` | `'expanded'` | Current state. Supports `bind:state`. |
| `showToggleButton` | `boolean` | `true` | Show toggle button. |
| `contentPadding` | `string` | `"16px"` | Content padding. |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `onstatechange` | `(event: CustomEvent) => void` | Fired on state change. |
| `onexpanded` | `(event: CustomEvent) => void` | Fired when expanded. |
| `onshrunk` | `(event: CustomEvent) => void` | Fired when shrunk. |
| `onclosed` | `(event: CustomEvent) => void` | Fired when closed. |

## Component Exports

Access methods via component instance binding:

```svelte
<script>
  let drawerRef;
</script>

<Drawer bind:this={drawerRef} ... />
```

| Method | Description |
|--------|-------------|
| `expand()` | Expands the drawer. |
| `shrink()` | Shrinks the drawer. |
| `close()` | Closes the drawer. |
| `toggle()` | Toggles state. |
| `getState()` | Gets current state. |
| `setState(state)` | Sets current state. |
