/**
 * ResizableCropper Web Component
 * A container that wraps a single child element with drag-to-scale (resizing) and drag-to-crop (panning) capabilities
 */
export interface ResizableCropperState {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    aspectRatio: string | null;
    contentElement: HTMLElement | null;
    contentLeft: number;
    contentTop: number;
    rotation: number;
    wrapperLeft: number;
    wrapperTop: number;
}
export interface ResizableCropperValues {
    wrapperWidth: number;
    wrapperHeight: number;
    wrapperLeft: number;
    wrapperTop: number;
    contentWidth: number;
    contentHeight: number;
    contentLeft: number;
    contentTop: number;
    zoom: number;
    rotation: number;
}
export interface ResizableCropperComponentState {
    mode: 'transform' | 'crop';
    disabled: boolean;
    allowCrop: boolean;
    allowResize: boolean;
    allowRotate: boolean;
    allowDrag: boolean;
    minWidth: number;
    minHeight: number;
    aspectRatio: string | null;
    values: ResizableCropperValues;
}
export interface ResizableCropEventDetail {
    width: number;
    height: number;
    wrapperLeft: number;
    wrapperTop: number;
    contentLeft: number;
    contentTop: number;
    action: 'scale' | 'crop' | 'pan' | 'rotate' | 'move';
    rotation?: number;
    handle?: string;
}
export declare class ResizableCropperElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private state;
    private wrapper;
    private contentSlot;
    private handlesContainer;
    private isDragging;
    private dragAction;
    private dragHandle;
    private dragStartX;
    private dragStartY;
    private dragStartWidth;
    private dragStartHeight;
    private dragStartContentLeft;
    private dragStartContentTop;
    private dragStartContentWidth;
    private dragStartContentHeight;
    private initialContentWidth;
    private initialContentHeight;
    private _dragStartRotation;
    private _dragStartPointerAngle;
    private _dragRotateCenterX;
    private _dragRotateCenterY;
    private _interactionMode;
    private _dragPointerOffsetX;
    private _dragPointerOffsetY;
    private _dragMoveContainer;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _applyInteractionModeUI;
    private _setInteractionMode;
    private updateContentElement;
    private initializeContentSize;
    private updateWrapperDimensions;
    private _applyWrapperTransform;
    private updateHandlesVisibility;
    private bindEvents;
    private unbindEvents;
    private handleWrapperDoubleClick;
    private handleDocumentPointerDown;
    private _getContainerForMove;
    private _ensureContainerPositionedForMove;
    private _syncWrapperPositionFromLayout;
    private _ensureAbsolutePositionForMove;
    private handleWrapperPointerDown;
    private handlePointerDown;
    private handleContentPointerDown;
    private handlePointerMove;
    private handleRotate;
    private handlePointerUp;
    private handleScale;
    private handleCrop;
    private clampContentPosition;
    private handlePan;
    private parseAspectRatio;
    private dispatchChange;
    private dispatchOnChange;
    private render;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    get minWidth(): number;
    set minWidth(value: number);
    get minHeight(): number;
    set minHeight(value: number);
    get aspectRatio(): string | null;
    set aspectRatio(value: string | null);
    get disabled(): boolean;
    set disabled(value: boolean);
    get allowCrop(): boolean;
    set allowCrop(value: boolean);
    get allowResize(): boolean;
    set allowResize(value: boolean);
    get allowRotate(): boolean;
    set allowRotate(value: boolean);
    get allowDrag(): boolean;
    set allowDrag(value: boolean);
    /**
     * Gets the current values including wrapper size, content size, position, and zoom level
     */
    getValues(): ResizableCropperValues;
    /**
     * Sets the values to reproduce size, zoom and pan
     * @param values - The values to set
     */
    setValues(values: Partial<ResizableCropperValues>): void;
    /**
     * Gets a serializable state snapshot of the component including flags, constraints, mode,
     * and the current transform/crop values.
     */
    getState(): ResizableCropperComponentState;
    /**
     * Restores a state snapshot produced by getState().
     * @param state - State to restore
     */
    setState(state: Partial<ResizableCropperComponentState>): void;
}
/**
 * Conditionally defines the custom element if in a browser environment.
 */
export declare const defineResizableCropper: (tagName?: string) => void;
//# sourceMappingURL=ResizableCropper.d.ts.map