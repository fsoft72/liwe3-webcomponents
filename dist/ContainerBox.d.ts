/**
 * ContainerBox Web Component
 * A container that wraps elements and shows a menu on hover
 */
import type { PopoverMenuItem } from './PopoverMenu';
export type MenuPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type ContainerBoxConfig = {
    menuPosition?: MenuPosition;
    menuItems?: PopoverMenuItem[];
    alwaysShowMenu?: boolean;
};
export declare class ContainerBoxElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private menuPosition;
    private menuItems;
    private alwaysShowMenu;
    private popoverMenu;
    private menuButton;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Set menu position
     */
    setMenuPosition(position: MenuPosition): void;
    /**
     * Get menu position
     */
    getMenuPosition(): MenuPosition;
    /**
     * Set menu items
     */
    setMenuItems(items: PopoverMenuItem[]): void;
    /**
     * Get menu items
     */
    getMenuItems(): PopoverMenuItem[];
    /**
     * Set whether menu button is always visible
     */
    setAlwaysShowMenu(value: boolean): void;
    /**
     * Get whether menu button is always visible
     */
    getAlwaysShowMenu(): boolean;
    /**
     * Render the component
     */
    private render;
    /**
     * Create the popover menu
     */
    private createPopoverMenu;
    /**
     * Update popover menu items
     */
    private updatePopoverMenu;
    /**
     * Render menu items recursively
     */
    private renderMenuItems;
    /**
     * Create and show the popover menu
     */
    private createAndShowPopover;
    /**
     * Attach event listeners to menu items
     */
    private attachMenuListeners;
    /**
     * Update menu button position
     */
    private updateMenuButtonPosition;
    /**
     * Update menu button visibility
     */
    private updateMenuButtonVisibility;
    /**
     * Setup event listeners
     */
    private setupEventListeners;
    /**
     * Cleanup event listeners
     */
    private cleanupEventListeners;
    /**
     * Handle menu button click
     */
    private handleMenuButtonClick;
    /**
     * Show the menu
     */
    private showMenu;
    /**
     * Hide the menu
     */
    private hideMenu;
    /**
     * Handle document click to close menu
     */
    private handleDocumentClick;
    /**
     * Handle content click - pass through to slotted elements
     */
    private handleContentClick;
}
/**
 * Conditionally defines the custom element if in a browser environment.
 */
declare const defineContainerBox: (tagName?: string) => void;
export { defineContainerBox };
//# sourceMappingURL=ContainerBox.d.ts.map