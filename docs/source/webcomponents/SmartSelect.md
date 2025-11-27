# SmartSelect Component

A customizable select dropdown with search, multi-select, and keyboard navigation.

## Live Example

<div class="example-container" style="padding: 20px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 20px;">
  <h3>Single Selection</h3>
  <liwe3-select 
    id="demo-select-single"
    placeholder="Select a fruit"
    options='[{"label":"Apple","value":"apple"},{"label":"Banana","value":"banana"},{"label":"Cherry","value":"cherry"},{"label":"Date","value":"date"},{"label":"Elderberry","value":"elderberry"}]'
  ></liwe3-select>
  <p>Selected: <span id="demo-select-single-result">None</span></p>

  <h3 style="margin-top: 20px;">Multiple Selection with Search</h3>
  <liwe3-select 
    id="demo-select-multi"
    multiple 
    searchable
    placeholder="Select technologies"
    options='[{"label":"TypeScript","value":"ts"},{"label":"JavaScript","value":"js"},{"label":"Svelte","value":"svelte"},{"label":"React","value":"react"},{"label":"Vue","value":"vue"},{"label":"Angular","value":"angular"}]'
  ></liwe3-select>
  <p>Selected: <span id="demo-select-multi-result">None</span></p>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const singleSelect = document.getElementById('demo-select-single');
    const singleResult = document.getElementById('demo-select-single-result');
    
    if (singleSelect) {
      singleSelect.addEventListener('change', (e) => {
        singleResult.textContent = e.detail.value || 'None';
      });
    }

    const multiSelect = document.getElementById('demo-select-multi');
    const multiResult = document.getElementById('demo-select-multi-result');

    if (multiSelect) {
      multiSelect.addEventListener('change', (e) => {
        const val = e.detail.value;
        multiResult.textContent = Array.isArray(val) && val.length ? val.join(', ') : 'None';
      });
    }
  });
</script>

## Usage

```html
<liwe3-select
  placeholder="Select a fruit"
  searchable
  options='[{"label":"Apple","value":"apple"},{"label":"Banana","value":"banana"}]'
></liwe3-select>
```

## Attributes & Properties

| Attribute | Property | Type | Description |
|-----------|----------|------|-------------|
| `multiple` | `multiple` | `boolean` | Enables multiple selection mode. |
| `searchable` | `searchable` | `boolean` | Enables search functionality within the dropdown. |
| `placeholder` | `placeholder` | `string` | Placeholder text when no option is selected. Default: "Select an option". |
| `disabled` | `disabled` | `boolean` | Disables the component. |
| `value` | `value` | `string \| string[]` | The selected value(s). |
| `options` | `options` | `SelectOption[]` | Array of options to display. |

### SelectOption Interface

```typescript
type SelectOption = {
  value: string;
  label: string;
};
```

## Methods

| Method | Description |
|--------|-------------|
| `open()` | Opens the dropdown. |
| `close()` | Closes the dropdown. |
| `toggle()` | Toggles the dropdown open/closed state. |
| `selectOption(value: string)` | Selects an option by its value. |
| `deselectOption(value: string)` | Deselects an option by its value. |
| `getSelectedOptions()` | Returns an array of currently selected options. |
| `setOptions(options: SelectOption[])` | Sets the options for the select component. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string \| string[] }` | Fired when the selection changes. |
| `open` | - | Fired when the dropdown opens. |
| `close` | - | Fired when the dropdown closes. |
| `search` | `{ query: string }` | Fired when the search input value changes. |

## Styling

The component uses Shadow DOM but exposes CSS variables for customization:

```css
liwe3-select {
  --font-family: sans-serif;
  --font-size: 14px;
  --focus-color: #007bff;
  --padding: 8px 12px;
  --border: 1px solid #ccc;
  --border-radius: 4px;
  --background: white;
  --tag-background: #e9ecef;
  --tag-border-radius: 12px;
  --tag-color: #495057;
  --remove-color: #6c757d;
  --remove-hover-color: #dc3545;
  --arrow-color: #666;
  --dropdown-background: white;
  --dropdown-border: 1px solid #ccc;
  --dropdown-border-radius: 4px;
  --dropdown-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --option-color: #333;
  --option-hover-background: #f8f9fa;
  --option-focused-background: #007bff;
  --option-focused-color: white;
  --option-selected-background: #e3f2fd;
  --option-selected-color: #1976d2;
  --no-options-color: #6c757d;
}
```
