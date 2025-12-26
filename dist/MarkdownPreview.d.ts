/**
 * MarkdownPreview Web Component
 * Renders markdown content using a dynamically loaded library
 */
export declare class MarkdownPreviewElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private _libUrl;
    private _value;
    private _isLibLoaded;
    private _isLoadingLib;
    private container;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    get libUrl(): string;
    set libUrl(value: string);
    get value(): string;
    set value(content: string);
    private render;
    private loadLibrary;
    private updateContent;
}
export declare const defineMarkdownPreview: (tagName?: string) => void;
//# sourceMappingURL=MarkdownPreview.d.ts.map