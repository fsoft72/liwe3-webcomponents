/**
 * ComicBalloon Web Component
 * A customizable comic balloon with different styles and draggable handler
 */

export enum BalloonType {
	TALK = 'talk',
	CLOUD = 'cloud',
	WHISPER = 'whisper',
	RECTANGLE = 'rectangle'
}

export type HandlerPosition = {
	x: number;
	y: number;
};

export interface IComicBalloon extends HTMLElement {
	type: BalloonType;
	textContent: string;
	handlerPosition: HandlerPosition;
	updateHandlerPosition( position: HandlerPosition ): void;
	getHTML(): string;
}

export type ContentChangeEvent = CustomEvent<{
	newContent: string;
	balloonType: BalloonType;
}>;

export type HandlerMoveEvent = CustomEvent<{
	finalPosition: HandlerPosition;
	balloonType: BalloonType;
}>;

export type ResizeEvent = CustomEvent<{
	width: number;
	height: number;
	balloonType: BalloonType;
}>;

export class ComicBalloonElement extends HTMLElement implements IComicBalloon {
	declare shadowRoot: ShadowRoot;
	private _type: BalloonType = BalloonType.TALK;
	private _handlerPosition: HandlerPosition = { x: 50, y: 100 };
	private isDragging: boolean = false;
	private isResizing: boolean = false;
	private dragStartOffset: { x: number; y: number } = { x: 0, y: 0 };
	private resizeStartPos: { x: number; y: number } = { x: 0, y: 0 };
	private contentEditableElement?: HTMLDivElement;
	private handler?: HTMLElement;
	private resizeHandle?: HTMLElement;
	private balloon?: HTMLElement;

	static get observedAttributes(): string[] {
		return [ 'type', 'text' ];
	}

	constructor() {
		super();
		this.attachShadow( { mode: 'open' } );
	}

	connectedCallback(): void {
		this.render();
		this.setupEventListeners();
	}

	disconnectedCallback(): void {
		this.removeEventListeners();
	}

	attributeChangedCallback( name: string, oldValue: string, newValue: string ): void {
		if ( oldValue === newValue ) return;

		if ( name === 'type' ) {
			this._type = ( newValue as BalloonType ) || BalloonType.TALK;
			this.updateBalloonStyle();
		} else if ( name === 'text' ) {
			if ( this.contentEditableElement ) {
				this.contentEditableElement.textContent = newValue;
			}
		}
	}

	get type(): BalloonType {
		return this._type;
	}

	set type( value: BalloonType ) {
		this._type = value;
		this.setAttribute( 'type', value );
	}

	get handlerPosition(): HandlerPosition {
		return { ...this._handlerPosition };
	}

	set handlerPosition( value: HandlerPosition ) {
		this._handlerPosition = { ...value };
		this.updateHandlerVisual();
	}

	updateHandlerPosition( position: HandlerPosition ): void {
		this.handlerPosition = position;
	}

	getHTML(): string {
		return this.outerHTML;
	}

	private render(): void {
		this.shadowRoot.innerHTML = `
			<style>${this.getStyles()}</style>
			<div class="comic-balloon-container">
				<svg class="balloon-svg" xmlns="http://www.w3.org/2000/svg">
					<g class="cloud-shape"></g>
				</svg>
				<div class="balloon ${this._type}">
					<div class="content" contenteditable="true" role="textbox" aria-label="Balloon text">
						${this.getAttribute( 'text' ) || 'Type your text here...'}
					</div>
					<div class="resize-handle" role="button" aria-label="Resize balloon"></div>
				</div>
				<div class="handler ${this._type}" role="button" aria-label="Drag to reposition pointer"></div>
			</div>
		`;

		this.contentEditableElement = this.shadowRoot.querySelector( '.content' ) as HTMLDivElement;
		this.handler = this.shadowRoot.querySelector( '.handler' ) as HTMLElement;
		this.resizeHandle = this.shadowRoot.querySelector( '.resize-handle' ) as HTMLElement;
		this.balloon = this.shadowRoot.querySelector( '.balloon' ) as HTMLElement;

		if ( this._type === BalloonType.CLOUD ) {
			this.updateCloudShape();
		}
		this.updateHandlerVisual();
	}

