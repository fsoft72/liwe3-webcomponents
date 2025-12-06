/**
 * ButtonToolbar Web Component
 * A customizable toolbar with groups of buttons, supporting horizontal/vertical orientation
 */

export type ButtonToolbarItem = {
  id: string;
  label?: string;
  icon?: string; // SVG content or icon class
  image?: string; // Image URL
  type?: 'default' | 'info' | 'error' | 'warn' | 'success';
  disabled?: boolean;
  tooltip?: string;
  action?: string; // Optional action name to dispatch
};

export type ButtonToolbarGroup = {
  id?: string;
  items: ButtonToolbarItem[];
  class?: string; // Optional CSS class for the group
};

export class ButtonToolbarElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private _groups: ButtonToolbarGroup[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return ['orientation', 'groups'];
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get orientation(): 'horizontal' | 'vertical' {
    return (this.getAttribute('orientation') as 'horizontal' | 'vertical') || 'horizontal';
  }

  set orientation(value: 'horizontal' | 'vertical') {
    this.setAttribute('orientation', value);
  }

  get groups(): ButtonToolbarGroup[] {
    const groupsAttr = this.getAttribute('groups');
    if (groupsAttr) {
      try {
        return JSON.parse(groupsAttr);
      } catch (e) {
        console.error('Invalid groups format:', e);
        return [];
      }
    }
    return this._groups;
  }

  set groups(value: ButtonToolbarGroup[]) {
    this._groups = value;
    // Also update attribute for consistency, but be careful with large data
    // For now, let's just render. If we want to sync property to attribute:
    // this.setAttribute('groups', JSON.stringify(value));
    // But usually for complex data, property is preferred source of truth if set directly.
    
    // SmartSelect implementation:
    // set options ( opts: SelectOption[] ) {
    //   this.setAttribute( 'options', JSON.stringify( opts ) );
    // }
    
    // I'll follow SmartSelect pattern for consistency
    this.setAttribute('groups', JSON.stringify(value));
  }

  connectedCallback(): void {
    this.render();
  }

  private handleButtonClick(item: ButtonToolbarItem, event: Event): void {
    if (item.disabled) return;
    
    this.dispatchEvent(new CustomEvent('button-click', {
      detail: {
        id: item.id,
        action: item.action || item.id,
        originalEvent: event,
        item
      },
      bubbles: true,
      composed: true
    }));
  }

  private render(): void {
    if (!this.shadowRoot) return;

    const style = `
      :host {
        display: block;
        font-family: var(--liwe3-font-family, system-ui, -apple-system, sans-serif);
      }

      .toolbar {
        display: flex;
        gap: var(--liwe3-toolbar-gap, 0.5rem);
        width: 100%;
        box-sizing: border-box;
      }

      .toolbar.horizontal {
        flex-direction: row;
        align-items: center;
      }

      .toolbar.vertical {
        flex-direction: column;
        align-items: stretch;
      }

      .group {
        display: flex;
        gap: 1px; /* Gap between buttons in a group */
        background-color: var(--liwe3-toolbar-group-bg, transparent);
        border-radius: var(--liwe3-toolbar-radius, 0.375rem);
        overflow: hidden;
      }

      .toolbar.horizontal .group {
        flex-direction: row;
      }

      .toolbar.vertical .group {
        flex-direction: column;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: var(--liwe3-button-padding, 0.5rem 1rem);
        border: none;
        cursor: pointer;
        font-size: var(--liwe3-button-font-size, 0.875rem);
        line-height: 1.25;
        transition: all 0.2s;
        background-color: var(--liwe3-button-bg, #f3f4f6);
        color: var(--liwe3-button-color, #1f2937);
        min-height: var(--liwe3-button-height, 2.5rem);
      }

      .button:hover:not(:disabled) {
        filter: brightness(0.95);
      }

      .button:active:not(:disabled) {
        filter: brightness(0.9);
      }

      .button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Button Types */
      .button.default {
        background-color: var(--liwe3-button-default-bg, #f3f4f6);
        color: var(--liwe3-button-default-color, #1f2937);
      }

      .button.info {
        background-color: var(--liwe3-button-info-bg, #3b82f6);
        color: var(--liwe3-button-info-color, #ffffff);
      }

      .button.error {
        background-color: var(--liwe3-button-error-bg, #ef4444);
        color: var(--liwe3-button-error-color, #ffffff);
      }

      .button.warn {
        background-color: var(--liwe3-button-warn-bg, #f59e0b);
        color: var(--liwe3-button-warn-color, #ffffff);
      }
      
      .button.success {
        background-color: var(--liwe3-button-success-bg, #10b981);
        color: var(--liwe3-button-success-color, #ffffff);
      }

      /* Content styling */
      .icon {
        width: 1.25em;
        height: 1.25em;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .icon svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }

      .image {
        width: 1.5em;
        height: 1.5em;
        object-fit: cover;
        border-radius: 50%;
      }
      
      /* Group styling - rounded corners logic */
      .toolbar.horizontal .group .button:first-child {
        border-top-left-radius: var(--liwe3-toolbar-radius, 0.375rem);
        border-bottom-left-radius: var(--liwe3-toolbar-radius, 0.375rem);
      }
      
      .toolbar.horizontal .group .button:last-child {
        border-top-right-radius: var(--liwe3-toolbar-radius, 0.375rem);
        border-bottom-right-radius: var(--liwe3-toolbar-radius, 0.375rem);
      }
      
      .toolbar.vertical .group .button:first-child {
        border-top-left-radius: var(--liwe3-toolbar-radius, 0.375rem);
        border-top-right-radius: var(--liwe3-toolbar-radius, 0.375rem);
      }
      
      .toolbar.vertical .group .button:last-child {
        border-bottom-left-radius: var(--liwe3-toolbar-radius, 0.375rem);
        border-bottom-right-radius: var(--liwe3-toolbar-radius, 0.375rem);
      }
    `;

    const renderButton = (item: ButtonToolbarItem) => {
      const btn = document.createElement('button');
      btn.className = `button ${item.type || 'default'}`;
      if (item.disabled) btn.disabled = true;
      if (item.tooltip) btn.title = item.tooltip;
      
      btn.onclick = (e) => this.handleButtonClick(item, e);

      if (item.icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'icon';
        // Check if it's an SVG string or just a class name (simple heuristic)
        if (item.icon.trim().startsWith('<')) {
          iconSpan.innerHTML = item.icon;
        } else {
          // Assuming it might be a class name if not SVG
          const i = document.createElement('i');
          i.className = item.icon;
          iconSpan.appendChild(i);
        }
        btn.appendChild(iconSpan);
      }

      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        img.className = 'image';
        img.alt = item.label || '';
        btn.appendChild(img);
      }

      if (item.label) {
        const span = document.createElement('span');
        span.textContent = item.label;
        btn.appendChild(span);
      }

      return btn;
    };

    const container = document.createElement('div');
    container.className = `toolbar ${this.orientation}`;

    this._groups.forEach(group => {
      const groupDiv = document.createElement('div');
      groupDiv.className = `group ${group.class || ''}`;
      
      group.items.forEach(item => {
        groupDiv.appendChild(renderButton(item));
      });
      
      container.appendChild(groupDiv);
    });

    this.shadowRoot.innerHTML = `<style>${style}</style>`;
    this.shadowRoot.appendChild(container);
  }
}

export const defineButtonToolbar = (): void => {
  if (typeof window !== 'undefined' && !customElements.get('liwe3-button-toolbar')) {
    customElements.define('liwe3-button-toolbar', ButtonToolbarElement);
  }
};
