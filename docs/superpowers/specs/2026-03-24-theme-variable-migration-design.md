# Theme Variable Migration — Design Spec

## Goal

Replace all hardcoded hex colors and per-component CSS custom properties in `packages/core/src/*.ts` with semantic `--liwe3-*` variables. Then create a CSS bridge file that maps `--liwe3-*` → `--wox-*` for WoxGUI integration.

## Decisions

- **All** per-component CSS variables (`--toast-*`, `--popover-menu-*`, `--tree-*`, `--drawer-*`, `--sortable-*`, `--container-box-*`, `--dialog-*`) are removed and replaced with `--liwe3-*` vars directly.
- Raw hex colors are replaced with the closest `--liwe3-*` semantic variable.
- A small set of new variables is added to `variables.css` to cover gaps (shadows, scrollbar).
- The WoxGUI bridge is a separate optional CSS file.

## New Variables

The following tinted status variables **already exist** in `variables.css` (lines 461-467) and will be used as-is:
- `--liwe3-success-light`, `--liwe3-success-dark`
- `--liwe3-warning-light`, `--liwe3-warning-dark`
- `--liwe3-error-light`, `--liwe3-error-dark`

The variable `--liwe3-info-light` also already exists (line 279, maps to `--liwe3-mode1-300`).

**Genuinely new variables** to add to `variables.css`:

| Variable | Light Mode | Dark Mode | Purpose |
|---|---|---|---|
| `--liwe3-shadow` | `0 2px 8px rgba(0,0,0,0.1)` | `0 2px 8px rgba(0,0,0,0.4)` | Component drop shadows |
| `--liwe3-shadow-lg` | `0 4px 16px rgba(0,0,0,0.15)` | `0 4px 16px rgba(0,0,0,0.5)` | Larger shadows (dropdowns, modals) |
| `--liwe3-scrollbar-track` | `var(--liwe3-gray-100)` | `var(--liwe3-gray-800)` | Scrollbar track |
| `--liwe3-scrollbar-thumb` | `var(--liwe3-gray-400)` | `var(--liwe3-gray-600)` | Scrollbar thumb |

## Per-Component Migration

### No changes needed

- **ButtonToolbar** — fully themed with `--liwe3-*` vars.
- **ImageView** — no color-related CSS (only `filter: blur` and `object-fit`).

### Minor fixes (already use `--liwe3-*`)

**SmartSelect**
- Remove bare `#ccc` hex fallbacks from border declarations (e.g. line 719).
- Fix semantic misuse: line 651 uses `--liwe3-background` for a border color — change to `--liwe3-border-default`.
- Migrate focus ring `rgba(0, 123, 255, 0.25)` to `--liwe3-focus-ring`.

**Dialog** — Remove `--dialog-*` intermediary layer. Collapse all `var(--dialog-X, var(--liwe3-Y, #hex))` chains to just `var(--liwe3-Y)`.

**DateSelector** — Minor fallback cleanup; already well-themed.

### Components needing full migration

**Toast**
- **Implementation note:** `getTypeColors()` returns JS-interpolated strings, not CSS var chains. The migration must rewrite this method to return `var(--liwe3-*)` strings (e.g. `background: 'var(--liwe3-success-light)'`) so the template literal injects CSS variable references instead of resolved hex values.
- Success: bg → `--liwe3-success-light`, border → `--liwe3-success`, icon → `--liwe3-success`
- Error: bg → `--liwe3-error-light`, border → `--liwe3-error`, icon → `--liwe3-error`
- Warning: bg → `--liwe3-warning-light`, border → `--liwe3-warning`, icon → `--liwe3-warning`
- Info: bg → `--liwe3-info-light`, border → `--liwe3-info`, icon → `--liwe3-info`
- Title text → `--liwe3-text-mode1`
- Body text → `--liwe3-text-mode2`
- Close button → `--liwe3-text-mode3`, hover → `--liwe3-text-mode1`
- Action buttons: bg → `--liwe3-surface-raised`, border → `--liwe3-border-default`, text → `--liwe3-text-mode1`, hover bg → `--liwe3-surface-mode1`

