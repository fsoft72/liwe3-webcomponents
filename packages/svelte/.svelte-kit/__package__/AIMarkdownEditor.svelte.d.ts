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
declare const AIMarkdownEditor: import("svelte").Component<Props, {
    setText: (text: string) => void;
    getText: () => string;
    setContext: (ctx: string) => void;
    getContext: () => string;
    setSystemPrompt: (prompt: string) => void;
    getSystemPrompt: () => string;
    setApiKey: (key: string) => void;
    getApiKey: () => string;
    setSuggestionDelay: (seconds: number) => void;
    getSuggestionDelay: () => number;
    setApiEndpoint: (endpoint: string) => void;
    getApiEndpoint: () => string;
    setModelName: (model: string) => void;
    getModelName: () => string;
}, "value" | "systemPrompt">;
type AIMarkdownEditor = ReturnType<typeof AIMarkdownEditor>;
export default AIMarkdownEditor;
//# sourceMappingURL=AIMarkdownEditor.svelte.d.ts.map