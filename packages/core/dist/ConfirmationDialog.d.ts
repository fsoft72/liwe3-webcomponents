/**
 * ConfirmationDialog Web Component
 * A customizable confirmation dialog with HTML body, custom buttons, and modal support
 */
export type ConfirmationDialogButton = {
    label: string;
    backgroundColor?: string;
    onClick: () => void;
};
export type ConfirmationDialogConfig = {
    title?: string;
    body: string;
    buttons?: ConfirmationDialogButton[];
    modal?: boolean;
    escToClose?: boolean;
    clickToClose?: boolean;
    onClose?: () => void;
};
export declare class ConfirmationDialogElement extends HTMLElement {
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
    show(config: ConfirmationDialogConfig): void;
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
declare const defineConfirmationDialog: (tagName?: string) => void;
/**
 * Shows a confirmation dialog with the given configuration.
 * This is the recommended way to display confirmation dialogs.
 *
 * @param config - The dialog configuration
 * @returns The dialog element instance
 *
 * @example
 * ```typescript
 * import { confirmationDialogAdd } from '@liwe3/webcomponents';
 *
 * confirmationDialogAdd({
 *   title: 'Delete File',
 *   body: '<p>Are you sure you want to delete this file? This action cannot be undone.</p>',
 *   buttons: [
 *     {
 *       label: 'Delete',
 *       backgroundColor: '#dc3545',
 *       onClick: () => {
 *         console.log('File deleted');
 *       }
 *     },
 *     {
 *       label: 'Cancel',
 *       onClick: () => {
 *         console.log('Cancelled');
 *       }
 *     }
 *   ],
 *   modal: true,
 *   escToClose: true,
 *   clickToClose: true
 * });
 * ```
 */
declare const confirmationDialogAdd: (config: ConfirmationDialogConfig) => ConfirmationDialogElement;
export { defineConfirmationDialog, confirmationDialogAdd };
//# sourceMappingURL=ConfirmationDialog.d.ts.map