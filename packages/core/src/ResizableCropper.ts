/**
 * ResizableCropper Web Component
 * A container that wraps a single child element with drag-to-scale (resizing) and drag-to-crop (panning) capabilities
 */

export interface ResizableCropperState {
	width : number;
	height : number;
	minWidth : number;
	minHeight : number;
	aspectRatio : string | null;
	contentElement : HTMLElement | null;
	contentLeft : number;
	contentTop : number;
	rotation : number;
	wrapperLeft : number;
	wrapperTop : number;
}

export interface ResizableCropperValues {
	wrapperWidth : number;
	wrapperHeight : number;
	wrapperLeft : number;
	wrapperTop : number;
	contentWidth : number;
	contentHeight : number;
	contentLeft : number;
	contentTop : number;
	zoom : number;
	rotation : number;
}

export interface ResizableCropperComponentState {
	mode : 'transform' | 'crop';
	disabled : boolean;
	allowCrop : boolean;
	allowResize : boolean;
	allowRotate : boolean;
	allowDrag : boolean;
	minWidth : number;
	minHeight : number;
	aspectRatio : string | null;
	values : ResizableCropperValues;
}

export interface ResizableCropEventDetail {
	width : number;
	height : number;
	wrapperLeft : number;
	wrapperTop : number;
	contentLeft : number;
	contentTop : number;
	action : 'scale' | 'crop' | 'pan' | 'rotate' | 'move';
	rotation? : number;
	handle? : string;
}

export class ResizableCropperElement extends HTMLElement {
	declare shadowRoot : ShadowRoot;

	private state : ResizableCropperState = {
		width: 200,
		height: 150,
		minWidth: 50,
		minHeight: 50,
		aspectRatio: null,
		contentElement: null,
		contentLeft: 0,
		contentTop: 0,
		rotation: 0,
		wrapperLeft: 0,
		wrapperTop: 0,
	};

	private wrapper! : HTMLElement;
	private contentSlot! : HTMLSlotElement;
	private handlesContainer! : HTMLElement;

	private isDragging = false;
	private dragAction : 'scale' | 'crop' | 'pan' | 'rotate' | 'move' | null = null;
	private dragHandle : string | null = null;
	private dragStartX = 0;
	private dragStartY = 0;
	private dragStartWidth = 0;
	private dragStartHeight = 0;
	private dragStartContentLeft = 0;
	private dragStartContentTop = 0;
	private dragStartContentWidth = 0;
	private dragStartContentHeight = 0;
	private initialContentWidth = 0;
	private initialContentHeight = 0;
	private _dragStartRotation = 0;
	private _dragStartPointerAngle = 0;
	private _dragRotateCenterX = 0;
	private _dragRotateCenterY = 0;
	private _interactionMode : 'transform' | 'crop' = 'transform';
	private _dragPointerOffsetX = 0;
	private _dragPointerOffsetY = 0;
	private _dragMoveContainer : HTMLElement | null = null;

	constructor () {
		super();
		this.attachShadow( { mode: 'open' } );
		this.render();
	}

	static get observedAttributes () : string[] {
		return [ 'width', 'height', 'min-width', 'min-height', 'aspect-ratio', 'disabled', 'allow-crop', 'allow-resize', 'allow-rotate', 'allow-drag' ];
	}

	attributeChangedCallback ( name : string, oldValue : string | null, newValue : string | null ) : void {
		if ( oldValue === newValue ) return;

		switch ( name ) {
			case 'width':
				this.state.width = parseFloat( newValue || '200' );
				this.updateWrapperDimensions();
				break;
			case 'height':
				this.state.height = parseFloat( newValue || '150' );
				this.updateWrapperDimensions();
				break;
			case 'min-width':
				this.state.minWidth = parseFloat( newValue || '50' );
				break;
			case 'min-height':
				this.state.minHeight = parseFloat( newValue || '50' );
				break;
			case 'aspect-ratio':
				this.state.aspectRatio = newValue;
				break;
			case 'allow-crop':
			case 'allow-resize':
			case 'allow-rotate':
			case 'allow-drag':
				this.updateHandlesVisibility();
				this._applyInteractionModeUI();
				break;
		}
	}

