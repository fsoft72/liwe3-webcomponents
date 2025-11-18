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

export class ContainerBoxElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private menuPosition: MenuPosition = 'bottom-left';
  private menuItems: PopoverMenuItem[] = [];
  private alwaysShowMenu: boolean = false;
  private popoverMenu: HTMLElement | null = null;
  private menuButton: HTMLElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback(): void {
    this.cleanupEventListeners();
  }

  /**
   * Set menu position
   */
  setMenuPosition(position: MenuPosition): void {
    this.menuPosition = position;
    this.updateMenuButtonPosition();
  }

  /**
   * Get menu position
   */
  getMenuPosition(): MenuPosition {
    return this.menuPosition;
  }

  /**
   * Set menu items
   */
  setMenuItems(items: PopoverMenuItem[]): void {
    this.menuItems = items;
    this.updatePopoverMenu();
  }

  /**
   * Get menu items
   */
  getMenuItems(): PopoverMenuItem[] {
    return this.menuItems;
  }

  /**
   * Set whether menu button is always visible
   */
  setAlwaysShowMenu(value: boolean): void {
    this.alwaysShowMenu = value;
    this.updateMenuButtonVisibility();
  }

  /**
   * Get whether menu button is always visible
   */
  getAlwaysShowMenu(): boolean {
    return this.alwaysShowMenu;
  }

  /**
   * Render the component
   */
  private render(): void {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .container-box {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .content-wrapper {
          width: 100%;
          height: 100%;
        }

        .menu-button {
          position: absolute;
          background: var(--container-box-menu-bg, #fff);
          border: 1px solid var(--container-box-menu-border, #ddd);
          border-radius: var(--container-box-menu-radius, 4px);
          padding: var(--container-box-menu-padding, 6px 10px);
          cursor: pointer;
          box-shadow: var(--container-box-menu-shadow, 0 2px 8px rgba(0,0,0,0.15));
          z-index: 10;
          opacity: 0;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: var(--container-box-menu-color, #333);
        }

        .menu-button:hover {
          background: var(--container-box-menu-hover-bg, #f5f5f5);
        }

        .container-box:hover .menu-button {
          opacity: 1;
        }

        .menu-button.always-visible {
          opacity: 1;
        }

        .menu-button-icon {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Position variants */
        .menu-button.top-left {
          top: var(--container-box-menu-offset, 8px);
          left: var(--container-box-menu-offset, 8px);
        }

        .menu-button.top-right {
          top: var(--container-box-menu-offset, 8px);
          right: var(--container-box-menu-offset, 8px);
        }

        .menu-button.bottom-left {
          bottom: var(--container-box-menu-offset, 8px);
          left: var(--container-box-menu-offset, 8px);
        }

        .menu-button.bottom-right {
          bottom: var(--container-box-menu-offset, 8px);
          right: var(--container-box-menu-offset, 8px);
        }

        .popover-container {
          position: fixed;
          z-index: 10000;
          pointer-events: none;
        }

        .popover-container > * {
          pointer-events: auto;
        }
      </style>

      <div class="container-box">
        <div class="content-wrapper">
          <slot></slot>
        </div>
        <div class="menu-button ${this.menuPosition} ${this.alwaysShowMenu ? 'always-visible' : ''}">
          <span class="menu-button-icon">⋮</span>
        </div>
      </div>
      <div class="popover-container"></div>
    `;

    this.menuButton = this.shadowRoot.querySelector('.menu-button');
    this.createPopoverMenu();
  }

  /**
   * Create the popover menu
   */
  private createPopoverMenu(): void {
    // We'll create the popover dynamically when needed
  }

  /**
   * Update popover menu items
   */
  private updatePopoverMenu(): void {
    // Menu items are stored and used when showing the menu
  }

  /**
   * Render menu items recursively
   */
  private renderMenuItems(items: PopoverMenuItem[]): string {
    return items.map(item => {
      if (item.label === '---sep') {
        return '<div class="menu-separator"></div>';
      }

      const hasSubmenu = item.items && item.items.length > 0;
      const isDisabled = item.enabled === false;
      const disabledClass = isDisabled ? 'disabled' : '';
      const submenuClass = hasSubmenu ? 'has-submenu' : '';

      return `
        <div class="menu-item ${disabledClass} ${submenuClass}" data-has-submenu="${hasSubmenu}">
          <span class="menu-item-label">${item.label}</span>
          ${hasSubmenu ? '<span class="menu-item-arrow">▶</span>' : ''}
          ${hasSubmenu ? `<div class="submenu">${this.renderMenuItems(item.items!)}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  /**
   * Create and show the popover menu
   */
  private createAndShowPopover(): HTMLElement {
    const popover = document.createElement('div');
    popover.className = 'custom-popover-menu';
    popover.innerHTML = `
      <style>
        .custom-popover-menu {
          position: fixed;
          background: white;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 180px;
          z-index: 10000;
        }

        .menu-item {
          padding: 10px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background-color 0.2s;
          position: relative;
          font-size: 14px;
          color: #333;
        }

        .menu-item:hover {
          background: #f5f5f5;
        }

        .menu-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .menu-item.has-submenu:hover .submenu {
          display: block;
        }

        .menu-item-label {
          flex: 1;
        }

        .menu-item-arrow {
          margin-left: 12px;
          font-size: 10px;
          color: #666;
        }

        .menu-separator {
          height: 1px;
          background: #e0e0e0;
          margin: 4px 8px;
        }

        .submenu {
          display: none;
          position: fixed;
          background: white;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 180px;
          z-index: 10001;
        }
      </style>
      ${this.renderMenuItems(this.menuItems)}
    `;

    return popover;
  }

  /**
   * Attach event listeners to menu items
   */
  private attachMenuListeners(popover: HTMLElement, items: PopoverMenuItem[]): void {
    const menuItems = popover.querySelectorAll('.menu-item:not(.has-submenu)');
    
    menuItems.forEach((element, index) => {
      let flatIndex = 0;
      const findItem = (items: PopoverMenuItem[]): PopoverMenuItem | null => {
        for (const item of items) {
          if (item.label === '---sep') continue;
          if (!(item.items && item.items.length > 0)) {
            if (flatIndex === index) return item;
            flatIndex++;
          }
        }
        return null;
      };

      const item = findItem(items);
      if (item && item.onclick) {
        element.addEventListener('click', (e) => {
          e.stopPropagation();
          item.onclick!();
          this.hideMenu();
        });
      }
    });

    // Handle submenu positioning within container boundaries
    const containerRect = this.getBoundingClientRect();
    const submenuItems = popover.querySelectorAll('.menu-item.has-submenu');
    
    submenuItems.forEach(element => {
      element.addEventListener('mouseenter', () => {
        const submenu = element.querySelector('.submenu') as HTMLElement;
        if (submenu) {
          const rect = element.getBoundingClientRect();
          const submenuRect = submenu.getBoundingClientRect();
          
          let left = rect.right + 5;
          let top = rect.top;
          
          // Check if submenu would overflow container on the right
          if (left + submenuRect.width > containerRect.right) {
            // Try positioning to the left of the parent item
            left = rect.left - submenuRect.width - 5;
            
            // If still overflowing left, position at container left edge
            if (left < containerRect.left) {
              left = containerRect.left;
            }
          }
          
          // Check if submenu would overflow container at the bottom
          if (top + submenuRect.height > containerRect.bottom) {
            // Align bottom of submenu with bottom of container
            top = containerRect.bottom - submenuRect.height;
            
            // If still overflowing at top, position at container top
            if (top < containerRect.top) {
              top = containerRect.top;
            }
          }
          
          submenu.style.left = `${left}px`;
          submenu.style.top = `${top}px`;
        }
      });
    });
  }

  /**
   * Update menu button position
   */
  private updateMenuButtonPosition(): void {
    if (!this.menuButton) return;

    this.menuButton.className = `menu-button ${this.menuPosition} ${this.alwaysShowMenu ? 'always-visible' : ''}`;
  }

  /**
   * Update menu button visibility
   */
  private updateMenuButtonVisibility(): void {
    if (!this.menuButton) return;

    if (this.alwaysShowMenu) {
      this.menuButton.classList.add('always-visible');
    } else {
      this.menuButton.classList.remove('always-visible');
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (this.menuButton) {
      this.menuButton.addEventListener('click', this.handleMenuButtonClick.bind(this));
    }

    // Allow clicks to pass through to slotted content
    const contentWrapper = this.shadowRoot.querySelector('.content-wrapper');
    if (contentWrapper) {
      contentWrapper.addEventListener('click', this.handleContentClick.bind(this));
    }
  }

  /**
   * Cleanup event listeners
   */
  private cleanupEventListeners(): void {
    if (this.menuButton) {
      this.menuButton.removeEventListener('click', this.handleMenuButtonClick.bind(this));
    }

    const contentWrapper = this.shadowRoot.querySelector('.content-wrapper');
    if (contentWrapper) {
      contentWrapper.removeEventListener('click', this.handleContentClick.bind(this));
    }
  }

  /**
   * Handle menu button click
   */
  private handleMenuButtonClick(e: Event): void {
    e.stopPropagation();

    if (!this.menuButton) return;

    // Toggle menu visibility
    if (this.popoverMenu) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }

  /**
   * Show the menu
   */
  private showMenu(): void {
    if (!this.menuButton || this.menuItems.length === 0) return;

    // Create the popover
    if (this.popoverMenu) {
      this.popoverMenu.remove();
    }

    this.popoverMenu = this.createAndShowPopover() as any;
    document.body.appendChild(this.popoverMenu as any);

    // Get button and container bounds
    const buttonRect = this.menuButton.getBoundingClientRect();
    const containerRect = this.getBoundingClientRect();
    
    // Temporarily position to measure
    (this.popoverMenu as any).style.left = `${buttonRect.left}px`;
    (this.popoverMenu as any).style.top = `${buttonRect.bottom + 4}px`;
    
    // Wait for next frame to get accurate measurements
    requestAnimationFrame(() => {
      const menuRect = (this.popoverMenu as any).getBoundingClientRect();
      
      let left = buttonRect.left;
      let top = buttonRect.bottom + 4;
      
      // Check if menu would overflow container on the right
      if (left + menuRect.width > containerRect.right) {
        // Try to align right edge of menu with right edge of container
        left = containerRect.right - menuRect.width;
        
        // If still overflowing left, align with left edge of container
        if (left < containerRect.left) {
          left = containerRect.left;
        }
      }
      
      // Check if menu would overflow container on the left
      if (left < containerRect.left) {
        left = containerRect.left;
      }
      
      // Check if menu would overflow container at the bottom
      if (top + menuRect.height > containerRect.bottom) {
        // Try positioning above the button
        top = buttonRect.top - menuRect.height - 4;
        
        // If still overflowing at top, position at container top
        if (top < containerRect.top) {
          top = containerRect.top;
        }
      }
      
      // Check if menu would overflow container at the top
      if (top < containerRect.top) {
        top = containerRect.top;
      }
      
      // Apply final position
      (this.popoverMenu as any).style.left = `${left}px`;
      (this.popoverMenu as any).style.top = `${top}px`;
    });

    // Attach event listeners
    this.attachMenuListeners(this.popoverMenu as any, this.menuItems);

    // Add click listener to close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', this.handleDocumentClick.bind(this), { once: true });
    }, 0);
  }

  /**
   * Hide the menu
   */
  private hideMenu(): void {
    if (this.popoverMenu) {
      (this.popoverMenu as any).remove();
      this.popoverMenu = null;
    }
  }

  /**
   * Handle document click to close menu
   */
  private handleDocumentClick(e: Event): void {
    const target = e.target as Node;
    const popoverElement = this.popoverMenu as any;
    if (popoverElement && !popoverElement.contains(target) && !this.menuButton?.contains(target)) {
      this.hideMenu();
    }
  }

  /**
   * Handle content click - pass through to slotted elements
   */
  private handleContentClick(e: Event): void {
    // Get the slotted elements
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) return;

    const assignedElements = slot.assignedElements();
    if (assignedElements.length === 0) return;

    // The click naturally propagates to slotted content
    // We just need to ensure it doesn't trigger the menu
    e.stopPropagation();
  }
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
const defineContainerBox = (tagName = 'liwe3-container-box'): void => {
  if (typeof window !== 'undefined' && !window.customElements.get(tagName)) {
    customElements.define(tagName, ContainerBoxElement);
  }
};

// Auto-register with default tag name
defineContainerBox();

export { defineContainerBox };
