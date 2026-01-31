/**
 * SortableContainer Web Component
 * A container that allows sorting child elements via drag and drop
 */

export type SortDirection = 'v' | 'h';
export type HandlePosition = 'start' | 'end';

export interface SortableContainerConfig {
	direction? : SortDirection;
	idName? : string;
	handlePosition? : HandlePosition;
}

export interface ReorgEventDetail {
	ids : string[];
}

export class SortableContainerElement extends HTMLElement {
	declare shadowRoot : ShadowRoot;
	private config : SortableContainerConfig = {
		direction: 'v',
		idName: 'id',
		handlePosition: 'end',
	};
	private draggedElement : HTMLElement | null = null;
	private draggedClone : HTMLElement | null = null;
	private dropPlaceholder : HTMLElement | null = null;
	private currentDropTarget : { element : HTMLElement; position : 'before' | 'after' } | null = null;
	private dragStartPosition : { x : number; y : number } | null = null;
	private handleWrappers : Map<HTMLElement, HTMLElement> = new Map();
	private slotObserver : MutationObserver | null = null;

	constructor () {
		super();
		this.attachShadow( { mode: 'open' } );
	}

	static get observedAttributes () : string[] {
		return [ 'direction', 'id-name', 'handle-position' ];
	}

	attributeChangedCallback ( name : string, oldValue : string | null, newValue : string | null ) : void {
		if ( oldValue !== newValue ) {
			switch ( name ) {
				case 'direction':
					this.config.direction = ( newValue as SortDirection ) || 'v';
					this.updateContainerStyles();
					this.updateHandleWrappers();
					break;
				case 'id-name':
					this.config.idName = newValue || 'id';
					break;
				case 'handle-position':
					this.config.handlePosition = ( newValue as HandlePosition ) || 'end';
					this.updateHandleWrappers();
					break;
			}
		}
	}

	connectedCallback () : void {
		this.render();
		this.setupDragListeners();
		this.setupSlotObserver();
		// Wrap existing children after initial render
		requestAnimationFrame( () => this.wrapAllChildren() );
	}

	disconnectedCallback () : void {
		this.cleanupDragListeners();
		this.cleanupSlotObserver();
		this.unwrapAllChildren();
	}

	get direction () : SortDirection {
		return this.config.direction!;
	}

	set direction ( value : SortDirection ) {
		this.config.direction = value;
		this.setAttribute( 'direction', value );
		this.updateContainerStyles();
		this.updateHandleWrappers();
	}

	get idName () : string {
		return this.config.idName!;
	}

	set idName ( value : string ) {
		this.config.idName = value;
		this.setAttribute( 'id-name', value );
	}

	get handlePosition () : HandlePosition {
		return this.config.handlePosition!;
	}

	set handlePosition ( value : HandlePosition ) {
		this.config.handlePosition = value;
		this.setAttribute( 'handle-position', value );
		this.updateHandleWrappers();
	}

	/**
	 * Get the current order of element IDs
	 */
	getOrder () : string[] {
		const children = Array.from( this.children ) as HTMLElement[];
		return children.map( ( child ) => child.getAttribute( this.config.idName! ) || '' ).filter( ( id ) => id !== '' );
	}

	/**
	 * Setup mutation observer for slot changes
	 */
	private setupSlotObserver () : void {
		this.slotObserver = new MutationObserver( ( mutations ) => {
			mutations.forEach( ( mutation ) => {
				mutation.addedNodes.forEach( ( node ) => {
					if ( node instanceof HTMLElement && node.parentElement === this ) {
						this.wrapChild( node );
					}
				} );
				mutation.removedNodes.forEach( ( node ) => {
					if ( node instanceof HTMLElement ) {
						this.unwrapChild( node );
					}
				} );
			} );
		} );

		this.slotObserver.observe( this, { childList: true } );
	}

	/**
	 * Cleanup mutation observer
	 */
	private cleanupSlotObserver () : void {
		if ( this.slotObserver ) {
			this.slotObserver.disconnect();
			this.slotObserver = null;
		}
	}

