/**
 * TreeView Web Component
 * A customizable tree view with infinite depth, checkboxes, and folder icons
 */
export type TreeNode = {
    id: string;
    label: string;
    children?: TreeNode[];
    icon?: string;
    customIcon?: string;
    selected?: boolean;
    expanded?: boolean;
};
export declare class TreeViewElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private treeData;
    private selectedIds;
    private expandedIds;
    private indentWidth;
    private showBorder;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get data(): TreeNode[];
    set data(value: TreeNode[]);
    get selectedNodeIds(): string[];
    set selectedNodeIds(ids: string[]);
    get showBorderEnabled(): boolean;
    set showBorderEnabled(value: boolean);
    /**
     * Initialize expanded state from the data
     */
    private initializeExpandedState;
    /**
     * Toggle node expansion
     */
    toggleExpansion(nodeId: string): void;
    /**
     * Toggle node selection
     */
    toggleSelection(nodeId: string): void;
    /**
     * Select all nodes recursively
     */
    selectAll(): void;
    /**
     * Deselect all nodes
     */
    deselectAll(): void;
    /**
     * Expand all nodes
     */
    expandAll(): void;
    /**
     * Collapse all nodes
     */
    collapseAll(): void;
    /**
     * Get node by ID
     */
    private findNode;
    /**
     * Get the default folder icon
     */
    private getDefaultIcon;
    /**
     * Render a single tree node
     */
    private renderNode;
    /**
     * Bind event listeners
     */
    private bindEvents;
    /**
     * Render the component
     */
    private render;
}
/**
 * Conditionally defines the custom element if in a browser environment.
 */
declare const defineTreeView: (tagName?: string) => void;
export { defineTreeView };
//# sourceMappingURL=TreeView.d.ts.map