	private getStyles(): string {
		return `
			:host {
				display: inline-block;
				position: relative;
				width: 300px;
				min-height: 150px;
				overflow: visible;
			}

			.comic-balloon-container {
				position: relative;
				width: 100%;
				height: 100%;
				padding: 50px;
				margin: -50px;
			}

			.balloon-svg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				pointer-events: none;
				z-index: 1;
				overflow: visible;
			}

			.balloon {
				position: relative;
				padding: 20px;
				background: white;
				border: 3px solid #000;
				min-height: 100px;
				z-index: 2;
				margin: 50px;
				width: calc(100% - 100px);
				height: calc(100% - 100px);
				box-sizing: border-box;
			}

			.balloon.talk {
				border-radius: 25px;
			}

			.balloon.cloud {
				border: none;
				background: transparent;
				position: relative;
			}
			
			.balloon.cloud .content {
				position: relative;
				z-index: 10;
			}

			.balloon.whisper {
				border-radius: 25px;
				border: 3px dashed #000;
			}

			.balloon.rectangle {
				border-radius: 5px;
			}

			.content {
				outline: none;
				min-height: 60px;
				font-family: 'Comic Sans MS', cursive, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #000;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
			}

			.content:empty:before {
				content: attr(aria-label);
				color: #999;
			}

			.handler {
				position: absolute;
				width: 20px;
				height: 20px;
				cursor: move;
				z-index: 3;
				user-select: none;
				background: rgba(0, 0, 0, 0.1);
				border-radius: 50%;
				border: 2px solid rgba(0, 0, 0, 0.3);
			}

			.handler:hover {
				background: rgba(0, 0, 0, 0.2);
				border-color: rgba(0, 0, 0, 0.5);
			}

			.handler.dragging {
				cursor: grabbing;
				background: rgba(0, 0, 0, 0.3);
			}

			.resize-handle {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 20px;
				height: 20px;
				cursor: nwse-resize;
				z-index: 4;
				background: linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 0.5) 50%);
				border-bottom-right-radius: inherit;
			}

			.resize-handle:hover {
				background: linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 0.8) 50%);
			}

			.resize-handle.resizing {
				background: linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 1) 50%);
			}
		`;
	}

	private updateBalloonStyle(): void {
		if ( !this.balloon || !this.handler ) return;

		this.balloon.className = `balloon ${this._type}`;
		this.handler.className = `handler ${this._type}`;
		
		if ( this._type === BalloonType.CLOUD ) {
			this.updateCloudShape();
		}
		
		this.updateHandlerVisual();
	}

	private updateCloudShape(): void {
		if ( !this.balloon ) return;
		
		const cloudGroup = this.shadowRoot.querySelector( '.cloud-shape' ) as SVGGElement;
		if ( !cloudGroup ) return;
		
		const rect = this.balloon.getBoundingClientRect();
		const containerRect = this.shadowRoot.querySelector( '.comic-balloon-container' )?.getBoundingClientRect();
		if ( !containerRect ) return;
		
		const x = rect.left - containerRect.left;
		const y = rect.top - containerRect.top;
		const w = rect.width;
		const h = rect.height;
		
		cloudGroup.innerHTML = '';
		
		const centerX = x + w / 2;
		const centerY = y + h / 2;
		
		const numScallops = 14;
		const radiusX = w / 2.5;
		const radiusY = h / 2.5;
		
		let pathData = '';
		
		for ( let i = 0; i <= numScallops; i++ ) {
			const angle = ( i / numScallops ) * Math.PI * 2 - Math.PI / 2;
			const nextAngle = ( ( i + 1 ) / numScallops ) * Math.PI * 2 - Math.PI / 2;
			
			const px = centerX + Math.cos( angle ) * radiusX;
			const py = centerY + Math.sin( angle ) * radiusY;
			
			const nx = centerX + Math.cos( nextAngle ) * radiusX;
			const ny = centerY + Math.sin( nextAngle ) * radiusY;
			
			// Chord midpoint
			const mx = ( px + nx ) / 2;
			const my = ( py + ny ) / 2;
			
			// Chord length
			const dx = nx - px;
			const dy = ny - py;
			const chordLen = Math.sqrt( dx * dx + dy * dy );
			
			// Vector from center to midpoint
			const vx = mx - centerX;
			const vy = my - centerY;
			const vLen = Math.sqrt( vx * vx + vy * vy );
			
			// Normalized vector
			const nx_vec = vx / vLen;
			const ny_vec = vy / vLen;
			
			// Control point distance
			const scallopHeight = chordLen * 0.8;
			
			const cx = mx + nx_vec * scallopHeight;
			const cy = my + ny_vec * scallopHeight;
			
			if ( i === 0 ) {
				pathData += `M ${px} ${py} `;
			}
			
			pathData += `Q ${cx} ${cy} ${nx} ${ny} `;
		}
		
		pathData += 'Z';
		
		const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		path.setAttribute( 'd', pathData );
		path.setAttribute( 'fill', 'white' );
		path.setAttribute( 'stroke', '#000' );
		path.setAttribute( 'stroke-width', '3' );
		path.setAttribute( 'stroke-linejoin', 'round' );
		
		cloudGroup.appendChild( path );
	}

