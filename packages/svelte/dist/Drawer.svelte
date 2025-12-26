<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Snippet } from "svelte";

  type DrawerDirection = "horizontal" | "vertical";
  type DrawerState = "expanded" | "shrunk" | "closed";

  interface DrawerElement extends HTMLElement {
    direction: DrawerDirection;
    duration: number;
    showTitleWhenShrunk: boolean;
    closable: boolean;
    title: string;
    icon: string;
    showToggleButton: boolean;
    contentPadding: string;
    state: DrawerState;
    expand: () => void;
    shrink: () => void;
    close: () => void;
    toggle: () => void;
  }

  interface Props {
    direction?: DrawerDirection;
    duration?: number;
    showTitleWhenShrunk?: boolean;
    closable?: boolean;
    title?: string;
    icon?: string;
    state?: DrawerState;
    showToggleButton?: boolean;
    contentPadding?: string;
    onstatechange?: (
      event: CustomEvent<{ oldState: DrawerState; newState: DrawerState }>
    ) => void;
    onexpanded?: (event: CustomEvent) => void;
    onshrunk?: (event: CustomEvent) => void;
    onclosed?: (event: CustomEvent) => void;
    children?: Snippet;
  }

  let {
    direction = "horizontal",
    duration = 300,
    showTitleWhenShrunk = false,
    closable = true,
    title = "",
    icon = "☰",
    state = $bindable<DrawerState>("expanded"),
    showToggleButton = true,
    contentPadding = "16px",
    onstatechange,
    onexpanded,
    onshrunk,
    onclosed,
    children,
    ...restProps
  }: Props = $props();

  let drawerElement: DrawerElement;
  let isReady = false;
  let eventsBound = false;
  let removeListeners: (() => void) | null = null;

  const updateAttributes = () => {
    if (!drawerElement || !isReady) return;

    drawerElement.direction = direction;
    drawerElement.duration = duration;
    drawerElement.showTitleWhenShrunk = showTitleWhenShrunk;
    drawerElement.closable = closable;
    drawerElement.title = title;
    drawerElement.icon = icon;
    drawerElement.showToggleButton = showToggleButton;
    drawerElement.contentPadding = contentPadding ?? "16px";
    drawerElement.state = state;
  };

  const bindEvents = () => {
    if (!drawerElement || eventsBound) return;

    const handleStateChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        oldState: DrawerState;
        newState: DrawerState;
      }>;

      state = customEvent.detail.newState;
      onstatechange?.(customEvent);
    };

    const handleExpanded = (event: Event) => {
      onexpanded?.(event as CustomEvent);
    };

    const handleShrunk = (event: Event) => {
      onshrunk?.(event as CustomEvent);
    };

    const handleClosed = (event: Event) => {
      onclosed?.(event as CustomEvent);
    };

    drawerElement.addEventListener(
      "drawer-state-change",
      handleStateChange as EventListener
    );
    drawerElement.addEventListener(
      "drawer-expanded",
      handleExpanded as EventListener
    );
    drawerElement.addEventListener(
      "drawer-shrunk",
      handleShrunk as EventListener
    );
    drawerElement.addEventListener(
      "drawer-closed",
      handleClosed as EventListener
    );

    removeListeners = () => {
      drawerElement.removeEventListener(
        "drawer-state-change",
        handleStateChange as EventListener
      );
      drawerElement.removeEventListener(
        "drawer-expanded",
        handleExpanded as EventListener
      );
      drawerElement.removeEventListener(
        "drawer-shrunk",
        handleShrunk as EventListener
      );
      drawerElement.removeEventListener(
        "drawer-closed",
        handleClosed as EventListener
      );
    };

    eventsBound = true;
  };

  onMount(async () => {
    await import("@liwe3/webcomponents/drawer");
    await customElements.whenDefined("liwe3-drawer");

    isReady = true;
    updateAttributes();
    bindEvents();
  });

  onDestroy(() => {
    removeListeners?.();
    removeListeners = null;
    eventsBound = false;
  });

  $effect(() => {
    if (!isReady) return;
    updateAttributes();
  });

  /** Expand the drawer programmatically. */
  export const expand = () => {
    drawerElement?.expand();
  };

  /** Shrink the drawer to its collapsed size. */
  export const shrink = () => {
    drawerElement?.shrink();
  };

  /** Close the drawer and remove it from the DOM. */
  export const close = () => {
    drawerElement?.close();
  };

  /** Toggle between expanded and shrunk states. */
  export const toggle = () => {
    drawerElement?.toggle();
  };

  /** Return the current drawer state. */
  export const getState = (): DrawerState => {
    return drawerElement?.state ?? state;
  };

  /** Imperatively set the drawer state. */
  export const setState = (nextState: DrawerState) => {
    if (!drawerElement) return;

    drawerElement.state = nextState;
    state = nextState;
  };
</script>

<!-- svelte-ignore a11y_unknown_aria_attribute -->
<liwe3-drawer bind:this={drawerElement} {...restProps}>
  {@render children?.()}
</liwe3-drawer>
