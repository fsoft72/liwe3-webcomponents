/**
 * TreeView Web Component
 * A customizable tree view with infinite depth, checkboxes, and folder icons
 */

export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: string;
  customIcon?: string;
  selected?: boolean;
  expanded?: boolean;
};

export class TreeViewElement extends HTMLElement {
  declare shadowRoot: ShadowRoot;
  private treeData: TreeNode[] = [];
  private selectedIds: Set<string> = new Set();
  private expandedIds: Set<string> = new Set();
  private indentWidth: number = 20;

  constructor () {
    super();
    this.attachShadow( { mode: 'open' } );
    this.render();
    this.bindEvents();
  }

  static get observedAttributes (): string[] {
    return [ 'data', 'indent-width', 'selected-ids' ];
  }

  attributeChangedCallback ( name: string, oldValue: string | null, newValue: string | null ): void {
    if ( oldValue !== newValue ) {
      if ( name === 'indent-width' ) {
        this.indentWidth = parseInt( newValue || '20', 10 );
      }
      this.render();
    }
  }

  get data (): TreeNode[] {
    const dataAttr = this.getAttribute( 'data' );
    if ( dataAttr ) {
      try {
        return JSON.parse( dataAttr );
      } catch ( e ) {
        console.error( 'Invalid data format:', e );
        return [];
      }
    }
    return this.treeData;
  }

  set data ( value: TreeNode[] ) {
    this.treeData = value;
    this.initializeExpandedState( value );
    this.setAttribute( 'data', JSON.stringify( value ) );
  }

  get selectedNodeIds (): string[] {
    return Array.from( this.selectedIds );
  }

  set selectedNodeIds ( ids: string[] ) {
    this.selectedIds = new Set( ids );
    this.render();
  }

  /**
   * Initialize expanded state from the data
   */
  private initializeExpandedState ( nodes: TreeNode[] ): void {
    const traverse = ( node: TreeNode ) => {
      if ( node.expanded ) {
        this.expandedIds.add( node.id );
      }
      if ( node.children ) {
        node.children.forEach( traverse );
      }
    };

    nodes.forEach( traverse );
  }

  /**
   * Toggle node expansion
   */
  toggleExpansion ( nodeId: string ): void {
    // Update DOM directly instead of full re-render
    const nodeElement = this.shadowRoot.querySelector( `.tree-node[data-node-id="${ nodeId }"]` ) as HTMLElement;
    if ( !nodeElement ) return;

    // Find the direct child .node-children element (not nested ones)
    const childrenContainer = Array.from( nodeElement.children ).find(
      el => el.classList.contains( 'node-children' )
    ) as HTMLElement | undefined;

    // Determine current state from DOM, not from expandedIds
    const hasChildrenInDom = !!childrenContainer;

    if ( hasChildrenInDom ) {
      // Currently expanded - collapse it
      childrenContainer.remove();
      this.expandedIds.delete( nodeId );

      // Toggle expand icon rotation
      const expandIcon = nodeElement.querySelector( '.expand-icon' ) as HTMLElement;
      if ( expandIcon ) {
        expandIcon.classList.remove( 'expanded' );
      }

      this.dispatchEvent( new CustomEvent( 'toggle', {
        detail: { nodeId, expanded: false }
      } ) );
    } else {
      // Currently collapsed - expand it
      const node = this.findNode( nodeId );
      if ( node && node.children ) {
        const depth = parseInt( nodeElement.dataset.depth || '0', 10 );
        const childrenHtml = `
          <div class="node-children">
            ${ node.children.map( child => this.renderNode( child, depth + 1 ) ).join( '' ) }
          </div>
        `;
        nodeElement.insertAdjacentHTML( 'beforeend', childrenHtml );
        this.expandedIds.add( nodeId );

        // Toggle expand icon rotation
        const expandIcon = nodeElement.querySelector( '.expand-icon' ) as HTMLElement;
        if ( expandIcon ) {
          expandIcon.classList.add( 'expanded' );
        }

        this.dispatchEvent( new CustomEvent( 'toggle', {
          detail: { nodeId, expanded: true }
        } ) );
      }
    }
  }

  /**
   * Toggle node selection
   */
  toggleSelection ( nodeId: string ): void {
    const isSelected = this.selectedIds.has( nodeId );

    if ( isSelected ) {
      this.selectedIds.delete( nodeId );
    } else {
      this.selectedIds.add( nodeId );
    }

    // Update checkbox state directly instead of full re-render
    const checkbox = this.shadowRoot.querySelector( `.node-checkbox[data-node-id="${ nodeId }"]` ) as HTMLInputElement;
    if ( checkbox ) {
      checkbox.checked = !isSelected;
    }

    this.dispatchEvent( new CustomEvent( 'selectionchange', {
      detail: { selectedIds: this.selectedNodeIds }
    } ) );
  }

