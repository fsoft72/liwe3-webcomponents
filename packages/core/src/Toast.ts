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
  duration?: number; // Auto-dismiss after x milliseconds (0 = no auto-dismiss, default: 5000ms)
  onClose?: () => void;
};

export class ToastElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private config: ToastConfig = {
    title: '',
    text: '',
    type: 'info',
    closable: true,
    duration: 5000
  };
  private autoCloseTimer?: number;
  private remainingTime: number = 0;
  private pauseTime: number = 0;
  private progressBar?: HTMLElement;

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
    const attrTitle = this.getAttribute( 'title' );
    const configTitle = this.config.title;

    // If no title is provided or empty, use capitalized type
    if ( ( !attrTitle || attrTitle.trim() === '' ) && ( !configTitle || configTitle.trim() === '' ) ) {
      const type = this.type;
      return type.charAt( 0 ).toUpperCase() + type.slice( 1 );
    }

    return attrTitle || configTitle;
  }

  set title ( value: string ) {
    if ( value && value.trim() !== '' ) {
      this.setAttribute( 'title', value );
      this.config.title = value;
    } else {
      this.removeAttribute( 'title' );
      this.config.title = '';
    }
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
    return this.config.duration ?? 5000;
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

    // If buttons are present, force duration to 0 (user must interact to close)
    if ( config.buttons && config.buttons.length > 0 ) {
      this.config.duration = 0;
    }

    // Sync config to attributes
    if ( config.title && config.title.trim() !== '' ) {
      this.title = config.title;
    } else {
      // Clear title if not provided or empty
      this.removeAttribute( 'title' );
      this.config.title = '';
    }
    this.text = config.text;
    if ( config.type ) this.type = config.type;
    if ( config.icon !== undefined ) this.icon = config.icon;
    if ( config.closable !== undefined ) this.closable = config.closable;
    if ( config.buttons && config.buttons.length > 0 ) {
      // Force duration to 0 when buttons are present
      this.duration = 0;
    } else if ( config.duration !== undefined ) {
      this.duration = config.duration;
    }
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

        // Animate the host element collapsing (height and margin to 0)
        const hostElement = this as unknown as HTMLElement;
        const currentHeight = hostElement.offsetHeight;

        // Set explicit height for animation
        hostElement.style.height = `${ currentHeight }px`;
        hostElement.style.marginBottom = '12px';

        // Force reflow
        void hostElement.offsetHeight;

        // Animate to 0
        hostElement.style.height = '0px';
        hostElement.style.marginBottom = '0px';
        hostElement.style.opacity = '0';

        // Wait for transition to complete, then remove
        setTimeout( () => {
          this.dispatchEvent( new CustomEvent( 'close' ) );
          if ( this.config.onClose ) {
            this.config.onClose();
          }
          this.remove();
        }, 300 );
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
      this.remainingTime = this.duration;
      this.pauseTime = Date.now();
      this.autoCloseTimer = window.setTimeout( () => {
        this.close();
      }, this.duration );

      // Start progress bar animation
      this.startProgressBarAnimation();
    }
  }

  /**
   * Pauses the auto-close timer
   */
  private pauseAutoCloseTimer (): void {
    if ( this.autoCloseTimer && this.duration > 0 ) {
      clearTimeout( this.autoCloseTimer );
      this.autoCloseTimer = undefined;
      this.remainingTime -= Date.now() - this.pauseTime;

      // Pause progress bar animation
      this.pauseProgressBarAnimation();
    }
  }

  /**
   * Resumes the auto-close timer
   */
  private resumeAutoCloseTimer (): void {
    if ( !this.autoCloseTimer && this.remainingTime > 0 ) {
      this.pauseTime = Date.now();
      this.autoCloseTimer = window.setTimeout( () => {
        this.close();
      }, this.remainingTime );

      // Resume progress bar animation
      this.resumeProgressBarAnimation();
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
   * Starts the progress bar animation
   */
  private startProgressBarAnimation (): void {
    if ( !this.progressBar || this.duration <= 0 ) return;

    // Reset and start the animation
    this.progressBar.style.animation = 'none';
    // Force a reflow to reset the animation
    void this.progressBar.offsetWidth;
    this.progressBar.style.animation = `shrinkProgress ${ this.duration }ms linear forwards`;
  }

  /**
   * Pauses the progress bar animation
   */
  private pauseProgressBarAnimation (): void {
    if ( !this.progressBar ) return;

    // Get the current computed width as a percentage of the container
    const computedStyle = window.getComputedStyle( this.progressBar );
    const currentWidth = computedStyle.width;
    const containerWidth = this.progressBar.parentElement?.offsetWidth || 1;
    const widthPercent = ( parseFloat( currentWidth ) / containerWidth ) * 100;

    // Stop the animation and set the width directly
    this.progressBar.style.animation = 'none';
    this.progressBar.style.width = `${ widthPercent }%`;
  }

  /**
   * Resumes the progress bar animation
   */
  private resumeProgressBarAnimation (): void {
    if ( !this.progressBar || this.remainingTime <= 0 ) return;

    // Get current width as starting point
    const computedStyle = window.getComputedStyle( this.progressBar );
    const currentWidth = computedStyle.width;
    const containerWidth = this.progressBar.parentElement?.offsetWidth || 1;
    const currentPercent = ( parseFloat( currentWidth ) / containerWidth ) * 100;

    // Calculate the duration based on the remaining percentage and remaining time
    // The animation should take exactly remainingTime to go from currentPercent to 0
    const adjustedDuration = this.remainingTime;

    // Create a new keyframe animation from current position to 0
    const animationName = `shrinkProgress-${ Date.now() }`;
    const styleSheet = this.shadowRoot.styleSheets[ 0 ];
    const keyframes = `
      @keyframes ${ animationName } {
        from {
          width: ${ currentPercent }%;
        }
        to {
          width: 0%;
        }
      }
    `;

    // Add the new keyframe rule
    if ( styleSheet ) {
      styleSheet.insertRule( keyframes, styleSheet.cssRules.length );
    }

    // Apply the animation
    this.progressBar.style.animation = `${ animationName } ${ adjustedDuration }ms linear forwards`;
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
    // Handle close button click and button clicks
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

    // Handle mouse enter/leave to pause/resume timer
    const container = this.shadowRoot.querySelector( '.toast-container' );
    if ( container ) {
      container.addEventListener( 'mouseenter', () => {
        this.pauseAutoCloseTimer();
      } );

      container.addEventListener( 'mouseleave', () => {
        this.resumeAutoCloseTimer();
      } );
    }
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

        .toast-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          width: 100%;
          background: var(--toast-progress-bar-color, rgba(0, 0, 0, 0.3));
          border-bottom-left-radius: var(--toast-border-radius, 8px);
          border-bottom-right-radius: var(--toast-border-radius, 8px);
          transform-origin: left;
        }

        @keyframes shrinkProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
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

        ${ this.duration > 0 ? '<div class="toast-progress-bar"></div>' : '' }
      </div>
    `;

    // Store reference to progress bar
    this.progressBar = this.shadowRoot.querySelector( '.toast-progress-bar' ) as HTMLElement;

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

/**
 * Default container ID for toast notifications
 */
const DEFAULT_CONTAINER_ID = 'liwe3-toast-container';

/**
 * Creates or gets the toast container element
 */
const getToastContainer = (): HTMLElement => {
  let container = document.getElementById( DEFAULT_CONTAINER_ID );

  if ( !container ) {
    container = document.createElement( 'div' );
    container.id = DEFAULT_CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '99999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.maxWidth = '400px';
    container.style.pointerEvents = 'none';

    // Add media query styles for mobile and smooth transitions
    const style = document.createElement( 'style' );
    style.textContent = `
      #${DEFAULT_CONTAINER_ID} > * {
        margin-bottom: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      #${DEFAULT_CONTAINER_ID} > *:last-child {
        margin-bottom: 0;
      }

      @media (max-width: 768px) {
        #${DEFAULT_CONTAINER_ID} {
          left: 20px !important;
          right: 20px !important;
          max-width: none !important;
        }
      }
    `;
    document.head.appendChild( style );

    document.body.appendChild( container );
  }

  return container;
};

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
 *   duration: 5000
 * });
 * ```
 */
const toastAdd = ( config: ToastConfig ): ToastElement => {
  const container = getToastContainer();
  const toast = document.createElement( 'liwe3-toast' ) as ToastElement;

  // Allow pointer events on individual toasts
  toast.style.pointerEvents = 'auto';

  // Show the toast with the provided config
  toast.show( config );

  // Add to container
  container.appendChild( toast );

  return toast;
};

export { defineToast, toastAdd };