**PopoverMenu**
- Bar bg → `--liwe3-surface-raised`, border → `--liwe3-border-default`
- Trigger text → `--liwe3-text-mode1`, hover bg → `--liwe3-surface-mode1`
- Active trigger bg → `--liwe3-mode1-300`, color → `--liwe3-color-mode4`
- Item text → `--liwe3-text-mode1`, hover bg → `--liwe3-surface-mode1`
- Disabled text → `--liwe3-text-disabled`
- Submenu arrow → `--liwe3-text-mode3`
- Separator → `--liwe3-border-default`
- Dropdown border → `--liwe3-border-default`

**CheckList**
- Background → `--liwe3-surface-raised`
- Text → `--liwe3-text-mode1`
- Primary/checked → `--liwe3-color-mode4`
- Unchecked border → `--liwe3-border-strong`
- Input border → `--liwe3-border-default`, focus → `--liwe3-color-mode4`
- Placeholder → `--liwe3-text-mode3`
- Disabled/done text → `--liwe3-text-disabled`
- Delete icon → `--liwe3-error`
- Separator → `--liwe3-surface-mode1`
- Drag handle → `--liwe3-text-mode3`
- Empty state → `--liwe3-border-default` bg

**TreeView**
- Text → `--liwe3-text-mode1`
- Focus outline → `--liwe3-color-mode4`
- Icon fill → `--liwe3-text-mode3`
- Checkbox border → `--liwe3-border-default`
- Checkbox checked bg/border → `--liwe3-color-mode4`
- Checkbox hover border → `--liwe3-border-strong`
- Label hover color → `--liwe3-color-mode4`
- Empty text → `--liwe3-text-disabled`
- Scrollbar track → `--liwe3-scrollbar-track`
- Scrollbar thumb → `--liwe3-scrollbar-thumb`

**ContainerBox**
- Shadow DOM menu: bg → `--liwe3-surface-raised`, border → `--liwe3-border-default`, text → `--liwe3-text-mode1`, hover → `--liwe3-surface-mode1`
- **Light-DOM popover** (`createAndShowPopover()`): This method creates a `<style>` block with hardcoded colors (`white`, `#ccc`, `#333`, `#f5f5f5`, `#666`, `#e0e0e0`). All must be migrated to `--liwe3-*` vars: bg → `--liwe3-surface-raised`, border → `--liwe3-border-default`, text → `--liwe3-text-mode1`, hover → `--liwe3-surface-mode1`, secondary text → `--liwe3-text-mode3`, separator → `--liwe3-border-default`.
- Handle bar border → `--liwe3-border-default`
- Handle text → `--liwe3-text-mode1`
- Handle hover bg → `--liwe3-surface-mode1`
- Separator → `--liwe3-text-mode3`
- Drag handle → `--liwe3-border-default`

**MarkdownPreview**
- Text → `--liwe3-text-mode1`
- Code bg → `--liwe3-surface-mode1`
- Blockquote border → `--liwe3-border-default`, color → `--liwe3-text-mode3`
- Table border → `--liwe3-border-subtle`
- Table header bg → `--liwe3-surface-mode1`
- Table bg → `--liwe3-surface-raised`

**AITextEditor**
- Input border → `--liwe3-border-default`, bg → `--liwe3-surface-raised`
- Focus border → `--liwe3-color-mode4`
- Ghost text → `--liwe3-text-disabled`
- Suggestion text → `--liwe3-text-mode2`
- Spinner → `--liwe3-text-mode3`, spinner top border → `--liwe3-color-mode4`
- Status indicator: active → `--liwe3-success`, inactive → `--liwe3-text-disabled`

