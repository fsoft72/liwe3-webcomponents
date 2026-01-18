# @liwe3/webcomponents-svelte - LLM Reference

Svelte 5 wrappers for @liwe3/webcomponents. Requires Svelte 5+ with runes.

## Installation

```bash
pnpm add @liwe3/webcomponents @liwe3/webcomponents-svelte
```

## Components

### SmartSelect

Advanced dropdown with search, multi-select, keyboard navigation.

```svelte
<script lang="ts">
  import { SmartSelect, type SelectOption } from '@liwe3/webcomponents-svelte';

  let value = $state<string | string[]>('');
  const options: SelectOption[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B', disabled: true }
  ];
</script>

<SmartSelect
  bind:value
  {options}
  multiple={false}
  searchable={true}
  placeholder="Select..."
  disabled={false}
  onchange={(v) => console.log(v)}
  onsearch={(query) => console.log(query)}
  onopen={(e) => {}}
  onclose={(e) => {}}
/>
```

**Methods:** `open()`, `close()`, `toggle()`, `selectOption(value)`, `deselectOption(value)`, `getSelectedOptions()`, `setOptions(options)`

---

### AITextEditor

Text editor with AI-powered suggestions (OpenAI-compatible API).

```svelte
<script lang="ts">
  import { AITextEditor } from '@liwe3/webcomponents-svelte';

  let value = $state('');
</script>

<AITextEditor
  bind:value
  apiKey="sk-..."
  suggestionDelay={3000}
  systemPrompt="You are a helpful assistant..."
  apiEndpoint="https://api.openai.com/v1/chat/completions"
  modelName="gpt-3.5-turbo"
  placeholder="Start writing..."
  onchange={(v) => {}}
  onbeforesuggestion={(data) => false}
  oncompletionerror={(error) => {}}
/>
```

**Methods:** `setText(text)`, `getText()`, `setContext(ctx)`, `getContext()`, `setSystemPrompt(prompt)`, `getSystemPrompt()`, `setApiKey(key)`, `getApiKey()`, `setSuggestionDelay(sec)`, `getSuggestionDelay()`, `setApiEndpoint(url)`, `getApiEndpoint()`, `setModelName(model)`, `getModelName()`

---

### AIMarkdownEditor

Markdown editor with AI suggestions and live preview.

```svelte
<script lang="ts">
  import { AIMarkdownEditor } from '@liwe3/webcomponents-svelte';

  let value = $state('');
</script>

<AIMarkdownEditor
  bind:value
  apiKey="sk-..."
  suggestionDelay={3000}
  systemPrompt="..."
  apiEndpoint="https://api.openai.com/v1/chat/completions"
  modelName="gpt-3.5-turbo"
  context=""
  onchange={(v) => {}}
  onbeforesuggestion={(data) => false}
/>
```

**Methods:** Same as AITextEditor.

---

### MarkdownPreview

Renders markdown to HTML using marked.js.

```svelte
<script lang="ts">
  import { MarkdownPreview } from '@liwe3/webcomponents-svelte';
</script>

<MarkdownPreview
  value="# Hello **World**"
  libUrl="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js"
  onlibraryloaded={() => {}}
/>
```

---

### Toasts

Global toast notifications. Add `<Toasts />` once in layout.

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import { Toasts } from '@liwe3/webcomponents-svelte';
</script>

<Toasts />
<slot />
```

```svelte
<!-- Any component -->
<script lang="ts">
  import { toastAdd } from '@liwe3/webcomponents-svelte';

  const showToast = () => {
    toastAdd({
      title: 'Success!',
      text: 'Saved.',
      type: 'success', // 'success' | 'error' | 'warning' | 'info'
      duration: 5000,
      position: 'TR' // TL | T | TR | BL | B | BR
    });
  };
</script>
```

---

### Dialogs

Modal dialogs. Add `<Dialogs />` once in layout.

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import { Dialogs } from '@liwe3/webcomponents-svelte';
</script>

<Dialogs />
<slot />
```

```svelte
<!-- Any component -->
<script lang="ts">
  import { dialogAdd } from '@liwe3/webcomponents-svelte';

  const showDialog = () => {
    const dialog = dialogAdd({
      title: 'Confirm',
      body: '<p>Are you sure?</p>',
      buttons: [
        { label: 'Yes', backgroundColor: '#28a745', onclick: () => dialog?.close() },
        { label: 'No', onclick: () => dialog?.close() }
      ],
      modal: true,
      escToClose: true,
      clickToClose: true
    });
  };
</script>
```

---

### DateSelector

Calendar date picker with single or range mode.

```svelte
<script lang="ts">
  import { DateSelector, type DateRange } from '@liwe3/webcomponents-svelte';

  let selectedDate = $state<string | null>(null);
  let selectedRange = $state<DateRange>({ start: null, end: null });
</script>

<!-- Single date -->
<DateSelector
  bind:selectedDate
  rangeMode={false}
  ondateselected={(date) => console.log(date)}
/>

<!-- Range mode -->
<DateSelector
  bind:selectedRange
  rangeMode={true}
  onrangeselected={(range) => console.log(range)}
/>
```

**Methods:** `setDate(dateStr)`, `setRange(start, end)`, `getSelectedDate()`, `getSelectedRange()`, `clear()`

---

### TreeView

Hierarchical tree with expand/collapse and selection.

