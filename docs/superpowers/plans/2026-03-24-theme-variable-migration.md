# Theme Variable Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded hex colors and **color-related** per-component CSS custom properties in `packages/core/src/*.ts` with semantic `--liwe3-*` variables, then create a WoxGUI bridge CSS file.

**Architecture:** Each component's inline CSS (template literals in Shadow DOM) gets its hex color values and color-related `--component-*` vars replaced with `--liwe3-*` semantic vars. A new `wox-theme-bridge.css` maps `--liwe3-*` → `--wox-*` for optional WoxGUI integration.

**Tech Stack:** TypeScript, CSS custom properties, Shadow DOM, Vite

**Spec:** `docs/superpowers/specs/2026-03-24-theme-variable-migration-design.md`

**Important notes:**
- Line numbers are approximate — search for the CSS string patterns when editing.
- `--liwe3-info-light` already exists in `variables.css` (line 279, maps to `--liwe3-mode1-300`).
- The final hex audit in Task 12 is the definitive completeness check.

## Scope Rules

**Migrate:** All hardcoded hex colors, `rgba()` colors, and color-related `--component-*` CSS variables (backgrounds, text colors, border colors, shadows, icon colors).

**Keep as-is:** Structural/sizing `--component-*` variables (padding, border-radius, font-size, font-family, gap, min-width, offset, etc.). These provide per-component layout customization and are NOT theme colors.

Examples of variables to **keep**:
- `--toast-border-radius`, `--popover-menu-bar-radius`, `--tree-padding`, `--tree-border-radius`, `--tree-font-size`, `--tree-font-family`, `--tree-node-border-radius`, `--drawer-horizontal-size`, `--drawer-vertical-size`, `--drawer-content-padding`, `--container-box-menu-radius`, `--container-box-menu-padding`, `--container-box-menu-offset`, `--tree-custom-icon-size`, `--tree-label-font-weight`, `--popover-menu-bar-padding`, `--popover-menu-radius`, `--toast-button-border-radius`, `--tree-checkbox-border-radius`

## Out of Scope

- Changing the existing OKLch color space calculations in `variables.css`
- Adding new components
- Modifying Svelte wrappers (they delegate styling to core)
- Changing component behavior or DOM structure
- Migrating structural/sizing `--component-*` CSS variables

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `packages/core/demos/theme/variables.css` | Add 4 new variables (shadow, scrollbar) |
| Modify | `packages/core/src/SmartSelect.ts` | Fix semantic misuse + cleanup hex fallbacks |
| Modify | `packages/core/src/Dialog.ts` | Remove `--dialog-*` intermediary layer |
| Modify | `packages/core/src/DateSelector.ts` | Minor fallback cleanup |
| Modify | `packages/core/src/Toast.ts` | Full migration, rewrite `getTypeColors()` |
| Modify | `packages/core/src/PopoverMenu.ts` | Full migration |
| Modify | `packages/core/src/ContainerBox.ts` | Full migration + light-DOM popover |
| Modify | `packages/core/src/CheckList.ts` | Full migration |
| Modify | `packages/core/src/TreeView.ts` | Full migration |
| Modify | `packages/core/src/MarkdownPreview.ts` | Full migration |
| Modify | `packages/core/src/AITextEditor.ts` | Full migration |
| Modify | `packages/core/src/AIMarkdownEditor.ts` | Full migration |
| Modify | `packages/core/src/Drawer.ts` | Full migration |
| Modify | `packages/core/src/ChunkUploader.ts` | Full migration |
| Modify | `packages/core/src/SortableContainer.ts` | Full migration (inline JS styles) |
| Modify | `packages/core/src/ResizableCropper.ts` | Full migration |
| Modify | `packages/core/src/ComicBalloon.ts` | Full migration |
| Create | `packages/core/src/wox-theme-bridge.css` | WoxGUI ↔ liwe3 variable mapping |
| No change | `packages/core/src/ButtonToolbar.ts` | Already fully themed |
| No change | `packages/core/src/ImageView.ts` | No color CSS |

---

### Task 1: Add new variables to `variables.css`

**Files:**
- Modify: `packages/core/demos/theme/variables.css`