	/**
	 * Wrap all children with handle wrappers
	 */
	private wrapAllChildren () : void {
		const children = Array.from( this.children ) as HTMLElement[];
		children.forEach( ( child ) => this.wrapChild( child ) );
	}

	/**
	 * Unwrap all children
	 */
	private unwrapAllChildren () : void {
		this.handleWrappers.forEach( ( wrapper, child ) => {
			if ( wrapper.parentElement === this ) {
				this.replaceChild( child, wrapper );
			}
		} );
		this.handleWrappers.clear();
	}

	/**
	 * Wrap a single child with a handle wrapper
	 */
	private wrapChild ( child : HTMLElement ) : void {
		if ( this.handleWrappers.has( child ) ) return;
		if ( child.classList.contains( 'sortable-wrapper' ) ) return;
		if ( child.classList.contains( 'drop-placeholder' ) ) return;

		const wrapper = document.createElement( 'div' );
		wrapper.className = 'sortable-wrapper';
		this.updateWrapperStyles( wrapper );

		const handle = document.createElement( 'div' );
		handle.className = 'sortable-handle';
		handle.innerHTML = this.getHandleIcon();

		// Apply base handle styles
		handle.style.display = 'flex';
		handle.style.alignItems = 'center';
		handle.style.justifyContent = 'center';
		handle.style.cursor = 'grab';
		handle.style.backgroundColor = 'var(--sortable-handle-bg, rgba(0, 0, 0, 0.05))';
		handle.style.borderRadius = 'var(--sortable-handle-radius, 4px)';
		handle.style.color = 'var(--sortable-handle-color, #666)';
		handle.style.transition = 'background-color 0.15s ease, color 0.15s ease';
		handle.style.flexShrink = '0';

		// Copy the id attribute to the wrapper for ordering
		const idValue = child.getAttribute( this.config.idName! );
		if ( idValue ) {
			wrapper.setAttribute( this.config.idName!, idValue );
		}

		// Insert wrapper and move child into it
		this.insertBefore( wrapper, child );
		wrapper.appendChild( child );
		wrapper.appendChild( handle );

		// Add hover effect via event listeners
		handle.addEventListener( 'mouseenter', () => {
			handle.style.backgroundColor = 'var(--sortable-handle-hover-bg, rgba(0, 0, 0, 0.1))';
			handle.style.color = 'var(--sortable-handle-hover-color, #333)';
		} );
		handle.addEventListener( 'mouseleave', () => {
			handle.style.backgroundColor = 'var(--sortable-handle-bg, rgba(0, 0, 0, 0.05))';
			handle.style.color = 'var(--sortable-handle-color, #666)';
		} );
		handle.addEventListener( 'mousedown', () => {
			handle.style.cursor = 'grabbing';
		} );
		handle.addEventListener( 'mouseup', () => {
			handle.style.cursor = 'grab';
		} );

		this.handleWrappers.set( child, wrapper );
		this.updateWrapperLayout( wrapper );
	}

	/**
	 * Unwrap a single child
	 */
	private unwrapChild ( child : HTMLElement ) : void {
		const wrapper = this.handleWrappers.get( child );
		if ( wrapper ) {
			this.handleWrappers.delete( child );
		}
	}

	/**
	 * Update wrapper styles based on direction and handle position
	 */
	private updateWrapperStyles ( wrapper : HTMLElement ) : void {
		const isHorizontal = this.config.direction === 'h';

		wrapper.style.display = 'flex';
		wrapper.style.flexDirection = isHorizontal ? 'column' : 'row';
		wrapper.style.alignItems = 'stretch';
	}