	private updateHandlerVisual(): void {
		if ( !this.handler || !this.balloon ) return;

		const relativeX = this._handlerPosition.x;
		const relativeY = this._handlerPosition.y;

		this.handler.style.left = `${relativeX - 10}px`;
		this.handler.style.top = `${relativeY - 10}px`;
		
		if ( this._type === BalloonType.CLOUD ) {
			this.updateCloudShape();
		}

		this.updateSVGPointer();
	}

	private updateSVGPointer(): void {
		const svg = this.shadowRoot.querySelector( '.balloon-svg' ) as SVGElement;
		if ( !svg || !this.balloon ) return;

		const balloonRect = this.balloon.getBoundingClientRect();
		const containerRect = svg.getBoundingClientRect();

		let pointerGroup = svg.querySelector( '.pointer-group' );
		if ( !pointerGroup ) {
			pointerGroup = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
			pointerGroup.setAttribute( 'class', 'pointer-group' );
			svg.appendChild( pointerGroup );
		}

		pointerGroup.innerHTML = '';

		const balloonLeft = balloonRect.left - containerRect.left;
		const balloonTop = balloonRect.top - containerRect.top;
		const balloonCenterX = balloonLeft + balloonRect.width / 2;
		const balloonCenterY = balloonTop + balloonRect.height / 2;

		const handlerX = this._handlerPosition.x;
		const handlerY = this._handlerPosition.y;

		const angle = Math.atan2( handlerY - balloonCenterY, handlerX - balloonCenterX );
		
		const balloonRadiusX = balloonRect.width / 2;
		const balloonRadiusY = balloonRect.height / 2;
		
		const edgeX = balloonCenterX + Math.cos( angle ) * balloonRadiusX * 0.85;
		const edgeY = balloonCenterY + Math.sin( angle ) * balloonRadiusY * 0.85;

		if ( this._type === BalloonType.TALK || this._type === BalloonType.RECTANGLE ) {
			this.drawTalkPointer( pointerGroup as SVGGElement, edgeX, edgeY, handlerX, handlerY );
		} else if ( this._type === BalloonType.CLOUD ) {
			this.drawCloudPointer( pointerGroup as SVGGElement, edgeX, edgeY, handlerX, handlerY );
		} else if ( this._type === BalloonType.WHISPER ) {
			this.drawWhisperPointer( pointerGroup as SVGGElement, edgeX, edgeY, handlerX, handlerY );
		}
	}

	private drawTalkPointer( group: SVGGElement, edgeX: number, edgeY: number, handlerX: number, handlerY: number ): void {
		const angle = Math.atan2( handlerY - edgeY, handlerX - edgeX );
		const perpAngle = angle + Math.PI / 2;
		
		const baseWidth = 20;
		
		const base1X = edgeX + Math.cos( perpAngle ) * baseWidth / 2;
		const base1Y = edgeY + Math.sin( perpAngle ) * baseWidth / 2;
		const base2X = edgeX - Math.cos( perpAngle ) * baseWidth / 2;
		const base2Y = edgeY - Math.sin( perpAngle ) * baseWidth / 2;
		const tipX = handlerX;
		const tipY = handlerY;

		const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		const d = `M ${base1X} ${base1Y} L ${tipX} ${tipY} L ${base2X} ${base2Y} Z`;
		path.setAttribute( 'd', d );
		path.setAttribute( 'fill', 'white' );
		path.setAttribute( 'stroke', '#000' );
		path.setAttribute( 'stroke-width', '3' );
		path.setAttribute( 'stroke-linejoin', 'round' );
		
		group.appendChild( path );
	}

	private drawCloudPointer( group: SVGGElement, edgeX: number, edgeY: number, handlerX: number, handlerY: number ): void {
		const dx = handlerX - edgeX;
		const dy = handlerY - edgeY;
		
		const numBubbles = 3;
		for ( let i = 0; i < numBubbles; i++ ) {
			const t = ( i + 1 ) / ( numBubbles + 1 );
			const x = edgeX + dx * t;
			const y = edgeY + dy * t;
			const radius = 8 - i * 2;
			
			const circle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
			circle.setAttribute( 'cx', x.toString() );
			circle.setAttribute( 'cy', y.toString() );
			circle.setAttribute( 'r', radius.toString() );
			circle.setAttribute( 'fill', 'white' );
			circle.setAttribute( 'stroke', '#000' );
			circle.setAttribute( 'stroke-width', '2' );
			
			group.appendChild( circle );
		}
	}

