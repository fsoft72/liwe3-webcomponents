<script lang="ts">
  import { onMount } from "svelte";
  import type { SelectOption } from "@liwe3/webcomponents";

  interface Props {
    multiple?: boolean;
    searchable?: boolean;
    placeholder?: string;
    disabled?: boolean;
    value?: string | string[];
    options?: SelectOption[];
    onchange?: (value: string | string[] | undefined) => void;
    onopen?: (event: CustomEvent) => void;
    onclose?: (event: CustomEvent) => void;
    onsearch?: (event: CustomEvent) => void;
  }

  let {
    multiple = false,
    searchable = false,
    placeholder = "Select an option",
    disabled = false,
    value = $bindable(),
    options = [],
    onchange,
    onopen,
    onclose,
    onsearch,
    ...restProps
  }: Props = $props();

  let smartSelectElement: HTMLElement;

  /**
   * Updates the web component's attributes based on props
   */
  const updateAttributes = () => {
    if (!smartSelectElement) return;

    // Set boolean attributes
    if (multiple) {
      smartSelectElement.setAttribute("multiple", "");
    } else {
      smartSelectElement.removeAttribute("multiple");
    }

    if (searchable) {
      smartSelectElement.setAttribute("searchable", "");
    } else {
      smartSelectElement.removeAttribute("searchable");
    }

    if (disabled) {
      smartSelectElement.setAttribute("disabled", "");
    } else {
      smartSelectElement.removeAttribute("disabled");
    }

    // Set string attributes
    smartSelectElement.setAttribute("placeholder", placeholder);

    // Set options as JSON string
    if (options.length > 0) {
      smartSelectElement.setAttribute("options", JSON.stringify(options));
    }

    // Set value
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        (smartSelectElement as any).value = value;
      } else {
        (smartSelectElement as any).value = value;
      }
    }
  };

  /**
   * Binds event listeners to the web component
   */
  const bindEvents = () => {
    if (!smartSelectElement) return;

    smartSelectElement.addEventListener("change", (event) => {
      const customEvent = event as CustomEvent;
      value = customEvent.detail.value;
      onchange?.(value);
    });

    smartSelectElement.addEventListener("open", (event) => {
      onopen?.(event as CustomEvent);
    });

    smartSelectElement.addEventListener("close", (event) => {
      onclose?.(event as CustomEvent);
    });

    smartSelectElement.addEventListener("search", (event) => {
      onsearch?.(event as CustomEvent);
    });
  };

  onMount(async () => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/smart-select");

    updateAttributes();
    bindEvents();

    /*
		// Watch for prop changes and update attributes
		$effect(() => {
			updateAttributes();
		});
		*/
  });

  /**
   * Expose methods to parent component
   */
  export const open = () => {
    (smartSelectElement as any)?.open();
  };

  export const close = () => {
    (smartSelectElement as any)?.close();
  };

  export const toggle = () => {
    (smartSelectElement as any)?.toggle();
  };

  export const selectOption = (optionValue: string) => {
    (smartSelectElement as any)?.selectOption(optionValue);
  };

  export const deselectOption = (optionValue: string) => {
    (smartSelectElement as any)?.deselectOption(optionValue);
  };

  export const getSelectedOptions = () => {
    return (smartSelectElement as any)?.getSelectedOptions() || [];
  };

  export const setOptions = (newOptions: SelectOption[]) => {
    (smartSelectElement as any)?.setOptions(newOptions);
  };
</script>

<!-- svelte-ignore a11y_unknown_aria_attribute -->
<liwe3-select bind:this={smartSelectElement} {...restProps}></liwe3-select>