	/**
	 * Update wrapper layout (handle position)
	 */
	private updateWrapperLayout ( wrapper : HTMLElement ) : void {
		const handle = wrapper.querySelector( '.sortable-handle' ) as HTMLElement;
		const children = Array.from( wrapper.children );
		const content = children.find( ( el ) => !el.classList.contains( 'sortable-handle' ) ) as HTMLElement;

		if ( !handle || !content ) return;

		const isHorizontal = this.config.direction === 'h';
		const isStart = this.config.handlePosition === 'start';

		wrapper.style.flexDirection = isHorizontal ? 'column' : 'row';

		// Make content take remaining space
		content.style.flex = '1';
		content.style.minWidth = '0';

		// Reorder children based on handle position
		if ( isStart ) {
			wrapper.insertBefore( handle, content );
		} else {
			wrapper.appendChild( handle );
		}

		// Update handle styles
		if ( isHorizontal ) {
			handle.style.width = '100%';
			handle.style.height = 'var(--sortable-handle-size, 24px)';
			handle.style.minHeight = 'var(--sortable-handle-size, 24px)';
			handle.style.minWidth = 'unset';
		} else {
			handle.style.width = 'var(--sortable-handle-size, 24px)';
			handle.style.minWidth = 'var(--sortable-handle-size, 24px)';
			handle.style.height = 'auto';
			handle.style.minHeight = 'unset';
		}
	}

	/**
	 * Update all handle wrappers
	 */
	private updateHandleWrappers () : void {
		this.handleWrappers.forEach( ( wrapper ) => {
			this.updateWrapperStyles( wrapper );
			this.updateWrapperLayout( wrapper );
		} );
	}

	/**
	 * Get the handle icon SVG
	 */
	private getHandleIcon () : string {
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
			<circle cx="9" cy="6" r="1.5"/>
			<circle cx="15" cy="6" r="1.5"/>
			<circle cx="9" cy="12" r="1.5"/>
			<circle cx="15" cy="12" r="1.5"/>
			<circle cx="9" cy="18" r="1.5"/>
			<circle cx="15" cy="18" r="1.5"/>
		</svg>`;
	}

	/**
	 * Render the component
	 */
	private render () : void {
		const isHorizontal = this.config.direction === 'h';

		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .sortable-container {
          display: flex;
          flex-direction: ${isHorizontal ? 'row' : 'column'};
          gap: var(--sortable-gap, 8px);
          position: relative;
          min-height: 50px;
        }

        ::slotted(.sortable-wrapper) {
          user-select: none;
          transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1),
                      opacity 0.2s ease,
                      margin 0.2s cubic-bezier(0.2, 0, 0, 1);
          will-change: transform;
        }

        ::slotted(.sortable-wrapper.dragging) {
          opacity: 0.3 !important;
          transition: opacity 0.15s ease !important;
        }

        ::slotted(.drop-placeholder) {
          background: var(--sortable-indicator-color, rgba(102, 126, 234, 0.15));
          border: 2px dashed var(--sortable-indicator-border-color, #667eea);
          border-radius: var(--sortable-indicator-radius, 8px);
          box-sizing: border-box;
          flex-shrink: 0;
          transition: height 0.2s cubic-bezier(0.2, 0, 0, 1),
                      width 0.2s cubic-bezier(0.2, 0, 0, 1),
                      opacity 0.15s ease;
          animation: placeholder-appear 0.15s ease-out;
        }

        @keyframes placeholder-appear {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .drag-clone {
          position: fixed;
          pointer-events: none;
          z-index: 1000;
          opacity: 0.6;
          transform: scale(1.02);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
      </style>
      <div class="sortable-container">
        <slot></slot>
      </div>
    `;
	}

	/**
	 * Update container flex direction based on direction prop
	 */
	private updateContainerStyles () : void {
		const container = this.shadowRoot.querySelector( '.sortable-container' ) as HTMLElement;
		if ( container ) {
			container.style.flexDirection = this.config.direction === 'h' ? 'row' : 'column';
		}
	}

	/**
	 * Setup drag event listeners
	 */
	private setupDragListeners () : void {
		this.addEventListener( 'mousedown', this.handleMouseDown.bind( this ) );
		this.addEventListener( 'touchstart', this.handleTouchStart.bind( this ), { passive: false } );
	}

