export type ChunkFileEvent = {
    id: string;
    status: string;
    progress: number;
    uploadId: string;
    key: string;
    originalFileName: string;
    size: number;
};
import type { HTMLAttributes } from 'svelte/elements';
import type { ChunkUploaderElement as ChunkUploaderElementType } from '@liwe3/webcomponents';
interface Props extends HTMLAttributes<ChunkUploaderElementType> {
    serverURL?: string;
    chunkSize?: number;
    authToken?: string;
    validFiletypes?: string[];
    maxFileSize?: number;
    labelDropFiles?: string;
    labelBrowse?: string;
    folder?: string;
    onfilecomplete?: (event: ChunkFileEvent) => void;
    onuploadcomplete?: (events: ChunkFileEvent[]) => void;
    onuploadaborted?: (events: ChunkFileEvent[]) => void;
    parseResponse?: (response: any, endpoint: 'initiate' | 'part' | 'complete') => any;
}
declare const ChunkUploader: import("svelte").Component<Props, {}, "">;
type ChunkUploader = ReturnType<typeof ChunkUploader>;
export default ChunkUploader;
//# sourceMappingURL=ChunkUploader.svelte.d.ts.map