```svelte
<script lang="ts">
  import { TreeView, type TreeNode } from '@liwe3/webcomponents-svelte';

  let data = $state<TreeNode[]>([
    { id: '1', label: 'Root', children: [
      { id: '1.1', label: 'Child' }
    ]}
  ]);
  let selectedIds = $state<string[]>([]);
</script>

<TreeView
  bind:data
  bind:selectedIds
  indentWidth={20}
  onselectionchange={(ids) => {}}
  ontoggle={(e) => {}}
  onitemselected={(e) => {}}
/>
```

**Methods:** `toggleExpansion(nodeId)`, `toggleSelection(nodeId)`, `selectAll()`, `deselectAll()`, `expandAll()`, `collapseAll()`

---

### Drawer

Collapsible drawer/sidebar panel.

```svelte
<script lang="ts">
  import { Drawer } from '@liwe3/webcomponents-svelte';

  let state = $state<'expanded' | 'shrunk' | 'closed'>('expanded');
</script>

<Drawer
  bind:state
  direction="horizontal"
  duration={300}
  title="Menu"
  icon="☰"
  closable={true}
  showTitleWhenShrunk={false}
  showToggleButton={true}
  contentPadding="16px"
  onstatechange={(e) => {}}
  onexpanded={(e) => {}}
  onshrunk={(e) => {}}
  onclosed={(e) => {}}
>
  <p>Drawer content</p>
</Drawer>
```

**Methods:** `expand()`, `shrink()`, `close()`, `toggle()`, `getState()`, `setState(state)`

---

### PopoverMenu

Context menu triggered on hover/click.

```svelte
<script lang="ts">
  import { PopoverMenu, type PopoverMenuConfig } from '@liwe3/webcomponents-svelte';

  const items: PopoverMenuConfig[] = [
    { label: 'Edit', action: () => console.log('edit') },
    { label: 'Delete', action: () => console.log('delete') }
  ];
</script>

<PopoverMenu {items} />
```

**Methods:** `setItems(items)`, `getItems()`, `addMenuItem(item, index?)`, `removeMenuItem(index)`, `updateMenuItem(index, item)`

---

### ContainerBox

Box with optional hover menu.

```svelte
<script lang="ts">
  import { ContainerBox, type PopoverMenuItem } from '@liwe3/webcomponents-svelte';

  const menuItems: PopoverMenuItem[] = [
    { label: 'Action', action: () => {} }
  ];
</script>

<ContainerBox
  menuPosition="bottom-left"
  {menuItems}
  alwaysShowMenu={false}
>
  <p>Content here</p>
</ContainerBox>
```

---

### ButtonToolbar

Grouped toolbar buttons.

```svelte
<script lang="ts">
  import { ButtonToolbar, type ButtonToolbarGroup } from '@liwe3/webcomponents-svelte';

  const groups: ButtonToolbarGroup[] = [
    {
      items: [
        { id: 'bold', icon: 'B', action: 'bold' },
        { id: 'italic', icon: 'I', action: 'italic' }
      ]
    }
  ];
</script>

<ButtonToolbar
  {groups}
  orientation="horizontal"
  onbuttonclick={({ id, action }) => console.log(id, action)}
/>
```

---

### CheckList

Interactive checklist with add/remove.

```svelte
<script lang="ts">
  import { CheckList, type CheckListItem } from '@liwe3/webcomponents-svelte';

  let items = $state<CheckListItem[]>([
    { id: '1', text: 'Task 1', checked: false },
    { id: '2', text: 'Task 2', checked: true }
  ]);
</script>

<CheckList
  title="Todo"
  {items}
  onchange={(newItems) => items = newItems}
/>
```

---

### ChunkUploader

Multi-part file uploader with progress.

```svelte
<script lang="ts">
  import { ChunkUploader, type ChunkFileEvent } from '@liwe3/webcomponents-svelte';
</script>

<ChunkUploader
  serverURL="https://api.example.com/upload"
  chunkSize={5}
  authToken="Bearer ..."
  validFiletypes={['image/*', '.pdf']}
  maxFileSize={5120}
  labelDropFiles="Drop files here"
  labelBrowse="Browse"
  folder="uploads"
  onfilecomplete={(file: ChunkFileEvent) => console.log(file)}
  onuploadcomplete={(files) => console.log(files)}
  onuploadaborted={(files) => console.log(files)}
  parseResponse={(res, endpoint) => res}
/>
```

---

### ResizableCropper

Resizable/croppable container.

```svelte
<script lang="ts">
  import { ResizableCropper, type ResizableCropperValues } from '@liwe3/webcomponents-svelte';

  let cropperRef: ReturnType<typeof ResizableCropper>;
</script>

<ResizableCropper
  bind:this={cropperRef}
  width={200}
  height={150}
  minWidth={50}
  minHeight={50}
  aspectRatio="16:9"
  disabled={false}
  allowCrop={true}
  allowResize={true}
  onchange={(values) => console.log(values)}
>
  <img src="image.jpg" alt="Crop me" />
</ResizableCropper>
```

**Methods:** `getValues()`, `setValues(values)`

---

## Types

All types are re-exported from `@liwe3/webcomponents`:

```ts
import type {
  SelectOption,
  AITextEditorConfig,
  ToastType,
  ToastButton,
  ToastConfig,
  ToastElement,
  DialogButton,
  DialogConfig,
  DialogElement,
  PopoverMenuItem,
  PopoverMenuConfig,
  DateRange,
  TreeNode,
  UploadedFile,
  ChunkUploaderConfig,
  CheckListItem,
  ButtonToolbarItem,
  ButtonToolbarGroup,
  ResizableCropperValues
} from '@liwe3/webcomponents-svelte';
```