	connectedCallback () : void {
		this.wrapper = this.shadowRoot.querySelector( '#wrapper' )!;
		this.shadowRoot.querySelector( '#clipper' )!;
		this.contentSlot = this.shadowRoot.querySelector( 'slot' )!;
		this.handlesContainer = this.shadowRoot.querySelector( '#handles-container' )!;

		this.updateWrapperDimensions();
		this.updateHandlesVisibility();
		this._applyInteractionModeUI();
		this._syncWrapperPositionFromLayout( this._getContainerForMove() );
		this.bindEvents();

		this.contentSlot.addEventListener( 'slotchange', () => {
			this.updateContentElement();
		} );

		this.updateContentElement();
	}

	disconnectedCallback () : void {
		this.unbindEvents();
	}

	private _applyInteractionModeUI () : void {
		if ( !this.wrapper ) return;
		this.wrapper.style.cursor = this._interactionMode === 'transform' && this.allowDrag && !this.disabled ? 'move' : '';
	}

	private _setInteractionMode ( mode : 'transform' | 'crop' ) : void {
		if ( this._interactionMode === mode ) return;
		this._interactionMode = mode;
		this.updateHandlesVisibility();
		this._applyInteractionModeUI();
	}

	private updateContentElement () : void {
		const nodes = this.contentSlot.assignedElements();
		if ( nodes.length > 0 ) {
			this.state.contentElement = nodes[0] as HTMLElement;
			this.state.contentElement.style.position = 'absolute';
			this.state.contentElement.style.left = `${this.state.contentLeft}px`;
			this.state.contentElement.style.top = `${this.state.contentTop}px`;

			// Get initial content dimensions
			if ( this.state.contentElement instanceof HTMLImageElement ) {
				if ( this.state.contentElement.complete ) {
					this.initializeContentSize();
				} else {
					this.state.contentElement.addEventListener( 'load', () => {
						this.initializeContentSize();
					}, { once: true } );
				}
			}
		}
	}

	private initializeContentSize () : void {
		if ( !this.state.contentElement ) return;
		const width = this.state.contentElement.offsetWidth;
		const height = this.state.contentElement.offsetHeight;
		if ( width > 0 ) {
			this.state.contentElement.style.width = `${width}px`;
			this.state.contentElement.style.height = 'auto';
			this.initialContentWidth = width;
			this.initialContentHeight = height;
		}
	}

	private updateWrapperDimensions () : void {
		if ( !this.wrapper ) return;
		this.wrapper.style.width = `${this.state.width}px`;
		this.wrapper.style.height = `${this.state.height}px`;
		this._applyWrapperTransform();
	}

	private _applyWrapperTransform () : void {
		if ( !this.wrapper ) return;
		this.wrapper.style.transformOrigin = 'center center';
		this.wrapper.style.transform = `rotate(${this.state.rotation}deg)`;
	}

	private updateHandlesVisibility () : void {
		if ( !this.handlesContainer ) return;

		const scaleHandle = this.handlesContainer.querySelector( '[data-action="scale"]' ) as HTMLElement;
		const rotateHandle = this.handlesContainer.querySelector( '[data-action="rotate"]' ) as HTMLElement;
		const cropHandles = this.handlesContainer.querySelectorAll( '[data-action="crop"]' );

		if ( scaleHandle ) {
			scaleHandle.style.display = this.allowResize ? '' : 'none';
		}

		if ( rotateHandle ) {
			rotateHandle.style.display = this.allowRotate ? '' : 'none';
		}

		cropHandles.forEach( ( handle ) => {
			( handle as HTMLElement ).style.display = this.allowCrop && this._interactionMode === 'crop' ? '' : 'none';
		} );
	}

	private bindEvents () : void {
		this.handlesContainer.addEventListener( 'pointerdown', this.handlePointerDown );
		this.wrapper.addEventListener( 'pointerdown', this.handleWrapperPointerDown );
		this.wrapper.addEventListener( 'dblclick', this.handleWrapperDoubleClick );
		document.addEventListener( 'pointerdown', this.handleDocumentPointerDown, true );

		// Add listener for dragging the content/image itself
		this.contentSlot.addEventListener( 'slotchange', () => {
			const elements = this.contentSlot.assignedElements();
			if ( elements.length > 0 ) {
				const content = elements[0] as HTMLElement;
				content.addEventListener( 'pointerdown', this.handleContentPointerDown );
			}
		} );
	}

	private unbindEvents () : void {
		this.handlesContainer.removeEventListener( 'pointerdown', this.handlePointerDown );
		this.wrapper.removeEventListener( 'pointerdown', this.handleWrapperPointerDown );
		this.wrapper.removeEventListener( 'dblclick', this.handleWrapperDoubleClick );
		document.removeEventListener( 'pointerdown', this.handleDocumentPointerDown, true );

		const elements = this.contentSlot.assignedElements();
		if ( elements.length > 0 ) {
			const content = elements[0] as HTMLElement;
			content.removeEventListener( 'pointerdown', this.handleContentPointerDown );
		}
	}