	/**
	 * Cleanup drag event listeners
	 */
	private cleanupDragListeners () : void {
		document.removeEventListener( 'mousemove', this.handleMouseMove );
		document.removeEventListener( 'mouseup', this.handleMouseUp );
		document.removeEventListener( 'touchmove', this.handleTouchMove );
		document.removeEventListener( 'touchend', this.handleTouchEnd );
	}

	/**
	 * Handle mouse down event
	 */
	private handleMouseDown = ( e : MouseEvent ) : void => {
		const target = e.target as HTMLElement;
		const draggableChild = this.findDraggableChild( target );

		if ( draggableChild ) {
			e.preventDefault();
			this.startDrag( draggableChild, e.clientX, e.clientY );
			document.addEventListener( 'mousemove', this.handleMouseMove );
			document.addEventListener( 'mouseup', this.handleMouseUp );
		}
	};

	/**
	 * Handle touch start event
	 */
	private handleTouchStart = ( e : TouchEvent ) : void => {
		const target = e.target as HTMLElement;
		const draggableChild = this.findDraggableChild( target );

		if ( draggableChild && e.touches.length === 1 ) {
			e.preventDefault();
			const touch = e.touches[0];
			this.startDrag( draggableChild, touch.clientX, touch.clientY );
			document.addEventListener( 'touchmove', this.handleTouchMove, { passive: false } );
			document.addEventListener( 'touchend', this.handleTouchEnd );
		}
	};

	/**
	 * Handle mouse move event
	 */
	private handleMouseMove = ( e : MouseEvent ) : void => {
		if ( this.draggedElement ) {
			e.preventDefault();
			this.updateDrag( e.clientX, e.clientY );
		}
	};

	/**
	 * Handle touch move event
	 */
	private handleTouchMove = ( e : TouchEvent ) : void => {
		if ( this.draggedElement && e.touches.length === 1 ) {
			e.preventDefault();
			const touch = e.touches[0];
			this.updateDrag( touch.clientX, touch.clientY );
		}
	};

	/**
	 * Handle mouse up event
	 */
	private handleMouseUp = ( e : MouseEvent ) : void => {
		if ( this.draggedElement ) {
			this.endDrag( e.clientX, e.clientY );
		}
		document.removeEventListener( 'mousemove', this.handleMouseMove );
		document.removeEventListener( 'mouseup', this.handleMouseUp );
	};

	/**
	 * Handle touch end event
	 */
	private handleTouchEnd = ( e : TouchEvent ) : void => {
		if ( this.draggedElement ) {
			const touch = e.changedTouches[0];
			this.endDrag( touch.clientX, touch.clientY );
		}
		document.removeEventListener( 'touchmove', this.handleTouchMove );
		document.removeEventListener( 'touchend', this.handleTouchEnd );
	};

	/**
	 * Check if the click target is a handle or inside a handle
	 */
	private isHandle ( target : HTMLElement ) : boolean {
		let current : HTMLElement | null = target;

		while ( current && current !== this ) {
			if ( current.classList.contains( 'sortable-handle' ) ) {
				return true;
			}
			current = current.parentElement;
		}

		return false;
	}

	/**
	 * Find the wrapper element from a handle click
	 */
	private findWrapperFromHandle ( target : HTMLElement ) : HTMLElement | null {
		let current : HTMLElement | null = target;

		// First find the handle
		while ( current && current !== this ) {
			if ( current.classList.contains( 'sortable-handle' ) ) {
				// The wrapper is the parent of the handle
				const wrapper = current.parentElement;
				if ( wrapper && wrapper.classList.contains( 'sortable-wrapper' ) && wrapper.parentElement === this ) {
					return wrapper;
				}
				return null;
			}
			current = current.parentElement;
		}

		return null;
	}

