/**
 * Dialog Web Component
 * A customizable dialog with HTML body, custom buttons, and modal support
 */
export type DialogButton = {
    label: string;
    backgroundColor?: string;
    onclick: (dialog?: DialogElement) => void;
};
export type DialogConfig = {
    title?: string;
    body: string;
    buttons?: DialogButton[];
    modal?: boolean;
    escToClose?: boolean;
    clickToClose?: boolean;
    fxAppear?: 'none' | 'fade' | 'slide';
    fxSpeed?: number;
    onclose?: () => void;
};
export declare class DialogElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private config;
    private backdrop?;
    private escKeyHandler?;
    private eventsBound;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Shows the dialog with the given configuration
     */
    show(config: DialogConfig): void;
    /**
     * Closes the dialog
     */
    close(): void;
    /**
     * Creates the modal backdrop
     */
    private createBackdrop;
    /**
     * Sets up keyboard event listeners
     */
    private setupKeyboardListeners;
    /**
     * Removes keyboard event listeners
     */
    private removeKeyboardListeners;
    /**
     * Binds all event listeners
     */
    private bindEvents;
    /**
     * Renders the component
     */
    private render;
}
/**
 * Conditionally defines the custom element if in a browser environment.
 */
declare const defineDialog: (tagName?: string) => void;
/**
 * Shows a dialog with the given configuration.
 * This is the recommended way to display dialogs.
 *
 * @param config - The dialog configuration
 * @returns The dialog element instance
 *
 * @example
 * ```typescript
 * import { dialogAdd } from '@liwe3/webcomponents';
 *
 * dialogAdd({
 *   title: 'Delete File',
 *   body: '<p>Are you sure you want to delete this file? This action cannot be undone.</p>',
 *   buttons: [
 *     {
 *       label: 'Delete',
 *       backgroundColor: '#dc3545',
 *       onclick: (dialog) => {
 *         console.log('File deleted');
 *         dialog.close();
 *       }
 *     },
 *     {
 *       label: 'Cancel',
 *       onclick: (dialog) => {
 *         console.log('Cancelled');
 *         dialog.close();
 *       }
 *     }
 *   ],
 *   modal: true,
 *   escToClose: true,
 *   clickToClose: true
 * });
 * ```
 */
declare const dialogAdd: (config: DialogConfig) => DialogElement;
export { defineDialog, dialogAdd };
//# sourceMappingURL=Dialog.d.ts.map