**AIMarkdownEditor**
- Same as AITextEditor mappings
- Toolbar bg → `--liwe3-surface-mode1`, border → `--liwe3-border-default`
- Toolbar button text → `--liwe3-text-mode1`
- Active button bg → `--liwe3-color-mode4`
- Toolbar button hover → `--liwe3-surface-mode2`

**Drawer**
- Remove `--drawer-*` variable declarations from `:host`
- Bg → `--liwe3-surface-raised`, border → `--liwe3-border-default`
- Text → `--liwe3-text-mode1`
- Icon bg → `--liwe3-surface-mode1`, hover → `--liwe3-surface-mode2`
- Button hover → `--liwe3-surface-mode1`
- Secondary text → `--liwe3-text-mode3`
- Danger → `--liwe3-error`

**ChunkUploader**
- Dropzone border → `--liwe3-border-default`, bg → `--liwe3-surface-raised`
- Active state border/bg → `--liwe3-success` / `--liwe3-success-light`
- Upload button bg → `--liwe3-success`, hover → darker via oklch
- File item border → `--liwe3-border-default`
- File name → `--liwe3-text-mode1`, size → `--liwe3-text-mode3`
- Separator → `--liwe3-border-default`
- Progress bar: success → `--liwe3-success`, error → `--liwe3-error`, uploading → `--liwe3-warning`
- Status text: completed → `--liwe3-success`, error → `--liwe3-error`, pending → `--liwe3-text-mode3`
- Cancel/retry buttons: cancel → `--liwe3-error`, retry → `--liwe3-success`

**SortableContainer**
- **Implementation note:** Styles are applied via inline JS (`handle.style.color = 'var(...)'`), not through a shadow stylesheet. The migration changes the `var()` references in these inline style assignments.
- Handle color → `--liwe3-text-mode3`, hover → `--liwe3-text-mode1`
- Drag indicator → `--liwe3-color-mode4`

**ResizableCropper**
- Selection border → `--liwe3-color-mode4`
- Handle bg → `--liwe3-color-mode4`

**ComicBalloon**
- Border/stroke → `--liwe3-text-mode1`
- Placeholder text → `--liwe3-text-disabled`
- Dashed border (editing) → `--liwe3-text-mode1`

## WoxGUI Bridge File

New file: `packages/core/src/wox-theme-bridge.css`

This file is imported **instead of** `variables.css` when using WoxGUI theming. It does not require `[data-theme]` since WoxGUI handles its own light/dark switching.

**Known limitations:**
- WoxGUI has no `--wox-warning` or `--wox-info` variables. The bridge uses hardcoded fallback values for these.
- WoxGUI has only one secondary text color (`--wox-text-secondary`), so `--liwe3-text-mode2`, `--liwe3-text-mode3`, and `--liwe3-text-disabled` all map to it. This reduces visual hierarchy slightly.
- Palette step variables (`--liwe3-mode1-300`, `--liwe3-mode4-500`, etc.) are approximated using the accent color at different opacities.

