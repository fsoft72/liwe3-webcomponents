<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    value?: string;
    libUrl?: string;
    onlibraryloaded?: () => void;
  }

  let {
    value = "",
    libUrl = "https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js",
    onlibraryloaded,
  }: Props = $props();

  let elementRef: HTMLElement;
  let webComponent = $state<any>(null);

  $effect(() => {
    if (webComponent) {
      if (webComponent.libUrl !== libUrl) {
        webComponent.libUrl = libUrl;
      }
      if (webComponent.value !== value) {
        webComponent.value = value;
      }
    }
  });

  onMount(async (): Promise<any> => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/markdown-preview");

    // Get reference to the web component
    webComponent = elementRef;

    const handleLibraryLoaded = () => {
      onlibraryloaded?.();
    };

    webComponent.addEventListener("library-loaded", handleLibraryLoaded);

    // Cleanup
    return () => {
      webComponent?.removeEventListener("library-loaded", handleLibraryLoaded);
    };
  });
</script>

<liwe3-markdown-preview bind:this={elementRef}></liwe3-markdown-preview>
