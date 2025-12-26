import type { ToastConfig, ToastElement, ToastPosition } from '@liwe3/webcomponents';
export type { ToastConfig, ToastElement, ToastPosition };
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
 *   duration: 5000,
 *   position: 'TR' // Optional: TL, T, TR, BL, B, BR (default: TR)
 * });
 * ```
 */
export declare const toastAdd: (config: ToastConfig) => ToastElement | undefined;
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const Toasts: $$__sveltets_2_IsomorphicComponent<Record<string, never>, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type Toasts = InstanceType<typeof Toasts>;
export default Toasts;
//# sourceMappingURL=Toasts.svelte.d.ts.map