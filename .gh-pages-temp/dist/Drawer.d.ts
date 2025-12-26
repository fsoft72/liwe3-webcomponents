/**
 * Drawer Web Component
 * A container that can be expanded, shrunk, or closed with smooth animations
 */
export type DrawerDirection = 'horizontal' | 'vertical';
export type DrawerState = 'expanded' | 'shrunk' | 'closed';
export interface DrawerConfig {
    direction?: DrawerDirection;
    duration?: number;
    showTitleWhenShrunk?: boolean;
    closable?: boolean;
    title?: string;
    icon?: string;
    showToggleButton?: boolean;
    contentPadding?: string;
}
export declare class DrawerElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private currentState;
    private config;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get direction(): DrawerDirection;
    set direction(value: DrawerDirection);
    get duration(): number;
    set duration(value: number);
    get showTitleWhenShrunk(): boolean;
    set showTitleWhenShrunk(value: boolean);
    get closable(): boolean;
    set closable(value: boolean);
    get title(): string;
    set title(value: string);
    get icon(): string;
    set icon(value: string);
    get showToggleButton(): boolean;
    set showToggleButton(value: boolean);
    get contentPadding(): string;
    set contentPadding(value: string);
    get state(): DrawerState;
    set state(value: DrawerState);
    /**
     * Expand the drawer
     */
    expand(): void;
    /**
     * Shrink the drawer
     */
    shrink(): void;
    /**
     * Close the drawer (removes from DOM)
     */
    close(): void;
    /**
     * Toggle between expanded and shrunk states
     */
    toggle(): void;
    private setState;
    private bindEvents;
    private render;
}
export declare function defineDrawer(tagName?: string): void;
//# sourceMappingURL=Drawer.d.ts.map