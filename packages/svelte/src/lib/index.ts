/**
 * @liwe3/webcomponents-svelte
 * Svelte 5 wrappers for @liwe3/webcomponents
 */

// Re-export types from the core package
export type { SelectOption, AITextEditorConfig, ToastType, ToastButton, ToastConfig } from '@liwe3/webcomponents';

// Export Svelte components
export { default as SmartSelect } from './SmartSelect.svelte';
export { default as AITextEditor } from './AITextEditor.svelte';
export { default as Toast } from './Toast.svelte';
