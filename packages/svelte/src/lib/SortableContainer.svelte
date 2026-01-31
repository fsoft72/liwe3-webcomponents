<script lang="ts">
import { onMount, tick } from 'svelte';
import type {
	HandlePosition,
	ReorgEventDetail,
	SortDirection,
} from '@liwe3/webcomponents';

interface Props {
	direction? : SortDirection;
	idName? : string;
	handlePosition? : HandlePosition;
	onreorg? : ( event : CustomEvent<ReorgEventDetail> ) => void;
	children? : import('svelte').Snippet;
}

let {
	direction = 'v',
	idName = 'id',
	handlePosition = 'end',
	onreorg,
	children,
	...restProps
} : Props = $props();

let sortableContainerElement : HTMLElement;
let isReady = $state( false );

/**
 * Updates the web component's attributes based on props
 */
const updateAttributes = () => {
	if ( !sortableContainerElement || !isReady ) return;

	sortableContainerElement.setAttribute( 'direction', direction );
	sortableContainerElement.setAttribute( 'id-name', idName );
	sortableContainerElement.setAttribute( 'handle-position', handlePosition );
};

/**
 * Binds event listeners to the web component
 */
const bindEvents = () => {
	if ( !sortableContainerElement ) return;

	sortableContainerElement.addEventListener( 'reorg', ( event ) => {
		onreorg?.( event as CustomEvent<ReorgEventDetail> );
	} );
};

onMount( async () => {
	// Dynamically import the web component
	await import( '@liwe3/webcomponents/sortable-container' );
	await customElements.whenDefined( 'liwe3-sortable-container' );

	isReady = true;
	updateAttributes();
	bindEvents();

	// Force re-wrap children after Svelte has rendered them
	// Use multiple ticks and a small delay to ensure children are fully rendered
	await tick();
	await tick();
	requestAnimationFrame( () => {
		( sortableContainerElement as any )?.wrapAllChildren?.();
	} );
} );

$effect( () => {
	if ( isReady ) {
		updateAttributes();
	}
} );

/**
 * Get the current order of element IDs
 */
export const getOrder = () : string[] => {
	return ( sortableContainerElement as any )?.getOrder?.() ?? [];
};
</script>

<liwe3-sortable-container bind:this={sortableContainerElement} {...restProps}>
	{@render children?.()}
</liwe3-sortable-container>