	private handleWrapperDoubleClick = ( event : MouseEvent ) : void => {
		if ( this.disabled ) return;
		event.preventDefault();
		event.stopPropagation();
		this._setInteractionMode( 'crop' );
	};

	private handleDocumentPointerDown = ( event : PointerEvent ) : void => {
		if ( this._interactionMode !== 'crop' ) return;
		const path = event.composedPath();
		if ( path.includes( this ) ) return;
		this._setInteractionMode( 'transform' );
	};

	private _getContainerForMove () : HTMLElement {
		return this.parentElement || ( this.offsetParent as HTMLElement ) || document.body;
	}

	private _ensureContainerPositionedForMove ( container : HTMLElement ) : void {
		const computed = window.getComputedStyle( container );
		if ( computed.position !== 'static' ) return;
		container.style.position = 'relative';
	}

	private _syncWrapperPositionFromLayout ( container : HTMLElement ) : void {
		const containerRect = container.getBoundingClientRect();
		const hostRect = this.getBoundingClientRect();
		const scrollLeft = container.scrollLeft;
		const scrollTop = container.scrollTop;
		const originLeft = containerRect.left + container.clientLeft;
		const originTop = containerRect.top + container.clientTop;
		this.state.wrapperLeft = hostRect.left - originLeft + scrollLeft;
		this.state.wrapperTop = hostRect.top - originTop + scrollTop;
	}

	private _ensureAbsolutePositionForMove ( container : HTMLElement ) : void {
		this._ensureContainerPositionedForMove( container );
		this._syncWrapperPositionFromLayout( container );
		this.style.position = 'absolute';
		this.style.left = `${this.state.wrapperLeft}px`;
		this.style.top = `${this.state.wrapperTop}px`;
		this.style.touchAction = 'none';
	}

	private handleWrapperPointerDown = ( event : PointerEvent ) : void => {
		if ( this.disabled ) return;
		if ( !this.allowDrag ) return;
		if ( this._interactionMode !== 'transform' ) return;

		const target = event.target as HTMLElement;
		if ( target.closest( '[data-action]' ) ) return;

		// In transform mode, dragging anywhere moves the whole component
		event.preventDefault();
		event.stopPropagation();

		const container = this._getContainerForMove();
		this._dragMoveContainer = container;
		this._ensureAbsolutePositionForMove( container );
		this._syncWrapperPositionFromLayout( container );

		const hostRect = this.getBoundingClientRect();
		this._dragPointerOffsetX = event.clientX - hostRect.left;
		this._dragPointerOffsetY = event.clientY - hostRect.top;

		this.isDragging = true;
		this.dragAction = 'move';
		this.dragHandle = null;
		this.dragStartX = event.clientX;
		this.dragStartY = event.clientY;

		document.addEventListener( 'pointermove', this.handlePointerMove );
		document.addEventListener( 'pointerup', this.handlePointerUp );
		this.dispatchEvent( new CustomEvent( 'rcw:move-start', { detail: { action: 'move' } } ) );
	};

	private handlePointerDown = ( event : PointerEvent ) : void => {
		if ( this.disabled ) return;

		const target = event.target as HTMLElement;
		const handle = target.closest( '[data-action]' ) as HTMLElement;
		if ( !handle ) return;

		event.preventDefault();
		event.stopPropagation();

		this.dragAction = handle.dataset.action as 'scale' | 'crop' | 'rotate';
		if ( this.dragAction === 'crop' && this._interactionMode !== 'crop' ) return;
		if ( this.dragAction === 'rotate' && !this.allowRotate ) return;
		this.isDragging = true;
		this.dragHandle = handle.dataset.corner || handle.dataset.side || null;
		this.dragStartX = event.clientX;
		this.dragStartY = event.clientY;
		this.dragStartWidth = this.state.width;
		this.dragStartHeight = this.state.height;
		this.dragStartContentLeft = this.state.contentLeft;
		this.dragStartContentTop = this.state.contentTop;

		// Get current content dimensions (ignore transforms)
		if ( this.state.contentElement ) {
			this.dragStartContentWidth = this.state.contentElement.offsetWidth;
			this.dragStartContentHeight = this.state.contentElement.offsetHeight;
		}

		if ( this.dragAction === 'rotate' ) {
			const wrapperRect = this.wrapper.getBoundingClientRect();
			this._dragRotateCenterX = wrapperRect.left + wrapperRect.width / 2;
			this._dragRotateCenterY = wrapperRect.top + wrapperRect.height / 2;
			this._dragStartPointerAngle = Math.atan2( event.clientY - this._dragRotateCenterY, event.clientX - this._dragRotateCenterX );
			this._dragStartRotation = this.state.rotation;
		}

		document.addEventListener( 'pointermove', this.handlePointerMove );
		document.addEventListener( 'pointerup', this.handlePointerUp );

		const eventName = this.dragAction === 'scale'
			? 'rcw:scale-start'
			: this.dragAction === 'crop'
			? 'rcw:crop-start'
			: 'rcw:rotate-start';
		this.dispatchEvent(
			new CustomEvent( eventName, {
				detail: { action: this.dragAction, handle: this.dragHandle },
			} ),
		);
	};

