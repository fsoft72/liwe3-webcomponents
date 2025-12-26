/**
 * ChunkUploader Web Component
 * A file uploader with drag & drop, file previews, and chunked upload support
 */
export interface UploadedFile {
    id: string;
    file: File;
    status: 'pending' | 'uploading' | 'completed' | 'error' | 'aborted';
    progress: number;
    uploadedBytes: number;
    preview?: string;
    error?: string;
    uploadId?: string;
    key?: string;
}
export interface ChunkUploaderConfig {
    serverURL: string;
    chunkSize: number;
    authToken?: string;
    validFiletypes?: string[];
    maxFileSize?: number;
    labelDropFiles?: string;
    labelBrowse?: string;
    folder?: string;
    compact?: boolean;
    onfilecomplete?: (file: UploadedFile) => void;
    onuploadcomplete?: (files: UploadedFile[]) => void;
    parseResponse?: (response: any, endpoint: 'initiate' | 'part' | 'complete') => any;
}
export declare class ChunkUploaderElement extends HTMLElement {
    shadowRoot: ShadowRoot;
    private files;
    private config;
    private isUploading;
    private abortController;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get serverURL(): string;
    set serverURL(value: string);
    get chunkSize(): number;
    set chunkSize(value: number);
    get authToken(): string | undefined;
    set authToken(value: string | undefined);
    get validFiletypes(): string[] | undefined;
    set validFiletypes(value: string[] | undefined);
    get maxFileSize(): number;
    set maxFileSize(value: number);
    get labelDropFiles(): string | undefined;
    set labelDropFiles(value: string | undefined);
    get labelBrowse(): string | undefined;
    set labelBrowse(value: string | undefined);
    get folder(): string | undefined;
    set folder(value: string | undefined);
    get compact(): boolean;
    set compact(value: boolean);
    set onfilecomplete(callback: ((file: UploadedFile) => void) | undefined);
    set onuploadcomplete(callback: ((files: UploadedFile[]) => void) | undefined);
    set parseResponse(callback: ((response: any, endpoint: 'initiate' | 'part' | 'complete') => any) | undefined);
    /**
     * Updates labels in the DOM when properties change
     */
    private updateLabels;
    /**
     * Updates compact mode styles and attributes
     */
    private updateCompactMode;
    /**
     * Formats bytes to human readable string
     */
    private formatBytes;
    /**
     * Generates a unique ID for a file
     */
    private generateFileId;
    /**
     * Validates a file based on config
     */
    private validateFile;
    /**
     * Generates a preview for image files
     */
    private generatePreview;
    /**
     * Adds files to the upload queue
     */
    private addFiles;
    /**
     * Removes a file from the queue
     */
    private removeFile;
    /**
     * Uploads a single file with chunking
     */
    private uploadFile;
    /**
     * Starts uploading all pending files
     */
    private startUpload;
    /**
     * Aborts all pending and uploading files
     */
    private abortAllUploads;
    /**
     * Updates a single file card in the DOM
     */
    private updateFileCard;
    /**
     * Renders all file cards
     */
    private renderFileCards;
    /**
     * Binds event listeners
     */
    private bindEvents;
    /**
     * Renders the component
     */
    private render;
}
/**
 * Defines the custom element if not already defined
 */
export declare const defineChunkUploader: (tagName?: string) => void;
//# sourceMappingURL=ChunkUploader.d.ts.map