/**
 * PopoverMenu Web Component
 * A customizable menu component using fixed positioning with support for nested submenus
 */
export type PopoverMenuItem = {
    label: string;
    enabled?: boolean;
    items?: PopoverMenuItem[];
    onclick?: () => void;
};
export type PopoverMenuConfig = {
    label: string;
    items: PopoverMenuItem[];
};
export declare class PopoverMenuElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private items;
    private openPopovers;
    private hoverTimeouts;
    private initialized;
    private globalClickHandler;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Set up global event listeners
     */
    private setupGlobalListeners;
    /**
     * Clean up global event listeners
     */
    private cleanupGlobalListeners;
    /**
     * Set menu items
     */
    setItems(items: PopoverMenuConfig[]): void;
    /**
     * Get current menu items
     */
    getItems(): PopoverMenuConfig[];
    /**
     * Add a new menu item
     */
    addMenuItem(item: PopoverMenuConfig, index?: number | null): void;
    /**
     * Remove a menu item
     */
    removeMenuItem(index: number): void;
    /**
     * Update a menu item
     */
    updateMenuItem(index: number, item: PopoverMenuConfig): void;
    /**
     * Render the menu component
     */
    private render;
    /**
     * Create a menu trigger button
     */
    private createMenuTrigger;
    /**
     * Create a popover if it doesn't exist
     */
    private createPopoverIfNeeded;
    /**
     * Populate a popover with menu items
     */
    private populatePopover;
    /**
     * Create a menu item element
     */
    private createMenuItem;
    /**
     * Show a submenu
     */
    private showSubmenu;
    /**
     * Close other submenus except the specified one and its ancestors
     */
    private closeOtherSubmenus;
    /**
     * Close all menus
     */
    private closeAllMenus;
    /**
     * Handle menu trigger click
     */
    private handleMenuTriggerClick;
    /**
     * Show the main menu
     */
    private showMainMenu;
    /**
     * Adjust popover position to handle overflow
     */
    private adjustPopoverPosition;
}
/**
 * Conditionally defines the custom element if in a browser environment.
 */
declare const definePopoverMenu: (tagName?: string) => void;
export { definePopoverMenu };
//# sourceMappingURL=PopoverMenu.d.ts.map