	private handleContentPointerDown = ( event : PointerEvent ) : void => {
		if ( this.disabled ) return;
		if ( this._interactionMode !== 'crop' ) return;

		// Only allow panning if content is larger than wrapper
		if ( !this.state.contentElement ) return;

		// Check if content is larger than wrapper in either dimension (ignore transforms)
		const canPan = this.state.contentElement.offsetWidth > this.state.width || this.state.contentElement.offsetHeight > this.state.height;
		if ( !canPan ) return;

		event.preventDefault();
		event.stopPropagation();

		this.isDragging = true;
		this.dragAction = 'pan';
		this.dragHandle = null;
		this.dragStartX = event.clientX;
		this.dragStartY = event.clientY;
		this.dragStartContentLeft = this.state.contentLeft;
		this.dragStartContentTop = this.state.contentTop;

		document.addEventListener( 'pointermove', this.handlePointerMove );
		document.addEventListener( 'pointerup', this.handlePointerUp );

		this.dispatchEvent(
			new CustomEvent( 'rcw:pan-start', {
				detail: { action: 'pan' },
			} ),
		);
	};

	private handlePointerMove = ( event : PointerEvent ) : void => {
		if ( !this.isDragging ) return;
		if ( this.dragAction === 'move' ) {
			const container = this._dragMoveContainer || this._getContainerForMove();
			const containerRect = container.getBoundingClientRect();
			const originLeft = containerRect.left + container.clientLeft;
			const originTop = containerRect.top + container.clientTop;
			this.state.wrapperLeft = event.clientX - originLeft + container.scrollLeft - this._dragPointerOffsetX;
			this.state.wrapperTop = event.clientY - originTop + container.scrollTop - this._dragPointerOffsetY;
			this.style.left = `${this.state.wrapperLeft}px`;
			this.style.top = `${this.state.wrapperTop}px`;
			this.dispatchChange( 'move' );
			return;
		}
		if ( this.dragAction === 'rotate' ) {
			this.handleRotate( event.clientX, event.clientY );
			this.dispatchChange( 'rotate' );
			return;
		}

		const deltaX = event.clientX - this.dragStartX;
		const deltaY = event.clientY - this.dragStartY;

		if ( this.dragAction === 'scale' ) {
			this.handleScale( deltaX, deltaY, this.dragHandle! );
		} else if ( this.dragAction === 'crop' ) {
			this.handleCrop( deltaX, deltaY, this.dragHandle! );
		} else if ( this.dragAction === 'pan' ) {
			this.handlePan( deltaX, deltaY );
		}

		this.dispatchChange( this.dragAction! );
	};
	private handleRotate ( pointerX : number, pointerY : number ) : void {
		const pointerAngle = Math.atan2( pointerY - this._dragRotateCenterY, pointerX - this._dragRotateCenterX );
		const deltaAngle = pointerAngle - this._dragStartPointerAngle;
		const deltaDegrees = deltaAngle * ( 180 / Math.PI );
		this.state.rotation = this._dragStartRotation + deltaDegrees;
		this._applyWrapperTransform();
	}

	private handlePointerUp = () : void => {
		if ( !this.isDragging ) return;

		this.isDragging = false;
		document.removeEventListener( 'pointermove', this.handlePointerMove );
		document.removeEventListener( 'pointerup', this.handlePointerUp );

		if ( this.dragAction ) {
			this.dispatchChange( this.dragAction );
		}

		this.dragAction = null;
		this.dragHandle = null;
		this._dragMoveContainer = null;
	};

