<script module lang="ts">
	import type { DialogConfig, DialogElement } from '@liwe3/webcomponents';

	// Re-export types for convenience
	export type { DialogConfig, DialogElement };

	/**
	 * Shows a dialog with the given configuration.
	 *
	 * IMPORTANT: Make sure to add the <Dialogs /> component to your layout first!
	 * The <Dialogs /> component initializes the dialog web component system.
	 *
	 * @param config - The dialog configuration
	 * @returns The dialog element instance (or undefined if called during SSR)
	 *
	 * @example
	 * ```typescript
	 * // In your +layout.svelte
	 * import { Dialogs } from '@liwe3/webcomponents-svelte';
	 * <Dialogs />
	 *
	 * // In any component
	 * import { dialogAdd } from '@liwe3/webcomponents-svelte';
	 *
	 * const dialog = dialogAdd({
	 *   title: 'Delete File',
	 *   body: '<p>Are you sure you want to delete this file?</p>',
	 *   buttons: [
	 *     {
	 *       label: 'Delete',
	 *       backgroundColor: '#dc3545',
	 *       onClick: () => {
	 *         console.log('File deleted');
	 *         dialog?.close();
	 *       }
	 *     },
	 *     {
	 *       label: 'Cancel',
	 *       onClick: () => {
	 *         dialog?.close();
	 *       }
	 *     }
	 *   ],
	 *   modal: true,
	 *   escToClose: true,
	 *   clickToClose: true
	 * });
	 * ```
	 */
	export const dialogAdd = (config: DialogConfig): DialogElement | undefined => {
		// Only run on client side
		if (typeof window === 'undefined') {
			return undefined;
		}

		// Get the dialogAdd function from window (set by the web component)
		// The <Dialogs /> component should have already loaded the web component
		const globalDialogAdd = (window as any).__liwe3_dialogAdd;

		if (!globalDialogAdd) {
			console.error(
				'dialogAdd: Dialog web component not initialized. Did you forget to add <Dialogs /> to your layout?'
			);
			return undefined;
		}

		return globalDialogAdd(config);
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		// Only run on the client side (onMount only runs in browser)
		// Import and initialize the Dialog web component
		const { dialogAdd: coreDialogAdd } = await import('@liwe3/webcomponents/dialog');

		// Expose dialogAdd on window so the wrapper can access it
		(window as any).__liwe3_dialogAdd = coreDialogAdd;
	});
</script>

<!-- This component doesn't render anything, it just loads the web component -->
