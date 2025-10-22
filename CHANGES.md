# CHANGES.md

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