- [ ] **Step 1: Add shadow and scrollbar variables to the light mode `:root` block**

Find the existing `:root` block that contains the semantic variables (around line 262-293, after `--liwe3-surface-*` and `--liwe3-border-*` definitions). Add after the `--liwe3-focus-ring` line:

```css
--liwe3-shadow: 0 2px 8px rgba(0,0,0,0.1);
--liwe3-shadow-lg: 0 4px 16px rgba(0,0,0,0.15);
--liwe3-scrollbar-track: var(--liwe3-gray-100);
--liwe3-scrollbar-thumb: var(--liwe3-gray-400);
```

- [ ] **Step 2: Add dark mode overrides in `[data-theme="dark"]` block**

Find the `[data-theme="dark"]` block (starts around line 298). Add after the `--liwe3-button-border-mode4` line:

```css
--liwe3-shadow: 0 2px 8px rgba(0,0,0,0.4);
--liwe3-shadow-lg: 0 4px 16px rgba(0,0,0,0.5);
--liwe3-scrollbar-track: var(--liwe3-gray-800);
--liwe3-scrollbar-thumb: var(--liwe3-gray-600);
```

- [ ] **Step 3: Build to verify**

Run: `cd packages/core && pnpm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/core/demos/theme/variables.css
git commit -m "feat: add shadow and scrollbar theme variables to variables.css"
```

---

### Task 2: Migrate SmartSelect (minor fixes)

**Files:**
- Modify: `packages/core/src/SmartSelect.ts` (style block around lines 615-800)

- [ ] **Step 1: Read the current styles**

Read `packages/core/src/SmartSelect.ts` lines 615-800 to see all current CSS.

- [ ] **Step 2: Fix semantic misuse and hex fallbacks**

Apply these replacements in the style block:
- Line 651: `var(--liwe3-background, #ccc)` used as border color → change to `var(--liwe3-border-default)`
- Line 719: bare `#ccc` in border → `var(--liwe3-border-default)`
- Lines 628, 664: `rgba(0, 123, 255, 0.25)` → `var(--liwe3-focus-ring)`
- Remove all remaining hex fallback values from `var()` expressions (they should just be `var(--liwe3-X)` with no fallback since the theme provides them)

