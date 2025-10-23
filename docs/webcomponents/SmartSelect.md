# SmartSelect

A customizable dropdown component with search, multi-select, and keyboard navigation capabilities.

## Basic Usage

```html
<liwe3-select id="mySelect"></liwe3-select>

<script type="module">
  import '@liwe3/webcomponents';

  const select = document.getElementById('mySelect');
  select.options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' }
  ];
</script>
```

## TypeScript Usage

```typescript
import { SmartSelectElement, SelectOption } from '@liwe3/webcomponents';

const select = document.getElementById('mySelect') as SmartSelectElement;

const options: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' }
];

select.options = options;
```

## Properties

### `options`
- **Type:** `SelectOption[]`
- **Default:** `[]`

Array of options to display in the dropdown.

```typescript
type SelectOption = {
  value: string;
  label: string;
};
```

**Example:**
```typescript
select.options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' }
];
```

### `value`
- **Type:** `string | string[]`
- **Default:** `''` (single mode) or `[]` (multiple mode)

The currently selected value(s). Returns a single string in single-select mode, or an array of strings in multi-select mode.

**Example:**
```typescript
// Single select
select.value = 'apple';
console.log(select.value); // 'apple'

// Multiple select
select.multiple = true;
select.value = ['apple', 'banana'];
console.log(select.value); // ['apple', 'banana']
```

### `multiple`
- **Type:** `boolean`
- **Default:** `false`

Enable multiple selection mode.

**Example:**
```typescript
select.multiple = true;
```

**HTML Attribute:**
```html
<liwe3-select multiple></liwe3-select>
```

### `searchable`
- **Type:** `boolean`
- **Default:** `false`

Enable search/filter functionality.

**Example:**
```typescript
select.searchable = true;
```

**HTML Attribute:**
```html
<liwe3-select searchable></liwe3-select>
```

### `placeholder`
- **Type:** `string`
- **Default:** `'Select an option'`

Placeholder text displayed when no option is selected.

**Example:**
```typescript
select.placeholder = 'Choose a fruit...';
```

**HTML Attribute:**
```html
<liwe3-select placeholder="Choose a fruit..."></liwe3-select>
```

### `disabled`
- **Type:** `boolean`
- **Default:** `false`

Disable the select component.

**Example:**
```typescript
select.disabled = true;
```

**HTML Attribute:**
```html
<liwe3-select disabled></liwe3-select>
```

## Methods

### `open()`

Opens the dropdown menu.

**Example:**
```typescript
select.open();
```

**Source:** `SmartSelect.ts:128`

---

### `close()`

Closes the dropdown menu.

**Example:**
```typescript
select.close();
```

**Source:** `SmartSelect.ts:156`

---

### `toggle()`

Toggles the dropdown open/closed state.

**Example:**
```typescript
select.toggle();
```

**Source:** `SmartSelect.ts:182`

---

### `selectOption(value: string)`

Selects an option by its value. In single-select mode, this also closes the dropdown.

**Parameters:**
- `value` - The value of the option to select

**Example:**
```typescript
select.selectOption('apple');
```

**Source:** `SmartSelect.ts:193`

---

### `deselectOption(value: string)`

Deselects an option by its value (useful in multi-select mode).

**Parameters:**
- `value` - The value of the option to deselect

**Example:**
```typescript
select.deselectOption('apple');
```

**Source:** `SmartSelect.ts:213`

---

### `getSelectedOptions(): SelectOption[]`

Returns an array of currently selected option objects.

**Returns:** `SelectOption[]`

**Example:**
```typescript
const selected = select.getSelectedOptions();
console.log(selected); // [{ value: 'apple', label: 'Apple' }]
```

**Source:** `SmartSelect.ts:222`

---

### `setOptions(options: SelectOption[])`

Sets the options and clears the current selection.

**Parameters:**
- `options` - Array of options

**Example:**
```typescript
select.setOptions([
  { value: 'new1', label: 'New Option 1' },
  { value: 'new2', label: 'New Option 2' }
]);
```

**Source:** `SmartSelect.ts:229`

## Events

### `change`

Fired when the selection changes.

**Detail:**
```typescript
{
  value: string | string[]
}
```

**Example:**
```typescript
select.addEventListener('change', (e) => {
  console.log('Selected:', e.detail.value);
});
```

**Source:** `SmartSelect.ts:207`, `SmartSelect.ts:216`

---

### `open`

Fired when the dropdown opens.

**Example:**
```typescript
select.addEventListener('open', () => {
  console.log('Dropdown opened');
});
```

**Source:** `SmartSelect.ts:150`

---

### `close`

Fired when the dropdown closes.

