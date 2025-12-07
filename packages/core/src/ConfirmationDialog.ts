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
  title?: string; // Default: "Confirmation Dialog"
  body: string; // HTML content
  buttons?: ConfirmationDialogButton[];
  modal?: boolean; // If true, dims background and prevents interaction outside dialog
  escToClose?: boolean; // If true, Esc key closes dialog
  clickToClose?: boolean; // If true, clicking outside closes dialog (like cancel)
  onClose?: () => void;
};

export class ConfirmationDialogElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private config: ConfirmationDialogConfig = {
    title: 'Confirmation Dialog',
    body: '',
    modal: true,
    escToClose: true,
    clickToClose: true
  };
  private backdrop?: HTMLElement;
  private escKeyHandler?: ( e: KeyboardEvent ) => void;
  private eventsBound: boolean = false;

  constructor () {
    super();
    this.attachShadow( { mode: 'open' } );
  }

  connectedCallback (): void {
    this.render();
    this.setupKeyboardListeners();
  }

  disconnectedCallback (): void {
    this.removeKeyboardListeners();
    if ( this.backdrop ) {
      this.backdrop.remove();
    }
  }

  /**
   * Shows the dialog with the given configuration
   */
  show ( config: ConfirmationDialogConfig ): void {
    this.config = { ...this.config, ...config };
    this.render();
    this.setupKeyboardListeners();

    // Create backdrop if modal is enabled
    if ( this.config.modal ) {
      this.createBackdrop();
    }

    // Add opening animation class
    requestAnimationFrame( () => {
      const dialog = this.shadowRoot.querySelector( '.dialog-container' ) as HTMLElement;
      if ( dialog ) {
        dialog.classList.add( 'show' );
      }
      if ( this.backdrop ) {
        this.backdrop.classList.add( 'show' );
      }
    } );
  }

  /**
   * Closes the dialog
   */
  close (): void {
    const dialog = this.shadowRoot.querySelector( '.dialog-container' ) as HTMLElement;

    // Add closing animation
    if ( dialog ) {
      dialog.classList.add( 'closing' );
    }
    if ( this.backdrop ) {
      this.backdrop.classList.add( 'closing' );
    }

    // Wait for animation to complete
    setTimeout( () => {
      this.removeKeyboardListeners();
      if ( this.backdrop ) {
        this.backdrop.remove();
        this.backdrop = undefined;
      }

      this.dispatchEvent( new CustomEvent( 'close' ) );
      if ( this.config.onClose ) {
        this.config.onClose();
      }
      this.remove();
    }, 300 );
  }

  /**
   * Creates the modal backdrop
   */
  private createBackdrop (): void {
    if ( this.backdrop ) return;

    this.backdrop = document.createElement( 'div' );
    this.backdrop.className = 'confirmation-dialog-backdrop';
    this.backdrop.style.position = 'fixed';
    this.backdrop.style.top = '0';
    this.backdrop.style.left = '0';
    this.backdrop.style.width = '100%';
    this.backdrop.style.height = '100%';
    this.backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.backdrop.style.zIndex = '99998';
    this.backdrop.style.opacity = '0';
    this.backdrop.style.transition = 'opacity 0.3s ease';

    // Handle click outside to close
    if ( this.config.clickToClose ) {
      this.backdrop.addEventListener( 'click', () => {
        this.close();
      } );
    }

    document.body.appendChild( this.backdrop );
  }

  /**
   * Sets up keyboard event listeners
   */
  private setupKeyboardListeners (): void {
    if ( this.config.escToClose ) {
      this.escKeyHandler = ( e: KeyboardEvent ) => {
        if ( e.key === 'Escape' ) {
          this.close();
        }
      };
      document.addEventListener( 'keydown', this.escKeyHandler );
    }
  }

  /**
   * Removes keyboard event listeners
   */
  private removeKeyboardListeners (): void {
    if ( this.escKeyHandler ) {
      document.removeEventListener( 'keydown', this.escKeyHandler );
      this.escKeyHandler = undefined;
    }
  }

  /**
   * Binds all event listeners
   */
  private bindEvents (): void {
    // Only bind events once to prevent duplicate event listeners
    if ( this.eventsBound ) return;
    this.eventsBound = true;

    // Handle button clicks
    this.shadowRoot.addEventListener( 'click', ( e ) => {
      const target = e.target as HTMLElement;

      if ( target.closest( '.close-button' ) ) {
        this.close();
      } else if ( target.closest( '.dialog-button' ) ) {
        const buttonIndex = ( target.closest( '.dialog-button' ) as HTMLElement ).dataset.index;
        if ( buttonIndex !== undefined ) {
          const button = this.config.buttons?.[ parseInt( buttonIndex, 10 ) ];
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
    const title = this.config.title || 'Confirmation Dialog';
    const buttons = this.config.buttons || [];

    // Determine button layout: first button on left, rest on right
    const firstButton = buttons.length > 0 ? buttons[ 0 ] : null;
    const rightButtons = buttons.length > 1 ? buttons.slice( 1 ) : [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-size: var(--font-size, 14px);
        }

        .dialog-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          min-width: 400px;
          max-width: 600px;
          max-height: 80vh;
          background: var(--dialog-background, white);
          border-radius: var(--dialog-border-radius, 8px);
          box-shadow: var(--dialog-shadow, 0 10px 40px rgba(0, 0, 0, 0.2));
          z-index: 99999;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dialog-container.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .dialog-container.closing {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }

        .dialog-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--dialog-border-color, #e0e0e0);
          flex-shrink: 0;
        }

        .dialog-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--dialog-title-color, #333);
        }

        .dialog-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          color: var(--dialog-text-color, #555);
          line-height: 1.6;
        }

        .dialog-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--dialog-border-color, #e0e0e0);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
          background: var(--dialog-background, white);
        }

        .footer-left {
          display: flex;
          gap: 12px;
        }

        .footer-right {
          display: flex;
          gap: 12px;
          margin-left: auto;
        }

        .dialog-button {
          padding: 8px 20px;
          border: 1px solid var(--dialog-button-border-color, #ccc);
          border-radius: var(--dialog-button-border-radius, 4px);
          background: var(--dialog-button-background, white);
          color: var(--dialog-button-color, #333);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          font-weight: 500;
        }

        .dialog-button:hover {
          background-color: var(--dialog-button-hover-background, #f8f9fa);
          border-color: var(--dialog-button-hover-border-color, #999);
        }

        .dialog-button:active {
          background-color: var(--dialog-button-active-background, #e9ecef);
        }

        .close-button {
          padding: 8px 20px;
          border: 1px solid var(--dialog-close-border-color, #ccc);
          border-radius: var(--dialog-button-border-radius, 4px);
          background: var(--dialog-close-background, white);
          color: var(--dialog-close-color, #333);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          font-weight: 500;
        }

        .close-button:hover {
          background-color: var(--dialog-close-hover-background, #f8f9fa);
          border-color: var(--dialog-close-hover-border-color, #999);
        }

        @media (max-width: 768px) {
          .dialog-container {
            min-width: 90vw;
            max-width: 90vw;
          }
        }

        .confirmation-dialog-backdrop.show {
          opacity: 1 !important;
        }

        .confirmation-dialog-backdrop.closing {
          opacity: 0 !important;
        }
      </style>

      <div class="dialog-container">
        <div class="dialog-header">
          <h2 class="dialog-title">${ title }</h2>
        </div>

        <div class="dialog-body">
          ${ this.config.body }
        </div>

        <div class="dialog-footer">
          ${ firstButton ? `
            <div class="footer-left">
              <button
                class="dialog-button"
                data-index="0"
                style="${ firstButton.backgroundColor ? `background-color: ${ firstButton.backgroundColor }; color: white; border-color: ${ firstButton.backgroundColor };` : '' }"
              >
                ${ firstButton.label }
              </button>
            </div>
          ` : '' }

          <div class="footer-right">
            ${ rightButtons.map( ( button, index ) => `
              <button
                class="dialog-button"
                data-index="${ index + 1 }"
                style="${ button.backgroundColor ? `background-color: ${ button.backgroundColor }; color: white; border-color: ${ button.backgroundColor };` : '' }"
              >
                ${ button.label }
              </button>
            `).join( '' ) }
            <button class="close-button">Close</button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
const defineConfirmationDialog = ( tagName: string = 'liwe3-confirmation-dialog' ): void => {
  if ( typeof window !== 'undefined' && !window.customElements.get( tagName ) ) {
    customElements.define( tagName, ConfirmationDialogElement );
  }
};

// Auto-register with default tag name
defineConfirmationDialog();

/**
 * Container ID for confirmation dialogs
 */
const DIALOG_CONTAINER_ID = 'liwe3-confirmation-dialog-container';

/**
 * Gets or creates the dialog container element
 */
const getDialogContainer = (): HTMLElement => {
  let container = document.getElementById( DIALOG_CONTAINER_ID );

  if ( !container ) {
    container = document.createElement( 'div' );
    container.id = DIALOG_CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.zIndex = '99999';
    container.style.pointerEvents = 'none';
    document.body.appendChild( container );
  }

  return container;
};

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
const confirmationDialogAdd = ( config: ConfirmationDialogConfig ): ConfirmationDialogElement => {
  const container = getDialogContainer();
  const dialog = document.createElement( 'liwe3-confirmation-dialog' ) as ConfirmationDialogElement;

  // Allow pointer events on individual dialogs
  dialog.style.pointerEvents = 'auto';

  // Show the dialog with the provided config
  dialog.show( config );

  // Add to container
  container.appendChild( dialog );

  return dialog;
};

export { defineConfirmationDialog, confirmationDialogAdd };
