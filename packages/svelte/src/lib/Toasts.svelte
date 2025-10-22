<script module lang="ts">
	import type { ToastConfig, ToastElement } from '@liwe3/webcomponents';

	/**
	 * Shows a toast notification with the given configuration.
	 *
	 * IMPORTANT: Make sure to add the <Toasts /> component to your layout first!
	 * The <Toasts /> component initializes the toast web component system.
	 *
	 * @param config - The toast configuration
	 * @returns The toast element instance (or undefined if called during SSR)
	 *
	 * @example
	 * ```typescript
	 * // In your +layout.svelte
	 * import { Toasts } from '@liwe3/webcomponents-svelte';
	 * <Toasts />
	 *
	 * // In any component
	 * import { toastAdd } from '@liwe3/webcomponents-svelte';
	 *
	 * toastAdd({
	 *   title: 'Success!',
	 *   text: 'Your changes have been saved.',
	 *   type: 'success',
	 *   duration: 5000
	 * });
	 * ```
	 */
	export const toastAdd = (config: ToastConfig): ToastElement | undefined => {
		// Only run on client side
		if (typeof window === 'undefined') {
			return undefined;
		}

		// Get the toastAdd function from window (set by the web component)
		// The <Toasts /> component should have already loaded the web component
		const globalToastAdd = (window as any).__liwe3_toastAdd;

		if (!globalToastAdd) {
			console.error(
				'toastAdd: Toast web component not initialized. Did you forget to add <Toasts /> to your layout?'
			);
			return undefined;
		}

		return globalToastAdd(config);
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		// Only run on the client side (onMount only runs in browser)
		// Import and initialize the Toast web component
		const { toastAdd: coreToastAdd } = await import('@liwe3/webcomponents/toast');

		// Expose toastAdd on window so the wrapper can access it
		(window as any).__liwe3_toastAdd = coreToastAdd;
	});
</script>

<!-- This component doesn't render anything, it just loads the web component -->
