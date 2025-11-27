# SmartSelect (Svelte)

Svelte wrapper for the `liwe3-select` web component.

## Usage

```svelte
<script lang="ts">
  import { SmartSelect } from '@liwe3/webcomponents-svelte';
  import type { SelectOption } from '@liwe3/webcomponents';

  let selectedValue = $state('apple');
  
  const options: SelectOption[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' }
  ];
</script>

<SmartSelect
  bind:value={selectedValue}
  {options}
  searchable
  placeholder="Select a fruit"
/>

<p>Selected: {selectedValue}</p>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| string[]` | `undefined` | The selected value(s). Supports `bind:value`. |
| `options` | `SelectOption[]` | `[]` | Array of options to display. |
| `multiple` | `boolean` | `false` | Enables multiple selection mode. |
| `searchable` | `boolean` | `false` | Enables search functionality. |
| `placeholder` | `string` | `"Select an option"` | Placeholder text. |
| `disabled` | `boolean` | `false` | Disables the component. |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `onchange` | `(value: string \| string[] \| undefined) => void` | Fired when selection changes. |
| `onsearch` | `(query: string) => void` | Fired when search query changes. |
| `onopen` | `(event: CustomEvent) => void` | Fired when dropdown opens. |
| `onclose` | `(event: CustomEvent) => void` | Fired when dropdown closes. |

## Component Exports

You can access component methods by binding to the component instance:

```svelte
<script>
  let selectRef;
  
  function toggleDropdown() {
    selectRef.toggle();
  }
</script>

<SmartSelect bind:this={selectRef} ... />
```

| Method | Description |
|--------|-------------|
| `open()` | Opens the dropdown. |
| `close()` | Closes the dropdown. |
| `toggle()` | Toggles the dropdown. |
| `selectOption(value)` | Selects an option. |
| `deselectOption(value)` | Deselects an option. |
| `getSelectedOptions()` | Returns selected options. |
| `setOptions(options)` | Updates options programmatically. |
