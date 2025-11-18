/**
 * Drawer Web Component
 * A container that can be expanded, shrunk, or closed with smooth animations
 */

export type DrawerDirection = 'horizontal' | 'vertical';
export type DrawerState = 'expanded' | 'shrunk' | 'closed';

export interface DrawerConfig {
  direction?: DrawerDirection;
  duration?: number;
  showTitleWhenShrunk?: boolean;
  closable?: boolean;
  title?: string;
  icon?: string;
  showToggleButton?: boolean;
  contentPadding?: string;
}

export class DrawerElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private currentState: DrawerState = 'expanded';
  private config: DrawerConfig = {
    direction: 'horizontal',
    duration: 300,
    showTitleWhenShrunk: false,
    closable: true,
    title: '',
    icon: '☰',
    showToggleButton: true,
    contentPadding: '16px'
  };

  constructor () {
    super();
    this.attachShadow( { mode: 'open' } );
    this.render();
    this.bindEvents();
  }

  static get observedAttributes (): string[] {
    return [ 'direction', 'duration', 'show-title-when-shrunk', 'closable', 'title', 'icon', 'state', 'show-toggle-button', 'content-padding' ];
  }

  attributeChangedCallback ( name: string, oldValue: string | null, newValue: string | null ): void {
    if ( oldValue !== newValue ) {
      switch ( name ) {
        case 'direction':
          this.config.direction = ( newValue as DrawerDirection ) || 'horizontal';
          break;
        case 'duration':
          this.config.duration = parseInt( newValue || '300', 10 );
          break;
        case 'show-title-when-shrunk':
          this.config.showTitleWhenShrunk = newValue === 'true';
          break;
        case 'closable':
          this.config.closable = newValue !== 'false';
          break;
        case 'title':
          this.config.title = newValue || '';
          break;
        case 'icon':
          this.config.icon = newValue || '☰';
          break;
        case 'state':
          this.currentState = ( newValue as DrawerState ) || 'expanded';
          break;
        case 'show-toggle-button':
          this.config.showToggleButton = newValue !== 'false';
          break;
        case 'content-padding':
          this.config.contentPadding = newValue ?? undefined;
          break;
      }
      this.render();
    }
  }

  get direction (): DrawerDirection {
    return this.config.direction!;
  }

  set direction ( value: DrawerDirection ) {
    this.config.direction = value;
    this.setAttribute( 'direction', value );
  }

  get duration (): number {
    return this.config.duration!;
  }

  set duration ( value: number ) {
    this.config.duration = value;
    this.setAttribute( 'duration', value.toString() );
  }

  get showTitleWhenShrunk (): boolean {
    return this.config.showTitleWhenShrunk!;
  }

  set showTitleWhenShrunk ( value: boolean ) {
    this.config.showTitleWhenShrunk = value;
    this.setAttribute( 'show-title-when-shrunk', value.toString() );
  }

  get closable (): boolean {
    return this.config.closable!;
  }

  set closable ( value: boolean ) {
    this.config.closable = value;
    this.setAttribute( 'closable', value.toString() );
  }

  get title (): string {
    return this.config.title!;
  }

  set title ( value: string ) {
    this.config.title = value;
    this.setAttribute( 'title', value );
  }

  get icon (): string {
    return this.config.icon!;
  }

  set icon ( value: string ) {
    this.config.icon = value;
    this.setAttribute( 'icon', value );
  }

  get showToggleButton (): boolean {
    return this.config.showToggleButton!;
  }

  set showToggleButton ( value: boolean ) {
    this.config.showToggleButton = value;
    this.setAttribute( 'show-toggle-button', value.toString() );
  }

  get contentPadding (): string {
    return this.config.contentPadding ?? '16px';
  }

  set contentPadding ( value: string ) {
    this.config.contentPadding = value;
    this.setAttribute( 'content-padding', value );
  }

  get state (): DrawerState {
    return this.currentState;
  }

  set state ( value: DrawerState ) {
    this.setState( value );
  }

  /**
   * Expand the drawer
   */
  expand (): void {
    this.setState( 'expanded' );
  }

  /**
   * Shrink the drawer
   */
  shrink (): void {
    this.setState( 'shrunk' );
  }

  /**
   * Close the drawer (removes from DOM)
   */
  close (): void {
    this.setState( 'closed' );
  }

  /**
   * Toggle between expanded and shrunk states
   */
  toggle (): void {
    if ( this.currentState === 'expanded' ) {
      this.shrink();
    } else if ( this.currentState === 'shrunk' ) {
      this.expand();
    }
  }

  private setState ( newState: DrawerState ): void {
    const oldState = this.currentState;
    this.currentState = newState;
    this.setAttribute( 'state', newState );

    const container = this.shadowRoot.querySelector( '.drawer-container' ) as HTMLElement;
    if ( !container ) return;

    // Dispatch state change event
    this.dispatchEvent( new CustomEvent( 'drawer-state-change', {
      detail: { oldState, newState },
      bubbles: true,
      composed: true
    } ) );

    if ( newState === 'closed' ) {
      // Immediately remove from DOM (no animation) without visual jump
      container.style.display = 'none';
      this.dispatchEvent( new CustomEvent( 'drawer-closed', { bubbles: true, composed: true } ) );
      this.remove();
      return;
    }

    if ( newState === 'shrunk' ) {
      container.style.display = 'block';
      container.classList.add( 'shrunk' );
      container.classList.remove( 'expanded' );
      this.dispatchEvent( new CustomEvent( 'drawer-shrunk', { bubbles: true, composed: true } ) );
      return;
    }

    if ( newState === 'expanded' ) {
      container.style.display = 'block';
      container.classList.remove( 'shrunk' );
      container.classList.add( 'expanded' );
      this.dispatchEvent( new CustomEvent( 'drawer-expanded', { bubbles: true, composed: true } ) );
      return;
    }
  }

  private bindEvents (): void {
    this.shadowRoot.addEventListener( 'click', ( e ) => {
      const target = e.target as HTMLElement;

      if ( target.closest( '.drawer-toggle' ) ) {
        e.preventDefault();
        this.toggle();
      }

      if ( target.closest( '.drawer-close' ) && this.config.closable ) {
        e.preventDefault();
        this.close();
      }
    } );
  }

  private render (): void {
    const isHorizontal = this.config.direction === 'horizontal';
    const showTitle = this.config.showTitleWhenShrunk;
    const showToggleButton = this.config.showToggleButton !== false;
    const contentPadding = this.config.contentPadding ?? '16px';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --drawer-duration: ${ this.config.duration }ms;
          --drawer-bg: #ffffff;
          --drawer-border: #e5e7eb;
          --drawer-text: #1f2937;
          --drawer-icon-bg: #f3f4f6;
          --drawer-icon-hover: #e5e7eb;
          --drawer-button-hover: #f9fafb;
          --drawer-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* Container when expanded */
        .drawer-container {
          background: var(--drawer-bg);
          border: 1px solid var(--drawer-border);
          border-radius: 8px;
          box-shadow: var(--drawer-shadow);
          overflow: hidden;
          position: relative;
        }

        .drawer-container.horizontal {
          width: var(--drawer-horizontal-size, 300px);
          height: auto;
          transition: none;
        }

        .drawer-container.vertical {
          width: auto;
          height: var(--drawer-vertical-size, 300px);
          transition: none;
        }

        .drawer-container.expanded {
          opacity: 1;
        }

        .drawer-container.shrunk.horizontal {
          width: var(--drawer-horizontal-shrunk-size, 48px);
        }

        .drawer-container.shrunk.vertical {
          height: var(--drawer-vertical-shrunk-size, 48px);
        }

        /* Header area with title and buttons */
        .drawer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-bottom: 1px solid var(--drawer-border);
          transition: none;
        }

        .drawer-container.shrunk .drawer-header {
          border-bottom: none;
        }

        .drawer-container.shrunk .drawer-title:not(.keep-visible),
        .drawer-container.shrunk .drawer-close {
          display: none;
        }

        .drawer-container.shrunk .drawer-title.keep-visible {
          display: block;
        }

        .drawer-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--drawer-icon-bg);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .drawer-toggle:hover {
          background: var(--drawer-icon-hover);
        }

        .drawer-title {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          color: var(--drawer-text);
          transition: none;
          white-space: nowrap;
          overflow: hidden;
        }

        .drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          color: #6b7280;
          transition: none;
          flex-shrink: 0;
        }

        .drawer-close:hover {
          background: var(--drawer-button-hover);
          color: #ef4444;
        }

        /* Content area */
        .drawer-content {
          padding: var(--drawer-content-padding, 16px);
          transition: none;
          overflow: auto;
        }

        .drawer-container.shrunk .drawer-content {
          opacity: 0;
          height: 0;
          padding: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
        }

        /* Vertical specific styles */
        .drawer-container.vertical {
          display: flex;
          flex-direction: column;
        }

        .drawer-container.vertical .drawer-content {
          flex: 1;
          overflow: auto;
        }
      </style>

      <div class="drawer-container ${ isHorizontal ? 'horizontal' : 'vertical' } ${ this.currentState }" style="display:block; --drawer-content-padding:${ contentPadding };">
        <div class="drawer-header">
          ${ showToggleButton ? `
          <button class="drawer-toggle" aria-label="Toggle drawer">
            ${ this.config.icon }
          </button>
          ` : '' }
          <div class="drawer-title ${ showTitle ? 'keep-visible' : '' }">
            ${ this.config.title }
          </div>
          ${ this.config.closable ? `
            <button class=\"drawer-close\" aria-label=\"Close drawer\">\n              ×\n            </button>
          ` : '' }
        </div>
        <div class="drawer-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// Auto-register the custom element
if ( !customElements.get( 'liwe3-drawer' ) ) {
  customElements.define( 'liwe3-drawer', DrawerElement );
}

// Export a function to manually register with a custom tag name
export function defineDrawer ( tagName: string = 'liwe3-drawer' ): void {
  if ( !customElements.get( tagName ) ) {
    customElements.define( tagName, DrawerElement );
  }
}
