<script lang="ts">
  import { onMount } from "svelte";
  import type { TreeNode } from "@liwe3/webcomponents";

  interface Props {
    data?: TreeNode[];
    indentWidth?: number;
    selectedIds?: string[];
    onselectionchange?: (selectedIds: string[]) => void;
    ontoggle?: (event: CustomEvent<{ nodeId: string; expanded: boolean }>) => void;
    onitemselected?: (event: CustomEvent<{ node: TreeNode; nodeId: string }>) => void;
  }

  let {
    data = $bindable([]),
    indentWidth = 20,
    selectedIds = $bindable([]),
    onselectionchange,
    ontoggle,
    onitemselected,
    ...restProps
  }: Props = $props();

  let treeViewElement: HTMLElement;

  /**
   * Updates the web component's attributes based on props
   */
  const updateAttributes = () => {
    if (!treeViewElement) return;

    // Set data
    if (data && data.length > 0) {
      (treeViewElement as any).data = data;
    }

    // Set indent width
    treeViewElement.setAttribute("indent-width", indentWidth.toString());

    // Set selected IDs
    if (selectedIds && selectedIds.length > 0) {
      (treeViewElement as any).selectedNodeIds = selectedIds;
    }
  };

  /**
   * Binds event listeners to the web component
   */
  const bindEvents = () => {
    if (!treeViewElement) return;

    treeViewElement.addEventListener("selectionchange", (event) => {
      const customEvent = event as CustomEvent;
      selectedIds = customEvent.detail.selectedIds;
      onselectionchange?.(selectedIds);
    });

    treeViewElement.addEventListener("toggle", (event) => {
      ontoggle?.(event as CustomEvent);
    });

    treeViewElement.addEventListener("itemselected", (event) => {
      onitemselected?.(event as CustomEvent);
    });
  };

  onMount(async () => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/tree-view");

    updateAttributes();
    bindEvents();
  });

  /**
   * Expose methods to parent component
   */
  export const toggleExpansion = (nodeId: string) => {
    (treeViewElement as any)?.toggleExpansion(nodeId);
  };

  export const toggleSelection = (nodeId: string) => {
    (treeViewElement as any)?.toggleSelection(nodeId);
  };

  export const selectAll = () => {
    (treeViewElement as any)?.selectAll();
  };

  export const deselectAll = () => {
    (treeViewElement as any)?.deselectAll();
  };

  export const expandAll = () => {
    (treeViewElement as any)?.expandAll();
  };

  export const collapseAll = () => {
    (treeViewElement as any)?.collapseAll();
  };
</script>

<liwe3-tree-view bind:this={treeViewElement} {...restProps}></liwe3-tree-view>
