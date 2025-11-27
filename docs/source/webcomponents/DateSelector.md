# DateSelector Component

A customizable date picker component supporting both single date and date range selection modes.

## Usage

```html
<!-- Single Date Mode -->
<liwe3-date-selector></liwe3-date-selector>

<!-- Range Mode -->
<liwe3-date-selector range-mode></liwe3-date-selector>
```

## Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `range-mode` | `boolean` | Enables date range selection mode. |

## Properties & Methods

| Method | Description |
|--------|-------------|
| `setDate(dateStr: string)` | Sets the selected date (format: YYYY-MM-DD). Only works in single mode. |
| `setRange(startDate: string, endDate: string)` | Sets the selected date range. Only works in range mode. |
| `getSelectedDate()` | Returns the currently selected date string or null. |
| `getSelectedRange()` | Returns the currently selected range object `{ start, end }`. |
| `clear()` | Clears the current selection. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `dateSelected` | `{ date: string }` | Fired when a single date is selected. |
| `rangeSelected` | `{ start: string, end: string }` | Fired when a date range is completed. |

## Styling

The component uses Shadow DOM. It is styled as a block element with a default width of 320px.

```css
liwe3-date-selector {
  /* No specific CSS variables exposed yet, uses internal styling */
  display: block;
}
```