	private drawWhisperPointer( group: SVGGElement, edgeX: number, edgeY: number, handlerX: number, handlerY: number ): void {
		const angle = Math.atan2( handlerY - edgeY, handlerX - edgeX );
		const perpAngle = angle + Math.PI / 2;
		
		const baseWidth = 20;
		
		const base1X = edgeX + Math.cos( perpAngle ) * baseWidth / 2;
		const base1Y = edgeY + Math.sin( perpAngle ) * baseWidth / 2;
		const base2X = edgeX - Math.cos( perpAngle ) * baseWidth / 2;
		const base2Y = edgeY - Math.sin( perpAngle ) * baseWidth / 2;
		const tipX = handlerX;
		const tipY = handlerY;

		const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		const d = `M ${base1X} ${base1Y} L ${tipX} ${tipY} L ${base2X} ${base2Y}`;
		path.setAttribute( 'd', d );
		path.setAttribute( 'fill', 'none' );
		path.setAttribute( 'stroke', '#000' );
		path.setAttribute( 'stroke-width', '3' );
		path.setAttribute( 'stroke-dasharray', '10 5' );
		path.setAttribute( 'stroke-linejoin', 'round' );
		path.setAttribute( 'stroke-linecap', 'round' );
		
		group.appendChild( path );
	}

	private setupEventListeners(): void {
		if ( !this.handler ) return;

		this.handler.addEventListener( 'mousedown', this.handleMouseDown.bind( this ) );
		this.handler.addEventListener( 'touchstart', this.handleTouchStart.bind( this ), { passive: false } );

		if ( this.resizeHandle ) {
			this.resizeHandle.addEventListener( 'mousedown', this.handleResizeMouseDown.bind( this ) );
			this.resizeHandle.addEventListener( 'touchstart', this.handleResizeTouchStart.bind( this ), { passive: false } );
		}

		if ( this.contentEditableElement ) {
			this.contentEditableElement.addEventListener( 'blur', this.handleContentBlur.bind( this ) );
		}
	}

	private removeEventListeners(): void {
		if ( !this.handler ) return;

		this.handler.removeEventListener( 'mousedown', this.handleMouseDown.bind( this ) );
		this.handler.removeEventListener( 'touchstart', this.handleTouchStart.bind( this ) );

		if ( this.resizeHandle ) {
			this.resizeHandle.removeEventListener( 'mousedown', this.handleResizeMouseDown.bind( this ) );
			this.resizeHandle.removeEventListener( 'touchstart', this.handleResizeTouchStart.bind( this ) );
		}

		if ( this.contentEditableElement ) {
			this.contentEditableElement.removeEventListener( 'blur', this.handleContentBlur.bind( this ) );
		}
	}

	private handleMouseDown( e: MouseEvent ): void {
		e.preventDefault();
		this.startDrag( e.clientX, e.clientY );

		const handleMouseMove = ( e: MouseEvent ) => this.handleDrag( e.clientX, e.clientY );
		const handleMouseUp = () => {
			this.stopDrag();
			document.removeEventListener( 'mousemove', handleMouseMove );
			document.removeEventListener( 'mouseup', handleMouseUp );
		};

		document.addEventListener( 'mousemove', handleMouseMove );
		document.addEventListener( 'mouseup', handleMouseUp );
	}

	private handleTouchStart( e: TouchEvent ): void {
		e.preventDefault();
		const touch = e.touches[0];
		this.startDrag( touch.clientX, touch.clientY );

		const handleTouchMove = ( e: TouchEvent ) => {
			const touch = e.touches[0];
			this.handleDrag( touch.clientX, touch.clientY );
		};
		const handleTouchEnd = () => {
			this.stopDrag();
			document.removeEventListener( 'touchmove', handleTouchMove );
			document.removeEventListener( 'touchend', handleTouchEnd );
		};

		document.addEventListener( 'touchmove', handleTouchMove, { passive: false } );
		document.addEventListener( 'touchend', handleTouchEnd );
	}

	private startDrag( clientX: number, clientY: number ): void {
		this.isDragging = true;
		if ( this.handler ) {
			this.handler.classList.add( 'dragging' );
		}

		const containerRect = this.shadowRoot.querySelector( '.comic-balloon-container' )?.getBoundingClientRect();
		if ( containerRect ) {
			this.dragStartOffset = {
				x: clientX - containerRect.left - this._handlerPosition.x,
				y: clientY - containerRect.top - this._handlerPosition.y
			};
		}
	}