	private handleScale ( deltaX : number, deltaY : number, handleCorner : string ) : void {
		if ( !this.state.contentElement ) return;

		let newWidth = this.dragStartWidth;
		let newHeight = this.dragStartHeight;

		// Scale both the wrapper AND the content together
		switch ( handleCorner ) {
			case 'br': // Bottom-right
				newWidth = this.dragStartWidth + deltaX;
				newHeight = this.dragStartHeight + deltaY;
				break;
			case 'bl': // Bottom-left
				newWidth = this.dragStartWidth - deltaX;
				newHeight = this.dragStartHeight + deltaY;
				break;
			case 'tr': // Top-right
				newWidth = this.dragStartWidth + deltaX;
				newHeight = this.dragStartHeight - deltaY;
				break;
			case 'tl': // Top-left
				newWidth = this.dragStartWidth - deltaX;
				newHeight = this.dragStartHeight - deltaY;
				break;
		}

		// Apply minimum constraints
		newWidth = Math.max( this.state.minWidth, newWidth );
		newHeight = Math.max( this.state.minHeight, newHeight );

		// Apply aspect ratio if set
		if ( this.state.aspectRatio ) {
			const ratio = this.parseAspectRatio( this.state.aspectRatio );
			if ( ratio ) {
				const widthBasedHeight = newWidth / ratio;
				const heightBasedWidth = newHeight * ratio;

				if ( Math.abs( newWidth - this.dragStartWidth ) > Math.abs( newHeight - this.dragStartHeight ) ) {
					newHeight = widthBasedHeight;
				} else {
					newWidth = heightBasedWidth;
				}

				newWidth = Math.max( this.state.minWidth, newWidth );
				newHeight = Math.max( this.state.minHeight, newHeight );
			}
		}

		// Calculate scale ratio to maintain proportional resizing
		const scaleX = newWidth / this.dragStartWidth;
		const scaleY = newHeight / this.dragStartHeight;
		const scale = Math.min( scaleX, scaleY ); // Use uniform scale

		// Update wrapper size
		this.state.width = newWidth;
		this.state.height = newHeight;
		this.updateWrapperDimensions();

		// Update content size proportionally
		const newContentWidth = this.dragStartContentWidth * scale;
		const newContentHeight = this.dragStartContentHeight * scale;

		this.state.contentElement.style.width = `${newContentWidth}px`;
		this.state.contentElement.style.height = `${newContentHeight}px`;

		// Adjust content position proportionally to keep it centered relative to wrapper
		this.state.contentLeft = this.dragStartContentLeft * scale;
		this.state.contentTop = this.dragStartContentTop * scale;

		// Clamp content position after scaling
		this.clampContentPosition();
	}

	private handleCrop ( deltaX : number, deltaY : number, side : string ) : void {
		// Crop resizes the wrapper (visible area), not the content
		let newWidth = this.dragStartWidth;
		let newHeight = this.dragStartHeight;

		switch ( side ) {
			case 'l': // Left - resize wrapper from left
				newWidth = this.dragStartWidth - deltaX;
				break;
			case 'r': // Right - resize wrapper from right
				newWidth = this.dragStartWidth + deltaX;
				break;
			case 't': // Top - resize wrapper from top
				newHeight = this.dragStartHeight - deltaY;
				break;
			case 'b': // Bottom - resize wrapper from bottom
				newHeight = this.dragStartHeight + deltaY;
				break;
		}

		// Apply minimum constraints
		newWidth = Math.max( this.state.minWidth, newWidth );
		newHeight = Math.max( this.state.minHeight, newHeight );

		// Apply aspect ratio if set
		if ( this.state.aspectRatio ) {
			const ratio = this.parseAspectRatio( this.state.aspectRatio );
			if ( ratio ) {
				const widthBasedHeight = newWidth / ratio;
				const heightBasedWidth = newHeight * ratio;

				if ( side === 'l' || side === 'r' ) {
					newHeight = widthBasedHeight;
				} else {
					newWidth = heightBasedWidth;
				}

				newWidth = Math.max( this.state.minWidth, newWidth );
				newHeight = Math.max( this.state.minHeight, newHeight );
			}
		}

		this.state.width = newWidth;
		this.state.height = newHeight;
		this.updateWrapperDimensions();

		// When cropping from left or top, adjust content position
		if ( side === 'l' ) {
			const widthDiff = newWidth - this.dragStartWidth;
			this.state.contentLeft = this.dragStartContentLeft - widthDiff;
		} else if ( side === 't' ) {
			const heightDiff = newHeight - this.dragStartHeight;
			this.state.contentTop = this.dragStartContentTop - heightDiff;
		}

		// Clamp content position
		this.clampContentPosition();
	}

