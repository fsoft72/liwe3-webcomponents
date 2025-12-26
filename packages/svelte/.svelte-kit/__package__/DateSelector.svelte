<script lang="ts">
  import { onMount } from "svelte";
  import type { DateRange } from "@liwe3/webcomponents";

  interface Props {
    rangeMode?: boolean;
    selectedDate?: string | null;
    selectedRange?: DateRange;
    ondateselected?: (date: string) => void;
    onrangeselected?: (range: DateRange) => void;
  }

  let {
    rangeMode = false,
    selectedDate = $bindable(null),
    selectedRange = $bindable({ start: null, end: null }),
    ondateselected,
    onrangeselected,
    ...restProps
  }: Props = $props();

  let dateSelectorElement: HTMLElement;

  /**
   * Updates the web component's attributes based on props
   */
  const updateAttributes = () => {
    if (!dateSelectorElement) return;

    // Set boolean attributes
    if (rangeMode) {
      dateSelectorElement.setAttribute("range-mode", "");
    } else {
      dateSelectorElement.removeAttribute("range-mode");
    }

    // Set selected date in single mode
    if (!rangeMode && selectedDate) {
      (dateSelectorElement as any).setDate(selectedDate);
    }

    // Set selected range in range mode
    if (rangeMode && selectedRange && selectedRange.start && selectedRange.end) {
      (dateSelectorElement as any).setRange(selectedRange.start, selectedRange.end);
    }
  };

  /**
   * Binds event listeners to the web component
   */
  const bindEvents = () => {
    if (!dateSelectorElement) return;

    dateSelectorElement.addEventListener("dateSelected", (event) => {
      const customEvent = event as CustomEvent;
      selectedDate = customEvent.detail.date;
      ondateselected?.(customEvent.detail.date);
    });

    dateSelectorElement.addEventListener("rangeSelected", (event) => {
      const customEvent = event as CustomEvent;
      selectedRange = {
        start: customEvent.detail.start,
        end: customEvent.detail.end
      };
      onrangeselected?.(selectedRange);
    });
  };

  onMount(async () => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/date-selector");

    updateAttributes();
    bindEvents();
  });

  /**
   * Expose methods to parent component
   */
  export const setDate = (dateStr: string) => {
    (dateSelectorElement as any)?.setDate(dateStr);
  };

  export const setRange = (startDate: string, endDate: string) => {
    (dateSelectorElement as any)?.setRange(startDate, endDate);
  };

  export const getSelectedDate = () => {
    return (dateSelectorElement as any)?.getSelectedDate() || null;
  };

  export const getSelectedRange = () => {
    return (dateSelectorElement as any)?.getSelectedRange() || { start: null, end: null };
  };

  export const clear = () => {
    (dateSelectorElement as any)?.clear();
  };
</script>

<!-- svelte-ignore a11y_unknown_aria_attribute -->
<liwe3-date-selector bind:this={dateSelectorElement} {...restProps}></liwe3-date-selector>
