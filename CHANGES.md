# CHANGES.md

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
