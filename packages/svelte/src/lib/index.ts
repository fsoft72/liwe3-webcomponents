/**
 * @liwe3/webcomponents-svelte
 * Svelte 5 wrappers for @liwe3/webcomponents
 */

// Re-export types from the core package
export type {
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
	ResizableCropperValues,
	SortDirection,
	HandlePosition,
	SortableContainerConfig,
	ReorgEventDetail,
} from '@liwe3/webcomponents';

// Export Svelte components
export { default as SmartSelect } from './SmartSelect.svelte';
export { default as AITextEditor } from './AITextEditor.svelte';
export { default as PopoverMenu } from './PopoverMenu.svelte';
export { default as DateSelector } from './DateSelector.svelte';
export { default as TreeView } from './TreeView.svelte';
export { default as Drawer } from './Drawer.svelte';
export { default as ContainerBox } from './ContainerBox.svelte';
export { default as ChunkUploader } from './ChunkUploader.svelte';
export { default as ButtonToolbar } from './ButtonToolbar.svelte';

// Export AIMarkdownEditor
export { default as AIMarkdownEditor } from './AIMarkdownEditor.svelte';

// Export MarkdownPreview
export { default as MarkdownPreview } from './MarkdownPreview.svelte';

// re-export ChunkUploader svelte types
export type { ChunkFileEvent } from './ChunkUploader.svelte';

// Export CheckList
export { default as CheckList } from './CheckList.svelte';

// Export Toasts component and toastAdd function
export { default as Toasts, toastAdd } from './Toasts.svelte';

// Export Dialogs component and dialogAdd function
export { default as Dialogs, dialogAdd } from './Dialogs.svelte';

// Export ResizableCropper
export { default as ResizableCropper } from './ResizableCropper.svelte';

// Export SortableContainer
export { default as SortableContainer } from './SortableContainer.svelte';
