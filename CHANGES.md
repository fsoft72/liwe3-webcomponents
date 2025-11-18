# CHANGES.md

## 2025-11-18

### Changed
- TreeView component interaction improvements
  - Removed single-click expand/collapse on folder labels
  - Added double-click to expand/collapse folders
  - Added double-click on items to fire `itemselected` event
  - Removed scale animation on node click for cleaner interaction
  - Fixed event handler duplication issue that was preventing checkbox and expand/collapse from working
  - Event handlers now bound only once in constructor instead of on every render

### Added
- Created new TreeView web component in `packages/core`
  - Infinite depth support for nested folder structures
  - Checkbox selection for both folders and items
  - Expandable/collapsible folders by clicking on them or expand/collapse buttons
  - Flexible icon system:
    - Custom icons via `customIcon` property
    - Standard emoji icons via `icon` property
    - Default folder/file icons (📁/📂 for folders, 📄 for files)
    - Option to hide icons by setting `icon: ''`
  - Customizable indentation width via `indent-width` attribute (default: 20px)
  - Modern, smooth animations for expand/collapse
  - Tree data structure using `TreeNode` type with recursive `children` support
  - Public API methods:
    - `toggleExpansion(nodeId)` - Toggle folder expansion
    - `toggleSelection(nodeId)` - Toggle node selection
    - `expandAll()` - Expand all folders
    - `collapseAll()` - Collapse all folders
    - `selectAll()` - Select all nodes
    - `deselectAll()` - Deselect all nodes
  - Custom events:
    - `selectionchange` - Fired when selection changes
    - `toggle` - Fired when a node is expanded/collapsed
  - Fully customizable via CSS variables (18+ customization points)
  - Visual guide lines connecting parent and child nodes
  - Smooth slide-down animation for expanding folders
  - Accessible keyboard navigation support
  - Updated core package version to 1.0.17

- Created comprehensive demo page for TreeView at `packages/core/demos/demo-tree-view.html`
  - Example 1: File system tree with nested folders and files
  - Example 2: Organization structure with custom emoji icons
  - Example 3: Custom indentation (40px) for deeper nesting
  - Example 4: Mixed icon configurations (custom, standard, none)
  - Interactive controls for expand/collapse and select/deselect all
  - Real-time selection feedback and event logging
  - Complete usage examples and TypeScript type definitions
  - CSS customization guide with all available CSS variables
  - Icon configuration examples
  - Updated demos index page with TreeView card

- Exported TreeView from core package
  - Added `TreeViewElement`, `defineTreeView`, and `TreeNode` type to exports
  - Added TreeView to package.json exports field as `./tree-view`
  - Integrated into `defineAllComponents()` convenience function

## 2025-10-28

### Added
- Toast component now supports customizable positioning
  - Added `ToastPosition` type with 6 position options: 'TL', 'T', 'TR', 'BL', 'B', 'BR'
  - 'TL' = top-left, 'T' = top-center, 'TR' = top-right (default)
  - 'BL' = bottom-left, 'B' = bottom-center, 'BR' = bottom-right
  - Each position creates its own independent container
  - Centered positions (T, B) use transform to center horizontally
  - Mobile responsive: all positions adjust to full-width on small screens
  - Updated core package version to 1.0.16
  - Added positioning examples to demo page with "Show All Positions" feature
  - Updated Svelte wrapper to re-export `ToastPosition` type and document position parameter
  - Updated Svelte package version to 1.0.15

### Changed
- Toast component now uses capitalized type as fallback title
  - When `title` is undefined or empty, displays capitalized type ("Info", "Warning", "Error", "Success")
  - Provides better default UX when title is not explicitly set
  - Updated core package version to 1.0.15

### Fixed
- Fixed Toast title showing "undefined" when title is not provided
  - Clear title attribute when undefined or empty in `show()` method
  - Update title setter to remove attribute when value is empty or whitespace
  - Ensures fallback to capitalized type works correctly in all scenarios

## 2025-10-23

### Added
- Created Svelte 5 wrapper for DateSelector component in `packages/svelte`
  - Added `DateSelector.svelte` with full Svelte 5 runes support
  - Supports single date and range selection modes via `rangeMode` prop
  - Two-way binding with `bind:selectedDate` and `bind:selectedRange`
  - Event handlers for `ondateselected` and `onrangeselected`
  - Exposed public methods: `setDate()`, `setRange()`, `getSelectedDate()`, `getSelectedRange()`, `clear()`
  - Updated Svelte package version to 1.0.6

- Created comprehensive demo page for DateSelector in `packages/demo`
  - Single date selection example with formatted output
  - Date range selection example with range display
  - Pre-selected date example
  - Features list and usage examples
  - Complete API reference with props, events, and methods tables
  - Added DateSelector card to main demo page

- Exported DateSelector types and component
  - Added `DateRange` type export to `packages/svelte/src/lib/index.ts`
  - Updated core package version to 1.0.14

### Changed
- Reorganized demo files into `packages/core/demos/` directory
  - Moved `demo-date-selector.html` to `demos/` folder
  - Moved `demo-popover-menu.html` to `demos/` folder
  - Moved `demo-toast.html` to `demos/` folder
  - Fixed import paths in all demo files to reference `../dist/` instead of `./dist/`
  - Created `demos/index.html` as landing page with links to all component demos

