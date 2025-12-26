/**
 * ButtonToolbar Web Component
 * A customizable toolbar with groups of buttons, supporting horizontal/vertical orientation
 */
export type ButtonToolbarItem = {
    id: string;
    label?: string;
    icon?: string;
    image?: string;
    type?: 'default' | 'info' | 'error' | 'warn' | 'success';
    disabled?: boolean;
    tooltip?: string;
    action?: string;
};
export type ButtonToolbarGroup = {
    id?: string;
    items: ButtonToolbarItem[];
    class?: string;
};
export declare class ButtonToolbarElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private _groups;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    get orientation(): 'horizontal' | 'vertical';
    set orientation(value: 'horizontal' | 'vertical');
    get groups(): ButtonToolbarGroup[];
    set groups(value: ButtonToolbarGroup[]);
    connectedCallback(): void;
    private handleButtonClick;
    private render;
}
export declare const defineButtonToolbar: () => void;
//# sourceMappingURL=ButtonToolbar.d.ts.map