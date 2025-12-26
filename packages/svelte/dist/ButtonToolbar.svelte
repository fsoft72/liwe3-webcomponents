<script lang="ts">
  import { onMount } from "svelte";
  import type { ButtonToolbarGroup, ButtonToolbarItem } from "@liwe3/webcomponents";

  interface Props {
    orientation?: 'horizontal' | 'vertical';
    groups?: ButtonToolbarGroup[];
    onbuttonclick?: (detail: { id: string; action: string; originalEvent: Event; item: ButtonToolbarItem }) => void;
  }

  let {
    orientation = "horizontal",
    groups = [],
    onbuttonclick,
    ...restProps
  }: Props = $props();

  let elementRef: HTMLElement;
  let webComponent = $state<any>(null);

  $effect(() => {
    if (webComponent) {
      webComponent.orientation = orientation;
    }
  });

  $effect(() => {
    if (webComponent) {
      webComponent.groups = groups;
    }
  });

  onMount(async () => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/button-toolbar");

    // Get reference to the web component
    webComponent = elementRef;

    // Listen for events
    const handleButtonClick = (event: CustomEvent) => {
      onbuttonclick?.(event.detail);
    };

    webComponent.addEventListener("button-click", handleButtonClick);

    // Cleanup
    return () => {
      webComponent?.removeEventListener("button-click", handleButtonClick);
    };
  });
</script>

<!-- svelte-ignore a11y_unknown_aria_attribute -->
<liwe3-button-toolbar bind:this={elementRef} {...restProps}></liwe3-button-toolbar>
