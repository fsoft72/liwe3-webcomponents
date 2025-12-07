<script module lang="ts">
	import type { ConfirmationDialogConfig, ConfirmationDialogElement } from '@liwe3/webcomponents';

	// Re-export types for convenience
	export type { ConfirmationDialogConfig, ConfirmationDialogElement };

	/**
	 * Shows a confirmation dialog with the given configuration.
	 *
	 * IMPORTANT: Make sure to add the <ConfirmationDialogs /> component to your layout first!
	 * The <ConfirmationDialogs /> component initializes the confirmation dialog web component system.
	 *
	 * @param config - The dialog configuration
	 * @returns The dialog element instance (or undefined if called during SSR)
	 *
	 * @example
	 * ```typescript
	 * // In your +layout.svelte
	 * import { ConfirmationDialogs } from '@liwe3/webcomponents-svelte';
	 * <ConfirmationDialogs />
	 *
	 * // In any component
	 * import { confirmationDialogAdd } from '@liwe3/webcomponents-svelte';
	 *
	 * const dialog = confirmationDialogAdd({
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
	export const confirmationDialogAdd = (config: ConfirmationDialogConfig): ConfirmationDialogElement | undefined => {
		// Only run on client side
		if (typeof window === 'undefined') {
			return undefined;
		}

		// Get the confirmationDialogAdd function from window (set by the web component)
		// The <ConfirmationDialogs /> component should have already loaded the web component
		const globalConfirmationDialogAdd = (window as any).__liwe3_confirmationDialogAdd;

		if (!globalConfirmationDialogAdd) {
			console.error(
				'confirmationDialogAdd: ConfirmationDialog web component not initialized. Did you forget to add <ConfirmationDialogs /> to your layout?'
			);
			return undefined;
		}

		return globalConfirmationDialogAdd(config);
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		// Only run on the client side (onMount only runs in browser)
		// Import and initialize the ConfirmationDialog web component
		const { confirmationDialogAdd: coreConfirmationDialogAdd } = await import('@liwe3/webcomponents/confirmation-dialog');

		// Expose confirmationDialogAdd on window so the wrapper can access it
		(window as any).__liwe3_confirmationDialogAdd = coreConfirmationDialogAdd;
	});
</script>

<!-- This component doesn't render anything, it just loads the web component -->
