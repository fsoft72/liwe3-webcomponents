export type ImageMode = 'stretch' | '1:1' | 'cover' | 'contain';
export type ImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type ImageFX = 'none' | 'bokeh' | 'pan-left' | 'pan-right' | 'zoom-in' | 'zoom-out';

export class ImageView extends HTMLElement {
	private _src: string = '';
	private _width: string = '100%';
	private _height: string = 'auto';
	private _mode: ImageMode = 'cover';
	private _position: ImagePosition = 'center';
	private _fx: ImageFX = 'none';
	private _fxHover: ImageFX = 'none';
	private _alt: string = '';
	private _isHovering: boolean = false;

	private container: HTMLDivElement;
	private img: HTMLImageElement;

	constructor () {
		super();
		this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.textContent = `
            :host {
                display: block;
                overflow: hidden;
                position: relative;
            }

            .container {
                width: 100%;
                height: 100%;
                overflow: hidden;
                position: relative;
                display: flex;
            }

            img {
                display: block;
                transition: transform 0.5s ease, filter 0.5s ease;
            }

            /* Modes */
            .mode-stretch img {
                width: 100%;
                height: 100%;
                object-fit: fill;
            }

            .mode-cover img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .mode-contain img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .mode-1-1 img {
                max-width: none;
                max-height: none;
                /* Default to auto, controlled by position */
            }

            /* Positions for 1:1 and others if applicable */
            .pos-center { justify-content: center; align-items: center; }
            .pos-top { justify-content: center; align-items: flex-start; }
            .pos-bottom { justify-content: center; align-items: flex-end; }
            .pos-left { justify-content: flex-start; align-items: center; }
            .pos-right { justify-content: flex-end; align-items: center; }
            .pos-top-left { justify-content: flex-start; align-items: flex-start; }
            .pos-top-right { justify-content: flex-end; align-items: flex-start; }
            .pos-bottom-left { justify-content: flex-start; align-items: flex-end; }
            .pos-bottom-right { justify-content: flex-end; align-items: flex-end; }

            /* FX */
            .fx-bokeh img {
                filter: blur(3px);
            }

            @keyframes pan-left {
                0% { transform: scale(1.2) translateX(0); }
                100% { transform: scale(1.2) translateX(-10%); }
            }

            @keyframes pan-right {
                0% { transform: scale(1.2) translateX(0); }
                100% { transform: scale(1.2) translateX(10%); }
            }

            @keyframes zoom-in {
                0% { transform: scale(1); }
                100% { transform: scale(1.2); }
            }

            @keyframes zoom-out {
                0% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            .fx-pan-left img {
                animation: pan-left 10s linear infinite alternate;
            }

            .fx-pan-right img {
                animation: pan-right 10s linear infinite alternate;
            }

            .fx-zoom-in img {
                animation: zoom-in 10s linear infinite alternate;
            }

            .fx-zoom-out img {
                animation: zoom-out 10s linear infinite alternate;
            }
        `;

		this.container = document.createElement( 'div' );
		this.container.classList.add( 'container' );

		this.img = document.createElement( 'img' );

		this.container.appendChild( this.img );
		this.shadowRoot!.appendChild( style );
		this.shadowRoot!.appendChild( this.container );

		// Add hover listeners
		this.addEventListener( 'mouseenter', this._handleMouseEnter.bind( this ) );
		this.addEventListener( 'mouseleave', this._handleMouseLeave.bind( this ) );
	}

	private _handleMouseEnter () {
		if ( this._fxHover !== 'none' ) {
			this._isHovering = true;
			this.updateClasses();
		}
	}

	private _handleMouseLeave () {
		if ( this._fxHover !== 'none' ) {
			this._isHovering = false;
			this.updateClasses();
		}
	}

	static get observedAttributes () {
		return [ 'src', 'width', 'height', 'mode', 'position', 'fx', 'fx-hover', 'alt' ];
	}

	attributeChangedCallback ( name: string, oldValue: string, newValue: string ) {
		if ( oldValue === newValue ) return;

		switch ( name ) {
			case 'src':
				this._src = newValue || '';
				this.render();
				break;
			case 'width':
				this._width = newValue || '100%';
				this.updateDimensions();
				break;
			case 'height':
				this._height = newValue || 'auto';
				this.updateDimensions();
				break;
			case 'mode':
				this._mode = ( newValue as ImageMode ) || 'cover';
				this.updateClasses();
				break;
			case 'position':
				this._position = ( newValue as ImagePosition ) || 'center';
				this.updateClasses();
				break;
			case 'fx':
				this._fx = ( newValue as ImageFX ) || 'none';
				this.updateClasses();
				break;
			case 'fx-hover':
				this._fxHover = ( newValue as ImageFX ) || 'none';
				this.updateClasses();
				break;
			case 'alt':
				this._alt = newValue || '';
				this.render();
				break;
		}
	}

	connectedCallback () {
		this.updateDimensions();
		this.updateClasses();
		this.render();
	}

	private updateDimensions () {
		this.style.width = this._width;
		this.style.height = this._height;
	}

	private updateClasses () {
		// Reset classes
		this.container.className = 'container';

		// Add mode class
		this.container.classList.add( `mode-${ this._mode }` );

		// Add position class
		this.container.classList.add( `pos-${ this._position }` );

		// Add FX class - use hover fx if hovering and defined, otherwise use regular fx
		const activeFx = ( this._isHovering && this._fxHover !== 'none' ) ? this._fxHover : this._fx;
		this.container.classList.add( `fx-${ activeFx }` );
	}

	private render () {
		const currentSrc = this.img.getAttribute( 'src' );
		if ( currentSrc !== this._src ) {
			if ( this._src ) {
				this.img.setAttribute( 'src', this._src );
			} else {
				this.img.removeAttribute( 'src' );
			}
		}

		const currentAlt = this.img.getAttribute( 'alt' );
		if ( currentAlt !== this._alt ) {
			if ( this._alt ) {
				this.img.setAttribute( 'alt', this._alt );
			} else {
				this.img.removeAttribute( 'alt' );
			}
		}
	}

	// Public API
	get src (): string { return this._src; }
	set src ( value: string ) { this.setAttribute( 'src', value ); }

	get width (): string { return this._width; }
	set width ( value: string ) { this.setAttribute( 'width', value ); }

	get height (): string { return this._height; }
	set height ( value: string ) { this.setAttribute( 'height', value ); }

	get mode (): ImageMode { return this._mode; }
	set mode ( value: ImageMode ) { this.setAttribute( 'mode', value ); }

	get position (): ImagePosition { return this._position; }
	set position ( value: ImagePosition ) { this.setAttribute( 'position', value ); }

	get fx (): ImageFX { return this._fx; }
	set fx ( value: ImageFX ) { this.setAttribute( 'fx', value ); }

	get fxHover (): ImageFX { return this._fxHover; }
	set fxHover ( value: ImageFX ) { this.setAttribute( 'fx-hover', value ); }

	get alt (): string { return this._alt; }
	set alt ( value: string ) { this.setAttribute( 'alt', value ); }
}

customElements.define( 'liwe3-image-view', ImageView );
