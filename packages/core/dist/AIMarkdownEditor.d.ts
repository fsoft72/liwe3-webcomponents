export declare class AIMarkdownEditorElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private aiEditor;
    private toolbar;
    private preview;
    private editorStatus;
    private loading;
    private isPreviewMode;
    private markdownLibUrl;
    constructor();
    connectedCallback(): void;
    private render;
    private init;
    private setupModal;
    private openSettings;
    private setupToolbar;
    private togglePreview;
    private handleToolbarAction;
    setText(text: string): void;
    getText(): string;
    setApiKey(key: string): void;
    getApiKey(): string;
    setSuggestionDelay(seconds: number): void;
    getSuggestionDelay(): number;
    setSystemPrompt(prompt: string): void;
    getSystemPrompt(): string;
    setApiEndpoint(endpoint: string): void;
    getApiEndpoint(): string;
    setModelName(modelName: string): void;
    getModelName(): string;
    setContext(context: string): void;
    getContext(): string;
}
export declare const defineAIMarkdownEditor: (tagName?: string) => void;
//# sourceMappingURL=AIMarkdownEditor.d.ts.map