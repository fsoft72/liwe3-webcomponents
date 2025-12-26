/**
 * CheckList Web Component
 * A customizable checklist with progress bar and JSON support
 */
export type CheckListItem = {
    label: string;
    checked: boolean;
};
export declare class CheckListElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private _items;
    private _title;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get title(): string;
    set title(value: string);
    get items(): CheckListItem[];
    set items(value: CheckListItem[]);
    get percentage(): number;
    loadJSON(json: string): void;
    toJSON(): string;
    private addItem;
    private removeItem;
    private toggleItem;
    private updateItemLabel;
    private render;
    private bindEvents;
}
export declare const defineCheckList: (tagName?: string) => void;
//# sourceMappingURL=CheckList.d.ts.map