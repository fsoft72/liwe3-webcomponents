<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    value?: string;
    apiKey?: string;
    suggestionDelay?: number;
    systemPrompt?: string;
    apiEndpoint?: string;
    modelName?: string;
    placeholder?: string;

    onbeforesuggestion?: (data: any) => boolean;
    oncompletionerror?: (error: string) => void;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(""),
    apiKey = "",
    suggestionDelay = 3000,
    systemPrompt = $bindable(
      "You are a helpful writing assistant. Continue the user's text naturally and coherently. Provide 1-3 sentences that would logically follow their writing. Keep the same tone and style. Do not repeat what they've already written."
    ),
    apiEndpoint = "https://api.openai.com/v1/chat/completions",
    modelName = "gpt-3.5-turbo",
    placeholder = "Start writing your markdown text here...",

    onbeforesuggestion,
    oncompletionerror,
    onchange,
  }: Props = $props();

  let elementRef: HTMLElement;
  let webComponent = $state<any>(null);

  /**
   * Updates the web component property and syncs with Svelte state
   */
  const updateWebComponentProperty = (
    propertyName: string,
    newValue: any,
    setterMethod?: string
  ) => {
    if (!webComponent) return;

    const method =
      setterMethod ||
      `set${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}`;
    if (typeof webComponent[method] === "function") {
      webComponent[method](newValue);
    } else if (propertyName in webComponent) {
      webComponent[propertyName] = newValue;
    }
  };

  $effect(() => {
    if (webComponent) {
      updateWebComponentProperty("apiKey", apiKey);
      updateWebComponentProperty("suggestionDelay", suggestionDelay / 1000);
      updateWebComponentProperty("systemPrompt", systemPrompt);
      updateWebComponentProperty("apiEndpoint", apiEndpoint);
      updateWebComponentProperty("modelName", modelName);
    }
  });

  $effect(() => {
    if (
      webComponent &&
      typeof webComponent.getText === "function" &&
      webComponent.getText() !== value
    ) {
      webComponent.setText(value);
    }
  });

  $effect(() => {
    if (webComponent) {
      const textarea = webComponent.shadowRoot?.getElementById("editor");
      if (textarea && placeholder) {
        textarea.placeholder = placeholder;
      }
    }
  });

  onMount(async (): Promise<any> => {
    // Dynamically import the web component
    await import("@liwe3/webcomponents/ai-text-editor");

    // Get reference to the web component
    webComponent = elementRef;

    // Listen for changes from the web component
    const handleChange = (event: CustomEvent) => {
      const newValue = event.detail.value;
      if (newValue !== value) {
        value = newValue;
        onchange?.(newValue);
      }
    };

    // Forward beforeSuggestion event and allow parent to cancel
    const handleBeforeSuggestion = (event: CustomEvent) => {
      const cancel = onbeforesuggestion
        ? onbeforesuggestion(event.detail)
        : false;

      // propagate cancellation back to the underlying web component
      if (cancel) event.preventDefault();
    };

    const handleCompletionError = (event: CustomEvent) => {
      oncompletionerror?.(event.detail.error);
    };

    webComponent.addEventListener("change", handleChange);
    webComponent.addEventListener(
      "beforeSuggestion",
      handleBeforeSuggestion as EventListener
    );
    webComponent.addEventListener(
      "oncompletionerror",
      handleCompletionError as EventListener
    );

    // Cleanup
    return () => {
      webComponent?.removeEventListener("change", handleChange);
      webComponent?.removeEventListener(
        "beforeSuggestion",
        handleBeforeSuggestion as EventListener
      );
      webComponent?.removeEventListener(
        "oncompletionerror",
        handleCompletionError as EventListener
      );
    };
  });

  // Public methods to expose web component functionality
  export const setText = (text: string) => {
    value = text;
    webComponent?.setText(text);
  };

  // Expose getText to parent components
  export const getText = (): string => {
    return webComponent?.getText() || "";
  };

  // Expose setContext to parent components
  export const setContext = (context: string) => {
    webComponent?.setContext(context);
  };

  // Expose getContext to parent components
  export const getContext = (): string => {
    return webComponent?.getContext() || "";
  };

  // Expose setSystemPrompt to allow changing the system prompt dynamically
  export const setSystemPrompt = (prompt: string) => {
    systemPrompt = prompt;
    webComponent?.setSystemPrompt?.(prompt);
  };

  // Expose getSystemPrompt to parent components
  export const getSystemPrompt = (): string => {
    return webComponent?.getSystemPrompt() || systemPrompt;
  };

  // Expose setApiKey to parent components
  export const setApiKey = (key: string) => {
    webComponent?.setApiKey(key);
  };

  // Expose getApiKey to parent components
  export const getApiKey = (): string => {
    return webComponent?.getApiKey() || "";
  };

  // Expose setSuggestionDelay to parent components
  export const setSuggestionDelay = (seconds: number) => {
    webComponent?.setSuggestionDelay(seconds);
  };

  // Expose getSuggestionDelay to parent components
  export const getSuggestionDelay = (): number => {
    return webComponent?.getSuggestionDelay() || suggestionDelay;
  };

  // Expose setApiEndpoint to parent components
  export const setApiEndpoint = (endpoint: string) => {
    webComponent?.setApiEndpoint(endpoint);
  };

  // Expose getApiEndpoint to parent components
  export const getApiEndpoint = (): string => {
    return webComponent?.getApiEndpoint() || apiEndpoint;
  };

  // Expose setModelName to parent components
  export const setModelName = (model: string) => {
    webComponent?.setModelName(model);
  };

  // Expose getModelName to parent components
  export const getModelName = (): string => {
    return webComponent?.getModelName() || modelName;
  };
</script>

<liwe3-ai-text-editor bind:this={elementRef}></liwe3-ai-text-editor>
