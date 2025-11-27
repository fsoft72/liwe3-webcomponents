# DateSelector Component

A customizable date picker component supporting both single date and date range selection modes.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
  <h3>Single Date Selection</h3>
  <liwe3-date-selector id="demo-single"></liwe3-date-selector>
  <p>Selected: <span id="demo-single-result">None</span></p>

  <h3 style="margin-top: 20px;">Range Selection</h3>
  <liwe3-date-selector range-mode id="demo-range"></liwe3-date-selector>
  <p>Selected Range: <span id="demo-range-result">None</span></p>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const singleSelector = document.getElementById('demo-single');
    const singleResult = document.getElementById('demo-single-result');
    
    if (singleSelector) {
      singleSelector.addEventListener('dateSelected', (e) => {
        singleResult.textContent = e.detail.date;
      });
    }

    const rangeSelector = document.getElementById('demo-range');
    const rangeResult = document.getElementById('demo-range-result');

    if (rangeSelector) {
      rangeSelector.addEventListener('rangeSelected', (e) => {
        rangeResult.textContent = `${e.detail.start} to ${e.detail.end}`;
      });
    }
  });
</script>

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