	/**
	 * Find the direct child that is being dragged (only if clicking on handle)
	 */
	private findDraggableChild ( target : HTMLElement ) : HTMLElement | null {
		// Only allow dragging if clicking on a handle
		if ( !this.isHandle( target ) ) {
			return null;
		}

		return this.findWrapperFromHandle( target );
	}

	/**
	 * Start dragging an element
	 */
	private startDrag ( element : HTMLElement, clientX : number, clientY : number ) : void {
		this.draggedElement = element;
		element.classList.add( 'dragging' );

		// Store initial drag position for axis locking
		const rect = element.getBoundingClientRect();
		this.dragStartPosition = {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		};

		// Create a clone for the visual drag effect
		this.createDragClone( element, clientX, clientY );

		// Create drop placeholder
		this.createDropPlaceholder();
	}

	/**
	 * Create a clone of the dragged element
	 */
	private createDragClone ( element : HTMLElement, clientX : number, clientY : number ) : void {
		const rect = element.getBoundingClientRect();
		const clone = element.cloneNode( true ) as HTMLElement;

		clone.classList.remove( 'dragging' );
		clone.classList.add( 'drag-clone' );
		clone.style.width = `${rect.width}px`;
		clone.style.height = `${rect.height}px`;
		clone.style.left = `${clientX - rect.width / 2}px`;
		clone.style.top = `${clientY - rect.height / 2}px`;
		clone.style.position = 'fixed';
		clone.style.pointerEvents = 'none';
		clone.style.zIndex = '1000';
		clone.style.opacity = '0.6';
		clone.style.transform = 'scale(1.02)';
		clone.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';

		document.body.appendChild( clone );
		this.draggedClone = clone;
	}

	/**
	 * Create the drop placeholder element
	 */
	private createDropPlaceholder () : void {
		this.removeDropPlaceholder();

		if ( !this.draggedElement ) return;

		const rect = this.draggedElement.getBoundingClientRect();
		const isHorizontal = this.config.direction === 'h';

		const placeholder = document.createElement( 'div' );
		placeholder.className = 'drop-placeholder';

		// Apply inline styles since placeholder is in light DOM
		placeholder.style.border = '2px dashed var(--sortable-indicator-color, #667eea)';
		placeholder.style.borderRadius = 'var(--sortable-indicator-radius, 8px)';
		placeholder.style.backgroundColor = 'rgba(102, 126, 234, 0.15)';
		placeholder.style.boxSizing = 'border-box';
		placeholder.style.flexShrink = '0';
		placeholder.style.pointerEvents = 'none';
		placeholder.style.transition = 'opacity 0.15s ease';
		placeholder.style.animation = 'none'; // Prevent re-animating on move

		if ( isHorizontal ) {
			placeholder.style.width = `${rect.width}px`;
			placeholder.style.height = `${rect.height}px`;
			placeholder.style.minWidth = `${rect.width}px`;
		} else {
			placeholder.style.width = '100%';
			placeholder.style.height = `${rect.height}px`;
			placeholder.style.minHeight = `${rect.height}px`;
		}

		this.dropPlaceholder = placeholder;
	}

	/**
	 * Remove the drop placeholder
	 */
	private removeDropPlaceholder () : void {
		if ( this.dropPlaceholder && this.dropPlaceholder.parentElement ) {
			this.dropPlaceholder.remove();
		}
		this.dropPlaceholder = null;
		this.currentDropTarget = null;
	}

	/**
	 * Update drag position and show appropriate drop indicator
	 */
	private updateDrag ( clientX : number, clientY : number ) : void {
		// Update clone position with axis locking
		if ( this.draggedClone && this.dragStartPosition ) {
			const rect = this.draggedElement!.getBoundingClientRect();
			const isHorizontal = this.config.direction === 'h';

			// Lock X for vertical sorting, lock Y for horizontal sorting
			const cloneX = isHorizontal ? clientX - rect.width / 2 : this.dragStartPosition.x - rect.width / 2;
			const cloneY = isHorizontal ? this.dragStartPosition.y - rect.height / 2 : clientY - rect.height / 2;

			this.draggedClone.style.left = `${cloneX}px`;
			this.draggedClone.style.top = `${cloneY}px`;
		}

		// Update placeholder position
		this.updatePlaceholderPosition( clientX, clientY );
	}

