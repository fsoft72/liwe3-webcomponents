<script lang="ts">
import { onMount } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type {
	CheckListElement as CheckListElementType,
	CheckListItem,
} from '@liwe3/webcomponents';

interface Props extends HTMLAttributes<CheckListElementType> {
	title?: string;
	items?: CheckListItem[];
	onchange?: (items: CheckListItem[]) => void;
}

let {
	title = 'Checklist',
	items = [],
	onchange,
	...restProps
}: Props = $props();

let element: CheckListElementType;
let isReady = $state(false);
let removeListeners: (() => void) | null = null;

const syncProps = () => {
	if (!isReady || !element) return;
	element.title = title;
	element.items = items;
};

const bindEvents = () => {
	if (!element) return;

	const handleChange = (event: CustomEvent) => {
		const newItems = event.detail.items;
		onchange?.(newItems);
	};

	element.addEventListener('change', handleChange as EventListener);

	removeListeners = () => {
		element.removeEventListener('change', handleChange as EventListener);
	};
};

onMount(() => {
	let isMounted = true;

	const setup = async () => {
		// Dynamic import to ensure the web component is registered
		await import('@liwe3/webcomponents');
		await customElements.whenDefined('liwe3-checklist');

		if (!isMounted) return;
		isReady = true;
		syncProps();
		bindEvents();
	};

	void setup();

	return () => {
		isMounted = false;
		removeListeners?.();
		removeListeners = null;
	};
});

$effect(() => {
	if (!isReady || !element) return;
	element.title = title;
});

$effect(() => {
	if (!isReady || !element) return;
	// We need to be careful not to create an infinite loop if the change event updates the items prop
	// But since we are passing a new array reference from the parent usually, it should be fine.
	// However, if the parent updates the array in place, Svelte might not detect it unless using $state.
	// For now, we assume standard Svelte 5 reactivity.
	if (JSON.stringify(element.items) !== JSON.stringify(items)) {
		element.items = items;
	}
});
</script>

<liwe3-checklist bind:this={element} {...restProps}></liwe3-checklist>
