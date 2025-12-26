import type { DialogConfig, DialogElement } from '@liwe3/webcomponents';
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
 *       onclick: () => {
 *         console.log('File deleted');
 *         dialog?.close();
 *       }
 *     },
 *     {
 *       label: 'Cancel',
 *       onclick: () => {
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
export declare const dialogAdd: (config: DialogConfig) => DialogElement | undefined;
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
declare const Dialogs: $$__sveltets_2_IsomorphicComponent<Record<string, never>, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type Dialogs = InstanceType<typeof Dialogs>;
export default Dialogs;
//# sourceMappingURL=Dialogs.svelte.d.ts.map