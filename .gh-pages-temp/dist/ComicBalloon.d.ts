/**
 * ComicBalloon Web Component
 * A customizable comic balloon with different styles and draggable handler
 */
export declare enum BalloonType {
    TALK = "talk",
    CLOUD = "cloud",
    WHISPER = "whisper",
    RECTANGLE = "rectangle"
}
export type HandlerPosition = {
    x: number;
    y: number;
};
export interface IComicBalloon extends HTMLElement {
    type: BalloonType;
    textContent: string;
    handlerPosition: HandlerPosition;
    updateHandlerPosition(position: HandlerPosition): void;
    getHTML(): string;
}
export type ContentChangeEvent = CustomEvent<{
    newContent: string;
    balloonType: BalloonType;
}>;
export type HandlerMoveEvent = CustomEvent<{
    finalPosition: HandlerPosition;
    balloonType: BalloonType;
}>;
export type ResizeEvent = CustomEvent<{
    width: number;
    height: number;
    balloonType: BalloonType;
}>;
export declare class ComicBalloonElement extends HTMLElement implements IComicBalloon {
    shadowRoot: ShadowRoot;
    private _type;
    private _handlerPosition;
    private isDragging;
    private isResizing;
    private dragStartOffset;
    private resizeStartPos;
    private contentEditableElement?;
    private handler?;
    private resizeHandle?;
    private balloon?;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    get type(): BalloonType;
    set type(value: BalloonType);
    get handlerPosition(): HandlerPosition;
    set handlerPosition(value: HandlerPosition);
    updateHandlerPosition(position: HandlerPosition): void;
    getHTML(): string;
    private render;
    private getStyles;
    private updateBalloonStyle;
    private updateCloudShape;
    private updateHandlerVisual;
    private updateSVGPointer;
    private drawTalkPointer;
    private drawCloudPointer;
    private drawWhisperPointer;
    private setupEventListeners;
    private removeEventListeners;
    private handleMouseDown;
    private handleTouchStart;
    private startDrag;
    private handleDrag;
    private stopDrag;
    private handleContentBlur;
    private handleResizeMouseDown;
    private handleResizeTouchStart;
    private startResize;
    private handleResize;
    private stopResize;
}
export declare const defineComicBalloon: () => void;
//# sourceMappingURL=ComicBalloon.d.ts.map