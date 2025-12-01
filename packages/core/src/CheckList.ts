/**
 * CheckList Web Component
 * A customizable checklist with progress bar and JSON support
 */

export type CheckListItem = {
  label: string;
  checked: boolean;
};

export class CheckListElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private _items: CheckListItem[] = [];
  private _title: string = 'Checklist';

  constructor () {
    super();
    this.attachShadow( { mode: 'open' } );
    this.render();
  }

  static get observedAttributes (): string[] {
    return [ 'title', 'items' ];
  }

  attributeChangedCallback ( name: string, oldValue: string | null, newValue: string | null ): void {
    if ( oldValue !== newValue ) {
      if ( name === 'title' ) {
        this._title = newValue || 'Checklist';
      } else if ( name === 'items' && newValue ) {
        try {
          this._items = JSON.parse( newValue );
        } catch ( e ) {
          console.error( 'Invalid items JSON:', e );
        }
      }
      this.render();
    }
  }

  get title (): string {
    return this._title;
  }

  set title ( value: string ) {
    this._title = value;
    this.setAttribute( 'title', value );
    this.render();
  }

  get items (): CheckListItem[] {
    return [ ...this._items ];
  }

  set items ( value: CheckListItem[] ) {
    this._items = [ ...value ];
    this.render();
    this.dispatchEvent( new CustomEvent( 'change', { detail: { items: this._items } } ) );
  }

  get percentage (): number {
    if ( this._items.length === 0 ) return 0;
    const completed = this._items.filter( item => item.checked ).length;
    return Math.round( ( completed / this._items.length ) * 100 );
  }

  loadJSON ( json: string ): void {
    try {
      const data = JSON.parse( json );
      if ( data.title ) this.title = data.title;
      if ( data.items && Array.isArray( data.items ) ) {
        this.items = data.items;
      }
    } catch ( e ) {
      console.error( 'Error loading JSON:', e );
    }
  }

  toJSON (): string {
    return JSON.stringify( {
      title: this.title,
      items: this.items
    }, null, 2 );
  }

  private addItem ( label: string ): void {
    if ( !label.trim() ) return;
    this._items.push( { label, checked: false } );
    this.render();
    this.dispatchEvent( new CustomEvent( 'change', { detail: { items: this._items } } ) );
    
    // Focus the new add item input after rendering
    requestAnimationFrame( () => {
      const addInput = this.shadowRoot.querySelector( '.add-item-input' ) as HTMLInputElement;
      if ( addInput ) addInput.focus();
    } );
  }

  private removeItem ( index: number ): void {
    this._items.splice( index, 1 );
    this.render();
    this.dispatchEvent( new CustomEvent( 'change', { detail: { items: this._items } } ) );
  }

  private toggleItem ( index: number ): void {
    this._items[ index ].checked = !this._items[ index ].checked;
    this.render();
    this.dispatchEvent( new CustomEvent( 'change', { detail: { items: this._items } } ) );
  }

  private updateItemLabel ( index: number, label: string ): void {
    this._items[ index ].label = label;
    // We don't re-render here to avoid losing focus, just update the model
    this.dispatchEvent( new CustomEvent( 'change', { detail: { items: this._items } } ) );
  }

  private render (): void {
    const percentage = this.percentage;
    const completedCount = this._items.filter( i => i.checked ).length;
    const totalCount = this._items.length;

    // Initial render of structure if needed
    if ( !this.shadowRoot.querySelector( '.list' ) ) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            background: var(--background, #fff);
            border-radius: var(--border-radius, 8px);
            padding: var(--padding, 16px);
            box-shadow: var(--box-shadow, 0 2px 4px rgba(0,0,0,0.1));
            max-width: var(--max-width, 100%);
          }
  
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
          }
  
          .title {
            font-size: 1.1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-color, #333);
          }
  
          .title-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
          }
  
          .progress-container {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }
  
          .progress-text {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-color, #333);
            min-width: 40px;
          }
  
          .progress-bar-bg {
            flex: 1;
            height: 6px;
            background: #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
          }
  
          .progress-bar-fill {
            height: 100%;
            background: var(--primary-color, #1976d2);
            width: 0%;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
  
          .list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
  
          .list-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 4px 0;
          }
  
          .checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #757575;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
          }
  
          .checkbox.checked {
            background: var(--primary-color, #1976d2);
            border-color: var(--primary-color, #1976d2);
          }
  
          .checkbox svg {
            width: 14px;
            height: 14px;
            fill: white;
            display: none;
          }
  
          .checkbox.checked svg {
            display: block;
          }
  
          .item-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.2s;
            color: var(--text-color, #333);
          }
  
          .item-input:focus {
            border-color: var(--primary-color, #1976d2);
          }
  
          .item-input.add-item-input {
            color: #666;
          }
          
          .item-input.add-item-input::placeholder {
            color: #999;
          }
  
          .delete-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            color: #9e9e9e;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
  
          .delete-btn:hover {
            color: #f44336;
          }
  
          .delete-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
          }
  
          .add-btn {
            background: #f5f5f5;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #757575;
            transition: background 0.2s;
          }
  
          .add-btn:hover {
            background: #e0e0e0;
          }
        </style>
  
        <div class="header">
          <div class="title">
            <svg class="title-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="title-text">${ this._title }</span>
          </div>
          <slot name="menu"></slot>
        </div>
  
        <div class="progress-container">
          <div class="progress-text"></div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill"></div>
          </div>
        </div>
  
        <div class="list"></div>
      `;
    }

    // Update Title
    const titleText = this.shadowRoot.querySelector( '.title-text' );
    if ( titleText ) titleText.textContent = this._title;

    // Update Progress
    const progressText = this.shadowRoot.querySelector( '.progress-text' );
    if ( progressText ) progressText.textContent = `${ completedCount } / ${ totalCount }`;

    const progressBar = this.shadowRoot.querySelector( '.progress-bar-fill' ) as HTMLElement;
    if ( progressBar ) progressBar.style.width = `${ percentage }%`;

    // Update List
    const list = this.shadowRoot.querySelector( '.list' );
    if ( list ) {
      list.innerHTML = `
        ${ this._items.map( ( item, index ) => `
          <div class="list-item">
            <div class="checkbox ${ item.checked ? 'checked' : '' }" data-index="${ index }">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <input 
              type="text" 
              class="item-input" 
              value="${ item.label }" 
              data-index="${ index }"
            >
            <button class="delete-btn" data-index="${ index }" title="Delete item">
              <svg viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        `).join( '' ) }

        <div class="list-item">
          <div class="checkbox" style="border-color: transparent; cursor: default;"></div>
          <input 
            type="text" 
            class="item-input add-item-input" 
            placeholder="Add an item"
          >
          <div class="add-btn" title="Add item">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
        </div>
      `;
    }

    this.bindEvents();
  }

  private bindEvents (): void {
    // Checkbox toggle
    this.shadowRoot.querySelectorAll( '.checkbox' ).forEach( checkbox => {
      checkbox.addEventListener( 'click', ( e ) => {
        const index = ( e.currentTarget as HTMLElement ).dataset.index;
        if ( index !== undefined ) {
          this.toggleItem( parseInt( index ) );
        }
      } );
    } );

    // Delete button
    this.shadowRoot.querySelectorAll( '.delete-btn' ).forEach( btn => {
      btn.addEventListener( 'click', ( e ) => {
        const index = ( e.currentTarget as HTMLElement ).dataset.index;
        if ( index !== undefined ) {
          this.removeItem( parseInt( index ) );
        }
      } );
    } );

    // Item input update
    this.shadowRoot.querySelectorAll( '.item-input:not(.add-item-input)' ).forEach( input => {
      input.addEventListener( 'input', ( e ) => {
        const target = e.target as HTMLInputElement;
        const index = target.dataset.index;
        if ( index !== undefined ) {
          this.updateItemLabel( parseInt( index ), target.value );
        }
      } );
    } );

    // Add item input
    const addInput = this.shadowRoot.querySelector( '.add-item-input' ) as HTMLInputElement;
    if ( addInput ) {
      addInput.addEventListener( 'keydown', ( e ) => {
        if ( e.key === 'Enter' ) {
          this.addItem( addInput.value );
          addInput.value = '';
        }
      } );
      
      addInput.addEventListener( 'blur', () => {
        if ( addInput.value.trim() ) {
          this.addItem( addInput.value );
          addInput.value = '';
        }
      } );
    }
    
    // Add button click
    const addBtn = this.shadowRoot.querySelector( '.add-btn' );
    if ( addBtn && addInput ) {
      addBtn.addEventListener( 'click', () => {
        if ( addInput.value.trim() ) {
          this.addItem( addInput.value );
          addInput.value = '';
        } else {
          addInput.focus();
        }
      } );
    }
  }
}

export const defineCheckList = ( tagName: string = 'liwe3-checklist' ): void => {
  if ( typeof window !== 'undefined' && !window.customElements.get( tagName ) ) {
    customElements.define( tagName, CheckListElement );
  }
};

defineCheckList();
