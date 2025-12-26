/**
 * AITextEditor Web Component
 * A text editor with AI-powered text continuation suggestions
 */
export interface AITextEditorConfig {
    apiKey?: string;
    suggestionDelay?: number;
    systemPrompt?: string;
    apiEndpoint?: string;
    modelName?: string;
    context?: string;
    embedded?: boolean;
    onStatusChange?: (hasApiKey: boolean) => void;
    onLoadingChange?: (isLoading: boolean) => void;
}
export declare class AITextEditorElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private editor;
    private editorBackground;
    private loading;
    private editorStatus;
    private typingTimer;
    private fullSuggestion;
    private suggestionParagraphs;
    private currentParagraphIndex;
    private isShowingSuggestion;
    private apiKey;
    private suggestionDelay;
    private systemPrompt;
    private apiEndpoint;
    private modelName;
    private context;
    private embedded;
    private onStatusChangeCallback?;
    private onLoadingChangeCallback?;
    constructor();
    /**
     * Renders the component's HTML structure
     */
    private render;
    /**
     * Initializes the component after rendering
     */
    private init;
    /**
     * Updates the background layer with current text and suggestions
     */
    private updateBackground;
    /**
     * Synchronizes scroll position between editor and background
     */
    private syncScroll;
    /**
     * Handles text input events
     */
    private handleTextInput;
    /**
     * Handles keyboard events
     */
    private handleKeyDown;
    /**
     * Requests an AI suggestion for the current text
     */
    private requestSuggestion;
    /**
     * Calls the OpenAI API for text completion
     */
    private callOpenAI;
    /**
     * Shows an AI suggestion
     */
    private showSuggestion;
    /**
     * Splits text into paragraphs/sentences
     */
    private splitIntoParagraphs;
    /**
     * Hides the current suggestion
     */
    private hideSuggestion;
    /**
     * Accepts the current suggestion paragraph
     */
    private acceptSuggestion;
    /**
     * Shows loading indicator
     */
    private showLoading;
    /**
     * Hides loading indicator
     */
    private hideLoading;
    /**
     * Shows an error message
     */
    private showError;
    /**
     * Escapes HTML special characters
     */
    private escapeHtml;
    /**
     * Sets the text content
     */
    setText(text: string): void;
    /**
     * Gets the text content
     */
    getText(): string;
    /**
     * Sets the API key
     */
    setApiKey(key: string): void;
    /**
     * Saves API key to localStorage
     */
    private _saveApiKey;
    /**
     * Loads API key from localStorage
     */
    private _loadApiKey;
    /**
     * Gets the API key
     */
    getApiKey(): string;
    /**
     * Sets the suggestion delay in seconds
     */
    setSuggestionDelay(seconds: number): void;
    /**
     * Gets the suggestion delay in seconds
     */
    getSuggestionDelay(): number;
    /**
     * Sets the system prompt
     */
    setSystemPrompt(prompt: string): void;
    /**
     * Gets the system prompt
     */
    getSystemPrompt(): string;
    /**
     * Sets the API endpoint
     */
    setApiEndpoint(endpoint: string): void;
    /**
     * Gets the API endpoint
     */
    getApiEndpoint(): string;
    /**
     * Sets the model name
     */
    setModelName(modelName: string): void;
    /**
     * Gets the model name
     */
    getModelName(): string;
    /**
     * Sets the context
     */
    setContext(context: string): void;
    /**
     * Gets the context
     */
    getContext(): string;
    /**
     * Configure the editor with callbacks and embedded mode
     */
    configure(config: Partial<AITextEditorConfig>): void;
    /**
     * Saves settings to localStorage
     */
    private _saveSettings;
    /**
     * Loads settings from localStorage
     */
    private _loadSettings;
}
/**
 * Conditionally defines the custom element if in a browser environment.
 */
declare const defineAITextEditor: (tagName?: string) => void;
export { defineAITextEditor };
//# sourceMappingURL=AITextEditor.d.ts.map