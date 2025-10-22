/**
 * Toast Web Component
 * A customizable toast notification system with multiple types, icons, buttons, and auto-dismiss
 */

export type ToastType = 'info' | 'warning' | 'error' | 'success';

export type ToastButton = {
  label: string;
  onClick: () => void;
};

export type ToastConfig = {
  title: string;
  text: string;
  type?: ToastType;
  icon?: string; // URL to icon/image
  buttons?: ToastButton[];
  closable?: boolean; // Show close X button
  duration?: number; // Auto-dismiss after x milliseconds (0 = no auto-dismiss)
  onClose?: () => void;
};

export class ToastElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private config: ToastConfig = {
    title: '',
    text: '',
    type: 'info',
    closable: true,
    duration: 0
  };
  private autoCloseTimer?: number;

  constructor () {
    super();
    this.attachShadow( { mode: 'open' } );
  }

  static get observedAttributes (): string[] {
    return [ 'title', 'text', 'type', 'icon', 'closable', 'duration', 'buttons' ];
  }

  attributeChangedCallback ( _name: string, oldValue: string | null, newValue: string | null ): void {
    if ( oldValue !== newValue ) {
      this.render();
    }
  }

  connectedCallback (): void {
    this.render();
    this.startAutoCloseTimer();
  }

  disconnectedCallback (): void {
    this.clearAutoCloseTimer();
  }

  get title (): string {
    return this.getAttribute( 'title' ) || this.config.title;
  }

  set title ( value: string ) {
    this.setAttribute( 'title', value );
    this.config.title = value;
  }

  get text (): string {
    return this.getAttribute( 'text' ) || this.config.text;
  }

  set text ( value: string ) {
    this.setAttribute( 'text', value );
    this.config.text = value;
  }

  get type (): ToastType {
    const attr = this.getAttribute( 'type' );
    return ( attr as ToastType ) || this.config.type || 'info';
  }

  set type ( value: ToastType ) {
    this.setAttribute( 'type', value );
    this.config.type = value;
  }

  get icon (): string | undefined {
    return this.getAttribute( 'icon' ) || this.config.icon;
  }

  set icon ( value: string | undefined ) {
    if ( value ) {
      this.setAttribute( 'icon', value );
      this.config.icon = value;
    } else {
      this.removeAttribute( 'icon' );
      this.config.icon = undefined;
    }
  }

  get closable (): boolean {
    if ( this.hasAttribute( 'closable' ) ) {
      return this.getAttribute( 'closable' ) !== 'false';
    }
    return this.config.closable !== false;
  }

  set closable ( value: boolean ) {
    if ( value ) {
      this.setAttribute( 'closable', 'true' );
    } else {
      this.setAttribute( 'closable', 'false' );
    }
    this.config.closable = value;
  }

  get duration (): number {
    const attr = this.getAttribute( 'duration' );
    if ( attr ) {
      return parseInt( attr, 10 );
    }
    return this.config.duration || 0;
  }

  set duration ( value: number ) {
    this.setAttribute( 'duration', value.toString() );
    this.config.duration = value;
  }

  get buttons (): ToastButton[] {
    const attr = this.getAttribute( 'buttons' );
    if ( attr ) {
      try {
        return JSON.parse( attr );
      } catch ( e ) {
        console.error( 'Invalid buttons format:', e );
        return [];
      }
    }
    return this.config.buttons || [];
  }

  set buttons ( value: ToastButton[] ) {
    this.setAttribute( 'buttons', JSON.stringify( value ) );
    this.config.buttons = value;
  }

  /**
   * Shows the toast with the given configuration
   */
  show ( config: ToastConfig ): void {
    this.config = { ...this.config, ...config };

    // Sync config to attributes
    this.title = config.title;
    this.text = config.text;
    if ( config.type ) this.type = config.type;
    if ( config.icon !== undefined ) this.icon = config.icon;
    if ( config.closable !== undefined ) this.closable = config.closable;
    if ( config.duration !== undefined ) this.duration = config.duration;
    if ( config.buttons ) this.buttons = config.buttons;

    this.render();
    this.startAutoCloseTimer();
  }

  /**
   * Closes the toast
   */
  close (): void {
    this.clearAutoCloseTimer();

    // Add closing animation
    const container = this.shadowRoot.querySelector( '.toast-container' ) as HTMLElement;
    if ( container ) {
      // Use requestAnimationFrame to ensure smooth animation
      requestAnimationFrame( () => {
        container.classList.add( 'closing' );
      } );

      // Listen for animation end event for smoother transition
      const handleAnimationEnd = () => {
        container.removeEventListener( 'animationend', handleAnimationEnd );
        this.dispatchEvent( new CustomEvent( 'close' ) );
        if ( this.config.onClose ) {
          this.config.onClose();
        }
        this.remove();
      };

      container.addEventListener( 'animationend', handleAnimationEnd );

      // Fallback timeout in case animationend doesn't fire
      setTimeout( () => {
        if ( this.isConnected ) {
          handleAnimationEnd();
        }
      }, 350 );
    } else {
      this.dispatchEvent( new CustomEvent( 'close' ) );
      if ( this.config.onClose ) {
        this.config.onClose();
      }
      this.remove();
    }
  }

  /**
   * Starts the auto-close timer if duration is set
   */
  private startAutoCloseTimer (): void {
    this.clearAutoCloseTimer();

    if ( this.duration > 0 ) {
      this.autoCloseTimer = window.setTimeout( () => {
        this.close();
      }, this.duration );
    }
  }

  /**
   * Clears the auto-close timer
   */
  private clearAutoCloseTimer (): void {
    if ( this.autoCloseTimer ) {
      clearTimeout( this.autoCloseTimer );
      this.autoCloseTimer = undefined;
    }
  }

  /**
   * Gets the color scheme for the toast type
   */
  private getTypeColors (): { background: string; border: string; icon: string } {
    const type = this.type;

    switch ( type ) {
      case 'success':
        return {
          background: 'var(--toast-success-background, #d4edda)',
          border: 'var(--toast-success-border, #c3e6cb)',
          icon: 'var(--toast-success-icon, #155724)'
        };
      case 'error':
        return {
          background: 'var(--toast-error-background, #f8d7da)',
          border: 'var(--toast-error-border, #f5c6cb)',
          icon: 'var(--toast-error-icon, #721c24)'
        };
      case 'warning':
        return {
          background: 'var(--toast-warning-background, #fff3cd)',
          border: 'var(--toast-warning-border, #ffeaa7)',
          icon: 'var(--toast-warning-icon, #856404)'
        };
      case 'info':
      default:
        return {
          background: 'var(--toast-info-background, #d1ecf1)',
          border: 'var(--toast-info-border, #bee5eb)',
          icon: 'var(--toast-info-icon, #0c5460)'
        };
    }
  }

  /**
   * Gets the default icon for the toast type
   */
  private getDefaultIcon (): string {
    const type = this.type;

    switch ( type ) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  /**
   * Binds all event listeners
   */
  private bindEvents (): void {
    // Handle close button click
    this.shadowRoot.addEventListener( 'click', ( e ) => {
      const target = e.target as HTMLElement;

      if ( target.closest( '.close-button' ) ) {
        this.close();
      } else if ( target.closest( '.toast-button' ) ) {
        const buttonIndex = ( target.closest( '.toast-button' ) as HTMLElement ).dataset.index;
        if ( buttonIndex !== undefined ) {
          const button = this.buttons[ parseInt( buttonIndex, 10 ) ];
          if ( button && button.onClick ) {
            button.onClick();
          }
        }
      }
    } );
  }

  /**
   * Renders the component
   */
  private render (): void {
    const colors = this.getTypeColors();
    const iconContent = this.icon
      ? `<img src="${ this.icon }" alt="Toast icon" class="toast-icon-img" />`
      : `<span class="toast-icon-default">${ this.getDefaultIcon() }</span>`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-size: var(--font-size, 14px);
        }

        .toast-container {
          display: flex;
          flex-direction: column;
          min-width: 300px;
          max-width: 500px;
          padding: 16px;
          background: ${ colors.background };
          border: 1px solid ${ colors.border };
          border-radius: var(--toast-border-radius, 8px);
          box-shadow: var(--toast-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          will-change: transform, opacity;
        }

        .toast-container.closing {
          animation: slideOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }

        .toast-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        .toast-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${ colors.icon };
        }

        .toast-icon-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .toast-icon-default {
          font-size: 20px;
          font-weight: bold;
        }

        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-weight: 600;
          font-size: 16px;
          margin: 0 0 4px 0;
          color: var(--toast-title-color, #333);
        }

        .toast-text {
          margin: 0;
          color: var(--toast-text-color, #555);
          line-height: 1.5;
          word-wrap: break-word;
        }

        .close-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: var(--toast-close-color, #666);
          border-radius: 4px;
          transition: background-color 0.2s, color 0.2s;
          padding: 0;
        }

        .close-button:hover {
          background-color: var(--toast-close-hover-background, rgba(0, 0, 0, 0.1));
          color: var(--toast-close-hover-color, #333);
        }

        .toast-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--toast-button-border, rgba(0, 0, 0, 0.1));
        }

        .toast-button {
          padding: 6px 16px;
          border: 1px solid var(--toast-button-border-color, #ccc);
          border-radius: var(--toast-button-border-radius, 4px);
          background: var(--toast-button-background, white);
          color: var(--toast-button-color, #333);
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s;
          font-family: inherit;
        }

        .toast-button:hover {
          background-color: var(--toast-button-hover-background, #f8f9fa);
          border-color: var(--toast-button-hover-border-color, #999);
        }

        .toast-button:active {
          background-color: var(--toast-button-active-background, #e9ecef);
        }
      </style>

      <div class="toast-container">
        ${ this.closable ? '<button class="close-button" aria-label="Close">×</button>' : '' }

        <div class="toast-header">
          <div class="toast-icon">
            ${ iconContent }
          </div>
          <div class="toast-content">
            <h4 class="toast-title">${ this.title }</h4>
            <p class="toast-text">${ this.text }</p>
          </div>
        </div>

        ${ this.buttons.length > 0 ? `
          <div class="toast-buttons">
            ${ this.buttons.map( ( button, index ) => `
              <button class="toast-button" data-index="${ index }">
                ${ button.label }
              </button>
            `).join( '' ) }
          </div>
        ` : '' }
      </div>
    `;

    this.bindEvents();
  }
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
const defineToast = ( tagName: string = 'liwe3-toast' ): void => {
  if ( typeof window !== 'undefined' && !window.customElements.get( tagName ) ) {
    customElements.define( tagName, ToastElement );
  }
};

// Auto-register with default tag name
defineToast();

export { defineToast };