	private clampContentPosition () : void {
		if ( !this.state.contentElement ) return;

		const contentWidth = this.state.contentElement.offsetWidth;
		const contentHeight = this.state.contentElement.offsetHeight;
		const minLeft = Math.min( 0, this.state.width - contentWidth );
		const minTop = Math.min( 0, this.state.height - contentHeight );

		this.state.contentLeft = Math.max( minLeft, Math.min( 0, this.state.contentLeft ) );
		this.state.contentTop = Math.max( minTop, Math.min( 0, this.state.contentTop ) );

		this.state.contentElement.style.left = `${this.state.contentLeft}px`;
		this.state.contentElement.style.top = `${this.state.contentTop}px`;
	}

	private handlePan ( deltaX : number, deltaY : number ) : void {
		if ( !this.state.contentElement ) return;

		// Pan the content by moving its position
		this.state.contentLeft = this.dragStartContentLeft + deltaX;
		this.state.contentTop = this.dragStartContentTop + deltaY;

		// Clamp to prevent blank areas
		this.clampContentPosition();
	}

	private parseAspectRatio ( ratio : string ) : number | null {
		const parts = ratio.split( '/' );
		if ( parts.length === 2 ) {
			const width = parseFloat( parts[0] );
			const height = parseFloat( parts[1] );
			if ( !isNaN( width ) && !isNaN( height ) && height !== 0 ) {
				return width / height;
			}
		}
		return null;
	}

	private dispatchChange ( action : 'scale' | 'crop' | 'pan' | 'rotate' | 'move' ) : void {
		const detail : ResizableCropEventDetail = {
			width: this.state.width,
			height: this.state.height,
			wrapperLeft: this.state.wrapperLeft,
			wrapperTop: this.state.wrapperTop,
			contentLeft: this.state.contentLeft,
			contentTop: this.state.contentTop,
			action,
			rotation: this.state.rotation,
			handle: this.dragHandle || undefined,
		};

		this.dispatchEvent( new CustomEvent( 'rcw:change', { detail } ) );

		// Dispatch the onChange event with full values
		this.dispatchOnChange();
	}

	private dispatchOnChange () : void {
		const values = this.getValues();
		this.dispatchEvent(
			new CustomEvent( 'change', {
				detail: values,
				bubbles: true,
				composed: true,
			} ),
		);
	}

	private render () : void {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: inline-block;
					position: relative;
				}

