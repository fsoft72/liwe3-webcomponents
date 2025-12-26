<script lang="ts">
  import { onMount } from "svelte";
  import type { PopoverMenuItem, MenuPosition } from "@liwe3/webcomponents";

  interface Props {
    menuPosition?: MenuPosition;
    menuItems?: PopoverMenuItem[];
    alwaysShowMenu?: boolean;
    children?: import("svelte").Snippet;
  }

  let {
    menuPosition = "bottom-left",
    menuItems = [],
    alwaysShowMenu = false,
    children,
    ...restProps
  }: Props = $props();

  let containerBoxElement: HTMLElement;
  let isReady = $state(false);

  const updateProps = () => {
    if (!containerBoxElement || !isReady) return;

    const el = containerBoxElement as any;

    if (typeof el.setMenuPosition === "function") {
      el.setMenuPosition(menuPosition);
    }
    if (typeof el.setMenuItems === "function") {
      el.setMenuItems(menuItems);
    }
    if (typeof el.setAlwaysShowMenu === "function") {
      el.setAlwaysShowMenu(alwaysShowMenu);
    }
  };

  onMount(async () => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/container-box");
    await customElements.whenDefined("liwe3-container-box");

    isReady = true;
    updateProps();
  });

  $effect(() => {
    if (isReady) {
      updateProps();
    }
  });
</script>

<!-- svelte-ignore a11y_unknown_aria_attribute -->
<liwe3-container-box bind:this={containerBoxElement} {...restProps}>
  {@render children?.()}
</liwe3-container-box>