	/**
	 * Update placeholder position based on cursor position
	 */
	private updatePlaceholderPosition ( clientX : number, clientY : number ) : void {
		if ( !this.dropPlaceholder || !this.draggedElement ) return;

		const children = Array.from( this.children ).filter(
			( child ) => child !== this.draggedElement && child !== this.dropPlaceholder,
		) as HTMLElement[];
		const isHorizontal = this.config.direction === 'h';

		if ( children.length === 0 ) {
			// If no other children, insert placeholder at the end
			if ( this.dropPlaceholder.parentElement !== this ) {
				this.appendChild( this.dropPlaceholder );
				this.currentDropTarget = null;
			}
			return;
		}

		// Find the closest drop position
		let closestChild : HTMLElement | null = null;
		let closestPosition : 'before' | 'after' = 'after';
		let minDistance = Infinity;

		for ( const child of children ) {
			const rect = child.getBoundingClientRect();

			if ( isHorizontal ) {
				const centerX = rect.left + rect.width / 2;
				const distance = Math.abs( clientX - centerX );

				if ( distance < minDistance ) {
					minDistance = distance;
					closestChild = child;
					closestPosition = clientX < centerX ? 'before' : 'after';
				}
			} else {
				const centerY = rect.top + rect.height / 2;
				const distance = Math.abs( clientY - centerY );

				if ( distance < minDistance ) {
					minDistance = distance;
					closestChild = child;
					closestPosition = clientY < centerY ? 'before' : 'after';
				}
			}
		}

		// Position the placeholder
		if ( closestChild ) {
			const targetElement = closestChild;
			const targetPosition : 'before' | 'after' = closestPosition;
			const isSameTarget = this.currentDropTarget
				&& this.currentDropTarget.element === targetElement
				&& this.currentDropTarget.position === targetPosition;

			if ( !isSameTarget ) {
				this.currentDropTarget = { element: targetElement, position: targetPosition };

				if ( targetPosition === 'before' ) {
					this.insertBefore( this.dropPlaceholder, targetElement );
				} else if ( targetPosition === 'after' ) {
					const nextSibling = targetElement.nextSibling;
					if ( nextSibling && nextSibling !== this.draggedElement ) {
						this.insertBefore( this.dropPlaceholder, nextSibling );
					} else {
						this.appendChild( this.dropPlaceholder );
					}
				}
			}
		}
	}

	/**
	 * End the drag operation
	 */
	private endDrag ( _clientX : number, _clientY : number ) : void {
		if ( !this.draggedElement ) return;

		// Move the dragged element to where the placeholder is
		if ( this.dropPlaceholder && this.dropPlaceholder.parentElement === this ) {
			this.insertBefore( this.draggedElement, this.dropPlaceholder );
			// Fire the reorg event
			this.fireReorgEvent();
		}

		// Cleanup
		this.draggedElement.classList.remove( 'dragging' );
		this.draggedElement = null;
		this.dragStartPosition = null;

		if ( this.draggedClone ) {
			this.draggedClone.remove();
			this.draggedClone = null;
		}

		this.removeDropPlaceholder();
	}

	/**
	 * Fire the onreorg event with the new order
	 */
	private fireReorgEvent () : void {
		const ids = this.getOrder();

		const event = new CustomEvent<ReorgEventDetail>( 'reorg', {
			bubbles: true,
			composed: true,
			detail: { ids },
		} );

		this.dispatchEvent( event );
	}
}

/**
 * Define the sortable-container custom element
 */
export const defineSortableContainer = ( tagName : string = 'liwe3-sortable-container' ) : void => {
	if ( typeof window !== 'undefined' && !customElements.get( tagName ) ) {
		customElements.define( tagName, SortableContainerElement );
	}
};
