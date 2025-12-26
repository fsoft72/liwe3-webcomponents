/**
 * Toast Web Component
 * A customizable toast notification system with multiple types, icons, buttons, and auto-dismiss
 */
export type ToastType = 'info' | 'warning' | 'error' | 'success';
export type ToastPosition = 'TL' | 'T' | 'TR' | 'BL' | 'B' | 'BR';
export type ToastButton = {
    label: string;
    onClick: () => void;
};
export type ToastConfig = {
    title: string;
    text: string;
    type?: ToastType;
    icon?: string;
    buttons?: ToastButton[];
    closable?: boolean;
    duration?: number;
    position?: ToastPosition;
    onClose?: () => void;
};
export declare class ToastElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private config;
    private autoCloseTimer?;
    private remainingTime;
    private pauseTime;
    private progressBar?;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get title(): string;
    set title(value: string);
    get text(): string;
    set text(value: string);
    get type(): ToastType;
    set type(value: ToastType);
    get icon(): string | undefined;
    set icon(value: string | undefined);
    get closable(): boolean;
    set closable(value: boolean);
    get duration(): number;
    set duration(value: number);
    get buttons(): ToastButton[];
    set buttons(value: ToastButton[]);
    /**
     * Shows the toast with the given configuration
     */
    show(config: ToastConfig): void;
    /**
     * Closes the toast
     */
    close(): void;
    /**
     * Starts the auto-close timer if duration is set
     */
    private startAutoCloseTimer;
    /**
     * Pauses the auto-close timer
     */
    private pauseAutoCloseTimer;
    /**
     * Resumes the auto-close timer
     */
    private resumeAutoCloseTimer;
    /**
     * Clears the auto-close timer
     */
    private clearAutoCloseTimer;
    /**
     * Starts the progress bar animation
     */
    private startProgressBarAnimation;
    /**
     * Pauses the progress bar animation
     */
    private pauseProgressBarAnimation;
    /**
     * Resumes the progress bar animation
     */
    private resumeProgressBarAnimation;
    /**
     * Gets the color scheme for the toast type
     */
    private getTypeColors;
    /**
     * Gets the default icon for the toast type
     */
    private getDefaultIcon;
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
declare const defineToast: (tagName?: string) => void;
/**
 * Shows a toast notification with the given configuration.
 * This is the recommended way to display toasts.
 *
 * @param config - The toast configuration
 * @returns The toast element instance
 *
 * @example
 * ```typescript
 * import { toastAdd } from '@liwe3/webcomponents';
 *
 * toastAdd({
 *   title: 'Success!',
 *   text: 'Your changes have been saved.',
 *   type: 'success',
 *   duration: 5000,
 *   position: 'TR' // Optional: top-right (default)
 * });
 * ```
 */
declare const toastAdd: (config: ToastConfig) => ToastElement;
export { defineToast, toastAdd };
//# sourceMappingURL=Toast.d.ts.map