- [ ] **Step 3: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/SmartSelect.ts
git commit -m "fix: replace hex fallbacks and semantic misuse in SmartSelect"
```

---

### Task 3: Migrate Dialog (remove intermediary layer)

**Files:**
- Modify: `packages/core/src/Dialog.ts` (style block around lines 266-410)

- [ ] **Step 1: Read the current styles**

Read `packages/core/src/Dialog.ts` lines 260-415.

- [ ] **Step 2: Collapse `--dialog-*` chains**

Replace all triple-nested `var(--dialog-X, var(--liwe3-Y, #hex))` chains with just `var(--liwe3-Y)`. Key mappings:
- `var(--dialog-background, var(--liwe3-surface-raised, white))` → `var(--liwe3-surface-raised)`
- `var(--dialog-border-radius, var(--liwe3-border-radius, 8px))` → `var(--liwe3-border-radius)`
- `var(--dialog-title-color, var(--liwe3-text-inverse, white))` → `var(--liwe3-text-inverse)`
- `var(--dialog-text-color, var(--liwe3-text-mode2, #555))` → `var(--liwe3-text-mode2)`
- `var(--dialog-border-color, var(--liwe3-border-default, #e0e0e0))` → `var(--liwe3-border-default)`
- `var(--dialog-button-background, var(--liwe3-surface-raised, white))` → `var(--liwe3-surface-raised)`
- `var(--dialog-button-color, var(--liwe3-text-mode1, #333))` → `var(--liwe3-text-mode1)`
- `var(--dialog-button-hover-background, var(--liwe3-hover-overlay, #f8f9fa))` → `var(--liwe3-hover-overlay)`
- `var(--dialog-button-hover-border-color, var(--liwe3-border-strong, #999))` → `var(--liwe3-border-strong)`
- `var(--dialog-button-active-background, var(--liwe3-active-overlay, #e9ecef))` → `var(--liwe3-active-overlay)`
- Same pattern for close button variants
- `var(--font-family, var(--liwe3-font-family, Ubuntu, sans-serif))` → `var(--liwe3-font-family)`
- `rgba(0, 0, 0, 0.6)` overlay → `var(--liwe3-surface-overlay)`

- [ ] **Step 3: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/Dialog.ts
git commit -m "refactor: remove --dialog-* intermediary CSS vars from Dialog"
```

---

### Task 4: Migrate DateSelector (minor cleanup)

**Files:**
- Modify: `packages/core/src/DateSelector.ts` (style block around lines 74-210)

- [ ] **Step 1: Read the current styles**

Read `packages/core/src/DateSelector.ts` lines 74-210.

- [ ] **Step 2: Remove hex fallbacks**

All `var(--liwe3-X, #hex)` patterns already use the correct `--liwe3-*` variable — just remove the hex fallback portion. For example:
- `var(--liwe3-border-default, #e0e0e0)` → `var(--liwe3-border-default)`
- `var(--liwe3-color, #333)` → `var(--liwe3-color)`
- `var(--liwe3-surface-mode1, #f5f5f5)` → `var(--liwe3-surface-mode1)`
- `var(--liwe3-text-mode2, #666)` → `var(--liwe3-text-mode2)`
- `var(--liwe3-mode4-500, #2196f3)` → `var(--liwe3-mode4-500)`
- `var(--liwe3-text-inverse, white)` → `var(--liwe3-text-inverse)`
- etc. for all remaining `var()` expressions with fallbacks
- `0 2px 8px rgba(0,0,0,0.1)` → `var(--liwe3-shadow)`

- [ ] **Step 3: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/DateSelector.ts
git commit -m "refactor: remove hex fallbacks from DateSelector theme vars"
```

---

### Task 5: Migrate Toast (full migration with JS rewrite)

**Files:**
- Modify: `packages/core/src/Toast.ts` (getTypeColors at lines 400-430, style block at lines 496-666)

- [ ] **Step 1: Read the current code**

Read `packages/core/src/Toast.ts` lines 395-670.

- [ ] **Step 2: Rewrite `getTypeColors()` to use CSS variables**

Replace the hex values in `getTypeColors()` with `var(--liwe3-*)` strings:

```typescript
private getTypeColors() {
    const colors: Record<string, { background: string; border: string; icon: string }> = {
        success: {
            background: 'var(--liwe3-success-light)',
            border: 'var(--liwe3-success)',
            icon: 'var(--liwe3-success)',
        },
        error: {
            background: 'var(--liwe3-error-light)',
            border: 'var(--liwe3-error)',
            icon: 'var(--liwe3-error)',
        },
        warning: {
            background: 'var(--liwe3-warning-light)',
            border: 'var(--liwe3-warning)',
            icon: 'var(--liwe3-warning)',
        },
        info: {
            background: 'var(--liwe3-info-light)',
            border: 'var(--liwe3-info)',
            icon: 'var(--liwe3-info)',
        },
    };
    return colors[this.type] || colors.info;
}
```

- [ ] **Step 3: Replace color-related `--toast-*` vars in the style block**

In the `<style>` section (lines 496-666), replace all **color-related** `--toast-*` vars:
- `var(--toast-title-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--toast-text-color, #555)` → `var(--liwe3-text-mode2)`
- `var(--toast-close-color, #666)` → `var(--liwe3-text-mode3)`
- `var(--toast-close-hover-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--toast-close-hover-background, ...)` → `var(--liwe3-surface-mode1)`
- `var(--toast-shadow, ...)` → `var(--liwe3-shadow-lg)`
- `var(--toast-button-background, ...)` → `var(--liwe3-surface-raised)`
- `var(--toast-button-border-color, #ccc)` → `var(--liwe3-border-default)`
- `var(--toast-button-border, ...)` (border-top separator) → `var(--liwe3-border-default)`
- `var(--toast-button-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--toast-button-hover-background, #f8f9fa)` → `var(--liwe3-surface-mode1)`
- `var(--toast-button-hover-border-color, #999)` → `var(--liwe3-border-strong)`
- `var(--toast-button-active-background, #e9ecef)` → `var(--liwe3-active-overlay)`
- `var(--toast-progress-bar-color, ...)` → keep as-is (this uses the type color from `getTypeColors()`)

**Keep structural vars as-is:** `--toast-border-radius`, `--toast-button-border-radius`

- [ ] **Step 4: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/Toast.ts
git commit -m "refactor: migrate Toast from --toast-* vars and hex to --liwe3-* theme vars"
```

---

### Task 6: Migrate PopoverMenu and ContainerBox

**Files:**
- Modify: `packages/core/src/PopoverMenu.ts` (style block at lines 131-233)
- Modify: `packages/core/src/ContainerBox.ts` (style block at lines 92-178, `createAndShowPopover()` at lines 236-308)

- [ ] **Step 1: Read PopoverMenu styles**

Read `packages/core/src/PopoverMenu.ts` lines 130-235.

- [ ] **Step 2: Migrate PopoverMenu**

Replace **color-related** `--popover-menu-*` vars and hex colors:
- `var(--popover-menu-bar-background, #fff)` → `var(--liwe3-surface-raised)`
- `var(--popover-menu-bar-border, #ddd)` → `var(--liwe3-border-default)`
- `var(--popover-menu-bar-shadow, 0 1px 3px rgba(0,0,0,0.1))` → `var(--liwe3-shadow)`
- `var(--popover-menu-trigger-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--popover-menu-trigger-hover-bg, #f0f0f0)` → `var(--liwe3-surface-mode1)`
- `var(--popover-menu-trigger-active-bg, #e3f2fd)` → `var(--liwe3-mode1-300)`
- `var(--popover-menu-trigger-active-color, #1976d2)` → `var(--liwe3-color-mode4)`
- `var(--popover-menu-background, white)` → `var(--liwe3-surface-raised)`
- `var(--popover-menu-border, #ccc)` → `var(--liwe3-border-default)`
- `var(--popover-menu-item-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--popover-menu-item-hover-bg, #f5f5f5)` → `var(--liwe3-surface-mode1)`
- `var(--popover-menu-item-disabled-color, #999)` → `var(--liwe3-text-disabled)`
- `var(--popover-menu-submenu-arrow-color, #666)` → `var(--liwe3-text-mode3)`
- `var(--popover-menu-separator-color, #e0e0e0)` → `var(--liwe3-border-default)`
- Any other `rgba(0,0,0,*)` dropdown shadows → `var(--liwe3-shadow-lg)`

**Keep structural vars as-is:** `--popover-menu-bar-radius`, `--popover-menu-bar-padding`, `--popover-menu-radius`

- [ ] **Step 3: Read ContainerBox styles**

Read `packages/core/src/ContainerBox.ts` lines 90-310.

- [ ] **Step 4: Migrate ContainerBox shadow DOM styles**

Replace **color-related** `--container-box-*` vars and hex colors in the shadow DOM style block:
- `var(--container-box-menu-bg, #fff)` → `var(--liwe3-surface-raised)`
- `var(--container-box-menu-border, #ddd)` → `var(--liwe3-border-default)`
- `var(--container-box-menu-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--container-box-menu-hover-bg, #f5f5f5)` → `var(--liwe3-surface-mode1)`
- `var(--container-box-menu-shadow, 0 2px 8px rgba(0,0,0,0.15))` → `var(--liwe3-shadow)`
- `var(--font-family, ...)` → `var(--liwe3-font-family)`

**Keep structural vars as-is:** `--container-box-menu-radius`, `--container-box-menu-padding`, `--container-box-menu-offset`

- [ ] **Step 5: Migrate ContainerBox light-DOM popover**

In `createAndShowPopover()` method (lines 236-308), replace hex colors in the inline `<style>` block:
- `background: white` → `background: var(--liwe3-surface-raised)`
- `border: 1px solid #ccc` → `border: 1px solid var(--liwe3-border-default)`
- `box-shadow: 0 4px 12px rgba(0,0,0,0.15)` → `box-shadow: var(--liwe3-shadow-lg)`
- `color: #333` → `color: var(--liwe3-text-mode1)`
- `background: #f5f5f5` → `background: var(--liwe3-surface-mode1)`
- `color: #666` → `color: var(--liwe3-text-mode3)`
- `background: #e0e0e0` → `background: var(--liwe3-border-default)`

- [ ] **Step 6: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/PopoverMenu.ts packages/core/src/ContainerBox.ts
git commit -m "refactor: migrate PopoverMenu and ContainerBox to --liwe3-* theme vars"
```

---

### Task 7: Migrate CheckList and TreeView

**Files:**
- Modify: `packages/core/src/CheckList.ts` (style block at lines 125-291)
- Modify: `packages/core/src/TreeView.ts` (style block at lines 428-656)

- [ ] **Step 1: Read CheckList styles**

Read `packages/core/src/CheckList.ts` lines 125-295.

- [ ] **Step 2: Migrate CheckList**

Replace **color-related** vars and hex colors (these are shadow-DOM-scoped, so the generic names are safe):
- `var(--background, #fff)` → `var(--liwe3-surface-raised)`
- `var(--text-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--primary-color, #1976d2)` → `var(--liwe3-color-mode4)`
- `var(--box-shadow, 0 2px 4px rgba(0,0,0,0.1))` → `var(--liwe3-shadow)`
- `#e0e0e0` (separator, unchecked bg) → `var(--liwe3-border-default)`
- `#757575` (done text) → `var(--liwe3-text-disabled)`
- `#666` (secondary text) → `var(--liwe3-text-mode3)`
- `#999` (disabled/placeholder) → `var(--liwe3-text-disabled)`
- `#9e9e9e` (drag handle) → `var(--liwe3-text-mode3)`
- `#f44336` (delete icon) → `var(--liwe3-error)`
- `#f5f5f5` (empty state bg) → `var(--liwe3-surface-mode1)`
- `2px solid #757575` (unchecked checkbox border) → `2px solid var(--liwe3-border-strong)`
- `1px solid #e0e0e0` (input border) → `1px solid var(--liwe3-border-default)`

- [ ] **Step 3: Read TreeView styles**

Read `packages/core/src/TreeView.ts` lines 425-660.

- [ ] **Step 4: Migrate TreeView**

Replace **color-related** `--tree-*` vars and hex colors:
- `var(--tree-text-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--tree-background, ...)` → `var(--liwe3-surface-raised)`
- `var(--tree-container-background, ...)` → `var(--liwe3-surface-mode1)`
- `var(--tree-border, ...)` → `var(--liwe3-border-default)`
- `var(--tree-border-shadow, ...)` → `var(--liwe3-shadow)`
- `var(--tree-hover-background, ...)` → `var(--liwe3-surface-mode1)`
- `var(--tree-expand-hover-background, ...)` → `var(--liwe3-surface-mode2)`
- `var(--tree-focus-color, #007bff)` → `var(--liwe3-color-mode4)`
- `var(--tree-icon-color, #666)` → `var(--liwe3-text-mode3)`
- `var(--tree-checkbox-border, #ccc)` → `var(--liwe3-border-default)`
- `var(--tree-checkbox-background, ...)` → `var(--liwe3-surface-raised)`
- `var(--tree-checkbox-checked-background, #007bff)` → `var(--liwe3-color-mode4)`
- `var(--tree-checkbox-checked-border, #007bff)` → `var(--liwe3-color-mode4)`
- `var(--tree-checkbox-hover-border, #999)` → `var(--liwe3-border-strong)`
- `var(--tree-checkbox-hover-shadow, ...)` → `var(--liwe3-focus-ring)`
- `var(--tree-label-color, #333)` → `var(--liwe3-text-mode1)`
- `var(--tree-label-hover-color, #007bff)` → `var(--liwe3-color-mode4)`
- `var(--tree-guide-line-color, ...)` → `var(--liwe3-border-subtle)`
- `var(--tree-empty-color, #999)` → `var(--liwe3-text-disabled)`
- `var(--tree-scrollbar-track, #f1f1f1)` → `var(--liwe3-scrollbar-track)`
- `var(--tree-scrollbar-thumb, #888)` → `var(--liwe3-scrollbar-thumb)`
- `var(--tree-scrollbar-thumb-hover, #555)` → `var(--liwe3-border-strong)`

**Keep structural vars as-is:** `--tree-font-family`, `--tree-font-size`, `--tree-padding`, `--tree-border-radius`, `--tree-node-border-radius`, `--tree-checkbox-border-radius`, `--tree-custom-icon-size`, `--tree-label-font-weight`

- [ ] **Step 5: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/CheckList.ts packages/core/src/TreeView.ts
git commit -m "refactor: migrate CheckList and TreeView to --liwe3-* theme vars"
```

---

### Task 8: Migrate MarkdownPreview, AITextEditor, AIMarkdownEditor

**Files:**
- Modify: `packages/core/src/MarkdownPreview.ts` (style block at lines 63-123)
- Modify: `packages/core/src/AITextEditor.ts` (style block at lines 69-215, inline at line 630)
- Modify: `packages/core/src/AIMarkdownEditor.ts` (style block at lines 39-195, inline at line 252)

- [ ] **Step 1: Read MarkdownPreview styles**

Read `packages/core/src/MarkdownPreview.ts` lines 60-125.

- [ ] **Step 2: Migrate MarkdownPreview**

Replace all hex colors:
- `color: #333` → `color: var(--liwe3-text-mode1)`
- `background-color: #f6f8fa` → `background-color: var(--liwe3-surface-mode1)`
- `border-left: 0.25em solid #d0d7de` → `border-left: 0.25em solid var(--liwe3-border-default)`
- `color: #656d76` → `color: var(--liwe3-text-mode3)`
- `border: 1px solid #d0d7de` → `border: 1px solid var(--liwe3-border-subtle)`
- `background-color: #ffffff` → `background-color: var(--liwe3-surface-raised)`
- `border-top: 1px solid #d8dee4` → `border-top: 1px solid var(--liwe3-border-subtle)`

- [ ] **Step 3: Read AITextEditor styles**

Read `packages/core/src/AITextEditor.ts` lines 65-220 and line 625-635.

- [ ] **Step 4: Migrate AITextEditor**

Replace all hex colors in the style block:
- `#e1e5e9` (border) → `var(--liwe3-border-default)`
- `#fafbfc` (bg) → `var(--liwe3-surface-raised)`
- `#4facfe` (focus border, spinner) → `var(--liwe3-color-mode4)`
- `#bbb` (ghost text) → `var(--liwe3-text-disabled)`
- `#ddd` (suggestion text) → `var(--liwe3-text-mode2)`
- `#777` (spinner bg, inactive status) → `var(--liwe3-text-mode3)`
- Inline JS at line 630: `'#4caf50'` → `'var(--liwe3-success)'`, `'#777'` → `'var(--liwe3-text-disabled)'`

- [ ] **Step 5: Read AIMarkdownEditor styles**

Read `packages/core/src/AIMarkdownEditor.ts` lines 35-200 and line 245-255.

- [ ] **Step 6: Migrate AIMarkdownEditor**

Same pattern as AITextEditor, plus toolbar-specific colors:
- `#e1e5e9` (border) → `var(--liwe3-border-default)`
- `#fafbfc` (bg) → `var(--liwe3-surface-raised)`
- `#4facfe` (focus, spinner) → `var(--liwe3-color-mode4)`
- `#777` (inactive status) → `var(--liwe3-text-disabled)`
- `#1f2937` (toolbar text) → `var(--liwe3-text-mode1)`
- `#4b5563` (toolbar secondary) → `var(--liwe3-text-mode2)`
- `#d1d5db` (toolbar border) → `var(--liwe3-border-default)`
- `#3b82f6` (active button bg) → `var(--liwe3-color-mode4)`
- `#e5e7eb` (button hover bg) → `var(--liwe3-surface-mode2)`
- `#374151` (button hover text) → `var(--liwe3-text-mode1)`
- Inline JS at line 252: `'#4caf50'` → `'var(--liwe3-success)'`, `'#777'` → `'var(--liwe3-text-disabled)'`

- [ ] **Step 7: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 8: Commit**

```bash
git add packages/core/src/MarkdownPreview.ts packages/core/src/AITextEditor.ts packages/core/src/AIMarkdownEditor.ts
git commit -m "refactor: migrate MarkdownPreview and AI editors to --liwe3-* theme vars"
```

---

### Task 9: Migrate Drawer and ChunkUploader

**Files:**
- Modify: `packages/core/src/Drawer.ts` (style block at lines 255-401)
- Modify: `packages/core/src/ChunkUploader.ts` (style block at lines 787-1099, inline JS at lines 660-671, 706-708)

- [ ] **Step 1: Read Drawer styles**

Read `packages/core/src/Drawer.ts` lines 255-405.

- [ ] **Step 2: Migrate Drawer**

Remove the **color-related** `--drawer-*` variable declarations from `:host` and replace their usages throughout:
- `var(--drawer-bg)` / `#ffffff` → `var(--liwe3-surface-raised)`
- `var(--drawer-border)` / `#e5e7eb` → `var(--liwe3-border-default)`
- `var(--drawer-text)` / `#1f2937` → `var(--liwe3-text-mode1)`
- `var(--drawer-shadow)` / `0 1px 3px rgba(0,0,0,0.1)` → `var(--liwe3-shadow)`
- `var(--drawer-icon-bg)` / `#f3f4f6` → `var(--liwe3-surface-mode1)`
- `var(--drawer-icon-hover)` / `#e5e7eb` → `var(--liwe3-surface-mode2)`
- `var(--drawer-button-hover)` / `#f9fafb` → `var(--liwe3-surface-mode1)`
- `#6b7280` (secondary text) → `var(--liwe3-text-mode3)`
- `#ef4444` (danger) → `var(--liwe3-error)`

**Keep sizing vars as-is:** `--drawer-horizontal-size`, `--drawer-vertical-size`, `--drawer-horizontal-shrunk-size`, `--drawer-vertical-shrunk-size`, `--drawer-content-padding`

- [ ] **Step 3: Read ChunkUploader styles**

Read `packages/core/src/ChunkUploader.ts` lines 655-715 and 785-1030.

- [ ] **Step 4: Migrate ChunkUploader style block**

Replace hex colors in the `<style>` section:
- `#ccc` (dropzone border) → `var(--liwe3-border-default)`
- `#fafafa` (dropzone bg) → `var(--liwe3-surface-raised)`
- `#4CAF50` (active border, upload btn) → `var(--liwe3-success)`
- `#f0f9f0`, `#e8f5e9` (active bg) → `var(--liwe3-success-light)`
- `#45a049` (upload btn hover) → oklch darker from `var(--liwe3-success)` or just keep the green pattern
- `#333` (text) → `var(--liwe3-text-mode1)`
- `#666` (secondary text) → `var(--liwe3-text-mode3)`
- `#e0e0e0` (separator, progress bg) → `var(--liwe3-border-default)`
- `#f5f5f5` (file header bg) → `var(--liwe3-surface-mode1)`
- `#ef4444`, `#dc2626` (error/cancel btn) → `var(--liwe3-error)`

- [ ] **Step 5: Migrate ChunkUploader inline JS styles**

In the progress bar color logic (around lines 660-671):
- `'#22c55e'` (completed) → `'var(--liwe3-success)'`
- `'#ef4444'` (error) → `'var(--liwe3-error)'`
- `'#f59e0b'` (uploading) → `'var(--liwe3-warning)'`

In the status color logic (around line 707):
- `'#22c55e'` → `'var(--liwe3-success)'`
- `'#ef4444'` → `'var(--liwe3-error)'`
- `'var(--color-primary)'` → `'var(--liwe3-color-mode4)'`

- [ ] **Step 6: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/Drawer.ts packages/core/src/ChunkUploader.ts
git commit -m "refactor: migrate Drawer and ChunkUploader to --liwe3-* theme vars"
```

---

### Task 10: Migrate SortableContainer, ResizableCropper, ComicBalloon

**Files:**
- Modify: `packages/core/src/SortableContainer.ts` (inline JS at lines 217-241, 671)
- Modify: `packages/core/src/ResizableCropper.ts` (inline JS at lines 698, 735, 787)
- Modify: `packages/core/src/ComicBalloon.ts` (inline JS at lines 173, 199, 212, 221, 353, 434, 457, 481)

- [ ] **Step 1: Read SortableContainer inline styles**

Read `packages/core/src/SortableContainer.ts` lines 215-245 and 668-675.

- [ ] **Step 2: Migrate SortableContainer**

Replace the inline `var()` references:
- `'var(--sortable-handle-color, #666)'` → `'var(--liwe3-text-mode3)'`
- `'var(--sortable-handle-hover-color, #333)'` → `'var(--liwe3-text-mode1)'`
- `'2px dashed var(--sortable-indicator-color, #667eea)'` → `'2px dashed var(--liwe3-color-mode4)'`

- [ ] **Step 3: Read ResizableCropper inline styles**

Read `packages/core/src/ResizableCropper.ts` lines 695-790.

- [ ] **Step 4: Migrate ResizableCropper**

Replace hex colors in inline style assignments:
- `'2px solid #007bff'` → `'2px solid var(--liwe3-color-mode4)'`
- `'#007bff'` (background) → `'var(--liwe3-color-mode4)'`

- [ ] **Step 5: Read ComicBalloon inline styles**

Read `packages/core/src/ComicBalloon.ts` lines 170-225 and 350-485.

- [ ] **Step 6: Migrate ComicBalloon**

Replace hex colors:
- `'3px solid #000'` → `'3px solid var(--liwe3-text-mode1)'`
- `'3px dashed #000'` → `'3px dashed var(--liwe3-text-mode1)'`
- `'#000'` (stroke attribute) → `'var(--liwe3-text-mode1)'`
- `color: #000` → `color: var(--liwe3-text-mode1)`
- `color: #999` → `color: var(--liwe3-text-disabled)`

- [ ] **Step 7: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 8: Commit**

```bash
git add packages/core/src/SortableContainer.ts packages/core/src/ResizableCropper.ts packages/core/src/ComicBalloon.ts
git commit -m "refactor: migrate SortableContainer, ResizableCropper, ComicBalloon to --liwe3-* theme vars"
```

---

### Task 11: Create WoxGUI bridge CSS

**Files:**
- Create: `packages/core/src/wox-theme-bridge.css`

- [ ] **Step 1: Create the bridge file**

Create `packages/core/src/wox-theme-bridge.css` with the full mapping from the spec:

```css
/*
 * WoxGUI Theme Bridge
 *
 * Maps --liwe3-* CSS custom properties to --wox-* equivalents.
 * Import this file INSTEAD of variables.css when using WoxGUI theming.
 *
 * Known limitations:
 * - WoxGUI has no --wox-warning or --wox-info; hardcoded fallbacks used.
 * - text-mode2, text-mode3, text-disabled all map to --wox-text-secondary.
 * - Palette steps (mode1-300, mode4-500) are approximated via oklch.
 */

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

- [ ] **Step 2: Build to verify**

Run: `cd packages/core && pnpm run build`

- [ ] **Step 3: Commit**

```bash
git add packages/core/src/wox-theme-bridge.css
git commit -m "feat: add WoxGUI theme bridge CSS mapping --liwe3-* to --wox-* vars"
```

---

### Task 12: Final build verification and version bump

**Files:**
- Modify: `packages/core/package.json` (version bump)

- [ ] **Step 1: Full clean build**

```bash
cd /home/fabio/dev/cloudflare/liwe3-webcomponents
pnpm run clean && pnpm run build
```

Expected: All packages build successfully.

- [ ] **Step 2: Grep for remaining hex colors**

Run a grep across all `.ts` files in `packages/core/src/` for hardcoded hex patterns to catch any missed colors:

```bash
grep -rn '#[0-9a-fA-F]\{3,8\}\b' packages/core/src/*.ts
```

Expected: Only colors in ButtonToolbar (already themed), ImageView (no color CSS), and any intentional non-theme colors (like SVG fill defaults) should remain.

- [ ] **Step 3: Bump core package version**

In `packages/core/package.json`, increment the patch version (e.g. `1.0.X` → `1.0.X+1`).

- [ ] **Step 4: Commit**

```bash
git add packages/core/package.json
git commit -m "chore: bump @liwe3/webcomponents version for theme migration"
```