				#wrapper {
					position: relative;
					border: 2px solid #007bff;
					box-sizing: border-box;
					background: rgba(0, 123, 255, 0.05);
				}

				#clipper {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					overflow: hidden;
				}

				::slotted(*) {
					position: absolute;
					max-width: none;
					max-height: none;
					cursor: grab;
				}

				::slotted(*:active) {
					cursor: grabbing;
				}

				#handles-container {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					pointer-events: none;
				}

				.handle {
					position: absolute;
					background: white;
					border: 2px solid #007bff;
					pointer-events: auto;
					touch-action: none;
					z-index: 1000;
				}

				.handle.rotate {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					top: -18px;
					left: 50%;
					transform: translateX(-50%);
					cursor: grab;
				}

				.handle.rotate:active {
					cursor: grabbing;
				}

				.handle.scale {
					width: 12px;
					height: 12px;
					border-radius: 50%;
					cursor: nwse-resize;
				}

				.handle.scale.tl {
					top: -6px;
					left: -6px;
					cursor: nwse-resize;
				}

				.handle.scale.tr {
					top: -6px;
					right: -6px;
					cursor: nesw-resize;
				}

				.handle.scale.bl {
					bottom: -6px;
					left: -6px;
					cursor: nesw-resize;
				}

				.handle.scale.br {
					bottom: -6px;
					right: -6px;
					cursor: nwse-resize;
				}

				.handle.crop {
					background: #007bff;
					cursor: move;
				}

				.handle.crop.t {
					top: -2px;
					left: 50%;
					transform: translateX(-50%);
					width: 40px;
					height: 4px;
					cursor: ns-resize;
				}

				.handle.crop.b {
					bottom: -2px;
					left: 50%;
					transform: translateX(-50%);
					width: 40px;
					height: 4px;
					cursor: ns-resize;
				}

				.handle.crop.l {
					left: -2px;
					top: 50%;
					transform: translateY(-50%);
					width: 4px;
					height: 40px;
					cursor: ew-resize;
				}

				.handle.crop.r {
					right: -2px;
					top: 50%;
					transform: translateY(-50%);
					width: 4px;
					height: 40px;
					cursor: ew-resize;
				}

				:host([disabled]) #wrapper {
					opacity: 0.6;
					cursor: not-allowed;
				}

				:host([disabled]) .handle {
					display: none;
				}
			</style>

			<div id="wrapper">
				<div id="clipper">
					<slot></slot>
				</div>

				<div id="handles-container">
					<!-- Rotate handle (top-center) -->
					<div class="handle rotate" data-action="rotate"></div>

					<!-- Scale handle (only bottom-right corner) -->
					<div class="handle scale br" data-action="scale" data-corner="br"></div>

					<!-- Crop handles (only right and bottom) -->
					<div class="handle crop b" data-action="crop" data-side="b"></div>
					<div class="handle crop r" data-action="crop" data-side="r"></div>
				</div>
			</div>
		`;
	}

	// Public API - Getters and Setters
	get width () : number {
		return this.state.width;
	}

	set width ( value : number ) {
		this.setAttribute( 'width', String( value ) );
	}

	get height () : number {
		return this.state.height;
	}

	set height ( value : number ) {
		this.setAttribute( 'height', String( value ) );
	}

	get minWidth () : number {
		return this.state.minWidth;
	}

	set minWidth ( value : number ) {
		this.setAttribute( 'min-width', String( value ) );
	}

	get minHeight () : number {
		return this.state.minHeight;
	}

	set minHeight ( value : number ) {
		this.setAttribute( 'min-height', String( value ) );
	}

	get aspectRatio () : string | null {
		return this.state.aspectRatio;
	}

	set aspectRatio ( value : string | null ) {
		if ( value ) {
			this.setAttribute( 'aspect-ratio', value );
		} else {
			this.removeAttribute( 'aspect-ratio' );
		}
	}

	get disabled () : boolean {
		return this.hasAttribute( 'disabled' );
	}

	set disabled ( value : boolean ) {
		if ( value ) {
			this.setAttribute( 'disabled', '' );
		} else {
			this.removeAttribute( 'disabled' );
		}
	}

	get allowCrop () : boolean {
		return this.hasAttribute( 'allow-crop' ) ? this.getAttribute( 'allow-crop' ) !== 'false' : true;
	}

	set allowCrop ( value : boolean ) {
		if ( value ) {
			this.setAttribute( 'allow-crop', 'true' );
		} else {
			this.setAttribute( 'allow-crop', 'false' );
		}
	}

	get allowResize () : boolean {
		return this.hasAttribute( 'allow-resize' ) ? this.getAttribute( 'allow-resize' ) !== 'false' : true;
	}

	set allowResize ( value : boolean ) {
		if ( value ) {
			this.setAttribute( 'allow-resize', 'true' );
		} else {
			this.setAttribute( 'allow-resize', 'false' );
		}
	}

	get allowRotate () : boolean {
		return this.hasAttribute( 'allow-rotate' ) ? this.getAttribute( 'allow-rotate' ) !== 'false' : true;
	}

	set allowRotate ( value : boolean ) {
		if ( value ) {
			this.setAttribute( 'allow-rotate', 'true' );
		} else {
			this.setAttribute( 'allow-rotate', 'false' );
		}
	}

	get allowDrag () : boolean {
		return this.hasAttribute( 'allow-drag' ) ? this.getAttribute( 'allow-drag' ) !== 'false' : true;
	}

	set allowDrag ( value : boolean ) {
		if ( value ) {
			this.setAttribute( 'allow-drag', 'true' );
		} else {
			this.setAttribute( 'allow-drag', 'false' );
		}
	}

	/**
	 * Gets the current values including wrapper size, content size, position, and zoom level
	 */
	public getValues () : ResizableCropperValues {
		// Keep wrapperLeft/wrapperTop in sync even when not moved yet.
		this._syncWrapperPositionFromLayout( this._getContainerForMove() );

		const contentWidth = this.state.contentElement?.offsetWidth || 0;
		const contentHeight = this.state.contentElement?.offsetHeight || 0;

		// Calculate zoom based on current content size vs initial size
		const zoom = this.initialContentWidth > 0 ? contentWidth / this.initialContentWidth : 1;

		return {
			wrapperWidth: this.state.width,
			wrapperHeight: this.state.height,
			wrapperLeft: this.state.wrapperLeft,
			wrapperTop: this.state.wrapperTop,
			contentWidth,
			contentHeight,
			contentLeft: this.state.contentLeft,
			contentTop: this.state.contentTop,
			zoom,
			rotation: this.state.rotation,
		};
	}

	/**
	 * Sets the values to reproduce size, zoom and pan
	 * @param values - The values to set
	 */
	public setValues ( values : Partial<ResizableCropperValues> ) : void {
		// Set wrapper size
		if ( values.wrapperWidth !== undefined ) {
			this.state.width = values.wrapperWidth;
		}
		if ( values.wrapperHeight !== undefined ) {
			this.state.height = values.wrapperHeight;
		}
		this.updateWrapperDimensions();

		if ( values.wrapperLeft !== undefined || values.wrapperTop !== undefined ) {
			const container = this._getContainerForMove();
			this._ensureAbsolutePositionForMove( container );
			if ( values.wrapperLeft !== undefined ) this.state.wrapperLeft = values.wrapperLeft;
			if ( values.wrapperTop !== undefined ) this.state.wrapperTop = values.wrapperTop;
			this.style.left = `${this.state.wrapperLeft}px`;
			this.style.top = `${this.state.wrapperTop}px`;
		}

		if ( values.rotation !== undefined ) {
			this.state.rotation = values.rotation;
			this._applyWrapperTransform();
		}

		if ( !this.state.contentElement ) {
			this.dispatchOnChange();
			return;
		}

		// Set content size based on zoom or explicit dimensions
		if ( values.zoom !== undefined && this.initialContentWidth > 0 ) {
			const newContentWidth = this.initialContentWidth * values.zoom;
			const newContentHeight = this.initialContentHeight * values.zoom;
			this.state.contentElement.style.width = `${newContentWidth}px`;
			this.state.contentElement.style.height = `${newContentHeight}px`;
		} else if ( values.contentWidth !== undefined ) {
			this.state.contentElement.style.width = `${values.contentWidth}px`;
			if ( values.contentHeight !== undefined ) {
				this.state.contentElement.style.height = `${values.contentHeight}px`;
			} else {
				this.state.contentElement.style.height = 'auto';
			}
		}

		// Set content position
		if ( values.contentLeft !== undefined ) {
			this.state.contentLeft = values.contentLeft;
		}
		if ( values.contentTop !== undefined ) {
			this.state.contentTop = values.contentTop;
		}

		// Apply position and clamp
		this.clampContentPosition();

		// Dispatch change event
		this.dispatchOnChange();
	}

	/**
	 * Gets a serializable state snapshot of the component including flags, constraints, mode,
	 * and the current transform/crop values.
	 */
	public getState () : ResizableCropperComponentState {
		return {
			mode: this._interactionMode,
			disabled: this.disabled,
			allowCrop: this.allowCrop,
			allowResize: this.allowResize,
			allowRotate: this.allowRotate,
			allowDrag: this.allowDrag,
			minWidth: this.minWidth,
			minHeight: this.minHeight,
			aspectRatio: this.aspectRatio,
			values: this.getValues(),
		};
	}

	/**
	 * Restores a state snapshot produced by getState().
	 * @param state - State to restore
	 */
	public setState ( state : Partial<ResizableCropperComponentState> ) : void {
		if ( state.disabled !== undefined ) this.disabled = state.disabled;
		if ( state.allowCrop !== undefined ) this.allowCrop = state.allowCrop;
		if ( state.allowResize !== undefined ) this.allowResize = state.allowResize;
		if ( state.allowRotate !== undefined ) this.allowRotate = state.allowRotate;
		if ( state.allowDrag !== undefined ) this.allowDrag = state.allowDrag;
		if ( state.minWidth !== undefined ) this.minWidth = state.minWidth;
		if ( state.minHeight !== undefined ) this.minHeight = state.minHeight;
		if ( state.aspectRatio !== undefined ) this.aspectRatio = state.aspectRatio;
		if ( state.mode !== undefined ) this._setInteractionMode( state.mode );
		if ( state.values ) this.setValues( state.values );
	}
}

/**
 * Conditionally defines the custom element if in a browser environment.
 */
export const defineResizableCropper = ( tagName : string = 'liwe3-resizable-cropper' ) : void => {
	if ( typeof window !== 'undefined' && !window.customElements.get( tagName ) ) {
		customElements.define( tagName, ResizableCropperElement );
	}
};

// Auto-register with default tag name
defineResizableCropper();