## 2025-10-22

### Added
- Added reverse progress bar to Toast notifications
  - Progress bar appears at the bottom of toasts with `duration > 0`
  - Animates from 100% to 0% width as timeout progresses
  - Automatically pauses when mouse hovers over toast
  - Resumes animation when mouse leaves
  - Customizable via `--toast-progress-bar-color` CSS variable
  - Default height: 4px
  - Syncs perfectly with auto-dismiss timer
  - Updated core package version to 1.0.8

### Fixed
- Fixed Toast progress bar resuming from beginning instead of paused position
  - Progress bar now correctly calculates current width percentage when paused
  - Creates dynamic keyframe animation from paused position to 0%
  - Animation duration matches remaining time for accurate progress tracking
  - Updated core package version to 1.0.9

### Changed
- Toasts with buttons now automatically disable auto-dismiss
  - When buttons are present, duration is forced to 0
  - Progress bar is not displayed when buttons are present
  - User must interact with buttons or close button to dismiss toast
  - Ensures user has time to read and respond to actionable toasts
  - Updated core package version to 1.0.10

### Improved
- Enhanced toast repositioning animation for smoother visual experience
  - Added CSS transitions to toast elements for fluid position changes
  - Toasts now smoothly slide up when other toasts close
  - Uses cubic-bezier easing (0.4, 0, 0.2, 1) for natural motion
  - 300ms transition duration for transform, opacity, and margin
  - Updated core package version to 1.0.11

- Fixed toast slide-up animation to be truly smooth
  - Replaced flexbox gap with margin-bottom for animatable spacing
  - Toast element now animates height and margin to 0 during close
  - Collapsing animation triggers after fade-out completes
  - Remaining toasts smoothly slide up to fill the space
  - Total close animation: 350ms fade + 300ms collapse = 650ms
  - Updated core package version to 1.0.12

## 2025-10-22 (Earlier)

### Added
- Implemented Turborepo for monorepo task orchestration and caching
  - Installed turbo ^2.5.8 as workspace dev dependency
  - Created `turbo.json` configuration with task pipelines for:
    - `build` - builds all packages with dependency-aware execution
    - `package` - packages Svelte library
    - `dev` - runs development mode (persistent, no cache)
    - `check` - runs type checking
    - `check:watch` - runs type checking in watch mode
    - `clean` - cleans build artifacts
  - Updated root `package.json` scripts to use Turbo:
    - `pnpm run build` - builds core and svelte packages (excludes demo)
    - `pnpm run build:core` - builds only core package
    - `pnpm run build:svelte` - builds only Svelte package
    - `pnpm run build:demo` - builds only demo package
    - `pnpm run dev` - runs dev mode for core and svelte (excludes demo)
    - `pnpm run dev:core` - runs dev mode for core only
    - `pnpm run dev:svelte` - runs dev mode for Svelte only
    - `pnpm run dev:demo` - runs dev mode for demo only
    - `pnpm run check` - runs type checking
  - Added `.turbo` directory to `.gitignore` for local cache
  - Turborepo provides:
    - Intelligent task scheduling based on package dependencies
    - Fast incremental builds with content-based caching
    - Parallel execution of independent tasks
    - Build times reduced from ~3.7s to ~38ms on cache hits

## 2025-10-12

### Fixed
- Fixed `AITextEditor` Svelte wrapper missing public methods
  - Added `getApiKey()` and `setApiKey()` methods for API key management
  - Added `getSuggestionDelay()` and `setSuggestionDelay()` methods for delay configuration
  - Added `getText()` getter method
  - Added `getContext()` and related getter/setter methods for all web component properties
  - This fixes the error "editorInstance.getApiKey is not a function" in the demo app

- Fixed `SmartSelect` text selection issue
  - Added `user-select: none` to `.select-trigger`, `.tag`, and `.option` elements
  - Prevents unwanted text selection when clicking or interacting with the component

## 2025-10-11

### Added
- Created `CLAUDE.md` with comprehensive documentation for Claude Code
  - Project overview and architecture details
  - Build, test, and publishing commands
  - Development guidelines for adding new components
  - Web component and Svelte wrapper requirements
  - Key architectural patterns and implementation details

- Created demo SvelteKit application in `packages/demo/`
  - Home page with project overview and features
  - SmartSelect demo page with multiple examples:
    - Basic single select
    - Searchable select
    - Multi-select with tags
    - Disabled state
    - Full featured example
  - AITextEditor demo page with:
    - API key configuration
    - Suggestion delay settings
    - Sample text loader
    - Real-time word count
    - Instructions and status indicators
  - Responsive layout with navigation and footer
  - Full Svelte 5 runes implementation

- Updated `README.md` to include demo app instructions

- Fixed Svelte package build configuration
  - Simplified build scripts to use `svelte-package` directly
  - Removed SvelteKit-specific configuration (not needed for library packaging)
  - Updated tsconfig.json for proper TypeScript compilation
  - All packages now build successfully