  /**
   * Select all nodes recursively
   */
  selectAll (): void {
    const traverse = ( node: TreeNode ) => {
      this.selectedIds.add( node.id );
      if ( node.children ) {
        node.children.forEach( traverse );
      }
    };

    this.data.forEach( traverse );
    this.render();
    this.dispatchEvent( new CustomEvent( 'selectionchange', {
      detail: { selectedIds: this.selectedNodeIds }
    } ) );
  }

  /**
   * Deselect all nodes
   */
  deselectAll (): void {
    this.selectedIds.clear();
    this.render();
    this.dispatchEvent( new CustomEvent( 'selectionchange', {
      detail: { selectedIds: this.selectedNodeIds }
    } ) );
  }

  /**
   * Expand all nodes
   */
  expandAll (): void {
    const traverse = ( node: TreeNode ) => {
      if ( node.children && node.children.length > 0 ) {
        this.expandedIds.add( node.id );
        node.children.forEach( traverse );
      }
    };

    this.data.forEach( traverse );
    this.render();
  }

  /**
   * Collapse all nodes
   */
  collapseAll (): void {
    this.expandedIds.clear();
    this.render();
  }

  /**
   * Get node by ID
   */
  private findNode ( nodeId: string, nodes: TreeNode[] = this.data ): TreeNode | null {
    for ( const node of nodes ) {
      if ( node.id === nodeId ) {
        return node;
      }
      if ( node.children ) {
        const found = this.findNode( nodeId, node.children );
        if ( found ) return found;
      }
    }
    return null;
  }

  /**
   * Get the default folder icon
   */
  private getDefaultIcon ( node: TreeNode, isExpanded: boolean ): string {
    if ( node.children && node.children.length > 0 ) {
      return isExpanded ? '📂' : '📁';
    }
    return '📄';
  }

  /**
   * Render a single tree node
   */
  private renderNode ( node: TreeNode, depth: number = 0 ): string {
    const isExpanded = this.expandedIds.has( node.id );
    const isSelected = this.selectedIds.has( node.id );
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = depth * this.indentWidth;

    // Determine icon to display
    let iconHtml = '';
    if ( node.customIcon ) {
      iconHtml = `<span class="node-icon custom-icon">${ node.customIcon }</span>`;
    } else if ( node.icon !== undefined && node.icon !== '' ) {
      iconHtml = `<span class="node-icon">${ node.icon }</span>`;
    } else if ( node.icon !== '' ) {
      iconHtml = `<span class="node-icon">${ this.getDefaultIcon( node, isExpanded ) }</span>`;
    }

    const nodeHtml = `
      <div class="tree-node" data-node-id="${ node.id }" data-depth="${ depth }">
        <div class="node-content" style="padding-left: ${ paddingLeft }px">
          <div class="node-controls">
            ${ hasChildren
              ? `<button class="expand-toggle" data-node-id="${ node.id }" aria-label="${ isExpanded ? 'Collapse' : 'Expand' }">
                   <svg class="expand-icon ${ isExpanded ? 'expanded' : '' }" viewBox="0 0 24 24" width="16" height="16">
                     <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                   </svg>
                 </button>`
              : '<span class="expand-spacer"></span>'
            }
            <label class="checkbox-wrapper">
              <input
                type="checkbox"
                class="node-checkbox"
                data-node-id="${ node.id }"
                ${ isSelected ? 'checked' : '' }
              >
              <span class="checkbox-custom"></span>
            </label>
          </div>
          ${ iconHtml }
          <span class="node-label" data-node-id="${ node.id }">${ node.label }</span>
        </div>
      </div>
    `;

    let childrenHtml = '';
    if ( hasChildren && isExpanded ) {
      childrenHtml = `
        <div class="node-children">
          ${ node.children!.map( child => this.renderNode( child, depth + 1 ) ).join( '' ) }
        </div>
      `;
    }

    return nodeHtml + childrenHtml;
  }

  /**
   * Bind event listeners
   */
  private bindEvents (): void {
    // Use event delegation for all interactive elements
    this.shadowRoot.addEventListener( 'click', ( e ) => {
      const target = e.target as HTMLElement;

      // Handle expand/collapse toggle button
      if ( target.closest( '.expand-toggle' ) ) {
        const button = target.closest( '.expand-toggle' ) as HTMLElement;
        const nodeId = button.dataset.nodeId;
        if ( nodeId ) {
          this.toggleExpansion( nodeId );
        }
        return;
      }
    } );

    // Handle checkbox changes
    this.shadowRoot.addEventListener( 'change', ( e ) => {
      const target = e.target as HTMLInputElement;
      if ( target.classList.contains( 'node-checkbox' ) ) {
        const nodeId = target.dataset.nodeId;
        if ( nodeId ) {
          this.toggleSelection( nodeId );
        }
      }
    } );

    // Handle double-click events
    this.shadowRoot.addEventListener( 'dblclick', ( e ) => {
      const target = e.target as HTMLElement;

      // Check if clicking on a node label or content
      if ( target.closest( '.node-label' ) || target.closest( '.node-content' ) ) {
        const nodeContent = target.closest( '.node-content' ) as HTMLElement;
        if ( !nodeContent ) return;

        const nodeElement = nodeContent.closest( '.tree-node' ) as HTMLElement;
        if ( !nodeElement ) return;

        const nodeId = nodeElement.dataset.nodeId;
        if ( !nodeId ) return;

        const node = this.findNode( nodeId );
        if ( !node ) return;

        // If it's a folder (has children), toggle expansion
        if ( node.children && node.children.length > 0 ) {
          this.toggleExpansion( nodeId );
        } else {
          // If it's an item (no children), fire itemselected event
          this.dispatchEvent( new CustomEvent( 'itemselected', {
            detail: { node, nodeId }
          } ) );
        }
      }
    } );
  }

