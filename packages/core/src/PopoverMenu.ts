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

export class PopoverMenuElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private items: PopoverMenuConfig[] = [];
  private openPopovers: Map<string, HTMLElement> = new Map();
  private hoverTimeouts: Map<string, number> = new Map();
  private initialized = false;
  private globalClickHandler: ( ( e: MouseEvent ) => void ) | null = null;

  constructor () {
    super();
    this.attachShadow( { mode: 'open' } );
  }

  connectedCallback (): void {
    if ( !this.initialized ) {
      this.render();
      this.setupGlobalListeners();
      this.initialized = true;
    }
  }

  disconnectedCallback (): void {
    this.cleanupGlobalListeners();
  }

  /**
   * Set up global event listeners
   */
  private setupGlobalListeners (): void {
    // Add global click listener to close menus when clicking outside
    this.globalClickHandler = ( e: MouseEvent ) => {
      if ( !this.contains( e.target as Node ) && !this.shadowRoot.contains( e.target as Node ) ) {
        this.closeAllMenus();
      }
    };
    document.addEventListener( 'click', this.globalClickHandler );
  }

  /**
   * Clean up global event listeners
   */
  private cleanupGlobalListeners (): void {
    if ( this.globalClickHandler ) {
      document.removeEventListener( 'click', this.globalClickHandler );
      this.globalClickHandler = null;
    }
  }

  /**
   * Set menu items
   */
  setItems ( items: PopoverMenuConfig[] ): void {
    this.items = items;
    this.render();
  }

  /**
   * Get current menu items
   */
  getItems (): PopoverMenuConfig[] {
    return this.items;
  }

  /**
   * Add a new menu item
   */
  addMenuItem ( item: PopoverMenuConfig, index: number | null = null ): void {
    if ( index === null ) {
      this.items.push( item );
    } else {
      this.items.splice( index, 0, item );
    }
    this.render();
  }

  /**
   * Remove a menu item
   */
  removeMenuItem ( index: number ): void {
    if ( index >= 0 && index < this.items.length ) {
      this.items.splice( index, 1 );
      this.render();
    }
  }

  /**
   * Update a menu item
   */
  updateMenuItem ( index: number, item: PopoverMenuConfig ): void {
    if ( index >= 0 && index < this.items.length ) {
      this.items[ index ] = item;
      this.render();
    }
  }

  /**
   * Render the menu component
   */
  private render (): void {
    // Clear all existing content
    const existingContainer = this.shadowRoot.querySelector( '.popover-menu-bar' );
    if ( existingContainer ) {
      existingContainer.remove();
    }

    // Clear popover tracking
    this.openPopovers.clear();

    // Clear any existing hover timeouts
    this.hoverTimeouts.forEach( timeout => clearTimeout( timeout ) );
    this.hoverTimeouts.clear();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        /* PopoverMenu Component Styles */
        .popover-menu-bar {
          display: flex;
          background: var(--popover-menu-bar-background, #fff);
          border: 1px solid var(--popover-menu-bar-border, #ddd);
          border-radius: var(--popover-menu-bar-radius, 6px);
          padding: var(--popover-menu-bar-padding, 4px);
          box-shadow: var(--popover-menu-bar-shadow, 0 1px 3px rgba(0,0,0,0.1));
        }

        .popover-menu-trigger {
          background: none;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          transition: background-color 0.2s;
          font-family: inherit;
          color: var(--popover-menu-trigger-color, #333);
        }

        .popover-menu-trigger:hover {
          background: var(--popover-menu-trigger-hover-bg, #f0f0f0);
        }

        .popover-menu-trigger.active {
          background: var(--popover-menu-trigger-active-bg, #e3f2fd);
          color: var(--popover-menu-trigger-active-color, #1976d2);
        }

        .popover-menu-popover {
          margin: 0;
          padding: 4px;
          border: 1px solid var(--popover-menu-border, #ccc);
          border-radius: var(--popover-menu-radius, 6px);
          background: var(--popover-menu-background, white);
          box-shadow: var(--popover-menu-shadow, 0 4px 12px rgba(0,0,0,0.15));
          min-width: 180px;
          z-index: 1000;
          font-family: inherit;
          position: fixed;
          display: none;
        }

        .popover-menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          transition: background-color 0.2s;
          position: relative;
          color: var(--popover-menu-item-color, #333);
        }

        .popover-menu-item:hover {
          background: var(--popover-menu-item-hover-bg, #f5f5f5);
        }

        .popover-menu-item.disabled {
          color: var(--popover-menu-item-disabled-color, #999);
          cursor: not-allowed;
        }

        .popover-menu-item.disabled:hover {
          background: transparent;
        }

        .popover-menu-item.has-submenu::after {
          content: '▶';
          font-size: 10px;
          color: var(--popover-menu-submenu-arrow-color, #666);
        }

        .popover-menu-separator {
          height: 1px;
          background: var(--popover-menu-separator-color, #e0e0e0);
          margin: 4px 0;
        }

        .popover-submenu-popover {
          margin: 0;
          padding: 4px;
          border: 1px solid var(--popover-menu-border, #ccc);
          border-radius: var(--popover-menu-radius, 6px);
          background: var(--popover-menu-background, white);
          box-shadow: var(--popover-menu-shadow, 0 4px 12px rgba(0,0,0,0.15));
          min-width: 160px;
          z-index: 1001;
          font-family: inherit;
          position: fixed;
          display: none;
        }
      </style>
      <div class="popover-menu-bar"></div>
    `;

    const menuBar = this.shadowRoot.querySelector( '.popover-menu-bar' ) as HTMLElement;

    this.items.forEach( ( item, index ) => {
      const trigger = this.createMenuTrigger( item, index );
      menuBar.appendChild( trigger );
    } );
  }

  /**
   * Create a menu trigger button
   */
  private createMenuTrigger ( item: PopoverMenuConfig, index: number ): HTMLElement {
    const trigger = document.createElement( 'button' );
    trigger.className = 'popover-menu-trigger';
    trigger.textContent = item.label;
    trigger.dataset.menuIndex = index.toString();

    trigger.addEventListener( 'click', ( e ) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleMenuTriggerClick( trigger, item.items, index );
    } );

    return trigger;
  }

  /**
   * Create a popover if it doesn't exist
   */
  private createPopoverIfNeeded ( items: PopoverMenuItem[], id: string, isSubmenu = false ): HTMLElement {
    let popover = this.shadowRoot.querySelector( `#${ id }` ) as HTMLElement;

    if ( !popover ) {
      popover = document.createElement( 'div' );
      popover.id = id;
      popover.className = isSubmenu ? 'popover-submenu-popover' : 'popover-menu-popover';
      popover.style.display = 'none';
      popover.style.position = 'fixed';
      this.shadowRoot.appendChild( popover );

      // Track this popover
      this.openPopovers.set( id, popover );
    }

    // Always repopulate with current items to ensure content is up-to-date
    this.populatePopover( popover, items, id );

    return popover;
  }

  /**
   * Populate a popover with menu items
   */
  private populatePopover ( popover: HTMLElement, items: PopoverMenuItem[], baseId: string ): void {
    popover.innerHTML = '';

    items.forEach( ( item, index ) => {
      if ( item.label === '---sep' ) {
        const separator = document.createElement( 'div' );
        separator.className = 'popover-menu-separator';
        popover.appendChild( separator );
      } else {
        const menuItem = this.createMenuItem( item, `${ baseId }-item-${ index }` );
        popover.appendChild( menuItem );
      }
    } );
  }

  /**
   * Create a menu item element
   */
  private createMenuItem ( item: PopoverMenuItem, id: string ): HTMLElement {
    const menuItem = document.createElement( 'div' );
    menuItem.className = 'popover-menu-item';
    menuItem.textContent = item.label;

    if ( item.enabled === false ) {
      menuItem.classList.add( 'disabled' );
      return menuItem;
    }

    if ( item.items && item.items.length > 0 ) {
      // Has submenu
      menuItem.classList.add( 'has-submenu' );
      const submenuId = `${ id }-submenu`;

      let hoverTimeout: number;

      menuItem.addEventListener( 'mouseenter', ( e ) => {
        e.stopPropagation();

        // Clear any existing timeout
        if ( this.hoverTimeouts.has( submenuId ) ) {
          clearTimeout( this.hoverTimeouts.get( submenuId ) );
        }

        hoverTimeout = window.setTimeout( () => {
          this.closeOtherSubmenus( submenuId );
          this.showSubmenu( item.items!, submenuId, menuItem );
        }, 100 );

        this.hoverTimeouts.set( submenuId, hoverTimeout );
      } );

      menuItem.addEventListener( 'mouseleave', ( e ) => {
        e.stopPropagation();
      } );

      menuItem.addEventListener( 'click', ( e ) => {
        e.stopPropagation();
        this.closeOtherSubmenus( submenuId );
        this.showSubmenu( item.items!, submenuId, menuItem );
      } );
    } else if ( item.onclick ) {
      // Regular menu item with click handler
      menuItem.addEventListener( 'click', ( e ) => {
        e.stopPropagation();
        item.onclick!();
        this.closeAllMenus();
      } );
    }

    return menuItem;
  }

  /**
   * Show a submenu
   */
  private showSubmenu ( items: PopoverMenuItem[], submenuId: string, parentItem: HTMLElement ): void {
    const submenu = this.createPopoverIfNeeded( items, submenuId, true );

    // Show the menu first so it's in the DOM and can be measured
    submenu.style.display = 'block';

    // Get the parent item's position AFTER showing the menu
    const rect = parentItem.getBoundingClientRect();
    submenu.style.position = 'fixed';
    submenu.style.left = `${ rect.right + 5 }px`;
    submenu.style.top = `${ rect.top }px`;

    // Adjust position with comprehensive overflow handling
    requestAnimationFrame( () => {
      const newRect = parentItem.getBoundingClientRect();
      this.adjustPopoverPosition( submenu, newRect, 'submenu' );
    } );
  }

  /**
   * Close other submenus except the specified one and its ancestors
   */
  private closeOtherSubmenus ( exceptSubmenuId: string | null = null ): void {
    // Build a set of IDs to keep open (the submenu being opened and all its ancestors)
    const idsToKeep = new Set<string>();
    if ( exceptSubmenuId ) {
      idsToKeep.add( exceptSubmenuId );

      // Add all ancestor IDs by traversing up the ID hierarchy
      let currentId = exceptSubmenuId;
      while ( currentId.includes( '-submenu' ) ) {
        // Remove the last submenu part to get the parent
        const lastSubmenuIndex = currentId.lastIndexOf( '-submenu' );
        if ( lastSubmenuIndex > 0 ) {
          // Find the item part before this submenu
          const beforeSubmenu = currentId.substring( 0, lastSubmenuIndex );
          const lastItemIndex = beforeSubmenu.lastIndexOf( '-item-' );
          if ( lastItemIndex > 0 ) {
            currentId = currentId.substring( 0, lastItemIndex );
            if ( currentId.endsWith( '-submenu' ) ) {
              idsToKeep.add( currentId );
            }
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    // Close all submenus that are not in the keep set
    this.openPopovers.forEach( ( popover, id ) => {
      if ( !idsToKeep.has( id ) && popover.classList.contains( 'popover-submenu-popover' ) ) {
        popover.style.display = 'none';
      }
    } );
  }

  /**
   * Close all menus
   */
  private closeAllMenus (): void {
    // Clear all hover timeouts
    this.hoverTimeouts.forEach( timeout => clearTimeout( timeout ) );
    this.hoverTimeouts.clear();

    this.openPopovers.forEach( popover => {
      popover.style.display = 'none';
    } );

    // Remove active class from all triggers
    this.shadowRoot.querySelectorAll( '.popover-menu-trigger' ).forEach( t => t.classList.remove( 'active' ) );
  }

  /**
   * Handle menu trigger click
   */
  private handleMenuTriggerClick ( trigger: HTMLElement, items: PopoverMenuItem[], index: number ): void {
    const popoverId = `menu-${ index }`;
    const popover = this.shadowRoot.querySelector( `#${ popoverId }` ) as HTMLElement;

    if ( popover && popover.style.display === 'block' ) {
      // Menu is open, close it
      this.closeAllMenus();
    } else {
      // Close other menus first
      this.closeAllMenus();

      // Create the popover and show it
      const mainPopover = this.createPopoverIfNeeded( items, popoverId );

      // Add active class to clicked trigger
      trigger.classList.add( 'active' );

      // Position and show the popover
      this.showMainMenu( mainPopover, trigger );
    }
  }

  /**
   * Show the main menu
   */
  private showMainMenu ( popover: HTMLElement, trigger: HTMLElement ): void {
    // Show the menu first so it's in the DOM and can be measured
    popover.style.display = 'block';

    const rect = trigger.getBoundingClientRect();
    popover.style.position = 'fixed';
    popover.style.left = `${ rect.left }px`;
    popover.style.top = `${ rect.bottom + 2 }px`;

    // Adjust position with comprehensive overflow handling
    requestAnimationFrame( () => {
      const updatedRect = trigger.getBoundingClientRect();
      this.adjustPopoverPosition( popover, updatedRect, 'main' );
    } );
  }

  /**
   * Adjust popover position to handle overflow
   */
  private adjustPopoverPosition ( popover: HTMLElement, triggerRect: DOMRect, type: 'main' | 'submenu' ): void {
    const popoverRect = popover.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 10; // Minimum margin from screen edges

    let newLeft = parseFloat( popover.style.left );
    let newTop = parseFloat( popover.style.top );

    if ( type === 'main' ) {
      // Main menu positioning

      // Handle horizontal overflow - check right edge first
      if ( popoverRect.right > viewportWidth - margin ) {
        // If overflowing right, align right edge of popover with right edge of trigger
        newLeft = triggerRect.right - popoverRect.width;
      }

      // Then ensure minimum margin from left edge
      if ( newLeft < margin ) {
        newLeft = margin;
      }

      // If popover is wider than viewport, center it
      if ( popoverRect.width > viewportWidth - ( 2 * margin ) ) {
        newLeft = margin;
      }

      // Handle vertical overflow - check bottom first
      if ( popoverRect.bottom > viewportHeight - margin ) {
        // Try positioning above the trigger
        newTop = triggerRect.top - popoverRect.height - 2;

        // If positioning above would go off-screen, position at bottom margin
        if ( newTop < margin ) {
          newTop = viewportHeight - popoverRect.height - margin;
        }
      }

      // Ensure minimum margin from top
      if ( newTop < margin ) {
        newTop = margin;
      }

      // If popover is taller than viewport, position at top margin
      if ( popoverRect.height > viewportHeight - ( 2 * margin ) ) {
        newTop = margin;
      }

    } else if ( type === 'submenu' ) {
      // Submenu positioning

      // Handle horizontal overflow
      if ( popoverRect.right > viewportWidth - margin ) {
        // Position to the left of the parent item
        newLeft = triggerRect.left - popoverRect.width - 5;

        // If still overflowing left, position at margin from left edge
        if ( newLeft < margin ) {
          newLeft = margin;
        }
      }

      // Ensure minimum margin from left edge
      if ( newLeft < margin ) {
        newLeft = margin;
      }

      // Handle vertical overflow
      if ( popoverRect.bottom > viewportHeight - margin ) {
        // Try aligning bottom of submenu with bottom of parent item
        newTop = triggerRect.bottom - popoverRect.height;

        // If that would go off-screen at top, position at bottom margin
        if ( newTop < margin ) {
          newTop = viewportHeight - popoverRect.height - margin;
        }
      }

      // Ensure minimum margin from top
      if ( newTop < margin ) {
        newTop = margin;
      }

      // If submenu is taller than viewport, position at top margin
      if ( popoverRect.height > viewportHeight - ( 2 * margin ) ) {
        newTop = margin;
      }
    }

    // Apply the new position
    popover.style.left = `${ newLeft }px`;
    popover.style.top = `${ newTop }px`;
  }
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
const definePopoverMenu = ( tagName = 'liwe3-popover-menu' ): void => {
  if ( typeof window !== 'undefined' && !window.customElements.get( tagName ) ) {
    customElements.define( tagName, PopoverMenuElement );
  }
};

// Auto-register with default tag name
definePopoverMenu();

export { definePopoverMenu };