	private handleDrag( clientX: number, clientY: number ): void {
		if ( !this.isDragging ) return;

		const containerRect = this.shadowRoot.querySelector( '.comic-balloon-container' )?.getBoundingClientRect();
		if ( !containerRect ) return;

		let newX = clientX - containerRect.left - this.dragStartOffset.x;
		let newY = clientY - containerRect.top - this.dragStartOffset.y;

		newX = Math.max( -50, Math.min( containerRect.width + 50, newX ) );
		newY = Math.max( -50, Math.min( containerRect.height + 50, newY ) );

		this._handlerPosition = { x: newX, y: newY };
		this.updateHandlerVisual();
	}

	private stopDrag(): void {
		this.isDragging = false;
		if ( this.handler ) {
			this.handler.classList.remove( 'dragging' );
		}

		this.dispatchEvent( new CustomEvent<HandlerMoveEvent['detail']>( 'handler-move', {
			detail: {
				finalPosition: { ...this._handlerPosition },
				balloonType: this._type
			},
			bubbles: true,
			composed: true
		} ) );
	}

	private handleContentBlur(): void {
		if ( !this.contentEditableElement ) return;

		this.dispatchEvent( new CustomEvent<ContentChangeEvent['detail']>( 'balloon-content-change', {
			detail: {
				newContent: this.contentEditableElement.textContent || '',
				balloonType: this._type
			},
			bubbles: true,
			composed: true
		} ) );
	}

	private handleResizeMouseDown( e: MouseEvent ): void {
		e.preventDefault();
		e.stopPropagation();
		this.startResize( e.clientX, e.clientY );

		const handleMouseMove = ( e: MouseEvent ) => this.handleResize( e.clientX, e.clientY );
		const handleMouseUp = () => {
			this.stopResize();
			document.removeEventListener( 'mousemove', handleMouseMove );
			document.removeEventListener( 'mouseup', handleMouseUp );
		};

		document.addEventListener( 'mousemove', handleMouseMove );
		document.addEventListener( 'mouseup', handleMouseUp );
	}

	private handleResizeTouchStart( e: TouchEvent ): void {
		e.preventDefault();
		e.stopPropagation();
		const touch = e.touches[0];
		this.startResize( touch.clientX, touch.clientY );

		const handleTouchMove = ( e: TouchEvent ) => {
			const touch = e.touches[0];
			this.handleResize( touch.clientX, touch.clientY );
		};
		const handleTouchEnd = () => {
			this.stopResize();
			document.removeEventListener( 'touchmove', handleTouchMove );
			document.removeEventListener( 'touchend', handleTouchEnd );
		};

		document.addEventListener( 'touchmove', handleTouchMove, { passive: false } );
		document.addEventListener( 'touchend', handleTouchEnd );
	}

	private startResize( clientX: number, clientY: number ): void {
		if ( !this.balloon || !this.resizeHandle ) return;

		this.isResizing = true;
		this.resizeHandle.classList.add( 'resizing' );

		this.resizeStartPos = {
			x: clientX,
			y: clientY
		};
	}

	private handleResize( clientX: number, clientY: number ): void {
		if ( !this.isResizing ) return;

		const deltaX = clientX - this.resizeStartPos.x;
		const deltaY = clientY - this.resizeStartPos.y;

		const hostRect = this.getBoundingClientRect();
		const newWidth = Math.max( 150, hostRect.width + deltaX );
		const newHeight = Math.max( 100, hostRect.height + deltaY );

		this.style.width = `${newWidth}px`;
		this.style.height = `${newHeight}px`;

		this.resizeStartPos = {
			x: clientX,
			y: clientY
		};

		this.updateHandlerVisual();
	}

	private stopResize(): void {
		if ( !this.isResizing || !this.balloon || !this.resizeHandle ) return;

		this.isResizing = false;
		this.resizeHandle.classList.remove( 'resizing' );

		const rect = this.balloon.getBoundingClientRect();

		this.dispatchEvent( new CustomEvent<ResizeEvent['detail']>( 'balloon-resize', {
			detail: {
				width: rect.width,
				height: rect.height,
				balloonType: this._type
			},
			bubbles: true,
			composed: true
		} ) );
	}
}

export const defineComicBalloon = (): void => {
	if ( typeof window !== 'undefined' && !customElements.get( 'comic-balloon' ) ) {
		customElements.define( 'comic-balloon', ComicBalloonElement );
	}
};