```css
:root {
  /* Backgrounds */
  --liwe3-background:      var(--wox-bg-app);
  --liwe3-surface-raised:  var(--wox-bg-panel);
  --liwe3-surface-mode1:   var(--wox-bg-input);
  --liwe3-surface-mode2:   var(--wox-bg-hover);
  --liwe3-surface-mode3:   var(--wox-bg-toolbar);
  --liwe3-surface-overlay:  rgba(0, 0, 0, 0.6);

  /* Text */
  --liwe3-text-mode1:      var(--wox-text-primary);
  --liwe3-text-mode2:      var(--wox-text-secondary);
  --liwe3-text-mode3:      var(--wox-text-secondary);
  --liwe3-text-inverse:    var(--wox-text-hi);
  --liwe3-text-disabled:   var(--wox-text-secondary);
  --liwe3-color:           var(--wox-text-primary);

  /* Accent / Semantic */
  --liwe3-color-mode1:     var(--wox-accent);
  --liwe3-color-mode4:     var(--wox-accent);
  --liwe3-success:         var(--wox-success);
  --liwe3-error:           var(--wox-danger);
  --liwe3-warning:         #f59e0b;
  --liwe3-info:            var(--wox-accent);

  /* Tinted status backgrounds */
  --liwe3-success-light:   oklch(from var(--wox-success) calc(l + 0.2) calc(c * 0.7) h);
  --liwe3-error-light:     oklch(from var(--wox-danger) calc(l + 0.2) calc(c * 0.7) h);
  --liwe3-warning-light:   oklch(from #f59e0b calc(l + 0.15) calc(c * 0.7) h);
  --liwe3-info-light:      oklch(from var(--wox-accent) calc(l + 0.2) calc(c * 0.3) h);

  /* Borders */
  --liwe3-border-default:  var(--wox-border);
  --liwe3-border-subtle:   var(--wox-border);
  --liwe3-border-strong:   var(--wox-border-light);
  --liwe3-border-width:    1px;

  /* Shadows */
  --liwe3-shadow:          var(--wox-shadow-sm);
  --liwe3-shadow-lg:       var(--wox-shadow-md);

  /* Typography */
  --liwe3-font-family:     var(--wox-font);
  --liwe3-font-size:       var(--wox-font-size-base);

  /* Spacing / Radius */
  --liwe3-border-radius:   var(--wox-radius-md);

  /* Palette step approximations */
  --liwe3-mode1-300:       oklch(from var(--wox-accent) calc(l + 0.2) calc(c * 0.7) h);
  --liwe3-mode4-200:       oklch(from var(--wox-accent) calc(l + 0.25) calc(c * 0.6) h);
  --liwe3-mode4-500:       var(--wox-accent);
  --liwe3-mode1-500:       var(--wox-accent);

  /* Interactive overlays */
  --liwe3-hover-overlay:   oklch(from var(--wox-accent) l c h / 0.08);
  --liwe3-active-overlay:  oklch(from var(--wox-accent) l c h / 0.12);
  --liwe3-focus-ring:      oklch(from var(--wox-accent) l c h / 0.5);

  /* Scrollbar */
  --liwe3-scrollbar-track: var(--wox-bg-input);
  --liwe3-scrollbar-thumb: var(--wox-border-light);
}
```

## Files Changed

1. `packages/core/demos/theme/variables.css` — add 4 new variables (shadow, scrollbar) in both light + dark blocks
2. `packages/core/src/Toast.ts` — full migration (rewrite `getTypeColors()`)
3. `packages/core/src/PopoverMenu.ts` — full migration
4. `packages/core/src/CheckList.ts` — full migration
5. `packages/core/src/TreeView.ts` — full migration
6. `packages/core/src/ContainerBox.ts` — full migration (includes light-DOM popover)
7. `packages/core/src/MarkdownPreview.ts` — full migration
8. `packages/core/src/AITextEditor.ts` — full migration
9. `packages/core/src/AIMarkdownEditor.ts` — full migration
10. `packages/core/src/Drawer.ts` — full migration
11. `packages/core/src/ChunkUploader.ts` — full migration
12. `packages/core/src/SortableContainer.ts` — full migration (inline JS styles)
13. `packages/core/src/ResizableCropper.ts` — full migration
14. `packages/core/src/ComicBalloon.ts` — full migration
15. `packages/core/src/SmartSelect.ts` — fix semantic misuse + cleanup
16. `packages/core/src/Dialog.ts` — remove `--dialog-*` intermediary
17. `packages/core/src/DateSelector.ts` — minor fallback cleanup
18. `packages/core/src/wox-theme-bridge.css` — new file

No changes: `ImageView.ts` (no color CSS), `ButtonToolbar.ts` (fully themed).

## Out of Scope

- Changing the existing OKLch color space calculations in `variables.css`
- Adding new components
- Modifying Svelte wrappers (they delegate styling to core)
- Changing component behavior or DOM structure
