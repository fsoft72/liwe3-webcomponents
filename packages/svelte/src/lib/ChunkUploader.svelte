<script module lang="ts">
export type ChunkFileEvent = {
	id : string;
	status : string;
	progress : number;
	uploadId : string;
	key : string;
	originalFileName : string;
	size : number;
};
</script>
<script lang="ts">
import { onMount } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type {
	ChunkUploaderElement as ChunkUploaderElementType,
	UploadedFile,
} from '@liwe3/webcomponents';

interface Props extends HTMLAttributes<ChunkUploaderElementType> {
	serverURL? : string;
	chunkSize? : number;
	authToken? : string;
	validFiletypes? : string[];
	maxFileSize? : number;
	labelDropFiles? : string;
	labelBrowse? : string;
	folder? : string;
	onfilecomplete? : ( event : ChunkFileEvent ) => void;
	onuploadcomplete? : ( events : ChunkFileEvent[] ) => void;
	onuploadaborted? : ( events : ChunkFileEvent[] ) => void;
	parseResponse? : ( response : any, endpoint : 'initiate' | 'part' | 'complete' ) => any;
}

let {
	serverURL = '',
	chunkSize = 5,
	authToken,
	validFiletypes,
	maxFileSize = 5120,
	labelDropFiles,
	labelBrowse,
	folder,
	onfilecomplete,
	onuploadcomplete,
	onuploadaborted,
	parseResponse,
	...restProps
} : Props = $props();

let uploaderElement : ChunkUploaderElementType;
let isReady = $state( false );
let removeListeners : (() => void) | null = null;

/**
 * Syncs the latest prop values down to the underlying web component.
 */
const syncProps = () => {
	if ( !isReady || !uploaderElement ) return;

	uploaderElement.serverURL = serverURL ?? '';
	uploaderElement.chunkSize = chunkSize;
	uploaderElement.authToken = authToken;
	uploaderElement.validFiletypes = validFiletypes?.length
		? [ ...validFiletypes ]
		: undefined;
	uploaderElement.maxFileSize = maxFileSize;
	uploaderElement.labelDropFiles = labelDropFiles;
	uploaderElement.labelBrowse = labelBrowse;
	uploaderElement.folder = folder;
	uploaderElement.parseResponse = parseResponse;
};

const _mapEvent = ( dets : any ) : ChunkFileEvent => {
	return {
		id: dets.id,
		originalFileName: dets.file.name,
		status: dets.status,
		progress: dets.progress,
		size: dets.uploadedBytes,
		uploadId: dets.uploadId,
		key: dets.key,
	};
};

/**
 * Forwards custom events emitted by the web component to Svelte callbacks.
 */
const bindEvents = () => {
	if ( !uploaderElement ) return;

	const handleFileComplete = ( event : Event ) => {
		const data : ChunkFileEvent = _mapEvent( event.detail );
		onfilecomplete?.( data );
	};

	const handleUploadComplete = ( event : Event ) => {
		const res : ChunkFileEvent[] = ( event as any ).detail.map( ( det ) => _mapEvent( det ) );
		onuploadcomplete?.( res );
	};

	const handleUploadAborted = ( event : Event ) => {
		const res : ChunkFileEvent[] = ( event as any ).detail.map( ( det ) => _mapEvent( det ) );
		onuploadaborted?.( res );
	};

	uploaderElement.addEventListener(
		'filecomplete',
		handleFileComplete as EventListener,
	);
	uploaderElement.addEventListener(
		'uploadcomplete',
		handleUploadComplete as EventListener,
	);
	uploaderElement.addEventListener(
		'uploadaborted',
		handleUploadAborted as EventListener,
	);

	removeListeners = () => {
		uploaderElement.removeEventListener(
			'filecomplete',
			handleFileComplete as EventListener,
		);
		uploaderElement.removeEventListener(
			'uploadcomplete',
			handleUploadComplete as EventListener,
		);
		uploaderElement.removeEventListener(
			'uploadaborted',
			handleUploadAborted as EventListener,
		);
	};
};

onMount( () => {
	let isMounted = true;

	const setup = async () => {
		await import( '@liwe3/webcomponents/chunk-uploader' );
		await customElements.whenDefined( 'liwe3-chunk-uploader' );

		if ( !isMounted ) return;
		isReady = true;
		syncProps();
		bindEvents();
	};

	void setup();

	return () => {
		isMounted = false;
		removeListeners?.();
		removeListeners = null;
	};
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.serverURL = serverURL ?? '';
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.chunkSize = chunkSize;
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.authToken = authToken;
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.validFiletypes = validFiletypes?.length
		? [ ...validFiletypes ]
		: undefined;
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.maxFileSize = maxFileSize;
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.labelDropFiles = labelDropFiles;
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.labelBrowse = labelBrowse;
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.folder = folder;
} );

$effect( () => {
	if ( !isReady || !uploaderElement ) return;
	uploaderElement.parseResponse = parseResponse;
} );
</script>

<liwe3-chunk-uploader bind:this={uploaderElement} {...restProps}></liwe3-chunk-uploader>
