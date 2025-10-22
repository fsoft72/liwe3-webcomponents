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

  /**
   * Updates the web component's items based on props
   */
  const updateItems = () => {
    if (!popoverMenuElement) return;

    // Set items using the setItems method
    if (items.length > 0) {
      (popoverMenuElement as any)?.setItems(items);
    }
  };

  onMount(async () => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/popover-menu");

    updateItems();
  });

  /**
   * Expose methods to parent component
   */
  export const setItems = (newItems: PopoverMenuConfig[]) => {
    (popoverMenuElement as any)?.setItems(newItems);
  };

  export const getItems = (): PopoverMenuConfig[] => {
    return (popoverMenuElement as any)?.getItems() || [];
  };

  export const addMenuItem = (item: PopoverMenuConfig, index: number | null = null) => {
    (popoverMenuElement as any)?.addMenuItem(item, index);
  };

  export const removeMenuItem = (index: number) => {
    (popoverMenuElement as any)?.removeMenuItem(index);
  };

  export const updateMenuItem = (index: number, item: PopoverMenuConfig) => {
    (popoverMenuElement as any)?.updateMenuItem(index, item);
  };

  // Reactively update items when props change
  $effect(() => {
    updateItems();
  });
</script>

<!-- svelte-ignore a11y_unknown_aria_attribute -->
<liwe3-popover-menu bind:this={popoverMenuElement} {...restProps}></liwe3-popover-menu>
