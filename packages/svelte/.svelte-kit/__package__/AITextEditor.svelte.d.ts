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
declare const AITextEditor: import("svelte").Component<Props, {
    setText: (text: string) => void;
    getText: () => string;
    setContext: (context: string) => void;
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
type AITextEditor = ReturnType<typeof AITextEditor>;
export default AITextEditor;
//# sourceMappingURL=AITextEditor.svelte.d.ts.map