  /**
   * Render the component
   */
  private render (): void {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--tree-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          font-size: var(--tree-font-size, 14px);
          color: var(--tree-text-color, #333);
          background: var(--tree-background, transparent);
          user-select: none;
        }

        .tree-container {
          overflow: auto;
          padding: var(--tree-padding, 8px);
        }

        .tree-node {
          position: relative;
        }

        .node-content {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: var(--tree-node-border-radius, 6px);
          transition: background-color 0.15s ease;
          cursor: pointer;
        }

        .node-content:hover {
          background-color: var(--tree-hover-background, rgba(0, 123, 255, 0.08));
        }

        .node-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .expand-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.15s ease;
        }

        .expand-toggle:hover {
          background-color: var(--tree-expand-hover-background, rgba(0, 0, 0, 0.1));
        }

        .expand-toggle:focus {
          outline: 2px solid var(--tree-focus-color, #007bff);
          outline-offset: 2px;
        }

        .expand-icon {
          fill: var(--tree-icon-color, #666);
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .expand-icon.expanded {
          transform: rotate(90deg);
        }

        .expand-spacer {
          width: 20px;
          height: 20px;
          display: inline-block;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin: 0;
        }

        .node-checkbox {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkbox-custom {
          position: relative;
          width: 18px;
          height: 18px;
          border: 2px solid var(--tree-checkbox-border, #ccc);
          border-radius: var(--tree-checkbox-border-radius, 4px);
          background: var(--tree-checkbox-background, white);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .checkbox-custom::after {
          content: '';
          position: absolute;
          display: none;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .node-checkbox:checked + .checkbox-custom {
          background: var(--tree-checkbox-checked-background, #007bff);
          border-color: var(--tree-checkbox-checked-border, #007bff);
        }

        .node-checkbox:checked + .checkbox-custom::after {
          display: block;
        }

        .checkbox-wrapper:hover .checkbox-custom {
          border-color: var(--tree-checkbox-hover-border, #999);
          box-shadow: 0 0 0 3px var(--tree-checkbox-hover-shadow, rgba(0, 123, 255, 0.1));
        }

        .node-checkbox:focus + .checkbox-custom {
          outline: 2px solid var(--tree-focus-color, #007bff);
          outline-offset: 2px;
        }

        .node-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          min-width: 20px;
        }

        .node-icon.custom-icon {
          font-size: var(--tree-custom-icon-size, 20px);
        }

        .node-label {
          flex: 1;
          padding: 2px 4px;
          color: var(--tree-label-color, #333);
          font-weight: var(--tree-label-font-weight, 400);
          line-height: 1.4;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .node-label:hover {
          color: var(--tree-label-hover-color, #007bff);
        }

        .node-children {
          position: relative;
        }

        .node-children::before {
          content: '';
          position: absolute;
          left: calc(var(--tree-indent-width, 20px) / 2 + 8px);
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--tree-guide-line-color, rgba(0, 0, 0, 0.1));
        }

        /* Animations */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .node-children {
          animation: slideDown 0.2s ease-out;
        }

        /* Empty state */
        .tree-empty {
          padding: 32px;
          text-align: center;
          color: var(--tree-empty-color, #999);
          font-style: italic;
        }

        /* Scrollbar styling */
        .tree-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .tree-container::-webkit-scrollbar-track {
          background: var(--tree-scrollbar-track, #f1f1f1);
          border-radius: 4px;
        }

        .tree-container::-webkit-scrollbar-thumb {
          background: var(--tree-scrollbar-thumb, #888);
          border-radius: 4px;
        }

        .tree-container::-webkit-scrollbar-thumb:hover {
          background: var(--tree-scrollbar-thumb-hover, #555);
        }
      </style>

      <div class="tree-container">
        ${ this.data.length > 0
          ? this.data.map( node => this.renderNode( node ) ).join( '' )
          : '<div class="tree-empty">No items to display</div>'
        }
      </div>
    `;
  }
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
const defineTreeView = ( tagName: string = 'liwe3-tree-view' ): void => {
  if ( typeof window !== 'undefined' && !window.customElements.get( tagName ) ) {
    customElements.define( tagName, TreeViewElement );
  }
};

// Auto-register with default tag name
defineTreeView();

export { defineTreeView };
