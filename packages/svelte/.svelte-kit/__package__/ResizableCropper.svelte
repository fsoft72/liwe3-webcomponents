<script lang="ts">
import { onMount } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type {
	ResizableCropperElement as ResizableCropperElementType,
	ResizableCropperValues,
} from '@liwe3/webcomponents';

interface Props extends HTMLAttributes<ResizableCropperElementType> {
	width? : number;
	height? : number;
	minWidth? : number;
	minHeight? : number;
	aspectRatio? : string;
	disabled? : boolean;
	allowCrop? : boolean;
	allowResize? : boolean;
	onchange? : ( values : ResizableCropperValues ) => void;
	'onrcw:change'? : ( detail : any ) => void;
	'onrcw:scale-start'? : ( detail : any ) => void;
	'onrcw:crop-start'? : ( detail : any ) => void;
	'onrcw:pan-start'? : ( detail : any ) => void;
}

let {
	width = 200,
	height = 150,
	minWidth = 50,
	minHeight = 50,
	aspectRatio,
	disabled = false,
	allowCrop = true,
	allowResize = true,
	onchange,
	'onrcw:change': onRcwChange,
	'onrcw:scale-start': onRcwScaleStart,
	'onrcw:crop-start': onRcwCropStart,
	'onrcw:pan-start': onRcwPanStart,
	children,
	...restProps
} : Props = $props();

let cropperElement : ResizableCropperElementType;
let isReady = $state( false );
let removeListeners : (() => void) | null = null;

/**
 * Forwards custom events emitted by the web component to Svelte callbacks.
 */
const bindEvents = () => {
	if ( !cropperElement ) return;

	const handleChange = ( event : Event ) => {
		const detail = ( event as CustomEvent ).detail as ResizableCropperValues;
		onchange?.( detail );
	};

	const handleRcwChange = ( event : Event ) => {
		const detail = ( event as CustomEvent ).detail;
		onRcwChange?.( detail );
	};

	const handleRcwScaleStart = ( event : Event ) => {
		const detail = ( event as CustomEvent ).detail;
		onRcwScaleStart?.( detail );
	};

	const handleRcwCropStart = ( event : Event ) => {
		const detail = ( event as CustomEvent ).detail;
		onRcwCropStart?.( detail );
	};

	const handleRcwPanStart = ( event : Event ) => {
		const detail = ( event as CustomEvent ).detail;
		onRcwPanStart?.( detail );
	};

	cropperElement.addEventListener( 'change', handleChange as EventListener );
	cropperElement.addEventListener( 'rcw:change', handleRcwChange as EventListener );
	cropperElement.addEventListener( 'rcw:scale-start', handleRcwScaleStart as EventListener );
	cropperElement.addEventListener( 'rcw:crop-start', handleRcwCropStart as EventListener );
	cropperElement.addEventListener( 'rcw:pan-start', handleRcwPanStart as EventListener );

	removeListeners = () => {
		cropperElement.removeEventListener( 'change', handleChange as EventListener );
		cropperElement.removeEventListener( 'rcw:change', handleRcwChange as EventListener );
		cropperElement.removeEventListener( 'rcw:scale-start', handleRcwScaleStart as EventListener );
		cropperElement.removeEventListener( 'rcw:crop-start', handleRcwCropStart as EventListener );
		cropperElement.removeEventListener( 'rcw:pan-start', handleRcwPanStart as EventListener );
	};
};

onMount( () => {
	let isMounted = true;

	const setup = async () => {
		await import( '@liwe3/webcomponents/resizable-cropper' );
		await customElements.whenDefined( 'liwe3-resizable-cropper' );

		if ( !isMounted ) return;
		isReady = true;
		bindEvents();
	};

	void setup();

	return () => {
		isMounted = false;
		removeListeners?.();
		removeListeners = null;
	};
} );

$effect( () => {
	if ( !isReady || !cropperElement ) return;
	cropperElement.width = width;
} );

$effect( () => {
	if ( !isReady || !cropperElement ) return;
	cropperElement.height = height;
} );

$effect( () => {
	if ( !isReady || !cropperElement ) return;
	cropperElement.minWidth = minWidth;
} );

$effect( () => {
	if ( !isReady || !cropperElement ) return;
	cropperElement.minHeight = minHeight;
} );

$effect( () => {
	if ( !isReady || !cropperElement ) return;
	cropperElement.aspectRatio = aspectRatio || null;
} );

$effect( () => {
	if ( !isReady || !cropperElement ) return;
	cropperElement.disabled = disabled;
} );

$effect( () => {
	if ( !isReady || !cropperElement ) return;
	cropperElement.allowCrop = allowCrop;
} );

$effect( () => {
	if ( !isReady || !cropperElement ) return;
	cropperElement.allowResize = allowResize;
} );

/**
 * Expose public methods
 */
export function getValues() : ResizableCropperValues | undefined {
	return cropperElement?.getValues();
}

export function setValues( values : Partial<ResizableCropperValues> ) : void {
	cropperElement?.setValues( values );
}
</script>

<liwe3-resizable-cropper bind:this={cropperElement} {...restProps}>
	{@render children?.()}
</liwe3-resizable-cropper>
