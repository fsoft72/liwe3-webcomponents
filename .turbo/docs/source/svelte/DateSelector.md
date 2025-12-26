# DateSelector (Svelte)

Svelte wrapper for the `liwe3-date-selector` web component.

## Usage

```svelte
<script lang="ts">
  import { DateSelector } from '@liwe3/webcomponents-svelte';
  import type { DateRange } from '@liwe3/webcomponents';

  let selectedDate = $state(null);
  let selectedRange = $state({ start: null, end: null });
</script>

<!-- Single Date Mode -->
<DateSelector 
  bind:selectedDate 
  ondateselected={(date) => console.log(date)} 
/>

<!-- Range Mode -->
<DateSelector 
  rangeMode 
  bind:selectedRange 
  onrangeselected={(range) => console.log(range)} 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rangeMode` | `boolean` | `false` | Enables range selection mode. |
| `selectedDate` | `string \| null` | `null` | Selected date (single mode). Supports `bind:selectedDate`. |
| `selectedRange` | `DateRange` | `{ start: null, end: null }` | Selected range (range mode). Supports `bind:selectedRange`. |

## Events

| Event | Type | Description |
|-------|------|-------------|
| `ondateselected` | `(date: string) => void` | Fired when a date is selected. |
| `onrangeselected` | `(range: DateRange) => void` | Fired when a range is selected. |

## Component Exports

Access methods via component instance binding:

```svelte
<script>
  let selectorRef;
</script>

<DateSelector bind:this={selectorRef} ... />
```

| Method | Description |
|--------|-------------|
| `setDate(date)` | Sets selected date. |
| `setRange(start, end)` | Sets selected range. |
| `getSelectedDate()` | Gets selected date. |
| `getSelectedRange()` | Gets selected range. |
| `clear()` | Clears selection. |
