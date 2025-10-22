<script lang="ts">
  import { onMount } from "svelte";
  import type { ToastType, ToastButton, ToastConfig } from "@liwe3/webcomponents";

  interface Props {
    title?: string;
    text?: string;
    type?: ToastType;
    icon?: string;
    closable?: boolean;
    duration?: number;
    buttons?: ToastButton[];
    onclose?: () => void;
  }

  let {
    title = "",
    text = "",
    type = "info",
    icon = $bindable(),
    closable = true,
    duration = 0,
    buttons = [],
    onclose,
    ...restProps
  }: Props = $props();

  let toastElement: HTMLElement;

  /**
   * Updates the web component's attributes based on props
   */
  const updateAttributes = () => {
    if (!toastElement) return;

    // Set string attributes
    toastElement.setAttribute("title", title);
    toastElement.setAttribute("text", text);
    toastElement.setAttribute("type", type);

    if (icon !== undefined) {
      toastElement.setAttribute("icon", icon);
    } else {
      toastElement.removeAttribute("icon");
    }

    // Set boolean attributes
    if (closable) {
      toastElement.setAttribute("closable", "true");
    } else {
      toastElement.setAttribute("closable", "false");
    }

    // Set duration
    toastElement.setAttribute("duration", duration.toString());

    // Set buttons as JSON string
    if (buttons.length > 0) {
      toastElement.setAttribute("buttons", JSON.stringify(buttons));
    }
  };

  /**
   * Binds event listeners to the web component
   */
  const bindEvents = () => {
    if (!toastElement) return;

    toastElement.addEventListener("close", () => {
      onclose?.();
    });
  };

  onMount(async () => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/toast");

    updateAttributes();
    bindEvents();
  });

  /**
   * Expose methods to parent component
   */
  export const show = (config: ToastConfig) => {
    (toastElement as any)?.show(config);
  };

  export const close = () => {
    (toastElement as any)?.close();
  };
</script>

<!-- svelte-ignore a11y_unknown_aria_attribute -->
<liwe3-toast bind:this={toastElement} {...restProps}></liwe3-toast>
