<script lang="ts">
  import { onMount } from "svelte";
  import type { PopoverMenuConfig } from "@liwe3/webcomponents";

  interface Props {
    items?: PopoverMenuConfig[];
  }

  let {
    items = [],
    ...restProps
  }: Props = $props();

  let popoverMenuElement: HTMLElement;
  let isReady = $state(false);

  /**
   * Updates the web component's items based on props
   */
  const updateItems = () => {
    if (!popoverMenuElement || !isReady) return;

    // Check if setItems method exists
    if (typeof (popoverMenuElement as any).setItems === 'function') {
      (popoverMenuElement as any).setItems(items);
    }
  };

  onMount(async () => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/popover-menu");

    // Wait for the custom element to be defined
    await customElements.whenDefined('liwe3-popover-menu');

    // Mark as ready
    isReady = true;

    // Initial update
    updateItems();
  });

  /**
   * Expose methods to parent component
   */
  export const setItems = (newItems: PopoverMenuConfig[]) => {
    if (typeof (popoverMenuElement as any)?.setItems === 'function') {
      (popoverMenuElement as any).setItems(newItems);
    }
  };

  export const getItems = (): PopoverMenuConfig[] => {
    if (typeof (popoverMenuElement as any)?.getItems === 'function') {
      return (popoverMenuElement as any).getItems();
    }
    return [];
  };

  export const addMenuItem = (item: PopoverMenuConfig, index: number | null = null) => {
    if (typeof (popoverMenuElement as any)?.addMenuItem === 'function') {
      (popoverMenuElement as any).addMenuItem(item, index);
    }
  };

  export const removeMenuItem = (index: number) => {
    if (typeof (popoverMenuElement as any)?.removeMenuItem === 'function') {
      (popoverMenuElement as any).removeMenuItem(index);
    }
  };

  export const updateMenuItem = (index: number, item: PopoverMenuConfig) => {
    if (typeof (popoverMenuElement as any)?.updateMenuItem === 'function') {
      (popoverMenuElement as any).updateMenuItem(index, item);
    }
  };

  // Reactively update items when props change (only after component is ready)
  $effect(() => {
    if (isReady) {
      updateItems();
    }
  });
</script>

<!-- svelte-ignore a11y_unknown_aria_attribute -->
<liwe3-popover-menu bind:this={popoverMenuElement} {...restProps}></liwe3-popover-menu>
