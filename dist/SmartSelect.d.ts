/**
 * SmartSelect Web Component
 * A customizable select dropdown with search, multi-select, and keyboard navigation
 */
export type SelectOption = {
    value: string;
    label: string;
    image?: string;
};
export declare class SmartSelectElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private isOpen;
    private selectedOptions;
    private filteredOptions;
    private focusedIndex;
    private searchValue;
    private keyboardNavigating;
    private keyboardTimer?;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get multiple(): boolean;
    set multiple(value: boolean);
    get searchable(): boolean;
    set searchable(value: boolean);
    get placeholder(): string;
    set placeholder(value: string);
    get disabled(): boolean;
    set disabled(value: boolean);
    get value(): string | string[];
    set value(val: string | string[]);
    get options(): SelectOption[];
    set options(opts: SelectOption[]);
    /**
     * Opens the dropdown
     */
    open(): void;
    /**
     * Closes the dropdown
     */
    close(): void;
    /**
     * Toggles the dropdown open/closed state
     */
    toggle(): void;
    /**
     * Selects an option by its value
     */
    selectOption(value: string): void;
    /**
     * Deselects an option by its value
     */
    deselectOption(value: string): void;
    /**
     * Returns an array of currently selected options
     */
    getSelectedOptions(): SelectOption[];
    /**
     * Sets the options for the select component
     */
    setOptions(options: SelectOption[]): void;
    /**
     * Handles search functionality
     */
    private handleSearch;
    /**
     * Updates the visual focus state without full re-render
     */
    private updateFocusedOption;
    /**
     * Scrolls the focused option into view
     */
    private scrollToFocusedOption;
    /**
     * Calculates the optimal dropdown position based on viewport constraints
     */
    private _calculateDropdownPosition;
    /**
     * Updates dropdown position using fixed positioning relative to viewport
     */
    private _updateDropdownPosition;
    /**
     * Handles keyboard navigation
     */
    private handleKeydown;
    /**
     * Binds all event listeners
     */
    private bindEvents;
    /**
     * Renders the component
     */
    private render;
}
/**
 * Conditionally defines the custom element if in a browser environment.
 */
declare const defineSmartSelect: (tagName?: string) => void;
export { defineSmartSelect };
//# sourceMappingURL=SmartSelect.d.ts.map