<script lang="ts">
  import { onMount } from "svelte";
  import type { AIMarkdownEditorElement } from "@liwe3/webcomponents";

  interface Props {
    value?: string;
    apiKey?: string;
    suggestionDelay?: number;
    systemPrompt?: string;
    apiEndpoint?: string;
    modelName?: string;
    context?: string;

    onbeforesuggestion?: (data: any) => boolean;
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
    context = "",

    onbeforesuggestion,
    onchange,
  }: Props = $props();

  let elementRef: AIMarkdownEditorElement;
  let isReady = $state(false);

  // Sync props to web component - only when ready
  $effect(() => {
    if (!isReady || !elementRef) return;
    
    if (apiKey) elementRef.setApiKey(apiKey);
    elementRef.setSuggestionDelay(suggestionDelay / 1000);
    elementRef.setSystemPrompt(systemPrompt);
    elementRef.setApiEndpoint(apiEndpoint);
    elementRef.setModelName(modelName);
    if (context) elementRef.setContext(context);
  });

  // Sync value to web component - only when ready
  $effect(() => {
    if (!isReady || !elementRef) return;
    
    const currentText = elementRef.getText();
    if (currentText !== value) {
      elementRef.setText(value);
    }
  });

  onMount(async () => {
    // Dynamically import and register the web component
    const { defineAIMarkdownEditor } = await import("@liwe3/webcomponents/ai-markdown-editor");
    defineAIMarkdownEditor();

    // Wait for element to be ready (next tick)
    await new Promise(resolve => setTimeout(resolve, 0));

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

    elementRef.addEventListener("change", handleChange);
    elementRef.addEventListener(
      "beforeSuggestion",
      handleBeforeSuggestion as EventListener
    );

    // Mark as ready to enable $effects
    isReady = true;

    // Cleanup
    return () => {
      elementRef?.removeEventListener("change", handleChange);
      elementRef?.removeEventListener(
        "beforeSuggestion",
        handleBeforeSuggestion as EventListener
      );
    };
  });

  // Public methods to expose web component functionality
  export const setText = (text: string) => {
    value = text;
    if (isReady && elementRef) {
      elementRef.setText(text);
    }
  };

  export const getText = (): string => {
    return elementRef?.getText() || "";
  };

  export const setContext = (ctx: string) => {
    context = ctx;
    if (isReady && elementRef) {
      elementRef.setContext(ctx);
    }
  };

  export const getContext = (): string => {
    return elementRef?.getContext() || context;
  };

  export const setSystemPrompt = (prompt: string) => {
    systemPrompt = prompt;
    if (isReady && elementRef) {
      elementRef.setSystemPrompt(prompt);
    }
  };

  export const getSystemPrompt = (): string => {
    return elementRef?.getSystemPrompt() || systemPrompt;
  };

  export const setApiKey = (key: string) => {
    if (isReady && elementRef) {
      elementRef.setApiKey(key);
    }
  };

  export const getApiKey = (): string => {
    return elementRef?.getApiKey() || "";
  };

  export const setSuggestionDelay = (seconds: number) => {
    if (isReady && elementRef) {
      elementRef.setSuggestionDelay(seconds);
    }
  };

  export const getSuggestionDelay = (): number => {
    return elementRef?.getSuggestionDelay() || suggestionDelay;
  };

  export const setApiEndpoint = (endpoint: string) => {
    if (isReady && elementRef) {
      elementRef.setApiEndpoint(endpoint);
    }
  };

  export const getApiEndpoint = (): string => {
    return elementRef?.getApiEndpoint() || apiEndpoint;
  };

  export const setModelName = (model: string) => {
    if (isReady && elementRef) {
      elementRef.setModelName(model);
    }
  };

  export const getModelName = (): string => {
    return elementRef?.getModelName() || modelName;
  };
</script>

<liwe3-ai-markdown-editor bind:this={elementRef}></liwe3-ai-markdown-editor>