**Example:**
```typescript
select.addEventListener('close', () => {
  console.log('Dropdown closed');
});
```

**Source:** `SmartSelect.ts:176`

---

### `search`

Fired when the user types in the search input (only when `searchable` is enabled).

**Detail:**
```typescript
{
  query: string
}
```

**Example:**
```typescript
select.addEventListener('search', (e) => {
  console.log('Search query:', e.detail.query);
});
```

**Source:** `SmartSelect.ts:246`

## Keyboard Navigation

The SmartSelect component supports full keyboard navigation:

| Key | Action |
|-----|--------|
| `ArrowDown` | Open dropdown (if closed) or move focus to next option |
| `ArrowUp` | Move focus to previous option, or back to search input |
| `Enter` | Select the focused option or open dropdown (if closed) |
| `Escape` | Close the dropdown |
| `Tab` | Close the dropdown and move to next focusable element |

When `searchable` is enabled:
- Typing in the search input filters options in real-time
- `ArrowDown` from search input moves focus to the first option
- `ArrowUp` on first option returns focus to search input

**Source:** `SmartSelect.ts:360-448`

## CSS Custom Properties

You can customize the appearance using CSS variables:

```css
liwe3-select {
  /* General */
  --font-family: 'Your Font', sans-serif;
  --font-size: 14px;

  /* Trigger (main button) */
  --padding: 8px 12px;
  --border: 1px solid #ccc;
  --border-radius: 4px;
  --background: white;
  --focus-color: #007bff;

  /* Tags (multi-select) */
  --tag-background: #e9ecef;
  --tag-border-radius: 12px;
  --tag-color: #495057;
  --remove-color: #6c757d;
  --remove-hover-color: #dc3545;

  /* Arrow */
  --arrow-color: #666;

  /* Dropdown */
  --dropdown-background: white;
  --dropdown-border: 1px solid #ccc;
  --dropdown-border-radius: 4px;
  --dropdown-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Options */
  --option-color: #333;
  --option-hover-background: #f8f9fa;
  --option-focused-background: #007bff;
  --option-focused-color: white;
  --option-selected-background: #e3f2fd;
  --option-selected-color: #1976d2;
  --no-options-color: #6c757d;
}
```

## Features

### Fixed Positioning

The dropdown uses `position: fixed` with intelligent viewport detection to ensure it's always visible and properly positioned, even when the trigger element is near screen edges or inside scrollable containers.

**Source:** `SmartSelect.ts:295-355`

### Search Filtering

When `searchable` is enabled, users can type to filter options. The search is case-insensitive and matches against the option labels.

**Example:**
```html
<liwe3-select searchable></liwe3-select>
```

**Source:** `SmartSelect.ts:239-247`

### Multi-Select Mode

In multi-select mode, selected options are displayed as removable tags, and clicking an option doesn't close the dropdown.

**Example:**
```html
<liwe3-select multiple></liwe3-select>
```

**Source:** `SmartSelect.ts:196-208`

### Automatic Scrolling

When navigating with keyboard, the component automatically scrolls the focused option into view.

**Source:** `SmartSelect.ts:269-290`

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SmartSelect Example</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 20px;
    }

    liwe3-select {
      --focus-color: #4f46e5;
      --option-focused-background: #4f46e5;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>SmartSelect Examples</h1>

  <h2>Single Select</h2>
  <liwe3-select
    id="single"
    placeholder="Choose a fruit..."
  ></liwe3-select>
  <p>Selected: <span id="singleValue">None</span></p>

  <h2>Multiple Select with Search</h2>
  <liwe3-select
    id="multiple"
    multiple
    searchable
    placeholder="Choose fruits..."
  ></liwe3-select>
  <p>Selected: <span id="multipleValue">None</span></p>

  <script type="module">
    import '@liwe3/webcomponents';

    const fruits = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
      { value: 'elderberry', label: 'Elderberry' },
      { value: 'fig', label: 'Fig' },
      { value: 'grape', label: 'Grape' }
    ];

    // Single select
    const single = document.getElementById('single');
    single.options = fruits;
    single.addEventListener('change', (e) => {
      document.getElementById('singleValue').textContent = e.detail.value;
    });

    // Multiple select
    const multiple = document.getElementById('multiple');
    multiple.options = fruits;
    multiple.addEventListener('change', (e) => {
      document.getElementById('multipleValue').textContent =
        Array.isArray(e.detail.value)
          ? e.detail.value.join(', ')
          : e.detail.value;
    });
  </script>
</body>
</html>
```

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Related Components

- [AITextEditor](./AITextEditor.md)
- [Toast](./Toast.md)
- [PopoverMenu](./PopoverMenu.md)
