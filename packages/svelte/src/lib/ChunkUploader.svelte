<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type {
    ChunkUploaderElement as ChunkUploaderElementType,
    UploadedFile,
  } from "@liwe3/webcomponents";

  interface Props extends HTMLAttributes<ChunkUploaderElementType> {
    serverURL?: string;
    chunkSize?: number;
    authToken?: string;
    validFiletypes?: string[];
    maxFileSize?: number;
    labelDropFiles?: string;
    labelBrowse?: string;
    onfilecomplete?: (event: CustomEvent<UploadedFile>) => void;
    onuploadcomplete?: (event: CustomEvent<UploadedFile[]>) => void;
    onuploadaborted?: (event: CustomEvent<UploadedFile[]>) => void;
  }

  let {
    serverURL = "",
    chunkSize = 5,
    authToken,
    validFiletypes,
    maxFileSize = 5120,
    labelDropFiles,
    labelBrowse,
    onfilecomplete,
    onuploadcomplete,
    onuploadaborted,
    ...restProps
  }: Props = $props();

  let uploaderElement: ChunkUploaderElementType;
  let isReady = false;
  let removeListeners: (() => void) | null = null;

  /**
   * Syncs the latest prop values down to the underlying web component.
   */
  const syncProps = () => {
    if (!isReady || !uploaderElement) return;

    uploaderElement.serverURL = serverURL ?? "";
    uploaderElement.chunkSize = chunkSize;
    uploaderElement.authToken = authToken;
    uploaderElement.validFiletypes = validFiletypes?.length
      ? [...validFiletypes]
      : undefined;
    uploaderElement.maxFileSize = maxFileSize;
    uploaderElement.labelDropFiles = labelDropFiles;
    uploaderElement.labelBrowse = labelBrowse;
  };

  /**
   * Forwards custom events emitted by the web component to Svelte callbacks.
   */
  const bindEvents = () => {
    if (!uploaderElement) return;

    const handleFileComplete = (event: Event) => {
      onfilecomplete?.(event as CustomEvent<UploadedFile>);
    };

    const handleUploadComplete = (event: Event) => {
      onuploadcomplete?.(event as CustomEvent<UploadedFile[]>);
    };

    const handleUploadAborted = (event: Event) => {
      onuploadaborted?.(event as CustomEvent<UploadedFile[]>);
    };

    uploaderElement.addEventListener(
      "filecomplete",
      handleFileComplete as EventListener
    );
    uploaderElement.addEventListener(
      "uploadcomplete",
      handleUploadComplete as EventListener
    );
    uploaderElement.addEventListener(
      "uploadaborted",
      handleUploadAborted as EventListener
    );

    removeListeners = () => {
      uploaderElement.removeEventListener(
        "filecomplete",
        handleFileComplete as EventListener
      );
      uploaderElement.removeEventListener(
        "uploadcomplete",
        handleUploadComplete as EventListener
      );
      uploaderElement.removeEventListener(
        "uploadaborted",
        handleUploadAborted as EventListener
      );
    };
  };

  onMount(() => {
    let isMounted = true;

    const setup = async () => {
      await import("@liwe3/webcomponents/chunk-uploader");
      await customElements.whenDefined("liwe3-chunk-uploader");

      if (!isMounted) return;
      isReady = true;
      syncProps();
      bindEvents();
    };

    void setup();

    return () => {
      isMounted = false;
      removeListeners?.();
      removeListeners = null;
    };
  });

  $effect(() => {
    if (!isReady || !uploaderElement) return;
    uploaderElement.serverURL = serverURL ?? "";
  });

  $effect(() => {
    if (!isReady || !uploaderElement) return;
    uploaderElement.chunkSize = chunkSize;
  });

  $effect(() => {
    if (!isReady || !uploaderElement) return;
    uploaderElement.authToken = authToken;
  });

  $effect(() => {
    if (!isReady || !uploaderElement) return;
    uploaderElement.validFiletypes = validFiletypes?.length
      ? [...validFiletypes]
      : undefined;
  });

  $effect(() => {
    if (!isReady || !uploaderElement) return;
    uploaderElement.maxFileSize = maxFileSize;
  });

  $effect(() => {
    if (!isReady || !uploaderElement) return;
    uploaderElement.labelDropFiles = labelDropFiles;
  });

  $effect(() => {
    if (!isReady || !uploaderElement) return;
    uploaderElement.labelBrowse = labelBrowse;
  });
</script>

<liwe3-chunk-uploader bind:this={uploaderElement} {...restProps}
></liwe3-chunk-uploader>
