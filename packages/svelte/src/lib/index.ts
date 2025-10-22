/**
 * @liwe3/webcomponents-svelte
 * Svelte 5 wrappers for @liwe3/webcomponents
 */

// Re-export types from the core package
export type { SelectOption, AITextEditorConfig, ToastType, ToastButton, ToastConfig, ToastElement, PopoverMenuItem, PopoverMenuConfig } from '@liwe3/webcomponents';

// Export Svelte components
export { default as SmartSelect } from './SmartSelect.svelte';
export { default as AITextEditor } from './AITextEditor.svelte';
export { default as PopoverMenu } from './PopoverMenu.svelte';

// Export Toasts component and toastAdd function
export { default as Toasts, toastAdd } from './Toasts.svelte';
